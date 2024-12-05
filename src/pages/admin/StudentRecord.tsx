"use client"

import React, { useState, useEffect } from 'react'
import { Trash2, Edit, Eye } from 'lucide-react'

// Define the structure of a student record
interface Student {
  student_id: number
  name: string
  semester: number
  program_name: string

}

export default function StudentRecords() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch students from the backend API
  useEffect(() => {
    // Make sure to replace with your backend API endpoint
    fetch('http://localhost:5002/students')
      .then(response => response.json())
      .then(data => {
        setStudents(data) // Update the state with fetched students
      })
      .catch(error => {
        console.error('Error fetching students:', error)
      })
  }, []) // Run only once when the component mounts
  const handleDelete = (student_id: number) => {
    fetch('http://localhost:5002/students-del', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id }),
    })
      .then((response) => {
        if (!response.ok) {
          // Attempt to parse the error as JSON
          return response.json().then(
            (errorData) => {
              throw new Error(errorData.message || 'An error occurred');
            },
            () => {
              // If parsing fails, throw the raw response text
              throw new Error('An unexpected error occurred while deleting the student.');
            }
          );
        }
        setStudents(students.filter((student) => student.student_id !== student_id));
      })
      .catch((error) => {
        console.error('Error deleting student:', error.message);
      });
  };
  
  

  
  const handleUpdate = (updatedStudent: Student) => {
    // Send a PUT request to the backend to update the student
    fetch(`http://localhost:5002/students/${updatedStudent.student_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedStudent),
    })
      .then(response => response.json())
      .then(updatedStudent => {
        setStudents(students.map(student => 
          student.student_id === updatedStudent.id ? updatedStudent : student
        ))
        setIsEditModalOpen(false) // Close the edit modal after update
      })
      .catch(error => {
        console.error('Error updating student:', error)
      })
  }

  const handleView = (student: Student) => {
    setSelectedStudent(student)
    setIsViewModalOpen(true)
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Records</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Semester</th>
              <th className="py-2 px-4 text-left">id</th>
              <th className="py-2 px-4 text-left">PROGRAM</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.semester}</td>
                <td className="py-2 px-4">{student.student_id}</td>
                <td className="py-2 px-4">{student.program_name}</td>
                <td className="py-2 px-4 space-x-2">
                  <button className="p-1 bg-blue-500 text-white rounded" onClick={() => handleView(student)}>
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 bg-green-500 text-white rounded" onClick={() => handleEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 bg-red-500 text-white rounded" onClick={() => handleDelete(student.student_id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Student Information</h2>
            <div className="space-y-4">
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Semester:</strong> {selectedStudent.semester}</p>
              <p><strong>ID:</strong> {selectedStudent.student_id}</p>
              <p><strong>Program:</strong> {selectedStudent.program_name}</p>
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

      {/* Edit Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const updatedStudent = {
                ...selectedStudent,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                grade: formData.get('grade') as string,
                major: formData.get('major') as string,
              }
              handleUpdate(updatedStudent)
            }} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  id="name" 
                  name="name" 
                  defaultValue={selectedStudent.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
             
            
              <div>
                <label htmlFor="Program" className="block text-sm font-medium text-gray-700">Program</label>
                <input 
                  id="major" 
                  name="major" 
                  defaultValue={selectedStudent.program_name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
