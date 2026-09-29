#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const MOBILE_ROOT = path.resolve(import.meta.dirname, "../apps/mobile");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(full, files);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

for (const file of walk(MOBILE_ROOT)) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  const mixedTheme =
    /import \{([^}]+)\} from "@\/lib\/theme";/.exec(content);
  if (mixedTheme) {
    const names = mixedTheme[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const local = names.filter((n) => n === "THEME" || n === "NAV_THEME");
    const fromPackage = names.filter((n) => n === "hslToHex");
    const unknown = names.filter(
      (n) => n !== "THEME" && n !== "NAV_THEME" && n !== "hslToHex",
    );
    if (unknown.length) continue;

    if (fromPackage.length && local.length) {
      const lines = [];
      if (fromPackage.length) {
        lines.push(
          `import { ${fromPackage.join(", ")} } from "@reborn/mobile-components";`,
        );
      }
      if (local.length) {
        lines.push(`import { ${local.join(", ")} } from "@/lib/theme";`);
      }
      content = content.replace(mixedTheme[0], lines.join("\n"));
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log("fixed theme imports:", path.relative(MOBILE_ROOT, file));
  }
}
