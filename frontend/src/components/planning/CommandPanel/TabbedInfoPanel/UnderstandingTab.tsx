import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { Check, Trash2 } from "lucide-react";
import axios from "axios";

import {
  initialUnderstanding,
  safeParseUnderstanding,
  handleToggleItem,
  handleDeleteItem,
  isAllCriteriaLocked,
  CriteriaItem,
  UnderstandingData,
} from "./UnderstandingTab/types";

const UnderstandingTab = ({ projectId }: { projectId: number | null }) => {
  const [understanding, setUnderstanding] =
    useState<UnderstandingData>(initialUnderstanding);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    axios
      .get(`/api/v1/chat/projects/${projectId}`)
      .then((res) => {
        const parsed = safeParseUnderstanding(res.data.understanding);
        setUnderstanding(parsed || initialUnderstanding);
      })
      .catch(() => {
        setUnderstanding(initialUnderstanding);
      });
  }, [projectId]);

  const handleSave = () => {
    if (!projectId) return;
    axios.put(`/api/v1/chat/projects/${projectId}/understanding`, {
      understanding,
    });
  };

  useEffect(() => {
    if (projectId !== null) handleSave();
  }, [understanding, locked]);

  const allLocked = isAllCriteriaLocked(understanding, locked);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Understanding</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <Switch
              checked={locked}
              onChange={setLocked}
              className={`${
                locked ? "bg-green-500" : "bg-gray-300"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Lock Understanding</span>
              <span
                className={`${
                  locked ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <span className="text-sm">Lock Panel</span>
          </label>
          <button
            disabled={!allLocked}
            className={`px-4 py-1 rounded text-white font-medium ${
              allLocked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
            }`}
          >
            Proceed to Phase 2
          </button>
        </div>
      </div>

      {Object.entries(understanding).map(([key, items]) => (
        <div key={key}>
          <h3 className="text-lg font-semibold mb-2 capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </h3>
          <ul className="space-y-1">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 bg-gray-100 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={item.locked}
                  onChange={() =>
                    setUnderstanding((prev) =>
                      handleToggleItem(
                        prev,
                        key as keyof UnderstandingData,
                        item.id
                      )
                    )
                  }
                />
                <span className="flex-1">{item.text}</span>
                <button
                  onClick={() =>
                    setUnderstanding((prev) =>
                      handleDeleteItem(
                        prev,
                        key as keyof UnderstandingData,
                        item.id
                      )
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default UnderstandingTab;
