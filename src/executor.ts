import { compileSrc } from "../src/compiler";
import { Address, ArrayStack } from "../src/util";
import {
  BoolView,
  BuiltinView,
  EnvView,
  FrameView,
  // Global,
  PointerView,
  StringView,
  builtinIds,
  builtinSymbols,
} from "../src/heapviews";
import { MachineState, Thread, ThreadCtl } from "../src/machine";
import { microcode } from "./eval";
import { InstrView } from "./instructions";
import { fmtAddress } from "./util";

class Executor {
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

export const exec = (src: string, quiet = false): void => {
  const { bytecode, srcMap, strPool, doneAt } = compileSrc(src);
  const heap = new DataView(new ArrayBuffer(10_000_000));
  const mem = { heap, free: 0 };

  // Before initializing the rest of the machine, let's allocate all builtins.
  const builtinAddrs = builtinIds.map((builtin) => BuiltinView.allocate(mem).setId(builtin).addr);
  const globalEnv = EnvView.allocate(mem, 1);
  const globalFrame = FrameView.allocate(mem, builtinSymbols.length);
  builtinAddrs.forEach((addr, i) => globalFrame.set(i, addr));
  globalEnv.setFrame(0, globalFrame.addr);

  // We'll also allocate all the strings...
  for (const strId of strPool.ids()) {
    const addr = StringView.allocate(mem).setId(strId).addr;
    strPool.setAddress(strId, addr);
  }

  // And the globals.
  // const globals: Record<Global, Address> = {
  //   [Global["true"]]: BoolView.allocate(mem).set(true).addr,
  //   [Global["false"]]: BoolView.allocate(mem).set(false).addr,
  //   [Global["nil"]]: PointerView.allocate(mem).setValue(-1).addr,
  // };

  // The initial thread.
  const init: Thread = {
    id: 0,
    isLive: true,
    isZombie: false,
    lastPc: doneAt,
    pc: 0,
    rts: new ArrayStack(),
    os: new ArrayStack(),
    env: globalEnv,
  };

  const tctl = new ThreadCtl(init);

  let state: MachineState = {
    ...mem,
    bytecode,
    srcMap,
    strPool,
    // globals,

    sub(e, eId, threadId, f) {
      tctl.sub(e, eId, threadId, f);
    },
    pub(e, eId, src) {
      tctl.pub(e, eId, src);
    },
    fork(thread) {
      return tctl.fork(thread);
    },
    getLockId() {
      return tctl.getLockId();
    },
  };

  let executor = new Executor(state, tctl);
  executor.run(quiet);
};
