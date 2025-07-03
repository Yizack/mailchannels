import { writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { join } from "path";
import packageJSON from "../package.json";

const packageJsonPath = join(process.cwd(), "package.json");

const originalPackage = packageJSON;
const originalName = originalPackage.name;
const originalDescription = originalPackage.description;

const aliases = [
  "@yizack/mailchannels"
];

// Update package.json for each alias
for (const alias of aliases) {
  console.info(`Publishing alias '${alias}'...`);

  const aliasPackage = {
    ...originalPackage,
    name: alias,
    description: `${originalDescription} (alias for mailchannels-sdk)`
  };

  await writeFile(packageJsonPath, JSON.stringify(aliasPackage, null, 2));

  execSync("npm publish", { stdio: "inherit" });
  console.info(`✅ Successfully published ${alias}`);
}

// Restore original package.json
await writeFile(packageJsonPath, JSON.stringify(originalPackage, null, 2) + "\n");
console.info(`🔄 Restored original package.json for '${originalName}'`);
console.info("🚀 All packages published successfully!");
