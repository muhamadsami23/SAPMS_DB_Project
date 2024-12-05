'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

// Define the structure of a Course object
interface Course {
  course_id: number
  course_name: string
}

// StarRating component for rating different aspects of a course
function StarRating({ name, value, onChange }: { name: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= value ? 'text-blue-500 fill-current' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// Define the props for the FeedbackModal component
interface FeedbackModalProps {
  course: Course
  onClose: () => void
  onSubmit: (feedback: any) => void
}

// Define the structure of FormData
interface FormData {
  teachingQuality: number;
  courseContent: number;
  communicationSkills: number;
  overallExperience: number;
  recommendationLikelihood: number;
  additionalComments: string;
}

// FeedbackModal component for submitting detailed feedback
function FeedbackModal({ course, onClose, onSubmit }: FeedbackModalProps) {
  const [formData, setFormData] = useState<FormData>({
    teachingQuality: 0,
    courseContent: 0,
    communicationSkills: 0,
    overallExperience: 0,
    recommendationLikelihood: 0,
    additionalComments: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'additionalComments' ? value : Number(value),
    }))
  }
  
  
  const handleStarRating = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ course, ...formData })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{course.course_name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Teaching Quality', name: 'teachingQuality' },
            { label: 'Course Content', name: 'courseContent' },
            { label: 'Communication Skills', name: 'communicationSkills' },
            { label: 'Overall Experience', name: 'overallExperience' },
            { label: 'Likelihood to Recommend', name: 'recommendationLikelihood' },
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <StarRating
  name={field.name}
  value={Number(formData[field.name as keyof FormData])}  
  onChange={(value) => handleStarRating(field.name, value)}
/>

            </div>
          ))}
          <div className="space-y-1">
            <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
              Additional Comments
            </label>
            <textarea
              id="additionalComments"
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleInputChange}
              className="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your comments here..."
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main FeedbackPage component
// FeedbackPage component with check for already submitted feedback
// Main FeedbackPage component
export default function FeedbackPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);

      const studentId = sessionStorage.getItem('student_id'); // Get student ID from sessionStorage

      if (!studentId) {
        setError('Student ID is not available.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5002/feedback-courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ student_id: studentId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data.courses); // Update state with courses

        // Check if feedback is already submitted for each course
        const feedbackStatusObj: { [key: number]: boolean } = {};
        for (const course of data.courses) {
          const feedbackResponse = await fetch('http://localhost:5002/check-feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              student_id: studentId,
              course_id: course.course_id,
            }),
          });

          const feedbackData = await feedbackResponse.json();
          feedbackStatusObj[course.course_id] = feedbackData.hasSubmittedFeedback;
        }

        setFeedbackStatus(feedbackStatusObj);

      } catch (err) {
        setError('An error occurred while fetching courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleFeedbackSubmit = async (feedback: any) => {
    try {
      const response = await fetch('http://localhost:5002/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: sessionStorage.getItem('student_id'),
          course_id: feedback.course.course_id,
          feedback_rating: feedback.overallExperience, // You can calculate an average if needed
          feedback_text: feedback.additionalComments,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success toast
        alert('Feedback submitted successfully!');
      } else {
        alert('Failed to submit feedback. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred while submitting your feedback.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Course Feedback</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {courses.map((course) => (
              <li key={course.course_id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">{course.course_name}</h2>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    disabled={feedbackStatus[course.course_id]} // Disable button if feedback is already submitted
                    className={`px-3 py-1 text-sm font-medium ${feedbackStatus[course.course_id] ? 'text-gray-400' : 'text-blue-600'} border ${feedbackStatus[course.course_id] ? 'border-gray-400' : 'border-blue-600'} rounded-md hover:${feedbackStatus[course.course_id] ? '' : 'bg-blue-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {feedbackStatus[course.course_id] ? 'Feedback Already Submitted' : 'Give Feedback'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedCourse && (
        <FeedbackModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}

