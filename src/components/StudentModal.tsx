import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Student, Proctor } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  student?: Student;
  proctors: Proctor[];
  existingUSNs: string[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
  proctors,
  existingUSNs,
}) => {
  const [formData, setFormData] = useState<Student>({
    usn: '',
    name: '',
    sem: 1,
    section: '',
    dept: '',
    p_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        usn: '',
        name: '',
        sem: 1,
        section: '',
        dept: '',
        p_id: '',
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.usn.trim()) {
      newErrors.usn = 'USN is required';
    } else if (!student && existingUSNs.includes(formData.usn)) {
      newErrors.usn = 'USN already exists';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.sem < 1 || formData.sem > 8) {
      newErrors.sem = 'Semester must be between 1 and 8';
    }

    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }

    if (!formData.dept.trim()) {
      newErrors.dept = 'Department is required';
    }

    if (!formData.p_id) {
      newErrors.p_id = 'Proctor is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof Student, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              USN *
            </label>
            <input
              type="text"
              value={formData.usn}
              onChange={(e) => handleChange('usn', e.target.value.toUpperCase())}
              disabled={!!student}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="e.g., 1MS21CS001"
            />
            {errors.usn && <p className="text-red-500 text-xs mt-1">{errors.usn}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter student name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester *
              </label>
              <select
                value={formData.sem}
                onChange={(e) => handleChange('sem', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
              {errors.sem && <p className="text-red-500 text-xs mt-1">{errors.sem}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section *
              </label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => handleChange('section', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="A, B, C..."
                maxLength={1}
              />
              {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <input
              type="text"
              value={formData.dept}
              onChange={(e) => handleChange('dept', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Computer Science"
            />
            {errors.dept && <p className="text-red-500 text-xs mt-1">{errors.dept}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proctor *
            </label>
            <select
              value={formData.p_id}
              onChange={(e) => handleChange('p_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a proctor</option>
              {proctors.map(proctor => (
                <option key={proctor.p_id} value={proctor.p_id}>
                  {proctor.name} ({proctor.dept})
                </option>
              ))}
            </select>
            {errors.p_id && <p className="text-red-500 text-xs mt-1">{errors.p_id}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {student ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};