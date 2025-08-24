import { useState, useEffect } from 'react';
import { Student, Proctor } from '../types';

const BASE_URL = "https://grievance-backend-9odk.onrender.com";

export const useDatabase = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [proctors, setProctors] = useState<Proctor[]>([]);

  // Fetch both students and proctors
  useEffect(() => {
    fetch(`${BASE_URL}/students`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error fetching students:", err));

    fetch(`${BASE_URL}/proctors`)
      .then(res => res.json())
      .then(data => setProctors(data))
      .catch(err => console.error("Error fetching proctors:", err));
  }, []);

  // Add student
  const addStudent = async (student: Student) => {
    const res = await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (res.ok) {
      const newStudent = await res.json();
      setStudents(prev => [...prev, newStudent]);
    }
  };

  // Update student
  const updateStudent = async (usn: string, updatedStudent: Student) => {
    const res = await fetch(`${BASE_URL}/students/${usn}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });
    if (res.ok) {
      setStudents(prev => prev.map(s => s.usn === usn ? updatedStudent : s));
    }
  };

  // Delete student
  const deleteStudent = async (usn: string) => {
    const res = await fetch(`${BASE_URL}/students/${usn}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setStudents(prev => prev.filter(s => s.usn !== usn));
    }
  };

  // Add proctor
  const addProctor = async (proctor: Proctor) => {
    const res = await fetch(`${BASE_URL}/proctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proctor),
    });
    if (res.ok) {
      const newProctor = await res.json();
      setProctors(prev => [...prev, newProctor]);
    }
  };

  // Update proctor
  const updateProctor = async (p_id: string, updatedProctor: Proctor) => {
    const res = await fetch(`${BASE_URL}/proctors/${p_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProctor),
    });
    if (res.ok) {
      setProctors(prev => prev.map(p => p.p_id === p_id ? updatedProctor : p));
    }
  };

  // Delete proctor (only if no students assigned)
  const deleteProctor = async (p_id: string) => {
    const hasStudents = students.some(s => s.p_id === p_id);
    if (hasStudents) {
      throw new Error('Cannot delete proctor with assigned students');
    }

    const res = await fetch(`${BASE_URL}/proctors/${p_id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProctors(prev => prev.filter(p => p.p_id !== p_id));
    }
  };

  // Helpers
  const getStudentsByProctor = (p_id: string) => {
    return students.filter(s => s.p_id === p_id);
  };

  const getProctorById = (p_id: string) => {
    return proctors.find(p => p.p_id === p_id);
  };

  return {
    students,
    proctors,
    addStudent,
    updateStudent,
    deleteStudent,
    addProctor,
    updateProctor,
    deleteProctor,
    getStudentsByProctor,
    getProctorById,
  };
};
