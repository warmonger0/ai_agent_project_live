import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const ROOT_DIR = path.resolve(__dirname, "../src");
const BACKUP_DIR = path.join(ROOT_DIR, "__backups__");

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const STATUS_LITERALS = ["pending", "running", "success", "error"];
const IMPORT_STATEMENT = `import { TaskStatus, TaskStatusList } from "@/lib/constants";`;

const StatusIndexMap = {
  pending: 0,
  running: 1,
  success: 2,
  error: 3,
} as const;

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, "../../tsconfig.scripts.json"),
});

const files = project.getSourceFiles("**/*.{ts,tsx}");

for (const file of files) {
  const text = file.getFullText();
  let updated = false;

  const relPath = path.relative(ROOT_DIR, file.getFilePath());
  const backupPath = path.join(BACKUP_DIR, relPath);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.writeFileSync(backupPath, text);

  // Insert import if not already present
  if (!text.includes("TaskStatusList")) {
    file.insertText(0, IMPORT_STATEMENT + "\n");
    updated = true;
  }

  // Update union type aliases: "pending" | "success" | ...
  file.getTypeAliases().forEach((alias) => {
    const union = alias.getTypeNode()?.asKind(SyntaxKind.UnionType);
    if (!union) return;

    const literals = union.getTypeNodes().map((n) => n.getText().replace(/['"]/g, ""));
    if (literals.every((val) => STATUS_LITERALS.includes(val))) {
      alias.setType("TaskStatus");
      updated = true;
    }
  });

  // Replace comparisons: status === "success"
  file.getDescendantsOfKind(SyntaxKind.BinaryExpression).forEach((expr) => {
    const left = expr.getLeft();
    const right = expr.getRight();

    if (
      expr.getOperatorToken().getText() === "===" &&
      right.getKind() === SyntaxKind.StringLiteral
    ) {
      const lit = right.getText().replace(/['"]/g, "");
      if ((lit as keyof typeof StatusIndexMap) in StatusIndexMap) {
        const index = StatusIndexMap[lit as keyof typeof StatusIndexMap];
        right.replaceWithText(`TaskStatusList[${index}]`);
        updated = true;
      }
    }
  });

  if (updated) {
    file.saveSync();
    console.log("✅ Updated:", relPath);
  }
}

console.log("🎉 Refactor pass #2 complete! All updates backed up to /src/__backups__/");
