import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Proctor } from '../types';

interface ProctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (proctor: Proctor) => void;
  proctor?: Proctor;
  existingIds: string[];
}

export const ProctorModal: React.FC<ProctorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  proctor,
  existingIds,
}) => {
  const [formData, setFormData] = useState<Proctor>({
    p_id: '',
    name: '',
    dept: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (proctor) {
      setFormData(proctor);
    } else {
      setFormData({
        p_id: '',
        name: '',
        dept: '',
      });
    }
    setErrors({});
  }, [proctor, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.p_id.trim()) {
      newErrors.p_id = 'Proctor ID is required';
    } else if (!proctor && existingIds.includes(formData.p_id)) {
      newErrors.p_id = 'Proctor ID already exists';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.dept.trim()) {
      newErrors.dept = 'Department is required';
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

  const handleChange = (field: keyof Proctor, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {proctor ? 'Edit Proctor' : 'Add New Proctor'}
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
              Proctor ID *
            </label>
            <input
              type="text"
              value={formData.p_id}
              onChange={(e) => handleChange('p_id', e.target.value.toUpperCase())}
              disabled={!!proctor}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="e.g., P001"
            />
            {errors.p_id && <p className="text-red-500 text-xs mt-1">{errors.p_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter proctor name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <input
              type="text"
              value={formData.dept}
              onChange={(e) => handleChange('dept', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., Computer Science"
            />
            {errors.dept && <p className="text-red-500 text-xs mt-1">{errors.dept}</p>}
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
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
            >
              {proctor ? 'Update' : 'Add'} Proctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};