"use client";
import React, { useState } from 'react';
import Previewer from '@/components/Previewer';

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [explanation, setExplanation] = useState("System ready. Describe a UI to begin.");
  const [isLoading, setIsLoading] = useState(false);
  
  // History stack for the Rollback feature
  const [history, setHistory] = useState<string[]>([]);

  // Initial UI state
  const [generatedCode, setGeneratedCode] = useState(`
<RyzeCard title="Welcome to Ryze AI">
  <RyzeInput label="App Name" placeholder="My New App" />
  <RyzeButton label="Get Started" variant="primary" />
</RyzeCard>
  `);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    setIsLoading(true);

    try {
      // 1. Save current code to history BEFORE updating (for Rollback)
      setHistory(prev => [...prev, generatedCode]);

      // 2. Call our Agent API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: chatInput, 
          currentCode: generatedCode 
        }),
      });

      const data = await response.json();

      // 3. Update the UI with AI results
      setGeneratedCode(data.code);
      setExplanation(data.explanation);
      setChatInput(""); // Clear input
    } catch (error) {
      console.error("Error generating UI:", error);
      setExplanation("Error: Could not connect to the AI agent.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = () => {
    if (history.length === 0) return;
    
    // Get the most recent item from history
    const previousVersion = history[history.length - 1];
    
    // Set it as the current code
    setGeneratedCode(previousVersion);
    
    // Remove it from the history stack
    setHistory(prev => prev.slice(0, -1));
    setExplanation("Rolled back to previous version.");
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 text-black overflow-hidden">
      
      {/* LEFT PANEL: CHAT & AGENT LOGIC */}
      <div className="w-1/3 border-r bg-white flex flex-col shadow-xl">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Ryze AI Agent</h1>
          <button 
            onClick={handleRollback}
            disabled={history.length === 0}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              history.length === 0 
              ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
              : 'text-gray-600 border-gray-400 hover:bg-gray-100'
            }`}
          >
            ↺ Rollback ({history.length})
          </button>
        </div>

        {/* AI EXPLANATION AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
            <p className="text-xs font-bold text-blue-500 uppercase mb-1">Agent Explanation</p>
            <p className="text-sm text-gray-700 italic">"{explanation}"</p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              Agent is thinking...
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex flex-col gap-2">
            <textarea 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
              placeholder="Describe changes (e.g. 'Add a login form inside a card')..."
              rows={3}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate UI"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: VISUALS */}
      <div className="flex-1 flex flex-col">
        {/* TOP: LIVE PREVIEW */}
        <div className="h-3/5 p-6 bg-gray-50 overflow-auto flex flex-col">
          <div className="mb-2 flex items-center gap-2">
             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
             <span className="text-xs font-bold text-gray-500 uppercase">Live Preview</span>
          </div>
          <div className="flex-1">
             <Previewer code={generatedCode} />
          </div>
        </div>

        {/* BOTTOM: RAW CODE VIEW */}
        <div className="h-2/5 bg-[#1e1e1e] text-white flex flex-col">
          <div className="px-4 py-2 border-b border-gray-800 bg-[#252526] flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Generated React Code</span>
            <span className="text-[10px] text-gray-600">READ-ONLY</span>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto custom-scrollbar">
            <pre className="text-blue-300">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}