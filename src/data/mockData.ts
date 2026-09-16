import { Student, AttendanceRecord, Announcement, Complaint, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Dr. Arthur Vance',
    email: 'admin@smartcampus.edu',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Aarav Sharma',
    email: 'aarav.cse@smartcampus.edu',
    role: 'student',
    student_id: 'STU2022001',
  },
  {
    id: 3,
    name: 'Priya Patel',
    email: 'priya.ece@smartcampus.edu',
    role: 'student',
    student_id: 'STU2022002',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 'STU2022001',
    name: 'Aarav Sharma',
    email: 'aarav.cse@smartcampus.edu',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    phone: '+91 98765 43210',
    cgpa: 8.85,
    section: 'A',
    guardian_name: 'Rajesh Sharma',
    guardian_phone: '+91 98765 43219',
    blood_group: 'B+',
    address: 'Block 4, Sunrise Apartments, Tech City',
    created_at: '2022-08-15',
  },
  {
    student_id: 'STU2022002',
    name: 'Priya Patel',
    email: 'priya.ece@smartcampus.edu',
    department: 'Electronics & Communication',
    year: '3rd Year',
    phone: '+91 98234 56789',
    cgpa: 9.12,
    section: 'B',
    guardian_name: 'Dinesh Patel',
    guardian_phone: '+91 98234 56780',
    blood_group: 'O+',
    address: 'Flat 102, Green Meadows, South Extension',
    created_at: '2022-08-16',
  },
  {
    student_id: 'STU2023015',
    name: 'Rohan Deshmukh',
    email: 'rohan.mech@smartcampus.edu',
    department: 'Mechanical Engineering',
    year: '2nd Year',
    phone: '+91 97654 32109',
    cgpa: 7.94,
    section: 'A',
    guardian_name: 'Suresh Deshmukh',
    guardian_phone: '+91 97654 32100',
    blood_group: 'A+',
    address: '14/B, Royal Palms, Campus Road',
    created_at: '2023-08-10',
  },
  {
    student_id: 'STU2023028',
    name: 'Ananya Iyer',
    email: 'ananya.it@smartcampus.edu',
    department: 'Information Technology',
    year: '2nd Year',
    phone: '+91 96543 21098',
    cgpa: 8.70,
    section: 'A',
    guardian_name: 'Venkatesh Iyer',
    guardian_phone: '+91 96543 21090',
    blood_group: 'AB+',
    address: 'Plot 45, Golden Colony, Metro Phase 1',
    created_at: '2023-08-12',
  },
  {
    student_id: 'STU2021009',
    name: 'Vikram Singh',
    email: 'vikram.civil@smartcampus.edu',
    department: 'Civil Engineering',
    year: '4th Year',
    phone: '+91 95432 10987',
    cgpa: 8.35,
    section: 'B',
    guardian_name: 'Baldev Singh',
    guardian_phone: '+91 95432 10980',
    blood_group: 'O-',
    address: 'House 88, Heritage Enclave, North Gate',
    created_at: '2021-08-18',
  },
  {
    student_id: 'STU2024003',
    name: 'Sneha Kulkarni',
    email: 'sneha.cse@smartcampus.edu',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    phone: '+91 94321 09876',
    cgpa: 8.90,
    section: 'C',
    guardian_name: 'Milind Kulkarni',
    guardian_phone: '+91 94321 09870',
    blood_group: 'A-',
    address: 'Quarter 12, Lake View Road',
    created_at: '2024-08-20',
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Mid-Semester Examinations Schedule & Seating Allotment',
    description: 'The timetable for Autumn Term Mid-Semester Examinations has been published. All examinations will commence from 10:00 AM in Examination Hall Blocks A & B. Admit cards must be printed and signed by the Department Dean before Monday.',
    department: 'All Departments',
    priority: 'urgent',
    author: 'Controller of Examinations',
    created_at: '2026-09-12',
    pinned: true,
  },
  {
    id: 2,
    title: 'Annual TechFest & Hackathon "InnovateX 2026" Registrations Open',
    description: 'InnovateX 2026 registration is officially open for all undergraduate engineering batches. Categories include AI/ML, Cloud Infrastructure, IoT, and CleanTech. Prizes worth INR 2,50,000 to be won. Last date for abstract submission is October 5th.',
    department: 'Computer Science & Engineering',
    priority: 'important',
    author: 'Student Affairs Council',
    created_at: '2026-09-10',
    pinned: true,
  },
  {
    id: 3,
    title: 'Campus High-Speed Wi-Fi Upgrade in Hostel Blocks B, C & D',
    description: 'The IT Infrastructure Services team will be deploying enterprise Wi-Fi 6 access points across Boys and Girls Hostel blocks over the weekend. Brief intermittent downtimes between 2:00 AM and 5:00 AM are expected.',
    department: 'All Departments',
    priority: 'normal',
    author: 'Chief Information Officer (CIO)',
    created_at: '2026-09-08',
  },
  {
    id: 4,
    title: 'Guest Lecture on "Serverless Architecture & Cloud Migration" by AWS Lead',
    description: 'Distinguished alumni and Senior Solutions Architect at AWS will deliver an interactive talk in the Central Auditorium on Saturday from 2:30 PM to 4:30 PM. Attendance mandatory for 3rd and 4th year CSE/IT scholars.',
    department: 'Information Technology',
    priority: 'important',
    author: 'Head of IT Department',
    created_at: '2026-09-06',
  },
  {
    id: 5,
    title: 'Central Library Extended Night Hours for Exam Preparation',
    description: 'In view of upcoming tests, the Central Library reading halls will stay operational 24/7 starting from next Monday. High-speed study booths and digital catalog terminals will remain active.',
    department: 'All Departments',
    priority: 'normal',
    author: 'Chief Librarian',
    created_at: '2026-09-02',
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 1,
    ticket_no: 'CMP-2026-101',
    student_id: 'STU2022001',
    student_name: 'Aarav Sharma',
    department: 'Computer Science & Engineering',
    subject: 'Unstable Wi-Fi connectivity in Hostel Block C, 3rd Floor',
    category: 'Hostel',
    description: 'The Wi-Fi access point in the eastern wing of 3rd floor frequently drops connection during evening hours (7 PM to 11 PM), making it difficult to access online lab IDEs and lecture recordings.',
    status: 'In Progress',
    attachment_name: 'speedtest_screenshot.png',
    attachment_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
    created_at: '2026-09-11 14:30',
    updated_at: '2026-09-13 11:20',
    admin_remarks: 'Network maintenance technician dispatched. Access point switch port reset scheduled for Friday.',
  },
  {
    id: 2,
    ticket_no: 'CMP-2026-102',
    student_id: 'STU2022002',
    student_name: 'Priya Patel',
    department: 'Electronics & Communication',
    subject: 'Overhead projector display distortion in Electronics Lab 304',
    category: 'Laboratory',
    description: 'The HDMI connector and optical lens on Projector #2 in Lab 304 flickers and has a magenta tint, which obscures circuit schematics during lab demonstration sessions.',
    status: 'Pending',
    attachment_name: 'lab_projector_fault.jpg',
    attachment_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60',
    created_at: '2026-09-13 09:15',
    updated_at: '2026-09-13 09:15',
  },
  {
    id: 3,
    ticket_no: 'CMP-2026-103',
    student_id: 'STU2023015',
    student_name: 'Rohan Deshmukh',
    department: 'Mechanical Engineering',
    subject: 'Water dispenser cooling issue in Mechanical Workshop Block',
    category: 'Infrastructure',
    description: 'The drinking water cooler placed near Workshop Bay 2 is not chilling water and the filtration indicator light is flashing red.',
    status: 'Resolved',
    created_at: '2026-09-05 16:45',
    updated_at: '2026-09-08 14:00',
    admin_remarks: 'RO filter cartridges replaced and cooling compressor serviced by facilities vendor.',
  },
  {
    id: 4,
    ticket_no: 'CMP-2026-104',
    student_id: 'STU2022001',
    student_name: 'Aarav Sharma',
    department: 'Computer Science & Engineering',
    subject: 'Missing course slides in Cloud Computing LMS Portal',
    category: 'Academics',
    description: 'Module 4 (AWS S3 & CloudWatch) lecture handouts have not yet been synchronized with the course portal.',
    status: 'Resolved',
    created_at: '2026-09-01 10:20',
    updated_at: '2026-09-03 16:30',
    admin_remarks: 'Prof. Nair uploaded the updated Module 4 slide deck and demo architectural scripts.',
  },
];

