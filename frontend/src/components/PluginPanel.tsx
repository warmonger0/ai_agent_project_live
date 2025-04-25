import React, { useEffect, useState } from "react";
import axios from "axios";

// Local fallback UI components (until a UI kit is wired)
const Card = ({ children, ...props }) => (
  <div className="border rounded p-4 bg-white shadow" {...props}>{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;
const Input = (props) => <input className="border px-2 py-1 rounded w-full" {...props} />;
const Button = (props) => <button className="bg-blue-600 text-white px-4 py-1 rounded" {...props} />;

export default function PluginPanel() {
  const [plugins, setPlugins] = useState([]);
  const [selected, setSelected] = useState(null);
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get("/plugins").then((res) => {
      setPlugins(res.data.plugins);
    });
  }, []);

  const runPlugin = async () => {
    if (!selected) return;
    try {
      const res = await axios.post(`/plugins/run/${selected}`, {
        input_text: inputText,
      });
      setResult(res.data.result);
    } catch (err) {
      setResult("❌ Error running plugin");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🧩 Plugin Panel</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(plugins) && plugins.map((plugin) => (
          <Card
            key={plugin.module}
            onClick={() => setSelected(plugin.module)}
            className={`cursor-pointer transition ${
              selected === plugin.module ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <CardContent>
              <p className="font-semibold">{plugin.name}</p>
              <p className="text-sm text-muted-foreground">{plugin.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="space-y-2">
          <h3 className="font-medium">Input for: {selected}</h3>
          <Input
            placeholder="Enter input..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button onClick={runPlugin}>Run Plugin</Button>
          {result && <p className="mt-2 text-green-600">Output: {result}</p>}
        </div>
      )}
    </div>
  );
}