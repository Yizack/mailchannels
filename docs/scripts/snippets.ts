import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  type Node,
  ScriptTarget,
  SyntaxKind,
  createSourceFile,
  forEachChild,
  isClassDeclaration,
  isConstructorDeclaration,
  isInterfaceDeclaration,
  isMethodDeclaration,
  isTypeAliasDeclaration
} from "typescript";
import { kebabCase } from "scule";

// Clean code by removing comments, empty lines, export keywords, and trimming whitespace
const cleanCode = (code: string) => code
  .replace(/\/\*[\s\S]*?\*\/|\/\/.*(?=\n|\r|$)/g, "") // Remove comments
  .replace(/^\s*[\r\n]/gm, "") // Remove empty lines
  .replace(/\n\s*\n/g, "\n") // Remove multiple empty lines
  .replace(/^export\s+/m, "") // Remove export keyword
  .trim();

// Extract class declaration with method signatures only
const extractClassWithSignatures = (code: string) => {
  const sourceFile = createSourceFile("temp.ts", code, ScriptTarget.Latest, true);
  let result = "";

  const visit = (node: Node) => {
    if (isClassDeclaration(node) && node.name) {
      // Start with class declaration
      const className = node.name.text;
      result = `class ${className} {\n`;

      // Process all class members
      node.members.forEach((member) => {
        if (isMethodDeclaration(member) || isConstructorDeclaration(member)) {
          // Skip private methods
          const isPrivate = member.modifiers?.some(modifier => modifier.kind === SyntaxKind.PrivateKeyword);
          if (isPrivate) return;
          // Get method signature
          const methodText = code.substring(member.pos, member.body ? member.body.pos : member.end);
          // Fix parameter types with default values
          const fixedMethodText = methodText
            .replace(/(\w+)\s*=\s*(true|false)(?=[,)])/g, "$1?: boolean") // boolean default values
            .replace(/(\w+)\s*:\s*([\w\[\]]+)\s*=\s*\[\]/g, "$1?: $2"); // array default values
          result += `  ${fixedMethodText.trim()};\n`;
        }
      });

      result += "}";
    }
    forEachChild(node, visit);
  };

  visit(sourceFile);
  return result;
};

// Extract types, interfaces, and classes
const extract = (code: string) => {
  const sourceFile = createSourceFile("temp.ts", code, ScriptTarget.Latest, true);
  const types = [] as { name: string, content: string }[];

  const visit = (node: Node) => {
    // Extract type aliases, interfaces
    if (isTypeAliasDeclaration(node) || isInterfaceDeclaration(node)) {
      const name = kebabCase(node.name.text);
      const content = cleanCode(code.substring(node.pos, node.end));
      types.push({ name, content });
    }
    // Extract classes
    else if (isClassDeclaration(node) && node.name) {
      const name = kebabCase(node.name.text);
      const processedClass = extractClassWithSignatures(code);
      types.push({ name, content: cleanCode(processedClass) });
    }
    forEachChild(node, visit);
  };
  visit(sourceFile);
  return types;
};

// Recursively read directories
const readDirFiles = async (dir: string, callback: (filePath: string) => void) => {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await readDirFiles(fullPath, callback);
    // Process file
    else if (entry.isFile()) callback(fullPath);
  }
};

// Process files and generate snippets
const generateSnippets = async (inputDir: string, outputDir: string, ignores?: string[]) => {
  await readDirFiles(inputDir, async (filePath) => {
    if (ignores?.includes(path.basename(filePath))) {
      console.info(`Ignoring ${filePath}`);
      return;
    }
    const data = await readFile(filePath, "utf8");
    const types = extract(data);
    for (const { name, content } of types) {
      const outputFilePath = path.join(outputDir, `${name}.ts`);
      await writeFile(outputFilePath, content);
    }
  });
  console.info(`Generated snippets for ${inputDir}`);
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(currentDir, "../snippets");
await mkdir(outputDir, { recursive: true });

const inputDirs = [
  "../../src/types",
  "../../src/modules"
];

const ignoreNames = [
  "internal.d.ts"
];

for (const dir of inputDirs) {
  await generateSnippets(path.join(currentDir, dir), outputDir, ignoreNames);
}
