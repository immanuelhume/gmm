import { execSync } from "child_process";
import { readdirSync } from "fs";
import { join } from "path";

const passDir = join(__dirname, "../go/pass");
const failDir = join(__dirname, "../go/fail");

function runAll() {
  const pfiles = readdirSync(passDir);

  console.log("Checking files which should pass...");
  pfiles.forEach((file) => {
    const filePath = join(passDir, file);
    const command = `npx tsx scripts/run.ts "${filePath}"`;

    try {
      execSync(command, { stdio: "ignore" });
      console.log(`${file} ✅`);
    } catch (error) {
      console.log(`${file} ❌`);
    }
  });

  const ffiles = readdirSync(failDir);

  console.log("\nChecking files which should fail...");
  ffiles.forEach((file) => {
    const filePath = join(failDir, file);
    const command = `npx tsx scripts/run.ts "${filePath}"`;

    try {
      execSync(command, { stdio: "ignore" });
      console.log(`${file} ❌`);
    } catch (error) {
      console.log(`${file} ✅`);
    }
  });
}

runAll();
