import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ChatPanel from "../components/ChatPanel";
import CodeViewer from "../components/CodeViewer";
import ComponentRenderer from "../components/ComponentRenderer";
import { generateComponent } from "../utils/api";

export default function Dashboard({ isAuthenticated }) {
  const [messages, setMessages] = useState([]);
  const [generatedCode, setGeneratedCode] = useState({ jsx: "", css: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message) => {
    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateComponent(message);

      const aiMessage = {
        role: "assistant",
        content: "Component generated successfully!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setGeneratedCode({ jsx: response.jsx, css: response.css });
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I encountered an error generating the component. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-text-primary text-xl">
          Please log in to access the dashboard.
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen text-text-primary bg-primary-bg">
        {/* Sidebar - Chat */}
        <aside className="w-1/4 border-r border-gray-700 bg-sidebar-bg flex flex-col">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </aside>

        {/* Preview */}
        <main className="w-2/4 p-4 flex items-center justify-center">
          <ComponentRenderer jsx={generatedCode.jsx} css={generatedCode.css} />
        </main>

        {/* Code Tabs */}
        <section className="w-1/4 border-l border-gray-700 bg-panel-bg flex flex-col">
          <CodeViewer jsx={generatedCode.jsx} css={generatedCode.css} />
        </section>
      </div>
    </Layout>
  );
}
