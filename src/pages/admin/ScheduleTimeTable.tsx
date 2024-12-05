'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Book } from 'lucide-react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState({});

  
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
       
      </div>
    </div>
  );
}
