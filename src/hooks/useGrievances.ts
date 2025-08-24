import { useState, useEffect } from 'react';
import { Grievance, User } from '../types';

const BASE_URL = "https://grievance-backend-9odk.onrender.com";

export const useGrievances = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/grievances`)
      .then(res => res.json())
      .then(data => setGrievances(data))
      .catch(err => console.error("Error loading grievances:", err));
  }, []);

  const submitGrievance = async (g: Omit<Grievance, 'id' | 'submissionDate' | 'lastUpdated' | 'status'>) => {
    const res = await fetch(`${BASE_URL}/grievances`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(g)
    });

    if (res.ok) {
      // MODIFIED: Add the new grievance returned from the API to the local state
      const newGrievance = await res.json();
      setGrievances(prev => [newGrievance, ...prev]);
      return true;
    }
    return false;
  };

  const updateGrievanceStatus = async (id: string, status: string) => {
    const res = await fetch(`${BASE_URL}/grievances/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      // MODIFIED: Update the specific grievance in the local state
      const updatedGrievance = await res.json();
      setGrievances(prev => prev.map(g => g.id === updatedGrievance.id ? updatedGrievance : g));
    }
  };

  const forwardGrievance = async (id: string, to: string, toRole: string) => {
    const res = await fetch(`${BASE_URL}/grievances/${id}/forward`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, toRole })
    });

    if (res.ok) {
      // MODIFIED: Update the specific grievance in the local state
      const updatedGrievance = await res.json();
      setGrievances(prev => prev.map(g => g.id === updatedGrievance.id ? updatedGrievance : g));
    }
  };

  // Filters (no changes needed)
  const getGrievancesByStudent = (studentId: string) =>
    grievances.filter(g => g.studentId === studentId);

  const getGrievancesByRole = (role: string, user: User) =>
    grievances.filter(g => g.currentHandler === user.id && g.handlerRole === role);

  return {
    grievances,
    submitGrievance,
    updateGrievanceStatus,
    forwardGrievance,
    getGrievancesByStudent,
    getGrievancesByRole
  };
};