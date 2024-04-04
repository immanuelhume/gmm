import { EnvView, Global, Memory } from "./heapviews";
import { InstrView } from "./instructions";
import { Address, ArrayStack, Stack, StrPool } from "./util";

export interface Registers {
  pc: number;
  rts: Stack<Address>;
  os: Stack<Address>;
  env: EnvView;
}

export interface Thread extends Registers {
  /**
   * Unique ID for the thread.
   */
  id: number;
  /**
   * Whether the thread is awake. If false, that means the thread is blocked
   * on something and should not be given any time slice.
   */
  isLive: boolean;
  /**
   * Whether the thread is a zombie, i.e. its parent has already terminated.
   */
  isZombie: boolean;
  /**
   * Location of the last instruction for this thread.
   */
  lastPc: number;
}

type Event = "chan-send" | "chan-read" | "mutex-lock" | "mutex-unlock" | "fin";

type ThreadId = number;
type OnEvent = (t: Thread) => void;

interface ThreadOps {
  pub: (e: Event, eId: number) => void;
  sub: (e: Event, eId: number, threadId: ThreadId, f: OnEvent) => void;
  /**
   * Forks a thread. All registers are copied.
   */
  fork: (thread: Thread) => Thread;
}

/**
 * State common to all threads.
 */
export interface MachineState extends Memory, ThreadOps {
  bytecode: DataView;
  /**
   * A map from bytecode address to source line number. It represents the line
   * from which that bytecode instruction was derived.
   */
  srcMap: Map<number, number>;
  strPool: StrPool;
  globals: Record<Global, Address>;
}

export class ThreadCtl implements ThreadOps {
  private nextThreadId;
  private threads: Map<ThreadId, Thread> = new Map();

  private liveThreads: Thread[] = [];
  private deadThreads: Thread[] = [];

  private subs: Map<Event, Map<number, [ThreadId, OnEvent][]>> = new Map();

  constructor(init: Thread) {
    this.liveThreads.push(init);

    this.nextThreadId = init.id + 1;
  }

  /**
   * Revives dead threads which can be revived.
   */
  revive() {
    const n = this.deadThreads.length;
    for (let i = n - 1; i >= 0; --i) {
      // must iterate backwards!
      if (this.deadThreads[i].isZombie) {
        this.deadThreads.splice(i, 1); // delete forever
      } else if (this.deadThreads[i].isLive) {
        const t = this.deadThreads.splice(i, 1)[0];
        this.liveThreads.push(t);
      }
    }
  }

  /**
   * Moves dead threads from live to dead list.
   */
  kill() {
    const n = this.liveThreads.length;
    for (let i = n - 1; i >= 0; --i) {
      // must iterate backwards!
      if (this.liveThreads[i].isZombie) {
        this.liveThreads.splice(i, 1); // delete forever
      } else if (!this.liveThreads[i].isLive) {
        const t = this.liveThreads.splice(i, 1)[0];
        this.deadThreads.push(t);
      }
    }
  }

  /**
   * Selects a thread to use for execution.
   */
  yoink(): Thread | undefined {
    this.kill();
    // Grab from the front...
    const ret = this.liveThreads.shift();
    if (ret === undefined) {
      this.revive(); // try reviving
      if (this.liveThreads.length === 0) return undefined;
      return this.yoink();
    }
    // ...and push it to the back.
    this.liveThreads.push(ret);
    return ret;
  }

  fork(oldThread: Thread): Thread {
    // @todo: this needs to be a DEEP copy!
    const newThread: Thread = {
      pc: oldThread.pc,
      rts: new ArrayStack(), // RTS can be empty
      os: oldThread.os.copy(), // a shallow copy
      env: oldThread.env, // doesn't matter, will be overriden
      id: this.nextThreadId++,
      isLive: true,
      isZombie: false,
      lastPc: -1, // to be determined by caller
    };
    this.threads.set(newThread.id, newThread);
    this.liveThreads.push(newThread);
    this.sub("fin", oldThread.id, newThread.id, (thread) => (thread.isZombie = true));
    return newThread;
  }

  pub(e: Event, eId: number): void {
    const es = this.subs.get(e);
    if (es === undefined) return;
    const fs = es.get(eId);
    if (fs === undefined) return;
    for (const [threadId, f] of fs) {
      const t = this.threads.get(threadId);
      if (t === undefined) return; // @todo is this an error?
      f(t);
    }
    es.delete(eId);
  }

  sub(e: Event, eId: number, threadId: ThreadId, f: OnEvent): void {
    let es = this.subs.get(e);
    if (es === undefined) {
      es = new Map();
      this.subs.set(e, es);
    }
    const fs = es.get(eId);
    if (fs === undefined) {
      es.set(eId, [[threadId, f]]);
    } else {
      fs.push([threadId, f]);
    }
  }
}
