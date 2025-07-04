import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { join } from "path";
import packageJSON from "../package.json";

const packageJsonPath = join(process.cwd(), "package.json");
const readmePath = join(process.cwd(), "README.md");

const originalPackage = packageJSON;
const originalName = originalPackage.name;
const originalDescription = originalPackage.description;

const originalReadme = await readFile(readmePath, "utf-8");

const mirrors = [
  "@yizack/mailchannels"
];

// Update package.json for each mirror
for (const mirror of mirrors) {
  console.info(`Publishing mirror '${mirror}'...`);

  const mirrorPackage = {
    ...originalPackage,
    name: mirror,
    description: `${originalDescription} (mirror for mailchannels-sdk)`
  };

  const mirrorReadme = originalReadme.replaceAll(originalName, mirror);

  await writeFile(packageJsonPath, JSON.stringify(mirrorPackage, null, 2));
  await writeFile(readmePath, mirrorReadme);

  execSync("npm publish", { stdio: "inherit" });
  console.info(`✅ Successfully published ${mirror}`);
}

// Restore original package.json
await writeFile(packageJsonPath, JSON.stringify(originalPackage, null, 2) + "\n");
await writeFile(readmePath, originalReadme);
console.info(`🔄 Restored original package.json for '${originalName}'`);
console.info("🚀 All packages published successfully!");
