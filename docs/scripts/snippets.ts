import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { isTypeAliasDeclaration, isInterfaceDeclaration, isClassDeclaration, createSourceFile, ScriptTarget, forEachChild, SyntaxKind, type Node } from "typescript";
import { kebabCase } from "scule";
import path from "path";

const cleanCode = (code: string) => {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*(?=\n|\r|$)/g, "")
    .replace(/^\s*[\r\n]/gm, "")
    .replace(/\n\s*\n/g, "\n")
    .replace(/^export\s+/m, "")
    .trim();
};

// Function to extract types, interfaces, and classes using TypeScript compiler API
const extract = (code: string) => {
  const sourceFile = createSourceFile("temp.ts", code, ScriptTarget.Latest, true);
  const types: { name: string, content: string }[] = [];

  const visit = (node: Node) => {
    if (isTypeAliasDeclaration(node) || isInterfaceDeclaration(node)) {
      const name = kebabCase(node.name.text);
      const content = cleanCode(code.substring(node.pos, node.end).trim());
      types.push({ name, content });
    }
    else if (isClassDeclaration(node)) {
      const name = node.name ? kebabCase(node.name.text) : "unknown";
      let content = `class ${node.name?.text} {\n`;
      for (const member of node.members) {
        if (member.kind === SyntaxKind.Constructor) {
          content += `  ${code.substring(member.pos, member.end).trim()}`;
        }
        else if (member.kind === SyntaxKind.MethodDeclaration) {
          const methodSignature = cleanCode(code.substring(member.pos, member.end)).split("{")[0].trim() + ";";
          content += `\n  ${methodSignature}`;
        }
      }
      content += "\n}";
      types.push({ name, content: content });
    }
    forEachChild(node, visit);
  };

  visit(sourceFile);
  return types;
};

const readFilesRecursively = async (dir: string, fileCallback: (filePath: string) => void) => {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await readFilesRecursively(fullPath, fileCallback);
    }
    else if (entry.isFile()) {
      fileCallback(fullPath);
    }
  }
};

const generateSnippets = async (inputDir: string, outputDir) => {
  await readFilesRecursively(inputDir, async (filePath) => {
    const data = await readFile(filePath, "utf8");
    const types = extract(data);

    for (const { name, content } of types) {
      const outputFilePath = path.join(outputDir, `${name}.ts`);
      await writeFile(outputFilePath, content);
    }
  });
  console.info(`Generated snippets for ${inputDir}`);
};

const typesDir = path.join(__dirname, "../../src/types");
const modulesDir = path.join(__dirname, "../../src/modules");
const outputDir = path.join(__dirname, "../snippets");

await mkdir(outputDir, { recursive: true });
await generateSnippets(typesDir, outputDir);
await generateSnippets(modulesDir, outputDir);
