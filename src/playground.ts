import { exec } from "../src/executor";
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

const runButton = document.getElementById("runButton") as HTMLButtonElement;
const codeInput = document.getElementById("codeInput") as HTMLTextAreaElement;
const output = document.getElementById("output") as HTMLDivElement;

runButton.addEventListener("click", () => {
  output.textContent = "";
  const src = codeInput.value;
  const startTime = performance.now();

  try {
    exec(src, true); // execute quietly

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
