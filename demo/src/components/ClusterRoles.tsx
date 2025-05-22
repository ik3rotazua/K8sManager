import ReactDOM from 'react-dom';
import { useState } from 'react';
import { Shield, Plus, Search, X } from 'lucide-react';

// Mock roles data
const predefinedRoles = [
  { name: 'cluster-admin', description: 'Full access to all resources' },
  { name: 'admin', description: 'Full access to namespaced resources' },
  { name: 'edit', description: 'Edit access to most resources' },
  { name: 'view', description: 'Read-only access to most resources' },
  { name: 'monitoring', description: 'Access to monitoring resources' },
  { name: 'deployment-manager', description: 'Manage deployments and pods' },
];

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

// Mock users data
const mockUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', roles: ['cluster-admin'] },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', roles: ['edit', 'view'] },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', roles: ['view'] },
];

export default function ClusterRoles() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState<{ name: string, email: string, roles: string[] }>({ name: '', email: '', roles: [] });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.roles.length > 0) {
      setUsers([...users, { ...newUser, id: Date.now().toString() }]);
      setNewUser({ name: '', email: '', roles: [] });
      setShowAddUser(false);
    }
  };

  const toggleRole = (userId: string, role: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const roles = user.roles.includes(role)
          ? user.roles.filter(r => r !== role)
          : [...user.roles, role];
        return { ...user, roles };
      }
      return user;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Roles Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Cluster Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedRoles.map(role => (
            <div key={role.name} className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="text-blue-500" size={20} />
                <h4 className="font-medium text-gray-800">{role.name}</h4>
              </div>
              <p className="text-sm text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Users and Permissions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Users and Permissions</h3>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Add User
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              autoComplete='off'
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {predefinedRoles.map(role => (
                        <button
                          key={role.name}
                          onClick={() => toggleRole(user.id, role.name)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.roles.includes(role.name)
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser &&
      ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-8 w-full max-w-md transform transition-all duration-300 ease-out shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  autoComplete='off'
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  autoComplete='off'
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                <div className="space-y-2">
                  {predefinedRoles.map(role => (
                    <label key={role.name} className="flex items-center">
                      <input
                        type="checkbox"
                        autoComplete='off'
                        checked={newUser.roles.includes(role.name)}
                        onChange={(e) => {
                          const roles = e.target.checked
                            ? [...newUser.roles, role.name]
                            : newUser.roles.filter(r => r !== role.name);
                          setNewUser({ ...newUser, roles });
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    }
    </div>
  );
}