import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  user: UserType;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onTabChange, onLogout }) => {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'profile', label: 'Profile', icon: User }
    ];

    if (user.role === 'student') {
      return [
        ...baseItems,
        { id: 'submit', label: 'Submit Grievance', icon: FileText },
        { id: 'grievances', label: 'My Grievances', icon: MessageSquare }
      ];
    } else {
      return [
        ...baseItems,
        { id: 'grievances', label: 'Grievances', icon: MessageSquare }
      ];
    }
  };

  const menuItems = getMenuItems();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'student': return 'Student';
      case 'proctor': return 'Proctor';
      case 'cluster_head': return 'Cluster Head';
      case 'hod': return 'Head of Department';
      case 'principal': return 'Principal';
      default: return role;
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">GMS</h1>
            <p className="text-xs text-gray-500">Grievance Portal</p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-600">{getRoleDisplayName(user.role)}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-auto p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};