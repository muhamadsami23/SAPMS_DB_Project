// Import required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5002;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
      if (err) {
          console.error('Database query error:', err.message); // Log error details
          return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = results[0];

      // Log the user data to ensure `student_id` is included in the results
      console.log('User:', user);

      if (user.password === password) {
          const role = user.role; // Get the role from the database
          const studentID = user.student_id; // Ensure this is correctly populated in the DB
          return res.status(200).json({
              message: 'Login successful',
              userRole: role, // Send the role in the response
              studentId: studentID, // Send student_id correctly
          });
      } else {
          return res.status(401).json({ message: 'Invalid username or password' });
      }
  });
});



// student details
app.post('/student', (req, res) => {
  const { student_id } = req.body;  // Expecting student_id to be in the JSON payload

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  // Query to fetch student information
  const studentQuery = `
    SELECT 
      s.name, s.student_id, s.contact, s.gender, s.enrollment_date, s.address, s.dob, 
      s.semester, s.section_id, s.program_id,
      sec.section_name AS section_name, 
      prog.program_name AS program_name
    FROM students s
    LEFT JOIN sections sec ON s.section_id = sec.section_id
    LEFT JOIN programs prog ON s.program_id = prog.program_id
    WHERE s.student_id = ?;
  `;

  // Execute the query
  db.execute(studentQuery, [student_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);  // Add error logging
      return res.status(500).json({ error: 'Error fetching student data' });
    }

    if (result.length > 0) {
      const student = result[0];
      
      // Format the data
      const studentData = {
        name: student.name,
        roll_no: `${student.name.replace(/\s+/g, '')}_${student.student_id}`,
        email: `${student.name.replace(/\s+/g, '')}_${student.student_id}@university.edu.pk`,
        contact: student.contact,
        gender: student.gender,
        // Format date to remove time (YYYY-MM-DD)
        enrollment_date: new Date(student.enrollment_date).toISOString().split('T')[0], 
        address: student.address,
        // Format dob to remove time (YYYY-MM-DD)
        dob: new Date(student.dob).toISOString().split('T')[0], 
        semester: student.semester,
        section_name: student.section_name,
        program_name: student.program_name,
      };
      

      return res.json(studentData);
    } else {
      return res.status(404).json({ error: 'Student not found' });
    }
  });
});

app.post('/courses', (req, res) => {
  const { student_id } = req.body; // Expecting student_id to be in the JSON payload

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  // Query to fetch courses and attendance for the student
  const studentQuery = `
    SELECT 
      c.course_id,
      c.course_name,
      c.description,
      a.attendance_date,
      a.status 
    FROM 
      courses c
    JOIN 
      student_courses sc ON c.course_id = sc.course_id
    LEFT JOIN 
      attendance a ON c.course_id = a.course_id AND a.student_id = sc.student_id
    WHERE 
      sc.student_id = ?;
  `;

  // Execute the query
  db.execute(studentQuery, [student_id], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Add error logging
      return res.status(500).json({ error: 'Error fetching courses and attendance' });
    }

    if (result.length > 0) {
      // Structure the courses and attendance data
      const courses = result.reduce((acc, course) => {
        const existingCourse = acc.find(c => c.course_id === course.course_id);

        if (existingCourse) {
          // Add attendance to the existing course
          if (course.attendance_date) {
            existingCourse.attendance.push({
              attendance_date: course.attendance_date,
              status: course.status
            });
          }
        } else {
          // Create a new course with attendance
          acc.push({
            course_id: course.course_id,
            course_name: course.course_name,
            description: course.description,
            attendance: course.attendance_date ? [{
              attendance_date: course.attendance_date,
              status: course.status
            }] : []
          });
        }

        return acc;
      }, []);

      return res.json({ courses });
    } else {
      return res.status(404).json({ error: 'No courses found for this student' });
    }
  });
});




const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Function to get course details
async function getCourseDetails(studentId) {
  const query = `
    SELECT sc.course_id, c.course_name, c.description 
    FROM student_courses sc 
    JOIN courses c ON sc.course_id = c.course_id 
    WHERE sc.student_id = ?`;
  return await executeQuery(query, [studentId]);
}

