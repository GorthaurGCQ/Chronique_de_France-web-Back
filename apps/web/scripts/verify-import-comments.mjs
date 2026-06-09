import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const WEB_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build"]);
const IMPORT_COMMENT =
  /^\/\/\s*(Module|Composant|Service|Modèle|Style|Auth|Lib|Page|Contrôleur|Test|Origine|Chemin)\s*:/;

function walkDir(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, files);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const missing = [];
const invalidLabel = [];

for (const file of walkDir(WEB_ROOT)) {
  const relFile = path.relative(WEB_ROOT, file);
  if (relFile === "next-env.d.ts") continue;

  const lines = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    if (/^\s*import\s/.test(lines[i])) {
      const start = i;
      let hasFrom = /\bfrom\s+["']/.test(lines[i]);
      while (!hasFrom && i + 1 < lines.length) {
        i++;
        hasFrom = /\bfrom\s+["']/.test(lines[i]);
      }
      const prev = start > 0 ? lines[start - 1].trim() : "";
      if (!IMPORT_COMMENT.test(prev)) {
        missing.push(`${relFile}:${start + 1}`);
      }
    }
    i++;
  }
}

console.log(`Imports sans commentaire : ${missing.length}`);
missing.forEach((m) => console.log(m));
