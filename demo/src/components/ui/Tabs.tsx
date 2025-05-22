import React, { useRef, useState } from "react";

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  onChange
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || tabs[0]?.id || ""
  );
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTabId) return;
    setAnimating(true);
    // Wait for fade out before changing tab
    timeoutRef.current = window.setTimeout(() => {
      setActiveTabId(tabId);
      setAnimating(false);
      onChange?.(tabId);
    }, 200); // match transition duration
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div>
      <div className="border-b border-gray-200">
        <div className="flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200
                ${
                  activeTabId === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`
            mt-6 transition-all duration-200
            ${
              animating
                ? "opacity-0 translate-y-2 pointer-events-none"
                : "opacity-100 translate-y-0"
            }
            `}
        style={{ willChange: "opacity, transform" }}
      >
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;
