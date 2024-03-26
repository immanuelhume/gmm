import { execSync } from "child_process";
import { readdirSync } from "fs";
import { join } from "path";

const directoryPath = join(__dirname, "../go/pass");

function runAll() {
  const files = readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = join(directoryPath, file);
    const command = `npx tsx scripts/run.ts "${filePath}"`;

    try {
      execSync(command, { stdio: "ignore" });
      console.log(`${filePath} ✅`);
    } catch (error) {
      console.log(`${filePath} ❌`);
    }
  });
}

runAll();