// Function to get grade items for a course
async function getGradeItems(studentId, courseId) {
  const gradeItems = [];
  let id = 1;

  // Fetch assignments
 
 // Query to get student assignments for a specific course
const studentAssignmentsQuery = `
SELECT sa.assignment_id, sa.obtained_marks
FROM student_assignment sa
JOIN assignments a ON sa.assignment_id = a.assignment_id
WHERE sa.student_id = ? AND a.course_id = ?`;

// Fetch assignment details
const assignmentRows = await executeQuery(studentAssignmentsQuery, [studentId, courseId]);

if (assignmentRows.length > 0) {
const assignmentIds = assignmentRows.map((row) => row.assignment_id);

const assignmentDetailsQuery = `
  SELECT assignment_id, upload_date, total_marks 
  FROM assignments 
  WHERE assignment_id IN (${assignmentIds.map(() => '?').join(',')})`;

const assignments = await executeQuery(assignmentDetailsQuery, assignmentIds);

assignments.forEach((assignment) => {
  const obtainedMarks = assignmentRows.find(
    (row) => row.assignment_id === assignment.assignment_id
  )?.obtained_marks;

  gradeItems.push({
    id: id++,
    student_id: studentId,
    item_id: assignment.assignment_id,
    course_id: courseId,
    description: `Assignment ${gradeItems.length + 1}`,
    upload_date: assignment.upload_date,
    total_marks: assignment.total_marks,
    obtained_marks: obtainedMarks,
    type: 'assignment',
  });
});
}

  // Fetch quizzes
  const quizzesQuery = `
    SELECT * FROM quizzes_tasks
    WHERE student_id = ? AND course_id = ?`;
  const quizzes = await executeQuery(quizzesQuery, [studentId, courseId]);
  quizzes.forEach((quiz, index) => {
    gradeItems.push({
      id: id++,
      student_id: studentId,
      item_id: quiz.quiz_id,
      course_id: courseId,
      description: `Quiz ${index + 1}`,
      upload_date: quiz.upload_date,
      total_marks: quiz.total_marks,
      obtained_marks: quiz.obtained_marks,
      type: 'quiz'
    });
  });

  // Fetch midterm
  const midtermQuery = `
    SELECT * FROM mid_term 
    WHERE student_id = ? AND course_id = ?`;
  const midterms = await executeQuery(midtermQuery, [studentId, courseId]);
  if (midterms.length > 0) {
    const midterm = midterms[0];
    gradeItems.push({
      id: id++,
      student_id: studentId,
      item_id: midterm.mid_term_id,
      course_id: courseId,
      description: 'Midterm Exam',
      total_marks: midterm.total_marks,
      obtained_marks: midterm.obtained_marks,
      type: 'exam'
    });
  }

  // Fetch final
  const finalQuery = `
    SELECT * FROM final_term
    WHERE student_id = ? AND course_id = ?`;
  const finals = await executeQuery(finalQuery, [studentId, courseId]);
  if (finals.length > 0) {
    const final = finals[0];
    gradeItems.push({
      id: id++,
      student_id: studentId,
      item_id: final.final_term_id,
      course_id: courseId,
      description: 'Final Exam',
      total_marks: final.total_marks,
      obtained_marks: final.obtained_marks,
      type: 'exam'
    });
  }

  return gradeItems;
}

// API endpoint to fetch grades
app.post('/grades', async (req, res) => {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    const courses = await getCourseDetails(student_id);
    const coursesWithGrades = await Promise.all(
      courses.map(async (course) => {
        const gradeItems = await getGradeItems(student_id, course.course_id);
        return {
          ...course,
          gradeItems
        };
      })
    );

    res.json(coursesWithGrades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'An error occurred while fetching grades' });
  }
});


