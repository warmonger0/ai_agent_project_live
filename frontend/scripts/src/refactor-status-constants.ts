import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const ROOT_DIR = path.resolve(__dirname, "../src");
const BACKUP_DIR = path.join(ROOT_DIR, "__backups__");
const STATUS_LITERALS = ["pending", "running", "success", "error"] as const;
const IMPORT_STATEMENT = `import { TaskStatus, TaskStatusList } from "@/lib/constants";`;

const StatusIndexMap = {
  pending: 0,
  running: 1,
  success: 2,
  error: 3,
} as const;

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, "../../tsconfig.scripts.json"),
});

const files = project.getSourceFiles("**/*.{ts,tsx}");

for (const file of files) {
  const relPath = path.relative(ROOT_DIR, file.getFilePath());
  const backupPath = path.join(BACKUP_DIR, relPath);
  let updated = false;

  const sourceText = file.getFullText();
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.writeFileSync(backupPath, sourceText);

  // ⬇ Add import if missing
  if (!sourceText.includes("TaskStatusList")) {
    file.insertText(0, IMPORT_STATEMENT + "\n");
    updated = true;
  }

  // 🔁 Convert union type aliases to TaskStatus
  file.getTypeAliases().forEach((alias) => {
    const union = alias.getTypeNode()?.asKind(SyntaxKind.UnionType);
    if (!union) return;

    const literals = union.getTypeNodes().map((n) => n.getText().replace(/['"]/g, ""));
    if (literals.every((val) => STATUS_LITERALS.includes(val as any))) {
      alias.setType("TaskStatus");
      updated = true;
    }
  });

  // 🔁 Convert string status checks to TaskStatusList index
  file.getDescendantsOfKind(SyntaxKind.BinaryExpression).forEach((expr) => {
    const operator = expr.getOperatorToken().getText();
    const right = expr.getRight();
    if (operator !== "===" || right.getKind() !== SyntaxKind.StringLiteral) return;

    const literal = right.getText().replace(/['"]/g, "");
    if ((literal as keyof typeof StatusIndexMap) in StatusIndexMap) {
      const index = StatusIndexMap[literal as keyof typeof StatusIndexMap];
      right.replaceWithText(`TaskStatusList[${index}]`);
      updated = true;
    }
  });

  if (updated) {
    file.saveSync();
    console.log(`✅ Updated: ${relPath}`);
  }
}

console.log("🎉 Refactor pass #2 complete! All updates backed up to /src/__backups__/");
