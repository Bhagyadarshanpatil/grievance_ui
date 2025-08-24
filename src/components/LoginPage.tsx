import React, { useState } from 'react';
import { Shield, User, Lock, ChevronDown } from 'lucide-react';
import { LoginCredentials } from '../types';

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  isLoading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    id: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'proctor', label: 'Proctor' },
    { value: 'cluster_head', label: 'Cluster Head' },
    { value: 'hod', label: 'Head of Department' },
    { value: 'principal', label: 'Principal' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.id || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await onLogin(credentials);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grievance Portal</h1>
          <p className="text-gray-600">Secure access to grievance management system</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <div className="relative">
                <select
                  value={credentials.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {credentials.role === 'student' ? 'USN' : 'Employee ID'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={credentials.id}
                  onChange={(e) => handleChange('id', e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={credentials.role === 'student' ? 'Enter your USN' : 'Enter your Employee ID'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-medium">Demo Credentials:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Student:</strong> 1MS21CS001 / password123</p>
              <p><strong>Proctor:</strong> P001 / password123</p>
              <p><strong>Cluster Head:</strong> C001 / password123</p>
              <p><strong>HOD:</strong> H001 / password123</p>
              <p><strong>Principal:</strong> PRIN001 / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};