// Generate last 30 days of realistic attendance for students
export const generateInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  let id = 1;
  const subjects = ['Cloud Architecture', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Design & Analysis of Algorithms'];
  
  // Dates for the past 20 class days
  const dates: string[] = [];
  const today = new Date();
  for (let i = 28; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const day = d.getDay();
    if (day !== 0 && day !== 6) { // Skip weekends
      dates.push(d.toISOString().split('T')[0]);
    }
  }

  INITIAL_STUDENTS.forEach((student, sIdx) => {
    dates.forEach((date, dIdx) => {
      // Deterministic realistic patterns:
      // Aarav ~90% attendance, Priya ~95%, Rohan ~80%, etc.
      let status: 'Present' | 'Absent' | 'Late' | 'Leave' = 'Present';
      const hash = (sIdx * 17 + dIdx * 31) % 100;
      if (sIdx === 0) {
        if (hash < 8) status = 'Absent';
        else if (hash < 14) status = 'Late';
      } else if (sIdx === 1) {
        if (hash < 5) status = 'Absent';
      } else if (sIdx === 2) {
        if (hash < 18) status = 'Absent';
        else if (hash < 25) status = 'Leave';
      } else {
        if (hash < 12) status = 'Absent';
        else if (hash < 18) status = 'Late';
      }

      records.push({
        id: id++,
        student_id: student.student_id,
        date,
        status,
        subject: subjects[dIdx % subjects.length],
        recorded_by: 'Automated Attendance Console'
      });
    });
  });

  return records;
};
