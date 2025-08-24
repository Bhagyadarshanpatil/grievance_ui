import React, { useState } from 'react';
import { FileText, Send, AlertCircle } from 'lucide-react';
import { User, Grievance } from '../types';

interface SubmitGrievanceProps {
  user: User;
  onSubmit: (grievance: Omit<Grievance, 'id' | 'submissionDate' | 'lastUpdated' | 'status' | 'currentHandler' | 'handlerRole'>) => void;
}

export const SubmitGrievance: React.FC<SubmitGrievanceProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'academic' as 'academic' | 'non-academic',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const grievanceData = {
      studentId: user.id,
      studentName: user.name,
      studentUSN: user.usn || user.id,
      type: formData.type,
      description: formData.description,
      priority: formData.priority
    };

    onSubmit(grievanceData);
    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        type: 'academic',
        description: '',
        priority: 'medium'
      });
    }, 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Submit Grievance</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Grievance Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your grievance has been submitted and assigned a tracking ID. You will receive updates on its progress.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Your grievance will be reviewed by your proctor within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Submit Grievance</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="h-4 w-4" />
          All fields are required
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Info Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Name:</span>
                <span className="ml-2 font-medium">{user.name}</span>
              </div>
              <div>
                <span className="text-blue-700">USN:</span>
                <span className="ml-2 font-medium">{user.usn}</span>
              </div>
              <div>
                <span className="text-blue-700">Department:</span>
                <span className="ml-2 font-medium">{user.department}</span>
              </div>
            </div>
          </div>

          {/* Grievance Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grievance Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="type"
                  value="academic"
                  checked={formData.type === 'academic'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Academic</div>
                  <div className="text-sm text-gray-500">Course, exams, faculty, curriculum related</div>
                </div>
              </label>
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="type"
                  value="non-academic"
                  checked={formData.type === 'non-academic'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Non-Academic</div>
                  <div className="text-sm text-gray-500">Hostel, mess, transport, infrastructure</div>
                </div>
              </label>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low - General inquiry or suggestion</option>
              <option value="medium">Medium - Standard issue requiring attention</option>
              <option value="high">High - Important issue affecting studies/life</option>
              <option value="urgent">Urgent - Critical issue requiring immediate action</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Please provide a detailed description of your grievance. Include specific incidents, dates, and any relevant information that will help us understand and address your concern effectively."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 50 characters required. Be specific and provide all relevant details.
            </p>
          </div>

          {/* Auto-filled Date/Time Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Submission Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Submission Date:</span>
                <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Submission Time:</span>
                <span className="ml-2 font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ type: 'academic', description: '', priority: 'medium' })}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.description.length < 50}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Grievance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};