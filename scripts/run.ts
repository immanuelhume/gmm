/**
 * Runs a go file.
 *
 * Usage: ts-node run.ts myfile.go
 */

import { readFileSync } from "fs";
import { exec } from "../src/executor";

const run = (filename: string) => {
  const src = readFileSync(filename).toString();
  exec(src);
};

const filename = process.argv[2];
run(filename);
