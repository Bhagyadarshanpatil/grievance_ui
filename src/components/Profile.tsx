import React from 'react';
import { User as UserIcon, Mail, Building, GraduationCap, Users, Shield } from 'lucide-react';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
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

  const ProfileField = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-lg text-gray-600">{getRoleDisplayName(user.role)}</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Verified Account</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField
            icon={UserIcon}
            label="User ID"
            value={user.id}
          />
          
          <ProfileField
            icon={Building}
            label="Department"
            value={user.department}
          />

          {user.email && (
            <ProfileField
              icon={Mail}
              label="Email"
              value={user.email}
            />
          )}

          {user.role === 'student' && (
            <>
              {user.usn && (
                <ProfileField
                  icon={GraduationCap}
                  label="USN"
                  value={user.usn}
                />
              )}
              
              {user.semester && (
                <ProfileField
                  icon={GraduationCap}
                  label="Semester"
                  value={`${user.semester}${user.semester === 1 ? 'st' : user.semester === 2 ? 'nd' : user.semester === 3 ? 'rd' : 'th'} Semester`}
                />
              )}
              
              {user.section && (
                <ProfileField
                  icon={Users}
                  label="Section"
                  value={`Section ${user.section}`}
                />
              )}
              
              {user.proctorId && (
                <ProfileField
                  icon={Users}
                  label="Proctor ID"
                  value={user.proctorId}
                />
              )}
            </>
          )}

          {user.role === 'proctor' && user.clusterId && (
            <ProfileField
              icon={Users}
              label="Cluster ID"
              value={user.clusterId}
            />
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Account Type:</span>
              <span className="ml-2 font-medium text-gray-900">{getRoleDisplayName(user.role)}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium text-green-600">Active</span>
            </div>
            <div>
              <span className="text-gray-600">Last Login:</span>
              <span className="ml-2 font-medium text-gray-900">Today</span>
            </div>
            <div>
              <span className="text-gray-600">Access Level:</span>
              <span className="ml-2 font-medium text-gray-900">
                {user.role === 'student' ? 'Standard' : 'Administrative'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};