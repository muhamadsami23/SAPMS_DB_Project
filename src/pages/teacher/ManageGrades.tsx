'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

interface Course {
  course_id: number;
  course_name: string;
}

interface Section {
  section_id: number;
  section_name: string;
}

interface Assignment {
  assignment_id: number;
  description: string;
  total_marks: number;
}

interface StudentAssignment {
  student_id: number;
  name: string;
  marks_obtained: number | null;
}

const ManageGradesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [gradeType, setGradeType] = useState<'assignment' | 'quiz' | 'midterm' | 'finalterm' | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [students, setStudents] = useState<StudentAssignment[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const teacherId = sessionStorage.getItem('student_id');
        const response = await axios.post('http://localhost:5002/teacher-courses', { teacher_id: teacherId });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to fetch courses');
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const fetchSections = async () => {
        try {
          const response = await axios.post('http://localhost:5002/course-sections', { course_id: selectedCourse });
          setSections(response.data);
        } catch (error) {
          console.error('Error fetching sections:', error);
          toast.error('Failed to fetch sections');
        }
      };
      fetchSections();
    }
  }, [selectedCourse]);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(Number(event.target.value));
    setSelectedSection(null);
    setGradeType(null);
    setSelectedAssignment(null);
    setAssignments([]);
    setStudents([]);
  };

  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(Number(event.target.value));
    setGradeType(null);
    setSelectedAssignment(null);
    setAssignments([]);
    setStudents([]);
  };

  const handleGradeTypeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGradeType = event.target.value as 'assignment' | 'quiz' | 'midterm' | 'finalterm';
    setGradeType(selectedGradeType);
    setSelectedAssignment(null);
    setStudents([]);

    if (selectedGradeType === 'assignment' && selectedCourse) {
      try {
        const response = await axios.post('http://localhost:5002/assignments-grading', { course_id: selectedCourse });
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast.error('Failed to fetch assignments');
      }
    }
  };

  const handleAssignmentChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const assignmentId = Number(event.target.value);
    setSelectedAssignment(assignmentId);

    try {
      const response = await axios.post('http://localhost:5002/assignment-students', { assignment_id: assignmentId });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching student assignments:', error);
      toast.error('Failed to fetch student assignments');
    }
  };

  const handleGradeChange = (studentId: number, marksObtained: number) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.student_id === studentId ? { ...student, marks_obtained: marksObtained } : student
      )
    );
  };

  const saveGrades = async () => {
    if (!selectedAssignment || !selectedCourse) return;
  
    try {
      const gradesToSave = students.map(student => ({
        student_id: student.student_id,
        assignment_id: selectedAssignment,
        marks_obtained: student.marks_obtained,
      }));
  
      const response = await axios.post('http://localhost:5002/insert-assignment', {
        course_id: selectedCourse,
        grades: gradesToSave,
      });
  
      if (response.status === 200) {
        toast.success('Grades saved successfully');
      } else {
        toast.error('Failed to save grades');
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      toast.error('Failed to save grades');
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Grades</h1>
      <div className="mb-6">
        <label htmlFor="course" className="block mb-2 text-sm font-medium text-gray-700">Select Course:</label>
        <select
          id="course"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={handleCourseChange}
          value={selectedCourse || ''}
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="mb-6">
          <label htmlFor="section" className="block mb-2 text-sm font-medium text-gray-700">Select Section:</label>
          <select
            id="section"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleSectionChange}
            value={selectedSection || ''}
          >
            <option value="">Select a section</option>
            {sections.map(section => (
              <option key={section.section_id} value={section.section_id}>
                {section.section_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSection && (
        <div className="mb-6">
          <label htmlFor="gradeType" className="block mb-2 text-sm font-medium text-gray-700">Select Grade Type:</label>
          <select
            id="gradeType"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleGradeTypeChange}
            value={gradeType || ''}
          >
            <option value="">Select grade type</option>
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
            <option value="midterm">Midterm</option>
            <option value="finalterm">Finalterm</option>
          </select>
        </div>
      )}

      {gradeType === 'assignment' && assignments.length > 0 && (
        <div className="mb-6">
          <label htmlFor="assignment" className="block mb-2 text-sm font-medium text-gray-700">Select Assignment:</label>
          <select
            id="assignment"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleAssignmentChange}
            value={selectedAssignment || ''}
          >
            <option value="">Select an assignment</option>
            {assignments.map(assignment => (
              <option key={assignment.assignment_id} value={assignment.assignment_id}>
                {assignment.description} (Total Marks: {assignment.total_marks})
              </option>
            ))}
          </select>
        </div>
      )}

      {students.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Student Grades</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Student ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Marks Obtained</th>
                <th className="border border-gray-300 p-2">Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_id}>
                  <td className="border border-gray-300 p-2">{student.student_id}</td>
                  <td className="border border-gray-300 p-2">{student.name}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      className="w-full p-1 border border-gray-300 rounded-md"
                      value={student.marks_obtained || ''}
                      onChange={(e) =>
                        handleGradeChange(student.student_id, parseFloat(e.target.value) || 0)
                      }
                      placeholder="Marks Obtained"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    {assignments.find(a => a.assignment_id === selectedAssignment)?.total_marks || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {students.length > 0 && (
        <div className="mb-6">
          <button
            onClick={saveGrades}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Save Grades
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageGradesPage;

