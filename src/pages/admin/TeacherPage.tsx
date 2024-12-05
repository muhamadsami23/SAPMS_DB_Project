"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Edit, Eye } from "lucide-react";

// Define the structure of a teacher record
interface Teacher {
  faculty_id: string;
  name: string;
  email: string;
  contact: string;
}

export default function TeacherRecords() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch teacher data on component mount
  useEffect(() => {
    fetch("http://localhost:5002/teachers") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setTeachers(data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  const handleDelete = (faculty_id: string) => {
    setTeachers(teachers.filter((teacher) => teacher.faculty_id !== faculty_id));
  };

  const handleUpdate = (updatedTeacher: Teacher) => {
    setTeachers(
      teachers.map((teacher) =>
        teacher.faculty_id === updatedTeacher.faculty_id ? updatedTeacher : teacher
      )
    );
    setIsEditModalOpen(false);
  };

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Records</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Faculty ID</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Contact</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.faculty_id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{teacher.name}</td>
                <td className="py-2 px-4">{teacher.faculty_id}</td>
                <td className="py-2 px-4">{teacher.email}</td>
                <td className="py-2 px-4">{teacher.contact}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    className="p-1 bg-blue-500 text-white rounded"
                    onClick={() => handleView(teacher)}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 bg-green-500 text-white rounded"
                    onClick={() => handleEdit(teacher)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(teacher.faculty_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Teacher Information</h2>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {selectedTeacher.name}
              </p>
              <p>
                <strong>Faculty ID:</strong> {selectedTeacher.faculty_id}
              </p>
              <p>
                <strong>Email:</strong> {selectedTeacher.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedTeacher.contact}
              </p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
