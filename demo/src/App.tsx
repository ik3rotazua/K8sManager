import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Box, 
  Cpu, 
  MemoryStick as Memory, 
  Network, 
  AlertCircle, 
  Settings, 
  Menu, 
  X, 
  Server, 
  Plus,
  Terminal,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Bell,
  Users
} from 'lucide-react';
import ClusterRoles from './components/ClusterRoles';

// Mock data for multiple clusters
const clusters = {
  'prod-cluster': {
    name: 'Production Cluster',
    region: 'us-west-1',
    status: 'Healthy',
    metrics: {
      pods: 24,
      nodes: 3,
      cpu: 67,
      memory: 72,
      storage: 45,
      alerts: 2,
    },
    pods: [
      { name: 'frontend-pod-1', status: 'Running', cpu: '120m', memory: '256Mi', restarts: 0 },
      { name: 'backend-pod-1', status: 'Running', cpu: '250m', memory: '512Mi', restarts: 1 },
      { name: 'database-pod-1', status: 'Warning', cpu: '500m', memory: '1Gi', restarts: 2 },
    ],
  },
  'staging-cluster': {
    name: 'Staging Cluster',
    region: 'us-east-1',
    status: 'Warning',
    metrics: {
      pods: 12,
      nodes: 2,
      cpu: 45,
      memory: 58,
      storage: 30,
      alerts: 1,
    },
    pods: [
      { name: 'staging-frontend-1', status: 'Running', cpu: '100m', memory: '256Mi', restarts: 0 },
      { name: 'staging-backend-1', status: 'Warning', cpu: '200m', memory: '512Mi', restarts: 1 },
    ],
  },
  'dev-cluster': {
    name: 'Development Cluster',
    region: 'eu-west-1',
    status: 'Healthy',
    metrics: {
      pods: 8,
      nodes: 1,
      cpu: 32,
      memory: 41,
      storage: 25,
      alerts: 0,
    },
    pods: [
      { name: 'dev-app-1', status: 'Running', cpu: '80m', memory: '128Mi', restarts: 0 },
      { name: 'dev-app-2', status: 'Running', cpu: '90m', memory: '128Mi', restarts: 0 },
    ],
  },
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedClusters, setSelectedClusters] = useState(['prod-cluster']);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState(['Welcome to K8s Terminal']);
  const [terminalInput, setTerminalInput] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddClusterModal, setShowAddClusterModal] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Auto-close sidebar after delay when mouse leaves
  useEffect(() => {
    let timeoutId: number;
    
    const handleMouseLeave = () => {
      timeoutId = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 300);
    };

    const handleMouseEnter = () => {
      clearTimeout(timeoutId);
      setIsSidebarOpen(true);
    };

    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      sidebarElement.addEventListener('mouseleave', handleMouseLeave);
      sidebarElement.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener('mouseleave', handleMouseLeave);
        sidebarElement.removeEventListener('mouseenter', handleMouseEnter);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleClusterSelection = (clusterId: string) => {
    setSelectedClusters(prev => 
      prev.includes(clusterId)
        ? prev.filter(id => id !== clusterId)
        : [...prev, clusterId]
    );
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      setTerminalHistory(prev => [...prev, `$ ${terminalInput}`, 'Command executed (mock response)']);
      setTerminalInput('');
    }
  };

  const renderMainContent = () => {
    switch(currentView) {
      case 'roles':
        return <ClusterRoles />;
      case 'dashboard':
      default:
        return (
          <>
            {selectedClusters.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="bg-blue-50 rounded-full p-6 mb-6">
                  <Server size={48} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">No Clusters Connected</h2>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Get started by connecting your first Kubernetes cluster to manage and monitor your applications.
                </p>
                <button
                  onClick={() => setShowAddClusterModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                >
                  <Plus size={20} />
                  <span>Connect New Cluster</span>
                </button>
              </div>
            )}

            {isTerminalOpen && (
              <div 
                className="fixed bottom-6 right-6 w-[600px] bg-gray-900 rounded-lg shadow-2xl transform transition-all duration-300 ease-out"
                style={{
                  height: isTerminalMinimized ? '48px' : '360px', 
                  // Remove the transform that's causing it to disappear
                  overflow: 'hidden'
                }}
              >
                <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800 rounded-t-lg sticky top-0 z-10">
                  <h3 className="text-white font-mono flex items-center">
                    <Terminal size={16} className="mr-2" />
                    Terminal
                  </h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setIsTerminalMinimized(!isTerminalMinimized)}
                      className="text-gray-400 hover:text-white transition-all duration-300"
                    >
                      <div className={`transform transition-transform duration-300 ${isTerminalMinimized ? 'rotate-180' : 'rotate-0'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </button>
                    <button 
                      onClick={() => setIsTerminalOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div 
                  className="p-4 overflow-auto custom-scrollbar transition-all duration-300"
                  style={{ 
                    maxHeight: isTerminalMinimized ? '0' : 'calc(100% - 48px)',
                    opacity: isTerminalMinimized ? 0 : 1 
                  }}
                >
                  <div className="font-mono text-sm space-y-2">
                    {terminalHistory.map((line, i) => (
                      <div 
                        key={i} 
                        className="text-green-400"
                        style={{ 
                          opacity: isTerminalMinimized ? 0 : 1,
                          transition: `opacity 300ms ${i * 50}ms ease-in-out` 
                        }}
                      >
                        {line}
                      </div>
                    ))}
                    <form onSubmit={handleTerminalSubmit} className="mt-2 flex items-center">
                      <span className="text-green-400">$&nbsp;</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
                        autoFocus={!isTerminalMinimized}
                        disabled={isTerminalMinimized}
                      />
                    </form>
                  </div>
                </div>
              </div>
            )}

            {selectedClusters.map(clusterId => {
              const cluster = clusters[clusterId as keyof typeof clusters];
              return (
                <div key={clusterId} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{cluster.name}</h3>
                      <p className="text-sm text-gray-500">Region: {cluster.region}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cluster.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cluster.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <MetricCard
                      title="Pods"
                      value={cluster.metrics.pods}
                      icon={<Box className="text-blue-500" />}
                    />
                    <MetricCard
                      title="CPU Usage"
                      value={`${cluster.metrics.cpu}%`}
                      icon={<Cpu className="text-green-500" />}
                    />
                    <MetricCard
                      title="Memory Usage"
                      value={`${cluster.metrics.memory}%`}
                      icon={<Memory className="text-purple-500" />}
                    />
                    <MetricCard
                      title="Alerts"
                      value={cluster.metrics.alerts}
                      icon={<AlertCircle className="text-red-500" />}
                    />
                  </div>

                  <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">Running Pods</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restarts</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {cluster.pods.map((pod) => (
                            <tr key={pod.name}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pod.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  pod.status === 'Running' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {pod.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pod.cpu}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pod.memory}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pod.restarts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Cluster Modal */}
            {showAddClusterModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 w-full max-w-md transform transition-all duration-300 ease-out">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Connect New Cluster</h3>
                    <button
                      onClick={() => setShowAddClusterModal(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cluster Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., production-cluster"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kubernetes Config
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
                        placeholder="Paste your kubeconfig here..."
                      />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowAddClusterModal(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Connect Cluster
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Static Sidebar */}
      <div 
        ref={sidebarRef} 
        className={`fixed top-0 left-0 h-full ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-10`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <Menu size={20} className="text-gray-600" />
        </div>

        <div className={`p-4 border-b border-gray-200 ${!isSidebarOpen && 'hidden'}`}>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Clusters</h2>
          {Object.entries(clusters).map(([id, cluster]) => (
            <div key={id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={id}
                checked={selectedClusters.includes(id)}
                onChange={() => toggleClusterSelection(id)}
                className="mr-2 flex-shrink-0"
              />
              <label htmlFor={id} className="flex items-center text-sm w-full">
                <Server size={16} className={`mr-2 flex-shrink-0 ${cluster.status === 'Healthy' ? 'text-green-500' : 'text-yellow-500'}`} />
                <span className="truncate">{cluster.name}</span>
              </label>
            </div>
          ))}
        </div>

        <nav className="mt-4 flex-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            text="Dashboard" 
            active={currentView === 'dashboard'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem 
            icon={<Users size={20} />} 
            text="Roles & Access" 
            active={currentView === 'roles'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('roles')}
          />
          <NavItem icon={<Box size={20} />} text="Workloads" collapsed={!isSidebarOpen} onClick={() => console.log('Workloads') } />
          <NavItem icon={<Network size={20} />} text="Services" collapsed={!isSidebarOpen} onClick={() => console.log('Services') } />
          <NavItem icon={<AlertCircle size={20} />} text="Alerts" collapsed={!isSidebarOpen} onClick={() => console.log('Alerts') } />
          <NavItem icon={<Shield size={20} />} text="Security" collapsed={!isSidebarOpen} onClick={() => console.log('Security') } />
          <NavItem icon={<Settings size={20} />} text="Settings" collapsed={!isSidebarOpen} onClick={() => console.log('Settings') } />
        </nav>

        <div className="border-t border-gray-200 p-4 flex items-center">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          {isSidebarOpen && (
            <div className="ml-3 overflow-hidden transition-all duration-300">
              <p className="text-sm font-medium text-gray-700 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Static Header */}
        <header 
          className="fixed top-0 right-0 bg-white border-b border-gray-200 z-10 transition-all duration-300" 
          style={{ 
            left: isSidebarOpen ? '16rem' : '5rem',  // Use rem units instead of pixels
            transitionProperty: 'left',
            transitionDuration: '300ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
          }}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentView === 'roles' ? 'Cluster Roles Management' : 'Multi-Cluster Overview'}
              </h2>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors duration-200">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <button 
                  onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                  className={`p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ${isTerminalOpen ? 'bg-gray-100' : ''}`}
                >
                  <Terminal size={20} />
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown size={16} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        <User size={16} className="mr-3" /> Profile
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        <Settings size={16} className="mr-3" /> Settings
                      </a>
                      <hr className="my-1" />
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200">
                        <LogOut size={16} className="mr-3" /> Logout
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 mt-20">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, text, active = false, collapsed = false, onClick }: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors duration-200 w-full ${
        active && 'bg-blue-50 text-blue-600'
      }`}
    >
      <span className="mr-3 flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{text}</span>}
    </a>
  );
}

function MetricCard({ title, value, icon }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-600">{title}</h4>
        {icon}
      </div>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default App;