import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Node, ScriptTarget, SyntaxKind, createSourceFile, forEachChild, isClassDeclaration, isMethodDeclaration } from "typescript";

const methodLineCache = new Map<string, Map<string, number>>();

export const getMethodLineNumber = (moduleName: string, methodName: string) => {
  const cacheKey = moduleName;

  if (methodLineCache.has(cacheKey)) {
    return methodLineCache.get(cacheKey)!.get(methodName) ?? null;
  }

  try {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const sourceFilePath = path.join(dir, `../../../../src/modules/${moduleName}.ts`);
    const code = readFileSync(sourceFilePath, "utf8");
    const sourceFile = createSourceFile(sourceFilePath, code, ScriptTarget.Latest, true);

    const methodLines = new Map<string, number>();

    const visit = (node: Node) => {
      if (isClassDeclaration(node) && node.name) {
        for (const member of node.members) {
          if (isMethodDeclaration(member)) {
            const isPrivate = member.modifiers?.some(modifier => modifier.kind === SyntaxKind.PrivateKeyword);
            if (isPrivate) continue;

            const name = member.name?.getText(sourceFile);
            if (name) {
              const lineNumber = sourceFile.getLineAndCharacterOfPosition(member.getStart(sourceFile)).line + 1;
              methodLines.set(name, lineNumber);
            }
          }
        }
      }
      forEachChild(node, visit);
    };

    visit(sourceFile);
    methodLineCache.set(cacheKey, methodLines);
    return methodLines.get(methodName) ?? null;
  }
  catch (error) {
    console.error(`Error reading ${moduleName} line numbers for ${methodName}:`, error);
    return null;
  }
};
