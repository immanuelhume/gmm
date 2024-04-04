/**
 * Runs a go file.
 *
 * Usage: ts-node run.ts myfile.go
 */

import { readFileSync } from "fs";
import { compileSrc } from "../src/compiler";
import { Address, ArrayStack } from "../src/util";
import {
  BuiltinView,
  EnvView,
  FrameView,
  Global,
  GlobalView,
  StringView,
  builtinName2Id,
  builtinSymbols,
} from "../src/heapviews";
import { MachineState, Thread, ThreadCtl } from "../src/machine";
import { Executor } from "../src/executor";

const run = (filename: string) => {
  const src = readFileSync(filename).toString();
  const { bytecode, srcMap, strPool, doneAt } = compileSrc(src);
  const heap = new DataView(new ArrayBuffer(4096));
  const mem = { heap, free: 0 };

  // Before initializing the rest of the machine, let's allocate all builtins.
  const builtinAddrs = builtinSymbols.map((builtin) => BuiltinView.allocate(mem).setId(builtinName2Id[builtin]).addr);
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
  const globals: Record<Global, Address> = {
    [Global.True]: -1,
    [Global.False]: -1,
    [Global.Nil]: -1,
  };
  for (const glob in Global) {
    const kind = Number(glob);
    if (isNaN(kind)) {
      continue;
    }
    const addr = GlobalView.allocate(mem).setKind(kind).addr;
    globals[kind as Global] = addr;
  }

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
    globals,

    sub(e, eId, threadId, f) {
      tctl.sub(e, eId, threadId, f);
    },
    pub(e, eId) {
      tctl.pub(e, eId);
    },
    fork(thread) {
      return tctl.fork(thread);
    },
  };

  let executor = new Executor(state, tctl);
  executor.run();
};

const filename = process.argv[2];
run(filename);
