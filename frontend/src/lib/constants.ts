// Centralized shared literals for status, types, and enums

// Task status values used throughout frontend/backend
export const TaskStatusList = ["pending", "running", "success", "error"] as const;
export type TaskStatus = typeof TaskStatusList[number];

// Plugin field input types
export const InputFieldTypes = ["text", "number", "boolean"] as const;
export type InputFieldType = typeof InputFieldTypes[number];

// Models supported (future expansion)
export const ModelUsedList = ["deepseek", "claude", "gpt4"] as const;
export type ModelUsed = typeof ModelUsedList[number];
