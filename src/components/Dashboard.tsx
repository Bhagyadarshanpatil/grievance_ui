import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { User, Grievance } from '../types';

interface DashboardProps {
  user: User;
  grievances: Grievance[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, grievances }) => {
  const getStudentStats = () => {
    const userGrievances = grievances.filter(g => g.studentId === user.id);
    return {
      total: userGrievances.length,
      pending: userGrievances.filter(g => ['submitted', 'under_review', 'forwarded'].includes(g.status)).length,
      resolved: userGrievances.filter(g => g.status === 'resolved').length,
      urgent: userGrievances.filter(g => g.priority === 'urgent').length
    };
  };

  const getStaffStats = () => {
    const assignedGrievances = grievances.filter(g => g.currentHandler === user.id);
    return {
      total: assignedGrievances.length,
      pending: assignedGrievances.filter(g => ['submitted', 'under_review'].includes(g.status)).length,
      resolved: assignedGrievances.filter(g => g.status === 'resolved').length,
      urgent: assignedGrievances.filter(g => g.priority === 'urgent').length
    };
  };

  const stats = user.role === 'student' ? getStudentStats() : getStaffStats();

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const recentGrievances = user.role === 'student' 
    ? grievances.filter(g => g.studentId === user.id).slice(0, 5)
    : grievances.filter(g => g.currentHandler === user.id).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'forwarded': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user.name}
          </p>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Grievances"
          value={stats.total}
          subtitle={user.role === 'student' ? 'Submitted by you' : 'Assigned to you'}
          color="bg-blue-500"
        />
        <StatCard
          icon={Clock}
          title="Pending"
          value={stats.pending}
          subtitle="Awaiting action"
          color="bg-yellow-500"
        />
        <StatCard
          icon={CheckCircle}
          title="Resolved"
          value={stats.resolved}
          subtitle="Successfully closed"
          color="bg-green-500"
        />
        <StatCard
          icon={AlertTriangle}
          title="Urgent"
          value={stats.urgent}
          subtitle="High priority items"
          color="bg-red-500"
        />
      </div>

      {/* Recent Grievances */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Grievances</h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        
        {recentGrievances.length > 0 ? (
          <div className="space-y-4">
            {recentGrievances.map((grievance) => (
              <div key={grievance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">#{grievance.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grievance.status)}`}>
                      {grievance.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(grievance.priority)}`}>
                      {grievance.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{grievance.description.substring(0, 100)}...</p>
                  {user.role !== 'student' && (
                    <p className="text-xs text-gray-500">Student: {grievance.studentName} ({grievance.studentUSN})</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(grievance.submissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No grievances yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user.role === 'student' 
                ? 'Submit your first grievance to get started.' 
                : 'No grievances have been assigned to you yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};