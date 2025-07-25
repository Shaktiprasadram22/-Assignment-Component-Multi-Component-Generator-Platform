import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { ClipboardIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-css";
import JSZip from "jszip";

export default function CodeViewer({ jsx, css }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    Prism.highlightAll();
  }, [jsx, css, activeTab]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = async () => {
    const zip = new JSZip();

    if (jsx) {
      zip.file("Component.jsx", jsx);
    }
    if (
      css &&
      css !==
        "/* No additional CSS provided - component uses Tailwind classes */"
    ) {
      zip.file("styles.css", css);
    }

    zip.file(
      "package.json",
      JSON.stringify(
        {
          name: "generated-component",
          version: "1.0.0",
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
          },
        },
        null,
        2
      )
    );

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { name: "JSX", content: jsx, language: "jsx" },
    { name: "CSS", content: css, language: "css" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text-primary">
          Generated Code
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => copyToClipboard(tabs[activeTab].content)}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-text-secondary hover:text-text-primary transition-colors"
            disabled={!tabs[activeTab].content}
          >
            <ClipboardIcon className="h-4 w-4" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center space-x-1 px-3 py-1 bg-accent hover:bg-indigo-600 rounded text-sm text-white transition-colors"
            disabled={!jsx && !css}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex border-b border-gray-700">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                  selected
                    ? "text-accent border-b-2 border-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              {tab.name}
              {tab.name === "CSS" &&
                css &&
                !css.includes("No additional CSS") && (
                  <span className="ml-1 text-xs bg-accent text-white rounded-full px-1">
                    •
                  </span>
                )}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="flex-1 overflow-hidden">
          {tabs.map((tab, index) => (
            <Tab.Panel key={index} className="h-full">
              <div className="h-full overflow-y-auto">
                {tab.content ? (
                  <pre className="p-4 text-sm font-mono">
                    <code className={`language-${tab.language}`}>
                      {tab.content}
                    </code>
                  </pre>
                ) : (
                  <div className="p-4 text-center text-text-secondary">
                    <p>No {tab.name.toLowerCase()} code generated yet.</p>
                    <p className="text-xs mt-2">
                      Start a conversation to generate components!
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
