import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { isTypeAliasDeclaration, isInterfaceDeclaration, isClassDeclaration, createSourceFile, ScriptTarget, forEachChild, SyntaxKind, type Node } from "typescript";
import { kebabCase } from "scule";
import path from "path";
import { fileURLToPath } from "url";

// Clean code by removing comments, empty lines, export keywords, and trimming whitespace
const cleanCode = (code: string) => code
  .replace(/\/\*[\s\S]*?\*\/|\/\/.*(?=\n|\r|$)/g, "") // Remove comments
  .replace(/^\s*[\r\n]/gm, "") // Remove empty lines
  .replace(/\n\s*\n/g, "\n") // Remove multiple empty lines
  .replace(/^export\s+/m, "") // Remove export keyword
  .trim();

// Find matching closing brace
const findMatchingBrace = (str: string, start: number): number => {
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}" && --depth === 0) return i;
  }
  return -1;
};

// Remove method implementations, keep only signatures
const removeImplementation = (source: string) => {
  let result = "", pos = 0;
  const methodRegex = /((?:public|protected|private|\s)*(?:async\s+)?(?:constructor|\w+\s*\([^)]*\)(?:\s*:\s*(?:(?!\{).|{[^}]*})+)?))\s*{/g;

  let match: RegExpExecArray | null;
  while ((match = methodRegex.exec(source)) !== null) {
    result += source.substring(pos, match.index) + match[1].trim() + ";";
    const openBracePos = source.indexOf("{", match.index + match[0].length - 1);
    const closeBracePos = findMatchingBrace(source, openBracePos);
    if (closeBracePos !== -1) {
      pos = closeBracePos + 1;
      methodRegex.lastIndex = pos;
    }
    else {
      pos = methodRegex.lastIndex;
    }
  }

  return result + source.substring(pos);
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
      let content = `class ${node.name.text} {\n`;
      for (const member of node.members) {
        const codeContent = code.substring(member.pos, member.end);
        if (member.kind === SyntaxKind.Constructor) {
          content += "  " + codeContent + "\n";
        }
        else if (member.kind === SyntaxKind.MethodDeclaration) {
          content += `  ${removeImplementation(codeContent)}\n`;
        }
      }
      content = cleanCode(content) + "\n}";
      types.push({ name, content });
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
const generateSnippets = async (inputDir: string, outputDir: string) => {
  await readDirFiles(inputDir, async (filePath) => {
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

for (const dir of inputDirs) {
  await generateSnippets(path.join(currentDir, dir), outputDir);
}