const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'
];
const rooms = [
  ...Array.from({ length: 7 }, (_, i) => `A-${i + 1}`),
  ...Array.from({ length: 7 }, (_, i) => `B-${i + 8}`),
  ...Array.from({ length: 8 }, (_, i) => `C-${i + 15}`),
  ...Array.from({ length: 4 }, (_, i) => `D-${i + 23}`),
  ...Array.from({ length: 4 }, (_, i) => `E-${i + 27}`)
];

// API to generate a timetable
app.post('/timetable', (req, res) => {
  const { student_id } = req.body;

  // Fetch student's section
  db.query(
    'SELECT section_id FROM students WHERE student_id = ?',
    [student_id],
    (err, sectionResults) => {
      if (err) {
        console.error('Error fetching section:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (sectionResults.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const section_id = sectionResults[0].section_id;

      // Fetch courses for the student's section
      db.query(
        `SELECT c.course_id, c.course_name
         FROM courses c
         JOIN sections sc ON c.course_id = sc.course_id
         WHERE sc.section_id = ?`,
        [section_id],
        (err, courseResults) => {
          if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (courseResults.length === 0) {
            return res.status(404).json({ error: 'No courses found for this section' });
          }

          // Generate timetable
          const timetable = generateTimetable(courseResults);

          res.json(timetable);
        }
      );
    }
  );
});

// Function to generate timetable
function generateTimetable(courses) {
  const timetable = {};
  days.forEach(day => {
    timetable[day] = [];
  });

  courses.forEach(course => {
    const availableDays = [...days];
    for (let i = 0; i < 4 && availableDays.length > 0; i++) {
      const dayIndex = Math.floor(Math.random() * availableDays.length);
      const day = availableDays[dayIndex];
      availableDays.splice(dayIndex, 1);

      if (timetable[day].length < 4) {
        const availableSlots = timeSlots.filter(slot =>
          !timetable[day].some(entry => entry.time === slot)
        );
        if (availableSlots.length > 0) {
          const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
          const room = rooms[Math.floor(Math.random() * rooms.length)];
          timetable[day].push({
            course_name: course.course_name,
            time: slot,
            room_no: room
          });
        }
      }
    }
  });

  return timetable;
}

app.post('/student-courses', (req, res) => {
  const { student_id } = req.body;

  // Fetch student's semester
  db.query(
    'SELECT semester FROM students WHERE student_id = ?',
    [student_id],
    (err, studentRows) => {
      if (err) {
        console.error('Error fetching student semester:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (studentRows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const semester = studentRows[0].semester;

      // Fetch all courses for the student's semester
      db.query(
        'SELECT c.course_id, c.course_name, c.description as course_description, c.credit FROM courses c WHERE c.semester = ?',
        [semester],
        (err, coursesRows) => {
          if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Fetch courses the student is registered for
          db.query(
            'SELECT course_id FROM student_courses WHERE student_id = ?',
            [student_id],
            (err, registeredRows) => {
              if (err) {
                console.error('Error fetching registered courses:', err);
                return res.status(500).json({ error: 'Internal server error' });
              }

              const registeredCourses = new Set(registeredRows.map(row => row.course_id));

              // Combine the data
              const courseData = coursesRows.map(course => ({
                ...course,
                status: registeredCourses.has(course.course_id) ? 'Registered' : 'Not Registered'
              }));

              res.json({
                semester,
                courses: courseData
              });
            }
          );
        }
      );
    }
  );
});

app.post('/student-assignments', (req, res) => {
  const { student_id } = req.body;

  // Get student's courses
  db.query(
    'SELECT course_id FROM student_courses WHERE student_id = ?',
    [student_id],
    (err, courses) => {
      if (err) {
        console.error('Error fetching student courses:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const courseIds = courses.map(course => course.course_id);

      if (courseIds.length === 0) {
        return res.json([]); // No courses found
      }

      // Get course names from the courses table
      db.query(
        'SELECT course_id, course_name FROM courses WHERE course_id IN (?)',
        [courseIds],
        (err, courseNames) => {
          if (err) {
            console.error('Error fetching course names:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Map course_id to course_name
          const courseNameMap = new Map(
            courseNames.map(course => [course.course_id, course.course_name])
          );

          // Get all assignments for these courses
          db.query(
            'SELECT * FROM assignments WHERE course_id IN (?)',
            [courseIds],
            (err, assignments) => {
              if (err) {
                console.error('Error fetching assignments:', err);
                return res.status(500).json({ error: 'Internal server error' });
              }

              if (assignments.length === 0) {
                return res.json([]); // No assignments found
              }

              // Get submitted assignments for this student
              db.query(
                'SELECT assignment_id FROM student_assignment WHERE student_id = ?',
                [student_id],
                (err, submittedAssignments) => {
                  if (err) {
                    console.error('Error fetching submitted assignments:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                  }

                  const currentDate = new Date();

                  // Create a set for submitted assignments
                  const submittedSet = new Set(
                    submittedAssignments.map(sa => `${sa.assignment_id}`)
                  );

                  const processedAssignments = assignments.map(assignment => {
                    let status;

                    // If the student has submitted the assignment, mark it as 'submitted'
                    if (submittedSet.has(assignment.assignment_id)) {
                      status = 'submitted';
                    } 
                    // If the submission date has passed, check if the student has submitted the assignment
                    else if (new Date(assignment.submission_date) < currentDate) {
                      // Check if there's a record for this student and assignment
                      const isSubmitted = submittedAssignments.some(sa => sa.assignment_id === assignment.assignment_id);
                      status = isSubmitted ? 'submitted' : 'missed';
                    } 
                    // Otherwise, it's 'due'
                    else {
                      status = 'due';
                    }

                    // Add the course name to the assignment
                    return {
                      ...assignment,
                      status,
                      course_name: courseNameMap.get(assignment.course_id) // Add course name here
                    };
                  });

                  res.json(processedAssignments);
                }
              );
            }
          );
        }
      );
    }
  );
});

app.post('/teacher-info', (req, res) => {
  const { student_id } = req.body;

  // Fetch teacher details using student_id
  const teacherQuery = `
    SELECT name, email, contact
    FROM teachers
    WHERE faculty_id = ?
  `;

  db.query(teacherQuery, [student_id], (err, teacherResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching teacher details' });
    }

    if (teacherResults.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const teacher = teacherResults[0];

    // Fetch courses taught by this teacher
    const coursesQuery = `
      SELECT c.course_name, c.description, c.course_id
      FROM courses c
      JOIN teacher_courses tc ON tc.course_id = c.course_id
      WHERE tc.teacher_id = ?
    `;

    db.query(coursesQuery, [student_id], (err, courseResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching courses' });
      }

      const courses = courseResults.map(course => ({
        course_id: course.course_id,
        name: course.course_name,
        description: course.description,
      }));

      // Return teacher details and courses
      res.json({ teacher, courses });
    });
  });
});


app.post('/teacher-courses', (req, res) => {
  const { teacher_id } = req.body;
  
  const query = `
    SELECT DISTINCT c.course_id, c.course_name 
    FROM courses c 
    JOIN teacher_courses tc ON c.course_id = tc.course_id 
    WHERE tc.teacher_id = ?
  `;
  
  db.query(query, [teacher_id], (error, results) => {
    if (error) {
      console.error('Error fetching teacher courses:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.json(results);
  });
});

app.post('/course-sections', (req, res) => {
  const { course_id } = req.body;
  
  const query = `
    SELECT section_id, section_name 
    FROM sections 
    WHERE course_id = ?
  `;
  
  db.query(query, [course_id], (error, results) => {
    if (error) {
      console.error('Error fetching course sections:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.json(results);
  });
});

app.post('/section-students', (req, res) => {
  const { course_id, section_id } = req.body;
  
  const query = `
    SELECT s.student_id, s.name 
    FROM students s 
    JOIN student_courses sc ON s.student_id = sc.student_id 
    WHERE sc.course_id = ? AND s.section_id = ?
  `;
  
  db.query(query, [course_id, section_id], (error, results) => {
    if (error) {
      console.error('Error fetching section students:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.json(results);
  });
});

app.post('/save-attendance', (req, res) => {
  const attendanceRecords = req.body;
  
  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    return res.status(400).json({ error: 'Invalid attendance data' });
  }

  // Check if attendance for this section and course has already been taken twice today
  const checkQuery = `
    SELECT COUNT(DISTINCT attendance_time) as count
    FROM attendance
    WHERE course_id = ? AND section_id = ? AND attendance_date = CURDATE()
  `;

  db.query(checkQuery, [attendanceRecords[0].course_id, attendanceRecords[0].section_id], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking attendance count:', checkError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (checkResults[0].count >= 2) {
      return res.status(400).json({ error: 'Attendance for this section has already been taken twice today' });
    }

    // If less than 2 attendances, proceed with saving
    const query = `
      INSERT INTO attendance (faculty_id, student_id, course_id, section_id, attendance_date, attendance_time, status)
      VALUES ?
      ON DUPLICATE KEY UPDATE status = VALUES(status)
    `;

    const values = attendanceRecords.map(record => [
      record.faculty_id,
      record.student_id,
      record.course_id,
      record.section_id,
      record.date,
      new Date(),
      record.status
    ]);

    db.query(query, [values], (error, results) => {
      if (error) {
        console.error('Error saving attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      res.json({ message: 'Attendance saved successfully' });
    });
  });
});

app.post('/fetch-attendance', (req, res) => {
  const { teacher_id, date, section_id } = req.body;

  let query = `
    SELECT 
      a.attendance_id, 
      a.attendance_date as date,
      a.attendance_time,
      a.course_id, 
      a.section_id, 
      s.section_name,
      a.student_id, 
      st.name as student_name,
      a.status,
      c.course_name
    FROM attendance a
    JOIN courses c ON a.course_id = c.course_id
    JOIN sections s ON a.section_id = s.section_id
    JOIN students st ON a.student_id = st.student_id
    WHERE a.faculty_id = ? AND a.attendance_date = ?
  `;

  const queryParams = [teacher_id, date];

  if (section_id) {
    query += ' AND a.section_id = ?';
    queryParams.push(section_id);
  }

  query += ' ORDER BY a.course_id, a.section_id, a.attendance_time, st.name';

  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error('Error fetching attendance records:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.json(results);
  });
});

app.post('/update-attendance', (req, res) => {
  const { attendance_id, status } = req.body;

  const query = 'UPDATE attendance SET status = ? WHERE attendance_id = ?';

  db.query(query, [status, attendance_id], (error, results) => {
    if (error) {
      console.error('Error updating attendance:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.json({ message: 'Attendance updated successfully' });
  });
});


app.get('/generate-timetable/:facultyId', async (req, res) => {
  const { facultyId } = req.params;

  try {
    const [results] = await db.promise().query(`
      SELECT 
        t.day,
        t.time_slot,
        c.course_name,
        s.section_name,
        t.teacher_id
      FROM 
        teacher_schedule t
      JOIN 
        courses c ON t.course_id = c.course_id
      JOIN 
        sections s ON t.section_id = s.section_id
      WHERE 
        t.teacher_id = ?
      ORDER BY 
        FIELD(t.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
        t.time_slot;
    `, [facultyId]);

    // Organize results by day
    const timetable = {};
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day) => {
      timetable[day] = results.filter((entry) => entry.day === day);
    });

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).send('Error fetching timetable');
  }
});


app.post('/generate-timetable', async (req, res) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // Days of the week
  const timeSlots = ['08:00-08:55', '09:00-09:55', '10:00-10:55', '11:00-11:55', '12:00-12:55'];
  const maxClassesPerDay = 5; // Max classes a section can have in a day
  const maxSameCoursePerDay = 2; // Max number of the same course allowed in a day for a section

  try {
    // Clear the previous timetable
    await db.promise().query('DELETE FROM teacher_schedule');

    // Fetch all sections
    const [sections] = await db.promise().query('SELECT * FROM sections');

    // Fetch all teacher-course mappings
    const [teacherCourses] = await db.promise().query('SELECT * FROM teacher_courses');

    // Track teacher availability
    const teacherSchedule = {}; // { teacher_id_day_timeSlot: true }

    // Initialize timetable array
    const timetable = [];

    // Loop through each section
    for (const section of sections) {
      // Track number of classes assigned per day for the current section
      const sectionDayClasses = {}; // { day: count }
      const sectionCourseCount = {}; // { day: { course_id: count } }

      // Initialize class count for all days and course count for all days
      days.forEach((day) => {
        sectionDayClasses[day] = 0;
        sectionCourseCount[day] = {};
      });

      // Assign courses to days and time slots
      for (const { teacher_id, course_id } of teacherCourses) {
        for (const day of days) {
          // Check if the section has reached max classes for the day
          if (sectionDayClasses[day] >= maxClassesPerDay) continue;

          // Check if the course has reached max occurrence for the day
          const courseCount = sectionCourseCount[day][course_id] || 0;
          if (courseCount >= maxSameCoursePerDay) continue;

          for (const slot of timeSlots) {
            // Check if the teacher is already busy at this time slot on this day
            const teacherSlotKey = `${teacher_id}_${day}_${slot}`;
            if (teacherSchedule[teacherSlotKey]) continue;

            // Assign this course to the section's timetable
            timetable.push({
              day,
              time_slot: slot,
              section_id: section.section_id,
              course_id,
              teacher_id,
            });

            // Mark teacher as busy
            teacherSchedule[teacherSlotKey] = true;

            // Update class and course counts for the section
            sectionDayClasses[day]++;
            sectionCourseCount[day][course_id] = courseCount + 1;

            break; // Move to the next course
          }

          // Exit early if the section has reached the max number of classes for the day
          if (sectionDayClasses[day] >= maxClassesPerDay) break;
        }
      }
    }

    // Insert the timetable into the database
    for (const entry of timetable) {
      await db.promise().query('INSERT INTO teacher_schedule SET ?', entry);
    }

    res.status(200).send('Timetable generated successfully for one week');
  } catch (error) {
    console.error('Error generating timetable:', error);
    res.status(500).send('Failed to generate timetable');
  }
});





// Get students for a course
app.post('/course-students', async (req, res) => {
  const { courseId } = req.body; // Extract from JSON body
  try {
    const [rows] = await db.execute(
      'SELECT s.student_id, s.name FROM students s JOIN student_courses sc ON s.student_id = sc.student_id WHERE sc.course_id = ?',
      [courseId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching course students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save assignment grades
app.post('/save-assignment-grades', async (req, res) => {
  const { assignmentId, grades } = req.body;
  try {
    await db.beginTransaction();
    for (const grade of grades) {
      await db.execute(
        'INSERT INTO student_assignment (student_id, assignment_id, obtained_marks, Status) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE obtained_marks = ?, Status = 1',
        [grade.studentId, assignmentId, grade.obtainedMarks, grade.obtainedMarks]
      );
    }
    await db.commit();
    res.json({ message: 'Grades saved successfully' });
  } catch (error) {
    await db.rollback();
    console.error('Error saving assignment grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save quiz grades
app.post('/save-quiz-grades', async (req, res) => {
  const { quizId, grades } = req.body;
  try {
    await db.beginTransaction();
    for (const grade of grades) {
      await db.execute(
        'INSERT INTO student_quizzes (student_id, quiz_id, obtained_marks, status) VALUES (?, ?, ?, "Completed") ON DUPLICATE KEY UPDATE obtained_marks = ?, status = "Completed"',
        [grade.studentId, quizId, grade.obtainedMarks, grade.obtainedMarks]
      );
    }
    await db.commit();
    res.json({ message: 'Grades saved successfully' });
  } catch (error) {
    await db.rollback();
    console.error('Error saving quiz grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save midterm grades
app.post('/save-midterm-grades', async (req, res) => {
  const { courseId, grades } = req.body;
  try {
    await db.beginTransaction();
    for (const grade of grades) {
      await db.execute(
        'INSERT INTO mid_term (student_id, course_id, obtained_marks, total_marks) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE obtained_marks = ?, total_marks = ?',
        [grade.studentId, courseId, grade.obtainedMarks, grade.totalMarks, grade.obtainedMarks, grade.totalMarks]
      );
    }
    await db.commit();
    res.json({ message: 'Grades saved successfully' });
  } catch (error) {
    await db.rollback();
    console.error('Error saving midterm grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save final term grades
app.post('/save-finalterm-grades', async (req, res) => {
  const { courseId, grades } = req.body;
  try {
    await db.beginTransaction();
    for (const grade of grades) {
      await db.execute(
        'INSERT INTO final_term (student_id, course_id, obtained_marks, total_marks) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE obtained_marks = ?, total_marks = ?',
        [grade.studentId, courseId, grade.obtainedMarks, grade.totalMarks, grade.obtainedMarks, grade.totalMarks]
      );
    }
    await db.commit();
    res.json({ message: 'Grades saved successfully' });
  } catch (error) {
    await db.rollback();
    console.error('Error saving final term grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/feedback-courses', (req, res) => {
  const { student_id } = req.body; // Expecting student_id in the JSON payload

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  // Query to fetch courses for the student
  const studentCoursesQuery = `
    SELECT 
      c.course_id,
      c.course_name
    FROM 
      courses c
    JOIN 
      student_courses sc ON c.course_id = sc.course_id
    WHERE 
      sc.student_id = ?;
  `;

  // Execute the query
  db.execute(studentCoursesQuery, [student_id], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Add error logging
      return res.status(500).json({ error: 'Error fetching courses' });
    }

    if (result.length > 0) {
      return res.json({ courses: result });
    } else {
      return res.status(404).json({ error: 'No courses found for this student' });
    }
  });
});

app.post('/submit-feedback', (req, res) => {
  const { student_id, course_id, feedback_rating, feedback_text } = req.body;

  // Calculate the average rating
  const avgRating = parseFloat(feedback_rating).toFixed(2);

  const query = `
    INSERT INTO feedback (student_id, course_id, feedback_rating, feedback_text)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [student_id, course_id, avgRating, feedback_text], (err, result) => {
    if (err) {
      console.error('Error saving feedback:', err);
      return res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }

    res.status(200).json({ message: 'Feedback submitted successfully!' });
  });
});
// Check if feedback already exists for a student and a course
app.post('/check-feedback', (req, res) => {
  const { student_id, course_id } = req.body; // Expecting student_id and course_id in the JSON payload

  if (!student_id || !course_id) {
    return res.status(400).json({ error: 'Student ID and Course ID are required' });
  }

  // Query to check if feedback exists for the student and course
  const checkFeedbackQuery = `
    SELECT 1 
    FROM feedback 
    WHERE student_id = ? AND course_id = ? 
    LIMIT 1;
  `;

  db.query(checkFeedbackQuery, [student_id, course_id], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Add error logging
      return res.status(500).json({ error: 'Error checking feedback status' });
    }

    if (result.length > 0) {
      // Feedback already exists
      return res.json({ hasSubmittedFeedback: true });
    } else {
      // No feedback found for the student and course
      return res.json({ hasSubmittedFeedback: false });
    }
  });
});

app.post('/assignments-grading', (req, res) => {
  const { course_id } = req.body;

  // Validate course_id
  if (!course_id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  // Query to fetch assignments for the given course_id
  const query = 'SELECT assignment_id, description, total_marks FROM assignments WHERE course_id = ?';

  // Execute the query using the existing db connection
  db.query(query, [course_id], (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);  // Send the query results as the response
  });
});

app.post('/assignment-students', (req, res) => {
  const { assignment_id } = req.body;

  // Validate assignment_id
  if (!assignment_id) {
    return res.status(400).json({ error: 'Assignment ID is required' });
  }

  // Query to fetch students and their marks for a given assignment
  const query = `
    SELECT s.student_id, s.name, sa.obtained_marks
    FROM students s
    LEFT JOIN student_assignment sa ON s.student_id = sa.student_id AND sa.assignment_id = ?
    WHERE s.student_id IN (
      SELECT student_id FROM student_assignment WHERE assignment_id = ?
    )
  `;

  // Execute the query using the existing db connection
  db.query(query, [assignment_id, assignment_id], (err, results) => {
    if (err) {
      console.error('Error fetching student assignments:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);  // Send the query results as the response
  });
});


app.post('/insert-assignment', (req, res) => {
  const { course_id, grades } = req.body;

  if (!course_id || !Array.isArray(grades)) {
    return res.status(400).send('Invalid input data');
  }

  const insertQueries = grades.map(grade => {
    const { student_id, assignment_id, marks_obtained } = grade;

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO student_assignment (student_id, assignment_id, obtained_marks, status)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE obtained_marks = VALUES(obtained_marks)
      `;
      db.query(query, [student_id, assignment_id, marks_obtained, 1], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });

  Promise.all(insertQueries)
    .then(() => {
      res.status(200).send('Grades saved successfully');
    })
    .catch((error) => {
      console.error('Error saving grades:', error);
      res.status(500).send('Failed to save grades');
    });
});






app.get('/students', (req, res) => {
  db.query('SELECT s.student_id, s.name, s.semester, p.program_name FROM students s, programs p where s.program_id = p.program_id', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching students: ' + err);
    }
    res.json(results);
  });
});

/* update student */

app.put('/students/:id', (req, res) => {
  const { name, email, grade, major } = req.body;
  const studentId = req.params.id;

  const updateQuery = `
    UPDATE students
    SET name = ?, email = ?, grade = ?, major = ?
    WHERE id = ?
  `;

  db.query(updateQuery, [name, email, grade, major, studentId], (err, result) => {
    if (err) {
      return res.status(500).send('Error updating student: ' + err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Student not found');
    }
    res.json({ message: 'Student updated successfully' });
  });
});

// Delete a student by ID
app.post('/students-del', (req, res) => {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  db.query('SELECT * FROM students WHERE student_id = ?', [student_id], (err, results) => {
    if (err) {
      console.error('Error fetching student:', err);
      return res.status(500).json({ message: 'Error fetching student', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = results[0];

    db.query('DELETE FROM students WHERE student_id = ?', [student_id], (deleteErr) => {
      if (deleteErr) {
        console.error('Error deleting student:', deleteErr);
        return res.status(500).json({ message: 'Error deleting student', error: deleteErr });
      }

      db.query(
        'INSERT INTO deleted_students (student_id, name, semester, program_id) VALUES (?, ?, ?, ?)',
        [student.id, student.name, student.semester, student.program_id],
        (insertErr) => {
          if (insertErr) {
            console.error('Error logging deleted student:', insertErr);
            return res.status(500).json({ message: 'Error logging deleted student', error: insertErr });
          }
          res.json({ message: 'Student deleted and logged successfully' });
        }
      );
    });
  });
});


app.get("/teachers", (req, res) => {
  const query = "SELECT name, faculty_id, email, contact FROM teachers";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching teachers:", err);
      return res.status(500).json({ error: "Failed to fetch teachers" });
    }

    res.json(results);
  });
});



// Fetch all students
app.get('/students', (req, res) => {
  const sqlQuery = 'SELECT * FROM students';
  db.query(sqlQuery, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

// Update student details
app.put('/students/:id', (req, res) => {
  const student_id = req.params.id;
  const { name, semester, program_name } = req.body;

  const sqlQuery = `
    UPDATE students 
    SET name = ?, semester = ?, program_name = ?
    WHERE student_id = ?`;

  db.query(sqlQuery, [name, semester, program_name, student_id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error updating student', error: err });
    } else {
      res.status(200).json({ message: 'Student updated successfully' });
    }
  });
});

// Delete student
app.post('/students-del', (req, res) => {
  const { student_id } = req.body;
  const sqlQuery = 'DELETE FROM students WHERE student_id = ?';

  db.query(sqlQuery, [student_id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json({ message: 'Student deleted successfully' });
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
