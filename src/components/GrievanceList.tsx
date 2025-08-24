import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { User, Grievance } from '../types';

interface GrievanceListProps {
  user: User;
  grievances: Grievance[];
  onUpdateStatus: (id: string, status: Grievance['status'], comment?: string) => void;
  onForward: (id: string, toHandler: string, toRole: string, reason?: string) => void;
}

export const GrievanceList: React.FC<GrievanceListProps> = ({ 
  user, 
  grievances, 
  onUpdateStatus, 
  onForward 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [forwardReason, setForwardReason] = useState('');

  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = grievance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grievance.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grievance.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || grievance.status === statusFilter;
    const matchesPriority = !priorityFilter || grievance.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'forwarded': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const canTakeAction = (grievance: Grievance) => {
    return grievance.currentHandler === user.id && 
           ['submitted', 'under_review', 'forwarded'].includes(grievance.status);
  };

  const getForwardOptions = () => {
    switch (user.role) {
      case 'proctor':
        return [
          { id: 'C001', role: 'cluster_head', name: 'Dr. Lisa Thompson (Cluster Head)' }
        ];
      case 'cluster_head':
        return [
          { id: 'H001', role: 'hod', name: 'Prof. Robert Chen (HOD - CS)' },
          { id: 'H002', role: 'hod', name: 'Dr. Maria Garcia (HOD - IT)' }
        ];
      case 'hod':
        return [
          { id: 'PRIN001', role: 'principal', name: 'Dr. James Anderson (Principal)' }
        ];
      default:
        return [];
    }
  };

  const handleStatusUpdate = (grievance: Grievance, newStatus: Grievance['status']) => {
    onUpdateStatus(grievance.id, newStatus, actionComment, user.id, user.name, user.role);
    setActionComment('');
    setSelectedGrievance(null);
  };

  const handleForward = (grievance: Grievance, toHandler: string, toRole: string) => {
    onForward(grievance.id, toHandler, toRole, user.id, user.role, forwardReason);
    setForwardReason('');
    setSelectedGrievance(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {user.role === 'student' ? 'My Grievances' : 'Grievances'}
        </h1>
        <div className="text-sm text-gray-500">
          {filteredGrievances.length} of {grievances.length} grievances
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search grievances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="forwarded">Forwarded</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {filteredGrievances.map((grievance) => (
          <div key={grievance.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-gray-900">#{grievance.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(grievance.status)}`}>
                  {grievance.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(grievance.priority)}`}>
                  {grievance.priority.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedGrievance(grievance)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="font-medium text-gray-900 capitalize">{grievance.type.replace('_', ' ')}</p>
              </div>
              {user.role !== 'student' && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Student</p>
                  <p className="font-medium text-gray-900">{grievance.studentName} ({grievance.studentUSN})</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Submitted</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(grievance.submissionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Handler</p>
                <p className="font-medium text-gray-900">{grievance.handlerRole.replace('_', ' ').toUpperCase()}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-900">{grievance.description}</p>
            </div>

            {canTakeAction(grievance) && (
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleStatusUpdate(grievance, 'under_review')}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors duration-200 text-sm font-medium"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => handleStatusUpdate(grievance, 'resolved')}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
                >
                  Mark Resolved
                </button>
                {getForwardOptions().length > 0 && (
                  <button
                    onClick={() => setSelectedGrievance(grievance)}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                  >
                    Forward <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredGrievances.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No grievances found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter || priorityFilter 
              ? 'Try adjusting your search criteria.' 
              : user.role === 'student' 
                ? 'You haven\'t submitted any grievances yet.' 
                : 'No grievances have been assigned to you yet.'}
          </p>
        </div>
      )}

      {/* Grievance Detail Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Grievance #{selectedGrievance.id}
                </h2>
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Grievance Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedGrievance.status)}`}>
                    {selectedGrievance.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedGrievance.priority)}`}>
                    {selectedGrievance.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedGrievance.description}</p>
              </div>

              {/* Comments */}
              {selectedGrievance.comments && selectedGrievance.comments.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Comments & Updates</p>
                  <div className="space-y-3">
                    {selectedGrievance.comments.map((comment) => (
                      <div key={comment.id} className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-900">{comment.userName}</span>
                          <span className="text-xs text-blue-600">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-blue-800">{comment.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Section */}
              {canTakeAction(selectedGrievance) && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Comment (Optional)
                      </label>
                      <textarea
                        value={actionComment}
                        onChange={(e) => setActionComment(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a comment about your action..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusUpdate(selectedGrievance, 'under_review')}
                        className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors duration-200 font-medium"
                      >
                        Mark Under Review
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedGrievance, 'resolved')}
                        className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
                      >
                        Mark Resolved
                      </button>
                    </div>

                    {/* Forward Options */}
                    {getForwardOptions().length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Forward to Higher Authority
                        </label>
                        <textarea
                          value={forwardReason}
                          onChange={(e) => setForwardReason(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                          placeholder="Reason for forwarding (optional)..."
                        />
                        <div className="space-y-2">
                          {getForwardOptions().map((option) => (
                            <button
                              key={option.id}
                              onClick={() => handleForward(selectedGrievance, option.id, option.role)}
                              className="w-full px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium text-left"
                            >
                              Forward to {option.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};