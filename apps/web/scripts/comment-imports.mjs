/**
 * Commentaire typé au-dessus de chaque import (Composant, Module, Service, Modèle, Style…).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.join(__dirname, "..");
const SRC_ROOT = path.join(WEB_ROOT, "src");
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build"]);
const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];
const IMPORT_COMMENT =
  /^\/\/\s*(Module|Composant|Service|Modèle|Style|Auth|Lib|Page|Contrôleur|Test|Origine|Chemin)\s*:/;

function walkDir(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, files);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function formatOrigin(resolvedPath) {
  return path.relative(WEB_ROOT, resolvedPath).replace(/\\/g, "/");
}

function resolveLocalFile(basePath) {
  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
    return basePath;
  }
  for (const ext of EXTENSIONS) {
    const withExt = basePath + ext;
    if (fs.existsSync(withExt)) return withExt;
  }
  for (const ext of EXTENSIONS) {
    const indexFile = path.join(basePath, "index" + ext);
    if (fs.existsSync(indexFile)) return indexFile;
  }
  return null;
}

function resolveImportPath(importPath, fromFile) {
  if (importPath.startsWith("@/")) {
    const rel = importPath.slice(2);
    const abs = path.join(SRC_ROOT, rel);
    const resolved = resolveLocalFile(abs);
    return formatOrigin(resolved ?? path.join(SRC_ROOT, rel));
  }

  if (importPath.startsWith(".")) {
    const dir = path.dirname(fromFile);
    const abs = path.resolve(dir, importPath);
    const resolved = resolveLocalFile(abs);
    return formatOrigin(resolved ?? abs);
  }

  return `node_modules/${importPath}`;
}

function classifyImport(originPath) {
  const p = originPath.replace(/\\/g, "/");

  if (p.startsWith("node_modules/")) return "Module";
  if (p.endsWith(".module.css")) return "Style";
  if (p.includes("/components_V/") && /\.tsx$/.test(p)) return "Composant";
  if (p.includes("/lib/services_M/")) return "Service";
  if (p.includes("/lib/auth/")) return "Auth";
  if (p.includes("/models_M/")) return "Modèle";
  if (p.includes("/app/(C)/")) return "Contrôleur";
  if (p.includes("/app/(V)/")) return "Page";
  if (p.includes("/lib/")) return "Lib";
  if (p.includes("__tests__")) return "Test";
  if (p === "src/proxy.ts") return "Lib";

  return "Module";
}

function buildComment(importPath, fromFile) {
  const origin = resolveImportPath(importPath, fromFile);
  const label = classifyImport(origin);
  return `// ${label} : ${origin}`;
}

function parseImports(content) {
  const imports = [];
  const importStart = /^\s*import\s+(?:type\s+)?/;
  const fromPattern = /\bfrom\s+["']([^"']+)["']/;
  const lines = content.split(/\r?\n/);

  let i = 0;
  while (i < lines.length) {
    if (!importStart.test(lines[i])) {
      i++;
      continue;
    }

    const startLine = i;
    let importPath = null;
    const singleLineFrom = lines[i].match(fromPattern);

    if (singleLineFrom) {
      importPath = singleLineFrom[1];
    } else {
      while (i + 1 < lines.length) {
        i++;
        const multiFrom = lines[i].match(fromPattern);
        if (multiFrom) {
          importPath = multiFrom[1];
          break;
        }
      }
    }

    if (importPath) imports.push({ startLine, importPath });
    i++;
  }

  return imports;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content.split(/\r?\n/).map((l) => l.replace(/\uFEFF/g, ""));
  const imports = parseImports(content);
  if (imports.length === 0) return false;

  const importMap = new Map(imports.map((imp) => [imp.startLine, imp.importPath]));
  const output = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    if (IMPORT_COMMENT.test(lines[i].trim()) && importMap.has(i + 1)) {
      changed = true;
      continue;
    }

    if (importMap.has(i)) {
      const comment = buildComment(importMap.get(i), filePath);
      const prev = output.length > 0 ? output[output.length - 1].trim() : "";
      if (prev !== comment) {
        if (prev && IMPORT_COMMENT.test(prev)) {
          output[output.length - 1] = comment;
        } else {
          output.push(comment);
        }
        changed = true;
      }
    }

    output.push(lines[i]);
  }

  if (changed) {
    fs.writeFileSync(filePath, output.join("\n"), "utf8");
  }
  return changed;
}

const files = walkDir(WEB_ROOT);
let count = 0;
for (const file of files) {
  if (processFile(file)) count++;
}
console.log(`Terminé : ${count} fichier(s) modifié(s) sur ${files.length}.`);
