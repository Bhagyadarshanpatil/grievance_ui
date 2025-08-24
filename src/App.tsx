import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { SubmitGrievance } from './components/SubmitGrievance';
import { GrievanceList } from './components/GrievanceList';
import { useAuth } from './hooks/useAuth';
import { useGrievances } from './hooks/useGrievances';

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const { 
    grievances, 
    submitGrievance, 
    updateGrievanceStatus, 
    forwardGrievance,
    getGrievancesByStudent,
    getGrievancesByRole
  } = useGrievances();
  
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = async (credentials: any) => {
    return await login(credentials);
  };

  const handleSubmitGrievance = (grievanceData: any) => {
    submitGrievance(grievanceData);
    setActiveTab('grievances');
  };

  const handleUpdateStatus = (id: string, status: any, comment?: string) => {
    updateGrievanceStatus(id, status, comment, user?.id, user?.name, user?.role);
  };

  const handleForward = (id: string, toHandler: string, toRole: string, reason?: string) => {
    forwardGrievance(id, toHandler, toRole, user?.id || '', user?.role || '', reason);
  };

  const getUserGrievances = () => {
    if (!user) return [];
    
    if (user.role === 'student') {
      return getGrievancesByStudent(user.id);
    } else {
      return getGrievancesByRole(user.role, user);
    }
  };

  const renderContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} grievances={getUserGrievances()} />;
      case 'profile':
        return <Profile user={user} />;
      case 'submit':
        return <SubmitGrievance user={user} onSubmit={handleSubmitGrievance} />;
      case 'grievances':
        return (
          <GrievanceList
            user={user}
            grievances={getUserGrievances()}
            onUpdateStatus={handleUpdateStatus}
            onForward={handleForward}
          />
        );
      default:
        return <Dashboard user={user} grievances={getUserGrievances()} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} isLoading={isLoading} />;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={logout} 
      />
      
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;