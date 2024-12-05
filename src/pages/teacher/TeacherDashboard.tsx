'use client'

import React, { useEffect, useState } from 'react'
import { User, Book, Phone, Mail, Edit, Calendar, ClipboardCheck, GraduationCap, Clock, ChevronRight } from 'lucide-react'

interface TeacherInfo {
  name: string
  email: string
  contact: string
}

interface Course {
  name: string
  description: string
}

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const TeacherDashboard: React.FC = () => {
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchTeacherData = async () => {
      const studentId = sessionStorage.getItem('student_id')

      const response = await fetch('http://localhost:5002/teacher-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId }),
      })

      const data = await response.json()
      setTeacherInfo(data.teacher)
      setCourses(data.courses)
    }

    fetchTeacherData()
  }, [])

  const features: Feature[] = [
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
      title: 'Grade Management',
      description: 'Easily input, track, and analyze student grades across all your courses.',
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-green-500" />,
      title: 'Attendance Tracking',
      description: 'Efficiently manage and monitor student attendance for each class session.',
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: 'Record Checking',
      description: 'Review and verify academic records, ensuring accuracy and completeness.',
    },
    {
      icon: <Calendar className="w-8 h-8 text-red-500" />,
      title: 'Smart Scheduling',
      description: 'Organize your classes, office hours, and academic events with ease.',
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12">
          Teacher Dashboard
        </h1>

        {/* Teacher Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold mb-6 flex items-center text-blue-600">
                <User className="mr-3" size={28} /> Teacher Profile
              </h2>
              <div className="space-y-4 text-gray-700">
                {teacherInfo ? (
                  <>
                    <div className="flex items-center text-gray-800">
                      <span className="w-28 font-semibold">Name:</span>
                      <span>{teacherInfo.name}</span>
                    </div>
                    <div className="flex items-center text-gray-800">
                      <Mail className="mr-2 text-blue-500" size={20} />
                      <span>{teacherInfo.email}</span>
                    </div>
                    <div className="flex items-center text-gray-800">
                      <Phone className="mr-2 text-blue-500" size={20} />
                      <span>{teacherInfo.contact}</span>
                    </div>
                   
                  </>
                ) : (
                  <p className="text-gray-500">Loading profile information...</p>
                )}
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold mb-6 flex items-center text-purple-600">
                <Book className="mr-3" size={28} /> Your Courses
              </h2>
              <div className="space-y-4">
                {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <div key={index} className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col w-4/5">
                        <span className="text-lg font-semibold text-gray-800">{course.name}</span>
                        <span className="text-sm text-gray-600">{course.description}</span>
                      </div>
                      <ChevronRight className="text-purple-500" size={24} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">You are not teaching any courses yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Teacher Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center">
              <GraduationCap className="mr-2" size={20} /> Enter Grades
            </button>
            <button className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center">
              <ClipboardCheck className="mr-2" size={20} /> Take Attendance
            </button>
            <button className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300 flex items-center justify-center">
              <Clock className="mr-2" size={20} /> Check Records
            </button>
            <button className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center">
              <Calendar className="mr-2" size={20} /> Manage Schedule
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="text-center text-gray-600 mt-12">
          <p className="text-sm">© 2024 Teacher Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default TeacherDashboard

