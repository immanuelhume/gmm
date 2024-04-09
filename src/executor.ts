import { microcode } from "./eval";
import { InstrView } from "./instructions";
import { MachineState, ThreadCtl } from "./machine";
import { fmtAddress } from "./util";

export class Executor {
  private tctl: ThreadCtl;

  private common: MachineState;
  private timeSlice: number;

  constructor(common: MachineState, tctl: ThreadCtl, timeSlice = 8) {
    this.tctl = tctl;
    this.common = common;
    this.timeSlice = timeSlice;

    const init = this.tctl.yoink();
    if (init == undefined) {
      throw new Error(); // @todo err msg
    }
  }

  run(quiet = false) {
    const toHexList = (xs: number[]) => xs.map((x) => `${x.toString(16)}`).join(", ");

    while (true) {
      const t = this.tctl.yoink();
      if (t === undefined) return;

      for (let i = 0; i < this.timeSlice; ++i) {
        let instr = InstrView.of(this.common.bytecode, t.pc);
        const opcode = instr.opcode();
        if (!quiet) {
          console.log(
            "[",
            t.id,
            "]",
            `\x1b[33m${fmtAddress(t.pc)}\x1b[0m ${instr.toString()}`.padEnd(52, " "),
            toHexList(t.os.toList()).padEnd(48, " "),
            toHexList(t.rts.toList()).padEnd(48, " "),
          );
        }
        microcode[opcode](this.common, t);
        if (t.pc === t.lastPc) {
          this.tctl.pub("fin", t.id, t.id);
          t.isZombie = true; // set itself to a zombie
          break;
        }
        if (!t.isLive) {
          break;
        }
      }
    }
  }
}
