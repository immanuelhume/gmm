import { defineConfig } from "vite";
import virtual from "@rollup/plugin-virtual";
import fs from "fs";
import path from "path";

// Function to read all example files and turn them into a module
const loadExamples = () => {
  const examplesPath = path.resolve(__dirname, "examples");
  const files = fs.readdirSync(examplesPath);
  const examples = {};

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(examplesPath, file), { encoding: "utf8" });
    const key = path.basename(file, path.extname(file)); // Use file name without extension as key
    examples[key] = content;
  });

  return examples;
};

export default defineConfig({
  plugins: [
    virtual({
      "virtual:examples": `export default ${JSON.stringify(loadExamples())};`,
    }),
  ],
  root: ".",
  build: {
    outDir: "./dist",
  },
  base: "/",
});
