'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle, X, Plus, Edit2, ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { format, parseISO } from 'date-fns'

interface Course {
  course_id: number
  course_name: string
}

interface Section {
  section_id: number
  section_name: string
}

interface Student {
  student_id: number
  name: string
}

type AttendanceStatus = 'Present' | 'Absent' | 'Late'

interface AttendanceRecord {
  attendance_id: number
  date: string
  course_id: number
  course_name: string
  section_id: number
  section_name: string
  student_id: number
  student_name: string
  status: AttendanceStatus
  attendance_time: string
}

interface AttendanceSummary {
  date: string
  course_id: number
  course_name: string
  section_id: number
  section_name: string
  attendance_time: string
  present: number
  absent: number
  late: number
  total: number
}

export default function AttendancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [savedRecords, setSavedRecords] = useState<AttendanceRecord[]>([])
  const [filterDate, setFilterDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [filterSection, setFilterSection] = useState<number | null>(null)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)
  const [attendanceSummaries, setAttendanceSummaries] = useState<AttendanceSummary[]>([])
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const teacherId = sessionStorage.getItem('student_id')
        const response = await axios.post('http://localhost:5002/teacher-courses', { teacher_id: teacherId })
        setCourses(response.data)
      } catch (error) {
        console.error('Error fetching courses:', error)
        toast.error('Failed to fetch courses')
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    const fetchSections = async () => {
      if (selectedCourse) {
        try {
          const response = await axios.post('http://localhost:5002/course-sections', { course_id: selectedCourse })
          setSections(response.data)
        } catch (error) {
          console.error('Error fetching sections:', error)
          toast.error('Failed to fetch sections')
        }
      }
    }
    fetchSections()
  }, [selectedCourse])

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedCourse && selectedSection) {
        try {
          const response = await axios.post('http://localhost:5002/section-students', { 
            course_id: selectedCourse,
            section_id: selectedSection
          })
          setStudents(response.data)
          const selectedCourseData = courses.find(c => c.course_id === selectedCourse)
          const selectedSectionData = sections.find(s => s.section_id === selectedSection)
          setAttendance(response.data.map(student => ({
            attendance_id: 0,
            date: format(selectedDate, 'yyyy-MM-dd'),
            course_id: selectedCourse,
            course_name: selectedCourseData ? selectedCourseData.course_name : '',
            section_id: selectedSection,
            section_name: selectedSectionData ? selectedSectionData.section_name : '',
            student_id: student.student_id,
            student_name: student.name,
            status: 'Present' as AttendanceStatus,
            attendance_time: format(new Date(), 'HH:mm:ss')
          })))
        } catch (error) {
          console.error('Error fetching students:', error)
          toast.error('Failed to fetch students')
        }
      }
    }
    fetchStudents()
  }, [selectedCourse, selectedSection, selectedDate, courses, sections])

  useEffect(() => {
    fetchAttendanceRecords()
  }, [filterDate, filterSection])

  const fetchAttendanceRecords = async () => {
    try {
      const teacherId = sessionStorage.getItem('student_id')
      const response = await axios.post('http://localhost:5002/fetch-attendance', {
        teacher_id: teacherId,
        date: filterDate,
        section_id: filterSection
      })
      setSavedRecords(response.data)
    } catch (error) {
      console.error('Error fetching attendance records:', error)
      toast.error('Failed to fetch attendance records')
    }
  }

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(Number(event.target.value))
    setSelectedSection(null)
    setStudents([])
    setAttendance([])
  }

  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(Number(event.target.value))
    setAttendance([])
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value + 'T00:00:00'))
  }

  const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => prev.map(record =>
      record.student_id === studentId ? { ...record, status } : record
    ))
  }

  const getAttendanceStatus = (studentId: number): AttendanceStatus => {
    return attendance.find(record => record.student_id === studentId)?.status || 'Present'
  }

  const saveAttendance = async () => {
    if (selectedCourse && selectedSection && selectedDate) {
      try {
        const teacherId = sessionStorage.getItem('student_id')
        console.log("faculty id", teacherId)

        const attendanceData = attendance.map(record => ({
          ...record,
          faculty_id: teacherId,
        }))

        await axios.post('http://localhost:5002/save-attendance', attendanceData)

        setIsModalOpen(false)
        setAttendance([])
        setSelectedCourse(null)
        setSelectedSection(null)
        toast.success('Attendance saved successfully')
        fetchAttendanceRecords()
      } catch (error) {
        console.error('Error saving attendance:', error)
        toast.error('Failed to save attendance')
      }
    }
  }

  const updateAttendance = async () => {
    if (editingRecord) {
      try {
        await axios.post('http://localhost:5002/update-attendance', editingRecord)
        setIsEditModalOpen(false)
        setEditingRecord(null)
        toast.success('Attendance updated successfully')
        fetchAttendanceRecords()
      } catch (error) {
        console.error('Error updating attendance:', error)
        toast.error('Failed to update attendance')
      }
    }
  }

  const calculateAttendanceSummaries = (records: AttendanceRecord[]) => {
    const summaries: { [key: string]: AttendanceSummary } = {}

    records.forEach(record => {
      const key = `${record.date}-${record.course_id}-${record.section_id}-${record.attendance_time}`
      if (!summaries[key]) {
        summaries[key] = {
          date: record.date,
          course_id: record.course_id,
          course_name: record.course_name,
          section_id: record.section_id,
          section_name: record.section_name,
          attendance_time: record.attendance_time,
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        }
      }
      summaries[key][record.status.toLowerCase() as 'present' | 'absent' | 'late']++
      summaries[key].total++
    })

    return Object.values(summaries)
  }

  useEffect(() => {
    const newSummaries = calculateAttendanceSummaries(savedRecords)
    setAttendanceSummaries(newSummaries)
  }, [savedRecords])

  const toggleSummaryExpansion = (key: string) => {
    setExpandedSummary(expandedSummary === key ? null : key)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-900 mb-12">
          <Users className="inline-block mr-2 mb-1" size={36} />
          Attendance Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="inline-block mr-2" size={20} />
          Add Attendance
        </button>

        {/* Filter options */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filter Attendance Records</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="filterDate"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="filterSection" className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                id="filterSection"
                value={filterSection?.toString() || ''}
                onChange={(e) => setFilterSection(e.target.value ? Number(e.target.value) : null)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">All Sections</option>
                {sections.map(section => (
                  <option key={section.section_id} value={section.section_id.toString()}>
                    {section.section_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Display attendance summaries and records */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Attendance Records</h2>
          {attendanceSummaries.length > 0 ? (
            attendanceSummaries.map((summary) => (
              <div key={`${summary.date}-${summary.course_id}-${summary.section_id}-${summary.attendance_time}`} className="bg-white shadow rounded-lg overflow-hidden">
                <div 
                  className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors p-4"
                  onClick={() => toggleSummaryExpansion(`${summary.date}-${summary.course_id}-${summary.section_id}-${summary.attendance_time}`)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {format(new Date(summary.date), 'yyyy-MM-dd')} - {summary.course_name} ({summary.section_name}) - {format(new Date(summary.attendance_time), 'HH:mm')}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {summary.present}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-4 h-4 mr-1" />
                        {summary.absent}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-1" />
                        {summary.late}
                      </span>
                      {expandedSummary === `${summary.date}-${summary.course_id}-${summary.section_id}-${summary.attendance_time}` ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>
                {expandedSummary === `${summary.date}-${summary.course_id}-${summary.section_id}-${summary.attendance_time}` && (
                  <div className="p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th scope="col" className="px-6 py-3 text-left te-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left te-wider">Time</th>
                          <th scope="col" className="px-6 py-3 text-left te-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {savedRecords
                          .filter(record => 
                            record.date === summary.date && 
                            record.course_id === summary.course_id && 
                            record.section_id === summary.section_id &&
                            record.attendance_time === summary.attendance_time
                          )
                          .map((record) => (
                            <tr key={record.attendance_id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {record.student_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                  record.status === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {format(new Date(record.attendance_time), 'HH:mm')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => {
                                    setEditingRecord(record)
                                    setIsEditModalOpen(true)
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                <p className="mt-1 text-sm text-gray-500">Add new attendance records or adjust your filters.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Attendance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Add Attendance</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  id="course"
                  onChange={handleCourseChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                  <select
                    id="section"
                    onChange={handleSectionChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  onChange={handleDateChange}
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {selectedCourse && selectedSection && selectedDate && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Student Attendance</h3>
                  <div className="space-y-2">
                    {students.map(student => (
                      <div key={student.student_id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <span className="font-medium text-gray-900">{student.name}</span>
                        <div className="flex space-x-2">
                          {[
                            { status: 'Present', icon: CheckCircle, color: 'text-green-600' },
                            { status: 'Absent', icon: XCircle, color: 'text-red-600' },
                            { status: 'Late', icon: Clock, color: 'text-yellow-600' }
                          ].map(({ status, icon: Icon, color }) => (
                            <button
                              key={status}
                              onClick={() => handleAttendanceChange(student.student_id, status as AttendanceStatus)}
                              className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                getAttendanceStatus(student.student_id) === status
                                  ? `bg-indigo-100 ${color}`
                                  : 'text-gray-400 hover:text-gray-500'
                              }`}
                            >
                              <Icon size={20} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={saveAttendance}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Edit Attendance</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Student: {editingRecord.student_name}</p>
                <p className="text-sm font-medium text-gray-700">Date: {format(parseISO(editingRecord.date), 'MMMM d, yyyy')}</p>
                <p className="text-sm font-medium text-gray-700">Time: {format(new Date(editingRecord.attendance_time), 'HH:mm')}</p>
                <p className="text-sm font-medium text-gray-700">Course: {editingRecord.course_name}</p>
                <p className="text-sm font-medium text-gray-700">Section: {editingRecord.section_name}</p>
              </div>
              <div>
                <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="editStatus"
                  value={editingRecord.status}
                  onChange={(e) => setEditingRecord({...editingRecord, status: e.target.value as AttendanceStatus})}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={updateAttendance}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

