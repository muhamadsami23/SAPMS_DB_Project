-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2024 at 05:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sap`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `assignment_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `upload_date` date NOT NULL,
  `submission_date` date NOT NULL,
  `total_marks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`assignment_id`, `course_id`, `description`, `upload_date`, `submission_date`, `total_marks`) VALUES
(1, 1, 'Introduction to Programming Concepts', '2024-11-06', '2024-11-20', 50),
(2, 1, 'Basic Algorithms Assignment', '2024-11-07', '2024-11-21', 60),
(3, 2, 'Linear Equations Problem Set', '2024-11-08', '2024-11-22', 40),
(4, 2, 'Probability & Statistics Assignment', '2024-11-09', '2024-12-05', 50),
(5, 3, 'Implementing Linked Lists', '2024-11-10', '2024-11-24', 60),
(6, 3, 'Sorting and Searching Algorithms', '2024-11-11', '2024-11-25', 70),
(7, 4, 'Propositional Logic and Proofs', '2024-11-12', '2024-11-26', 50),
(8, 4, 'Set Theory Exercises', '2024-11-13', '2024-11-27', 60),
(9, 5, 'Database Normalization Techniques', '2024-11-14', '2024-11-28', 70),
(10, 5, 'SQL Query Practice', '2024-11-15', '2024-11-29', 60),
(11, 6, 'Process Scheduling Algorithms', '2024-11-16', '2024-11-30', 80),
(12, 6, 'Memory Management Assignment', '2024-11-17', '2024-12-01', 70),
(13, 7, 'Software Development Lifecycle', '2024-11-18', '2024-12-02', 90),
(14, 7, 'Agile Methodology Case Study', '2024-11-19', '2024-12-03', 80),
(15, 8, 'Network Protocols Analysis', '2024-11-20', '2024-12-04', 85),
(16, 8, 'TCP/IP Model Explanation', '2024-11-21', '2024-12-05', 75),
(17, 9, 'AI Fundamentals Quiz', '2024-11-22', '2024-12-06', 90),
(18, 9, 'Machine Learning Techniques', '2024-11-23', '2024-12-07', 100),
(19, 10, 'Cybersecurity Threat Analysis', '2024-11-24', '2024-12-08', 95),
(20, 10, 'Encryption Algorithms Practical', '2024-11-25', '2024-12-09', 85),
(21, 2, 'Assignment 2', '2024-11-22', '2024-11-25', 100);

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `faculty_id` int(11) DEFAULT NULL,
  `attendance_date` date DEFAULT NULL,
  `status` enum('Present','Absent','Late') NOT NULL,
  `attendance_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `student_id`, `course_id`, `section_id`, `faculty_id`, `attendance_date`, `status`, `attendance_time`) VALUES
(4, 1, 1, 1, 101, '2024-11-29', 'Present', '2024-11-29 04:22:14'),
(5, 3, 1, 1, 101, '2024-11-29', 'Absent', '2024-11-29 04:22:14'),
(6, 6, 1, 1, 101, '2024-11-29', 'Present', '2024-11-29 04:22:14'),
(7, 2, 3, 2, 101, '2024-11-29', 'Present', '2024-11-29 04:29:04'),
(8, 1, 1, 1, 101, '2024-11-29', 'Present', '2024-11-29 04:29:19'),
(9, 3, 1, 1, 101, '2024-11-29', 'Absent', '2024-11-29 04:29:19'),
(10, 6, 1, 1, 101, '2024-11-29', 'Absent', '2024-11-29 04:29:19'),
(11, 1, 1, 1, 101, '2024-12-01', 'Absent', '2024-12-01 13:56:20'),
(12, 3, 1, 1, 101, '2024-12-01', 'Absent', '2024-12-01 13:56:20'),
(13, 6, 1, 1, 101, '2024-12-01', 'Present', '2024-12-01 13:56:20'),
(14, 1, 1, 1, 101, '2024-12-03', 'Present', '2024-12-03 05:22:13'),
(15, 3, 1, 1, 101, '2024-12-03', 'Absent', '2024-12-03 05:17:02'),
(16, 6, 1, 1, 101, '2024-12-03', 'Present', '2024-12-03 05:17:02');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `description` text NOT NULL,
  `credit` int(11) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `Program_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `semester`, `description`, `credit`, `course_name`, `faculty_id`, `Program_Id`) VALUES
(1, 1, 'Introduction to Computer Science', 3, 'CS101', 101, 1),
(2, 1, 'Basic Mathematics', 3, 'MATH101', 102, 1),
(3, 2, 'Data Structures and Algorithms', 4, 'CS102', 103, 1),
(4, 2, 'Discrete Mathematics', 3, 'MATH201', 104, 1),
(5, 3, 'Database Systems', 4, 'CS201', 105, 1),
(6, 3, 'Operating Systems', 3, 'CS202', 106, 1),
(7, 4, 'Software Engineering', 4, 'CS301', 107, 1),
(8, 4, 'Computer Networks', 3, 'CS302', 108, 1),
(9, 5, 'Artificial Intelligence', 4, 'CS401', 109, 2),
(10, 5, 'Cybersecurity', 3, 'CS402', 110, 3),
(11, 1, 'Applied Physics', 3, 'NS101', 102, 1);

-- --------------------------------------------------------

--
-- Table structure for table `deleted_students`
--

CREATE TABLE `deleted_students` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `program_id` int(11) NOT NULL,
  `deleted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `feedback_rating` int(11) NOT NULL CHECK (`feedback_rating` between 1 and 5),
  `feedback_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `student_id`, `course_id`, `feedback_rating`, `feedback_text`, `created_at`, `updated_at`) VALUES
(2, 1, 2, 2, 'bad teacher. manhoos', '2024-12-03 11:11:31', '2024-12-03 11:11:31'),
(3, 1, 1, 1, '', '2024-12-03 11:11:56', '2024-12-03 11:11:56');

-- --------------------------------------------------------

--
-- Table structure for table `final_term`
--

CREATE TABLE `final_term` (
  `final_term_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `total_marks` int(11) NOT NULL,
  `obtained_marks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mid_term`
