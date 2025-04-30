"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
};
const project = new ts_morph_1.Project({
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
        const union = alias.getTypeNode()?.asKind(ts_morph_1.SyntaxKind.UnionType);
        if (!union)
            return;
        const literals = union.getTypeNodes().map((n) => n.getText().replace(/['"]/g, ""));
        if (literals.every((val) => STATUS_LITERALS.includes(val))) {
            alias.setType("TaskStatus");
            updated = true;
        }
    });
    // Replace comparisons: status === "success"
    file.getDescendantsOfKind(ts_morph_1.SyntaxKind.BinaryExpression).forEach((expr) => {
        const left = expr.getLeft();
        const right = expr.getRight();
        if (expr.getOperatorToken().getText() === "===" &&
            right.getKind() === ts_morph_1.SyntaxKind.StringLiteral) {
            const lit = right.getText().replace(/['"]/g, "");
            if (lit in StatusIndexMap) {
                const index = StatusIndexMap[lit];
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
