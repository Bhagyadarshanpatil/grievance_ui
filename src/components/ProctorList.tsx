import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Users, Building } from 'lucide-react';
import { Proctor, Student } from '../types';

interface ProctorListProps {
  proctors: Proctor[];
  students: Student[];
  onEdit: (proctor: Proctor) => void;
  onDelete: (p_id: string) => void;
  onAdd: () => void;
}

export const ProctorList: React.FC<ProctorListProps> = ({
  proctors,
  students,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const departments = [...new Set(proctors.map(p => p.dept))];

  const filteredProctors = proctors.filter(proctor => {
    const matchesSearch = proctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proctor.p_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !filterDept || proctor.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  const getStudentCount = (p_id: string) => {
    return students.filter(s => s.p_id === p_id).length;
  };

  const handleDelete = (p_id: string) => {
    const studentCount = getStudentCount(p_id);
    if (studentCount > 0) {
      alert(`Cannot delete proctor with ${studentCount} assigned students. Please reassign students first.`);
      return;
    }
    onDelete(p_id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Proctors</h1>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Proctor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Proctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProctors.map((proctor) => {
          const studentCount = getStudentCount(proctor.p_id);
          return (
            <div key={proctor.p_id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(proctor)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proctor.p_id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{proctor.name}</h3>
                <p className="text-sm text-gray-500 mb-3">ID: {proctor.p_id}</p>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Building className="h-4 w-4 mr-2" />
                  {proctor.dept}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Assigned Students</span>
                  <span className="text-lg font-semibold text-emerald-600">{studentCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProctors.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No proctors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterDept ? 'Try adjusting your search criteria.' : 'Get started by adding a new proctor.'}
          </p>
        </div>
      )}
    </div>
  );
};