--

CREATE TABLE `mid_term` (
  `mid_term_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `obtained_marks` int(11) NOT NULL,
  `total_marks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `program_id` int(11) NOT NULL,
  `program_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`program_id`, `program_name`) VALUES
(1, 'Computer Science'),
(2, 'Artificial Intelligence'),
(3, 'Cybersecurity'),
(4, 'Electrical Engineering');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes_tasks`
--

CREATE TABLE `quizzes_tasks` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `upload_date` date NOT NULL,
  `total_marks` int(11) NOT NULL,
  `obtained_marks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes_tasks`
--

INSERT INTO `quizzes_tasks` (`id`, `student_id`, `quiz_id`, `course_id`, `description`, `upload_date`, `total_marks`, `obtained_marks`) VALUES
(1, 1, 2, 1, 'quiz 1', '2024-11-15', 10, 8);

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `section_id` int(11) NOT NULL,
  `section_name` varchar(50) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `faculty_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`section_id`, `section_name`, `course_id`, `faculty_id`) VALUES
(1, 'A', 1, 0),
(2, 'B', 3, 101),
(3, 'C', 1, 0),
(4, 'A', 2, 101),
(5, 'B', 2, 0),
(6, 'A', 3, 101),
(7, 'B', 3, 0),
(8, 'A', 4, 0),
(9, 'B', 4, 0),
(10, 'C', 4, 0),
(11, 'A', 5, 0),
(12, 'B', 5, 0),
(13, 'A', 6, 0),
(14, 'B', 6, 0),
(15, 'C', 6, 0),
(16, 'D', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `enrollment_date` date NOT NULL,
  `address` text NOT NULL,
  `dob` date NOT NULL,
  `Semester` int(11) NOT NULL,
  `section_id` int(11) DEFAULT NULL,
  `program_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `name`, `contact`, `gender`, `enrollment_date`, `address`, `dob`, `Semester`, `section_id`, `program_id`) VALUES
