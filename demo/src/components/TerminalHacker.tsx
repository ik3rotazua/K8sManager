import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal } from 'lucide-react';
import TerminalCustomizer from './TerminalCustomizer';

const splashArt = [
    "      .--.          .--.        ",
    "     |o_o |        |o_o |       ",
    "     |:_/ |        |:_/ |       ",
    "    //    \\       //    \\     ",
    "   (|     | )    (|     | )    ",
    "  /'\\_   _/`\\   /'\\_   _/`\\   ",
    "  \\___)=(___/   \\___)=(___/  ",
  "              ",
  "      K8s Hacker Terminal        ",
];

const secrets: Record<string, string[]> = {
  'sudo': [
    'You have no power here!',
    'Permission denied: You are not root.',
  ],
  'hack': [
    'Initiating hack sequence...',
    'Just kidding. Stay ethical! 😎',
  ],
  'kubectl get pods': [
    'NAME              READY   STATUS    RESTARTS   AGE',
    'frontend-pod-1    1/1     Running   0          1h',
    'backend-pod-1     1/1     Running   1          2h',
    'database-pod-1    1/1     Warning   2          3h',
  ],
};

const whoamiProfile = [
  "user: github.com/ik3rotazua",
  "name: ik3rotazua",
  "role: K8s Admin",
];

const randomHackLogs = [
  "[*] Bypassing firewall...",
  "[*] Escalating privileges...",
  "[*] Injecting payload...",
  "[*] Accessing cluster secrets...",
  "[*] Downloading kubeconfig...",
  "[*] Spawning reverse shell...",
  "[*] Enumerating pods...",
  "[*] Disabling audit logs...",
  "[*] Exfiltrating data...",
  "[*] Cleaning up traces...",
];

interface TerminalHackerProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  position: { x: number; y: number };
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const TerminalHacker: React.FC<TerminalHackerProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  position,
  isDragging,
  onMouseDown,
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowSplash(false), 1800);
      setHistory(splashArt);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized, isOpen]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, showSplash]);

  const handleCommand = (cmd: string) => {
    if (cmd === 'clear') {
      setHistory([]);
      return;
    }
    if (cmd === 'whoami') {
      setHistory(prev => [...prev, '$ whoami', ...whoamiProfile]);
      return;
    }
    if (cmd === 'hack') {
    setHistory(prev => [...prev, '$ hack', 'Initiating hack sequence...']);
    // Simulate hack logs with delays
    let idx = 0;
    const logs = [...randomHackLogs.sort(() => 0.5 - Math.random()).slice(0, 5)];
    const addLog = () => {
      if (idx < logs.length) {
        setHistory(prev => [...prev, logs[idx]]);
        idx++;
        setTimeout(addLog, 350);
      } else {
        setTimeout(() => {
          setHistory(prev => [...prev, "Just kidding. Stay ethical! 😎"]);
        }, 500);
      }
    };
    setTimeout(addLog, 500);
    return;
  }
    if (secrets[cmd]) {
      setHistory(prev => [...prev, `$ ${cmd}`, ...secrets[cmd]]);
      return;
    }
    setHistory(prev => [...prev, `$ ${cmd}`, 'Command not found']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (input.trim() === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }
    handleCommand(input.trim());
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed rounded-lg shadow-2xl transition-all duration-300 ease-out border-2 border-green-500"
      style={{
        background: 'linear-gradient(135deg, #101c14 80%, #1a2e1a 100%)',
        height: isMinimized ? '48px' : '360px',
        width: '600px',
        bottom: 24 - position.y,
        right: 24 - position.x,
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'auto',
        zIndex: 50,
        fontFamily: 'Fira Mono, monospace',
        boxShadow: '0 0 32px #00ff00a0',
        transition: isDragging ? 'none' : 'bottom 0.3s cubic-bezier(0.22, 1, 0.36, 1), right 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
      }}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center justify-between p-3 border-b border-green-700 bg-black/80 rounded-t-lg sticky top-0 z-10 terminal-header cursor-grab">
        <h3 className="text-green-400 font-mono flex items-center">
          <Terminal size={16} className="mr-2" />
          Hacker Terminal
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onMinimize}
            className="text-green-400 hover:text-green-200 transition-all duration-300"
          >
            <div className={`transform transition-transform duration-300 ${isMinimized ? 'rotate-180' : 'rotate-0'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-200 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div
        className="p-4 overflow-auto custom-scrollbar transition-all duration-300"
        style={{
          maxHeight: isMinimized ? '0' : 'calc(100% - 48px)',
          opacity: isMinimized ? 0 : 1
        }}
      >
        <div className="font-mono text-sm space-y-2">
          {history.map((line, i) => (
            <pre
                key={i}
                className="text-green-400"
                style={{
                opacity: isMinimized ? 0 : 1,
                textShadow: '0 0 2px #00ff00, 0 0 8px #00ff00a0',
                transition: `opacity 300ms ${i * 50}ms ease-in-out`,
                margin: 0,
                background: 'transparent',
                fontFamily: 'Fira Mono, monospace',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                whiteSpace: 'pre'
                }}
            >{line}</pre>
          ))}
          <div ref={endRef} />
          {!showSplash && (
            <form autoComplete='off' onSubmit={handleSubmit} className="mt-2 flex items-center">
              <span className="text-green-400" style={{ textShadow: '0 0 2px #00ff00' }}>$&nbsp;</span>
              <input
                ref={inputRef}
                type="text"
                autoComplete='off'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
                autoFocus={!isMinimized}
                disabled={isMinimized}
                style={{
                  textShadow: '0 0 2px #00ff00, 0 0 8px #00ff00a0',
                  fontFamily: 'Fira Mono, monospace'
                }}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalHacker;