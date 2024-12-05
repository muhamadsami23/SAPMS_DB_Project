'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Book } from 'lucide-react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState({});
  const facultyId = sessionStorage.getItem('student_id'); // Assuming faculty_id is stored in sessionStorage.

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/generate-timetable/${facultyId}`);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      alert('Failed to fetch timetable');
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [facultyId]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-indigo-900 mb-12">
          <Calendar className="inline-block mr-3 mb-1" size={40} />
          Teacher Schedule
        </h1>
        <button
          onClick={async () => {
            try {
              await axios.post('http://localhost:5002/generate-timetable');
              alert('Timetable generated successfully!');
            } catch (error) {
              console.error('Error generating timetable:', error);
              alert('Failed to generate timetable');
            }
          }}
          className="block mx-auto mb-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-md shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-blue-500 transition-all duration-300"
        >
          Generate Timetable
        </button>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6">
                <h3 className="font-semibold text-xl">{day}</h3>
              </div>
              <div className="p-6 space-y-4">
                {schedule[day]?.length > 0 ? (
                  schedule[day].map((classInfo, index) => (
                    <div
                      key={index}
                      className="bg-indigo-50 rounded-lg p-4 shadow-md hover:bg-indigo-100 transition-all duration-300"
                    >
                      <p className="font-medium text-indigo-900 flex items-center">
                        <Clock size={18} className="mr-2 text-indigo-700" />
                        {classInfo.time_slot}
                      </p>
                      <p className="text-indigo-800 mt-2 flex items-center">
                        <Book size={18} className="mr-2 text-indigo-700" />
                        {classInfo.course_name}
                      </p>
                      <p className="text-sm text-indigo-600 mt-2 flex items-center">
                        <MapPin size={18} className="mr-2 text-indigo-700" />
                        Section: {classInfo.section_name}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 text-center">No classes scheduled</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
