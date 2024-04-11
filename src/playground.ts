import { compileSrc } from "../src/compiler";
import { Address, ArrayStack } from "../src/util";
import {
  BoolView,
  BuiltinView,
  EnvView,
  FrameView,
  Global,
  PointerView,
  StringView,
  builtinIds,
  builtinSymbols,
} from "../src/heapviews";
import { MachineState, Thread, ThreadCtl } from "../src/machine";
import { Executor } from "../src/executor";
import examples from "virtual:examples";

(function () {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  console.log = function (...args: any[]) {
    const message = args
      .map((arg) => {
        return typeof arg === "object" ? JSON.stringify(arg) : arg.toString();
      })
      .join(" ");
    displayOnUI(message, "white");
    originalConsoleLog.apply(console, args);
  };

  console.error = function (...args: any[]) {
    const message = args
      .map((arg) => {
        return typeof arg === "object" ? JSON.stringify(arg) : arg.toString();
      })
      .join(" ");
    displayOnUI(message, "red");
    originalConsoleError.apply(console, args);
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  const exampleSelector = document.getElementById("exampleSelector") as HTMLSelectElement;
  const codeInput = document.getElementById("codeInput") as HTMLTextAreaElement;

  Object.entries(examples).forEach(([key, value]) => {
    const option = new Option(key, key);
    exampleSelector.options.add(option);
  });

  exampleSelector.addEventListener("change", () => {
    const selectedExample = examples[exampleSelector.value];
    if (!selectedExample) return;
    if (selectedExample) {
      codeInput.value = selectedExample;
    }
  });

  codeInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Stop the default tabbing-out behavior
      const start = codeInput.selectionStart;
      const end = codeInput.selectionEnd;

      // Insert the tab character
      codeInput.value = codeInput.value.substring(0, start) + "\t" + codeInput.value.substring(end);

      // Move the cursor to the right of the inserted tab
      codeInput.selectionStart = codeInput.selectionEnd = start + 1;
    }
  });
});

export const exec = (src: string): void => {
  const { bytecode, srcMap, strPool, doneAt } = compileSrc(src);
  const heap = new DataView(new ArrayBuffer(4096));
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
  const globals: Record<Global, Address> = {
    [Global["true"]]: BoolView.allocate(mem).set(true).addr,
    [Global["false"]]: BoolView.allocate(mem).set(false).addr,
    [Global["nil"]]: PointerView.allocate(mem).setValue(-1).addr,
  };

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
  executor.run(true); /* run quietly */
};

const runButton = document.getElementById("runButton") as HTMLButtonElement;
const codeInput = document.getElementById("codeInput") as HTMLTextAreaElement;
const output = document.getElementById("output") as HTMLDivElement;

runButton.addEventListener("click", () => {
  output.textContent = "";
  const src = codeInput.value;
  const startTime = performance.now();

  try {
    exec(src);

    const endTime = performance.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(3);
    displayOnUI(`Completed in ${executionTime} seconds`, "white");
  } catch (e) {
    if (e instanceof Error) displayOnUI(e.message, "red");
    else displayOnUI(JSON.stringify(e), "red");
  }
});

function displayOnUI(message: string, color: string) {
  const logContainer = document.getElementById("output");
  if (logContainer) {
    const messageElement = document.createElement("div");
    messageElement.style.color = color;
    messageElement.innerHTML = message;
    logContainer.appendChild(messageElement);
  }
}
