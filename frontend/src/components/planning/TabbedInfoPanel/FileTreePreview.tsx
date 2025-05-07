export default function FileTreePreview() {
    return (
      <div className="text-gray-700 text-sm font-mono">
        <pre>
  {`backend/
    ├── app/
    │   ├── main.py
    │   └── routes/
    │       └── health.py
  frontend/
    ├── src/
    │   └── pages/
    │       └── CommandPanel.tsx`}
        </pre>
      </div>
    );
  }
  