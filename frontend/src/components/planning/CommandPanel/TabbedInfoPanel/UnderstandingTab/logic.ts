// File: frontend/src/components/planning/CommandPanel/TabbedInfoPanel/UnderstandingTab/logic.ts

import type { UnderstandingData } from "/home/war/ai_agent_project/frontend/src/components/planning/CommandPanel/TabbedInfoPanel/UnderstandingTab/types.ts";

export const initialUnderstanding: UnderstandingData = {
  overview: [],
  functionality: [],
  features: [],
  lookAndFeel: [],
  deployment: [],
};

export function safeParseUnderstanding(raw: any): UnderstandingData | null {
  try {
    if (typeof raw === "string") return JSON.parse(raw);
    return raw || null;
  } catch {
    return null;
  }
}

export function handleToggleItem(
  current: UnderstandingData,
  section: keyof UnderstandingData,
  id: string
): UnderstandingData {
  return {
    ...current,
    [section]: current[section].map((item) =>
      item.id === id ? { ...item, locked: !item.locked } : item
    ),
  };
}

export function handleDeleteItem(
  current: UnderstandingData,
  section: keyof UnderstandingData,
  id: string
): UnderstandingData {
  return {
    ...current,
    [section]: current[section].filter((item) => item.id !== id),
  };
}

export function isAllCriteriaLocked(
  understanding: UnderstandingData,
  lockToggle: boolean
): boolean {
  return (
    lockToggle &&
    Object.values(understanding).every((section) =>
      section.every((item) => item.locked)
    )
  );
}