(1, 'Ali Ahmed', '03123456789', 'Male', '2023-01-15', '123 Street, Karachi', '2001-05-20', 1, 1, 1),
(2, 'Sara Khan', '03321234567', 'Female', '2023-01-16', '456 Avenue, Lahore', '2000-07-12', 2, 2, 1),
(3, 'Ahmed Raza', '03451239876', 'Male', '2023-01-17', '789 Road, Islamabad', '1999-09-25', 1, 1, 1),
(4, 'Fatima Noor', '03219876543', 'Female', '2023-01-18', '654 Lane, Karachi', '2002-03-14', 3, 6, 2),
(5, 'Hassan Ali', '03004567890', 'Male', '2023-01-19', '321 Block, Quetta', '1998-12-11', 2, 3, 3),
(6, 'Zara Siddiqui', '03129876543', 'Female', '2023-01-20', '987 Circle, Faisalabad', '2001-11-05', 1, 1, 1),
(7, 'Usman Malik', '03456789012', 'Male', '2023-01-21', '111 Square, Multan', '1999-06-22', 3, 2, 2),
(8, 'Ayesha Tariq', '03211234567', 'Female', '2023-01-22', '222 Park, Karachi', '2000-01-15', 2, 4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `student_assignment`
--

CREATE TABLE `student_assignment` (
  `student_id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `obtained_marks` int(11) NOT NULL,
  `Status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_assignment`
--

INSERT INTO `student_assignment` (`student_id`, `assignment_id`, `obtained_marks`, `Status`) VALUES
(1, 1, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `student_courses`
--

CREATE TABLE `student_courses` (
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_courses`
--

INSERT INTO `student_courses` (`student_id`, `course_id`) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 1),
(3, 2),
(4, 5),
(4, 6),
(5, 3),
(5, 4),
(6, 1),
(6, 2),
(7, 5),
(7, 6),
(8, 3),
(8, 4);

-- --------------------------------------------------------

--
-- Table structure for table `student_quizzes`
--

CREATE TABLE `student_quizzes` (
  `student_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `obtained_marks` float NOT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `faculty_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`faculty_id`, `name`, `email`, `contact`) VALUES
(101, 'Dr. Ali Ahmed', 'ali.ahmed@university.edu', '03123456789'),
(102, 'Prof. Ayesha Khan', 'ayesha.khan@university.edu', '03234567890'),
(103, 'Dr. Imran Malik', 'imran.malik@university.edu', '03345678901'),
(104, 'Prof. Maryam Noor', 'maryam.noor@university.edu', '03456789012'),
(105, 'Dr. John Michael', 'john.michael@university.edu', '03567890123'),
(106, 'Prof. Bilal Rashid', 'bilal.rashid@university.edu', '03678901234'),
(107, 'Dr. Sarah Khan', 'sarah.khan@university.edu', '03789012345'),
(108, 'Prof. James Peter', 'james.peter@university.edu', '03890123456'),
(109, 'Dr. Zainab Shams', 'zainab.shams@university.edu', '03901234567'),
(110, 'Prof. Peter D’Souza', 'peter.dsouza@university.edu', '04012345678'),
(111, 'Taha Farooqui', 'tahafarooqui@gmail.com', '03002134567');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_courses`
--

CREATE TABLE `teacher_courses` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher_courses`
--

INSERT INTO `teacher_courses` (`id`, `teacher_id`, `course_id`) VALUES
(1, 101, 1),
(2, 102, 2),
(3, 103, 3),
(4, 104, 4),
(5, 105, 5),
(6, 106, 6),
(7, 107, 7),
(8, 108, 8),
(9, 109, 9),
(10, 110, 10),
(11, 102, 11),
(12, 101, 2),
(13, 101, 3),
(14, 101, 6);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_schedule`
--

CREATE TABLE `teacher_schedule` (
  `schedule_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `day` varchar(20) NOT NULL,
  `time_slot` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher_schedule`
--

INSERT INTO `teacher_schedule` (`schedule_id`, `teacher_id`, `section_id`, `course_id`, `day`, `time_slot`, `created_at`) VALUES
(0, 101, 1, 1, 'Monday', '08:00:00', '2024-12-03 15:27:24'),
(0, 101, 1, 1, 'Tuesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 101, 1, 1, 'Wednesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 101, 1, 1, 'Thursday', '08:00:00', '2024-12-03 15:27:24'),
(0, 101, 1, 1, 'Friday', '08:00:00', '2024-12-03 15:27:24'),
(0, 102, 1, 2, 'Monday', '08:00:00', '2024-12-03 15:27:24'),
(0, 102, 1, 2, 'Tuesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 102, 1, 2, 'Wednesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 102, 1, 2, 'Thursday', '08:00:00', '2024-12-03 15:27:24'),
(0, 102, 1, 2, 'Friday', '08:00:00', '2024-12-03 15:27:24'),
(0, 103, 1, 3, 'Monday', '08:00:00', '2024-12-03 15:27:24'),
(0, 103, 1, 3, 'Tuesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 103, 1, 3, 'Wednesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 103, 1, 3, 'Thursday', '08:00:00', '2024-12-03 15:27:24'),
(0, 103, 1, 3, 'Friday', '08:00:00', '2024-12-03 15:27:24'),
(0, 104, 1, 4, 'Monday', '08:00:00', '2024-12-03 15:27:24'),
(0, 104, 1, 4, 'Tuesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 104, 1, 4, 'Wednesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 104, 1, 4, 'Thursday', '08:00:00', '2024-12-03 15:27:24'),
(0, 104, 1, 4, 'Friday', '08:00:00', '2024-12-03 15:27:24'),
(0, 105, 1, 5, 'Monday', '08:00:00', '2024-12-03 15:27:24'),
(0, 106, 1, 6, 'Tuesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 107, 1, 7, 'Wednesday', '08:00:00', '2024-12-03 15:27:24'),
(0, 108, 1, 8, 'Thursday', '08:00:00', '2024-12-03 15:27:24'),
(0, 109, 1, 9, 'Friday', '08:00:00', '2024-12-03 15:27:24'),
(0, 101, 2, 1, 'Monday', '09:00:00', '2024-12-03 15:27:24'),
(0, 101, 2, 1, 'Tuesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 101, 2, 1, 'Wednesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 101, 2, 1, 'Thursday', '09:00:00', '2024-12-03 15:27:25'),
(0, 101, 2, 1, 'Friday', '09:00:00', '2024-12-03 15:27:25'),
(0, 102, 2, 2, 'Monday', '09:00:00', '2024-12-03 15:27:25'),
(0, 102, 2, 2, 'Tuesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 102, 2, 2, 'Wednesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 102, 2, 2, 'Thursday', '09:00:00', '2024-12-03 15:27:25'),
(0, 102, 2, 2, 'Friday', '09:00:00', '2024-12-03 15:27:25'),
(0, 103, 2, 3, 'Monday', '09:00:00', '2024-12-03 15:27:25'),
(0, 103, 2, 3, 'Tuesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 103, 2, 3, 'Wednesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 103, 2, 3, 'Thursday', '09:00:00', '2024-12-03 15:27:25'),
(0, 103, 2, 3, 'Friday', '09:00:00', '2024-12-03 15:27:25'),
(0, 104, 2, 4, 'Monday', '09:00:00', '2024-12-03 15:27:25'),
(0, 104, 2, 4, 'Tuesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 104, 2, 4, 'Wednesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 104, 2, 4, 'Thursday', '09:00:00', '2024-12-03 15:27:25'),
(0, 104, 2, 4, 'Friday', '09:00:00', '2024-12-03 15:27:25'),
(0, 105, 2, 5, 'Monday', '09:00:00', '2024-12-03 15:27:25'),
(0, 106, 2, 6, 'Tuesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 107, 2, 7, 'Wednesday', '09:00:00', '2024-12-03 15:27:25'),
(0, 108, 2, 8, 'Thursday', '09:00:00', '2024-12-03 15:27:25'),
(0, 109, 2, 9, 'Friday', '09:00:00', '2024-12-03 15:27:25'),
(0, 101, 3, 1, 'Monday', '10:00:00', '2024-12-03 15:27:25'),
(0, 101, 3, 1, 'Tuesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 101, 3, 1, 'Wednesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 101, 3, 1, 'Thursday', '10:00:00', '2024-12-03 15:27:25'),
(0, 101, 3, 1, 'Friday', '10:00:00', '2024-12-03 15:27:25'),
(0, 102, 3, 2, 'Monday', '10:00:00', '2024-12-03 15:27:25'),
(0, 102, 3, 2, 'Tuesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 102, 3, 2, 'Wednesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 102, 3, 2, 'Thursday', '10:00:00', '2024-12-03 15:27:25'),
(0, 102, 3, 2, 'Friday', '10:00:00', '2024-12-03 15:27:25'),
(0, 103, 3, 3, 'Monday', '10:00:00', '2024-12-03 15:27:25'),
(0, 103, 3, 3, 'Tuesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 103, 3, 3, 'Wednesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 103, 3, 3, 'Thursday', '10:00:00', '2024-12-03 15:27:25'),
(0, 103, 3, 3, 'Friday', '10:00:00', '2024-12-03 15:27:25'),
(0, 104, 3, 4, 'Monday', '10:00:00', '2024-12-03 15:27:25'),
(0, 104, 3, 4, 'Tuesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 104, 3, 4, 'Wednesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 104, 3, 4, 'Thursday', '10:00:00', '2024-12-03 15:27:25'),
(0, 104, 3, 4, 'Friday', '10:00:00', '2024-12-03 15:27:25'),
(0, 105, 3, 5, 'Monday', '10:00:00', '2024-12-03 15:27:25'),
(0, 106, 3, 6, 'Tuesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 107, 3, 7, 'Wednesday', '10:00:00', '2024-12-03 15:27:25'),
(0, 108, 3, 8, 'Thursday', '10:00:00', '2024-12-03 15:27:25'),
(0, 109, 3, 9, 'Friday', '10:00:00', '2024-12-03 15:27:25'),
(0, 101, 4, 1, 'Monday', '11:00:00', '2024-12-03 15:27:25'),
(0, 101, 4, 1, 'Tuesday', '11:00:00', '2024-12-03 15:27:25'),
(0, 101, 4, 1, 'Wednesday', '11:00:00', '2024-12-03 15:27:25'),
(0, 101, 4, 1, 'Thursday', '11:00:00', '2024-12-03 15:27:25'),
(0, 101, 4, 1, 'Friday', '11:00:00', '2024-12-03 15:27:25'),
(0, 102, 4, 2, 'Monday', '11:00:00', '2024-12-03 15:27:25'),
(0, 102, 4, 2, 'Tuesday', '11:00:00', '2024-12-03 15:27:25'),
(0, 102, 4, 2, 'Wednesday', '11:00:00', '2024-12-03 15:27:25'),
(0, 102, 4, 2, 'Thursday', '11:00:00', '2024-12-03 15:27:25'),
(0, 102, 4, 2, 'Friday', '11:00:00', '2024-12-03 15:27:25'),
(0, 103, 4, 3, 'Monday', '11:00:00', '2024-12-03 15:27:25'),
(0, 103, 4, 3, 'Tuesday', '11:00:00', '2024-12-03 15:27:25'),
(0, 103, 4, 3, 'Wednesday', '11:00:00', '2024-12-03 15:27:25'),
(0, 103, 4, 3, 'Thursday', '11:00:00', '2024-12-03 15:27:26'),
(0, 103, 4, 3, 'Friday', '11:00:00', '2024-12-03 15:27:26'),
(0, 104, 4, 4, 'Monday', '11:00:00', '2024-12-03 15:27:26'),
(0, 104, 4, 4, 'Tuesday', '11:00:00', '2024-12-03 15:27:26'),
(0, 104, 4, 4, 'Wednesday', '11:00:00', '2024-12-03 15:27:26'),
(0, 104, 4, 4, 'Thursday', '11:00:00', '2024-12-03 15:27:26'),
(0, 104, 4, 4, 'Friday', '11:00:00', '2024-12-03 15:27:26'),
(0, 105, 4, 5, 'Monday', '11:00:00', '2024-12-03 15:27:26'),
(0, 106, 4, 6, 'Tuesday', '11:00:00', '2024-12-03 15:27:26'),
(0, 107, 4, 7, 'Wednesday', '11:00:00', '2024-12-03 15:27:26'),
(0, 108, 4, 8, 'Thursday', '11:00:00', '2024-12-03 15:27:26'),
(0, 109, 4, 9, 'Friday', '11:00:00', '2024-12-03 15:27:26'),
(0, 101, 5, 1, 'Monday', '12:00:00', '2024-12-03 15:27:26'),
(0, 101, 5, 1, 'Tuesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 101, 5, 1, 'Wednesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 101, 5, 1, 'Thursday', '12:00:00', '2024-12-03 15:27:26'),
(0, 101, 5, 1, 'Friday', '12:00:00', '2024-12-03 15:27:26'),
(0, 102, 5, 2, 'Monday', '12:00:00', '2024-12-03 15:27:26'),
(0, 102, 5, 2, 'Tuesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 102, 5, 2, 'Wednesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 102, 5, 2, 'Thursday', '12:00:00', '2024-12-03 15:27:26'),
(0, 102, 5, 2, 'Friday', '12:00:00', '2024-12-03 15:27:26'),
(0, 103, 5, 3, 'Monday', '12:00:00', '2024-12-03 15:27:26'),
(0, 103, 5, 3, 'Tuesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 103, 5, 3, 'Wednesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 103, 5, 3, 'Thursday', '12:00:00', '2024-12-03 15:27:26'),
(0, 103, 5, 3, 'Friday', '12:00:00', '2024-12-03 15:27:26'),
(0, 104, 5, 4, 'Monday', '12:00:00', '2024-12-03 15:27:26'),
(0, 104, 5, 4, 'Tuesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 104, 5, 4, 'Wednesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 104, 5, 4, 'Thursday', '12:00:00', '2024-12-03 15:27:26'),
(0, 104, 5, 4, 'Friday', '12:00:00', '2024-12-03 15:27:26'),
(0, 105, 5, 5, 'Monday', '12:00:00', '2024-12-03 15:27:26'),
(0, 106, 5, 6, 'Tuesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 107, 5, 7, 'Wednesday', '12:00:00', '2024-12-03 15:27:26'),
(0, 108, 5, 8, 'Thursday', '12:00:00', '2024-12-03 15:27:26'),
(0, 109, 5, 9, 'Friday', '12:00:00', '2024-12-03 15:27:26'),
(0, 105, 6, 5, 'Tuesday', '08:00:00', '2024-12-03 15:27:26'),
(0, 105, 6, 5, 'Wednesday', '08:00:00', '2024-12-03 15:27:26'),
(0, 105, 6, 5, 'Thursday', '08:00:00', '2024-12-03 15:27:26'),
(0, 105, 6, 5, 'Friday', '08:00:00', '2024-12-03 15:27:26'),
(0, 106, 6, 6, 'Monday', '08:00:00', '2024-12-03 15:27:26'),
(0, 106, 6, 6, 'Wednesday', '08:00:00', '2024-12-03 15:27:26'),
(0, 106, 6, 6, 'Thursday', '08:00:00', '2024-12-03 15:27:26'),
(0, 106, 6, 6, 'Friday', '08:00:00', '2024-12-03 15:27:26'),
(0, 107, 6, 7, 'Monday', '08:00:00', '2024-12-03 15:27:26'),
(0, 107, 6, 7, 'Tuesday', '08:00:00', '2024-12-03 15:27:26'),
(0, 107, 6, 7, 'Thursday', '08:00:00', '2024-12-03 15:27:26'),
(0, 107, 6, 7, 'Friday', '08:00:00', '2024-12-03 15:27:26'),
(0, 108, 6, 8, 'Monday', '08:00:00', '2024-12-03 15:27:26'),
(0, 108, 6, 8, 'Tuesday', '08:00:00', '2024-12-03 15:27:26'),
(0, 108, 6, 8, 'Wednesday', '08:00:00', '2024-12-03 15:27:26'),
(0, 108, 6, 8, 'Friday', '08:00:00', '2024-12-03 15:27:26'),
(0, 109, 6, 9, 'Monday', '08:00:00', '2024-12-03 15:27:26'),
(0, 109, 6, 9, 'Tuesday', '08:00:00', '2024-12-03 15:27:26'),
(0, 109, 6, 9, 'Wednesday', '08:00:00', '2024-12-03 15:27:26'),
(0, 109, 6, 9, 'Thursday', '08:00:00', '2024-12-03 15:27:26'),
(0, 110, 6, 10, 'Monday', '08:00:00', '2024-12-03 15:27:26'),
(0, 105, 7, 5, 'Tuesday', '09:00:00', '2024-12-03 15:27:26'),
(0, 105, 7, 5, 'Wednesday', '09:00:00', '2024-12-03 15:27:26'),
(0, 105, 7, 5, 'Thursday', '09:00:00', '2024-12-03 15:27:26'),
(0, 105, 7, 5, 'Friday', '09:00:00', '2024-12-03 15:27:26'),
(0, 106, 7, 6, 'Monday', '09:00:00', '2024-12-03 15:27:26'),
(0, 106, 7, 6, 'Wednesday', '09:00:00', '2024-12-03 15:27:26'),
(0, 106, 7, 6, 'Thursday', '09:00:00', '2024-12-03 15:27:26'),
(0, 106, 7, 6, 'Friday', '09:00:00', '2024-12-03 15:27:26'),
(0, 107, 7, 7, 'Monday', '09:00:00', '2024-12-03 15:27:26'),
(0, 107, 7, 7, 'Tuesday', '09:00:00', '2024-12-03 15:27:26'),
(0, 107, 7, 7, 'Thursday', '09:00:00', '2024-12-03 15:27:26'),
(0, 107, 7, 7, 'Friday', '09:00:00', '2024-12-03 15:27:26'),
(0, 108, 7, 8, 'Monday', '09:00:00', '2024-12-03 15:27:27'),
(0, 108, 7, 8, 'Tuesday', '09:00:00', '2024-12-03 15:27:27'),
(0, 108, 7, 8, 'Wednesday', '09:00:00', '2024-12-03 15:27:27'),
(0, 108, 7, 8, 'Friday', '09:00:00', '2024-12-03 15:27:27'),
(0, 109, 7, 9, 'Monday', '09:00:00', '2024-12-03 15:27:27'),
(0, 109, 7, 9, 'Tuesday', '09:00:00', '2024-12-03 15:27:27'),
(0, 109, 7, 9, 'Wednesday', '09:00:00', '2024-12-03 15:27:27'),
(0, 109, 7, 9, 'Thursday', '09:00:00', '2024-12-03 15:27:27'),
(0, 110, 7, 10, 'Monday', '09:00:00', '2024-12-03 15:27:27'),
(0, 105, 8, 5, 'Tuesday', '10:00:00', '2024-12-03 15:27:27'),
(0, 105, 8, 5, 'Wednesday', '10:00:00', '2024-12-03 15:27:27'),
(0, 105, 8, 5, 'Thursday', '10:00:00', '2024-12-03 15:27:27'),
(0, 105, 8, 5, 'Friday', '10:00:00', '2024-12-03 15:27:27'),
(0, 106, 8, 6, 'Monday', '10:00:00', '2024-12-03 15:27:27'),
(0, 106, 8, 6, 'Wednesday', '10:00:00', '2024-12-03 15:27:27'),
(0, 106, 8, 6, 'Thursday', '10:00:00', '2024-12-03 15:27:27'),
(0, 106, 8, 6, 'Friday', '10:00:00', '2024-12-03 15:27:27'),
(0, 107, 8, 7, 'Monday', '10:00:00', '2024-12-03 15:27:27'),
(0, 107, 8, 7, 'Tuesday', '10:00:00', '2024-12-03 15:27:27'),
(0, 107, 8, 7, 'Thursday', '10:00:00', '2024-12-03 15:27:27'),
(0, 107, 8, 7, 'Friday', '10:00:00', '2024-12-03 15:27:27'),
(0, 108, 8, 8, 'Monday', '10:00:00', '2024-12-03 15:27:27'),
(0, 108, 8, 8, 'Tuesday', '10:00:00', '2024-12-03 15:27:27'),
(0, 108, 8, 8, 'Wednesday', '10:00:00', '2024-12-03 15:27:27'),
(0, 108, 8, 8, 'Friday', '10:00:00', '2024-12-03 15:27:27'),
(0, 109, 8, 9, 'Monday', '10:00:00', '2024-12-03 15:27:27'),
(0, 109, 8, 9, 'Tuesday', '10:00:00', '2024-12-03 15:27:27'),
(0, 109, 8, 9, 'Wednesday', '10:00:00', '2024-12-03 15:27:27'),
(0, 109, 8, 9, 'Thursday', '10:00:00', '2024-12-03 15:27:27'),
(0, 110, 8, 10, 'Monday', '10:00:00', '2024-12-03 15:27:27'),
(0, 105, 9, 5, 'Tuesday', '11:00:00', '2024-12-03 15:27:27'),
(0, 105, 9, 5, 'Wednesday', '11:00:00', '2024-12-03 15:27:27'),
(0, 105, 9, 5, 'Thursday', '11:00:00', '2024-12-03 15:27:27'),
(0, 105, 9, 5, 'Friday', '11:00:00', '2024-12-03 15:27:27'),
(0, 106, 9, 6, 'Monday', '11:00:00', '2024-12-03 15:27:27'),
(0, 106, 9, 6, 'Wednesday', '11:00:00', '2024-12-03 15:27:27'),
(0, 106, 9, 6, 'Thursday', '11:00:00', '2024-12-03 15:27:27'),
(0, 106, 9, 6, 'Friday', '11:00:00', '2024-12-03 15:27:27'),
(0, 107, 9, 7, 'Monday', '11:00:00', '2024-12-03 15:27:27'),
(0, 107, 9, 7, 'Tuesday', '11:00:00', '2024-12-03 15:27:27'),
(0, 107, 9, 7, 'Thursday', '11:00:00', '2024-12-03 15:27:27'),
(0, 107, 9, 7, 'Friday', '11:00:00', '2024-12-03 15:27:27'),
(0, 108, 9, 8, 'Monday', '11:00:00', '2024-12-03 15:27:27'),
(0, 108, 9, 8, 'Tuesday', '11:00:00', '2024-12-03 15:27:27'),
(0, 108, 9, 8, 'Wednesday', '11:00:00', '2024-12-03 15:27:27'),
(0, 108, 9, 8, 'Friday', '11:00:00', '2024-12-03 15:27:27'),
(0, 109, 9, 9, 'Monday', '11:00:00', '2024-12-03 15:27:27'),
(0, 109, 9, 9, 'Tuesday', '11:00:00', '2024-12-03 15:27:27'),
(0, 109, 9, 9, 'Wednesday', '11:00:00', '2024-12-03 15:27:27'),
(0, 109, 9, 9, 'Thursday', '11:00:00', '2024-12-03 15:27:27'),
(0, 110, 9, 10, 'Monday', '11:00:00', '2024-12-03 15:27:27'),
(0, 105, 10, 5, 'Tuesday', '12:00:00', '2024-12-03 15:27:27'),
(0, 105, 10, 5, 'Wednesday', '12:00:00', '2024-12-03 15:27:27'),
(0, 105, 10, 5, 'Thursday', '12:00:00', '2024-12-03 15:27:27'),
(0, 105, 10, 5, 'Friday', '12:00:00', '2024-12-03 15:27:27'),
(0, 106, 10, 6, 'Monday', '12:00:00', '2024-12-03 15:27:27'),
(0, 106, 10, 6, 'Wednesday', '12:00:00', '2024-12-03 15:27:27'),
(0, 106, 10, 6, 'Thursday', '12:00:00', '2024-12-03 15:27:27'),
(0, 106, 10, 6, 'Friday', '12:00:00', '2024-12-03 15:27:27'),
(0, 107, 10, 7, 'Monday', '12:00:00', '2024-12-03 15:27:27'),
(0, 107, 10, 7, 'Tuesday', '12:00:00', '2024-12-03 15:27:27'),
(0, 107, 10, 7, 'Thursday', '12:00:00', '2024-12-03 15:27:27'),
(0, 107, 10, 7, 'Friday', '12:00:00', '2024-12-03 15:27:27'),
(0, 108, 10, 8, 'Monday', '12:00:00', '2024-12-03 15:27:27'),
(0, 108, 10, 8, 'Tuesday', '12:00:00', '2024-12-03 15:27:27'),
(0, 108, 10, 8, 'Wednesday', '12:00:00', '2024-12-03 15:27:27'),
(0, 108, 10, 8, 'Friday', '12:00:00', '2024-12-03 15:27:27'),
(0, 109, 10, 9, 'Monday', '12:00:00', '2024-12-03 15:27:27'),
(0, 109, 10, 9, 'Tuesday', '12:00:00', '2024-12-03 15:27:27'),
(0, 109, 10, 9, 'Wednesday', '12:00:00', '2024-12-03 15:27:27'),
(0, 109, 10, 9, 'Thursday', '12:00:00', '2024-12-03 15:27:28'),
(0, 110, 10, 10, 'Monday', '12:00:00', '2024-12-03 15:27:28'),
(0, 110, 11, 10, 'Tuesday', '08:00:00', '2024-12-03 15:27:28'),
(0, 110, 11, 10, 'Wednesday', '08:00:00', '2024-12-03 15:27:28'),
(0, 110, 11, 10, 'Thursday', '08:00:00', '2024-12-03 15:27:28'),
(0, 110, 11, 10, 'Friday', '08:00:00', '2024-12-03 15:27:28'),
(0, 110, 12, 10, 'Tuesday', '09:00:00', '2024-12-03 15:27:28'),
(0, 110, 12, 10, 'Wednesday', '09:00:00', '2024-12-03 15:27:28'),
(0, 110, 12, 10, 'Thursday', '09:00:00', '2024-12-03 15:27:28'),
(0, 110, 12, 10, 'Friday', '09:00:00', '2024-12-03 15:27:28'),
(0, 110, 13, 10, 'Tuesday', '10:00:00', '2024-12-03 15:27:28'),
(0, 110, 13, 10, 'Wednesday', '10:00:00', '2024-12-03 15:27:28'),
(0, 110, 13, 10, 'Thursday', '10:00:00', '2024-12-03 15:27:28'),
(0, 110, 13, 10, 'Friday', '10:00:00', '2024-12-03 15:27:28'),
(0, 110, 14, 10, 'Tuesday', '11:00:00', '2024-12-03 15:27:28'),
(0, 110, 14, 10, 'Wednesday', '11:00:00', '2024-12-03 15:27:28'),
(0, 110, 14, 10, 'Thursday', '11:00:00', '2024-12-03 15:27:28'),
(0, 110, 14, 10, 'Friday', '11:00:00', '2024-12-03 15:27:28'),
(0, 110, 15, 10, 'Tuesday', '12:00:00', '2024-12-03 15:27:28'),
(0, 110, 15, 10, 'Wednesday', '12:00:00', '2024-12-03 15:27:28'),
(0, 110, 15, 10, 'Thursday', '12:00:00', '2024-12-03 15:27:28'),
(0, 110, 15, 10, 'Friday', '12:00:00', '2024-12-03 15:27:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `student_id`) VALUES
(1, 'ali_1', 'Ali123400*', 'student', 1),
(4, 'sara_2', 'sara123400*', 'student', 2),
(111, 'taha', 'Taha1234*', 'teacher', 101),
(113, 'ahzam', 'abcd1234*', 'admin', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `faculty_id` (`faculty_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `deleted_students`
--
ALTER TABLE `deleted_students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `final_term`
--
ALTER TABLE `final_term`
  ADD PRIMARY KEY (`final_term_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `mid_term`
--
ALTER TABLE `mid_term`
  ADD PRIMARY KEY (`mid_term_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `quizzes_tasks`
--
ALTER TABLE `quizzes_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`section_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `student_assignment`
--
ALTER TABLE `student_assignment`
  ADD PRIMARY KEY (`student_id`,`assignment_id`),
  ADD KEY `assignment_id` (`assignment_id`);

--
-- Indexes for table `student_courses`
--
ALTER TABLE `student_courses`
  ADD PRIMARY KEY (`student_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `student_quizzes`
--
ALTER TABLE `student_quizzes`
  ADD PRIMARY KEY (`student_id`,`quiz_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`faculty_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `teacher_courses`
--
ALTER TABLE `teacher_courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `deleted_students`
--
ALTER TABLE `deleted_students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `final_term`
--
ALTER TABLE `final_term`
  MODIFY `final_term_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mid_term`
--
ALTER TABLE `mid_term`
  MODIFY `mid_term_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quizzes_tasks`
--
ALTER TABLE `quizzes_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `faculty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `teacher_courses`
--
ALTER TABLE `teacher_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`),
  ADD CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`),
  ADD CONSTRAINT `attendance_ibfk_4` FOREIGN KEY (`faculty_id`) REFERENCES `teachers` (`faculty_id`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `final_term`
--
ALTER TABLE `final_term`
  ADD CONSTRAINT `final_term_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `final_term_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `mid_term`
--
ALTER TABLE `mid_term`
  ADD CONSTRAINT `mid_term_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `mid_term_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `quizzes_tasks`
--
ALTER TABLE `quizzes_tasks`
  ADD CONSTRAINT `quizzes_tasks_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `quizzes_tasks_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`);

--
-- Constraints for table `student_assignment`
--
ALTER TABLE `student_assignment`
  ADD CONSTRAINT `student_assignment_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `student_assignment_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`);

--
-- Constraints for table `student_courses`
--
ALTER TABLE `student_courses`
  ADD CONSTRAINT `student_courses_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teacher_courses`
--
ALTER TABLE `teacher_courses`
  ADD CONSTRAINT `teacher_courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`faculty_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
