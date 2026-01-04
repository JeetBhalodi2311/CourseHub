export const MOCK_USERS = [
    { id: '1', name: 'Jeet', email: 'jeet@gmail.com', password: 'abc123', role: 'student', enrolledCourses: [] },
    { id: '2', name: 'Viraj', email: 'viraj@gmail.com', password: 'abc123', role: 'instructor', enrolledCourses: [] }
];

export const MOCK_COURSES = [
    {
        id: '1',
        title: 'The Complete Python Bootcamp 2024',
        description: 'Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games.',
        instructorId: '2',
        instructorName: 'Jose Portilla',
        price: 499,
        rating: 4.8,
        totalReviews: 45000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/567828_67d0.jpg',
        category: 'Development',
        lectures: []
    },
    {
        id: '101',
        title: '100 Days of Code: The Complete Python Pro Bootcamp',
        description: 'Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!',
        instructorId: '2',
        instructorName: 'Dr. Angela Yu',
        price: 599,
        rating: 4.7,
        totalReviews: 210000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/2776760_f176_10.jpg',
        category: 'Development',
        lectures: []
    },
    {
        id: '102',
        title: 'Ultimate AWS Certified Solutions Architect Associate 2024',
        description: 'Full practice exam included + explanations! Master the SAA-C03 exam.',
        instructorId: '3',
        instructorName: 'Stephane Maarek',
        price: 999,
        rating: 4.9,
        totalReviews: 12000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/2196488_8fc7_10.jpg',
        category: 'It & Software',
        lectures: []
    },
    {
        id: '103',
        title: 'React - The Complete Guide 2024 (incl. React Router & Redux)',
        description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
        instructorId: '4',
        instructorName: 'Academind by Maximilian Schwarzmüller',
        price: 499,
        rating: 4.6,
        totalReviews: 185000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg',
        category: 'Development',
        lectures: []
    },
    {
        id: '104',
        title: 'The Complete Digital Marketing Course - 12 Courses in 1',
        description: 'Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!',
        instructorId: '5',
        instructorName: 'Rob Percival',
        price: 649,
        rating: 4.5,
        totalReviews: 156000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/914296_3670_8.jpg',
        category: 'Marketing',
        lectures: []
    },
    {
        id: '105',
        title: 'Microsoft Excel - Excel from Beginner to Advanced',
        description: 'Excel with this A-Z Microsoft Excel Course. Microsoft Excel 2010, 2013, 2016, Excel 2019 and Office 365',
        instructorId: '6',
        instructorName: 'Kyle Pew',
        price: 499,
        rating: 4.7,
        totalReviews: 89000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/793796_0e89_2.jpg',
        category: 'Office Productivity',
        lectures: []
    },
    {
        id: '106',
        title: 'Graphic Design Masterclass - Learn GREAT Design',
        description: 'The Ultimate Graphic Design Course Which Covers Photoshop, Illustrator, InDesign, Design Theory, Branding and Logo Design',
        instructorId: '7',
        instructorName: 'Lindsay Marsh',
        price: 449,
        rating: 4.8,
        totalReviews: 42000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/1653432_3a57_3.jpg',
        category: 'Design',
        lectures: []
    },
    {
        id: '107',
        title: 'Complete C# Unity Game Developer 2D',
        description: 'Learn Unity in C# & Code Your First Seven 2D Video Games for Web, Mac & PC. The Tilemap adjustments cover Unity 2018',
        instructorId: '8',
        instructorName: 'GameDev.tv Team',
        price: 499,
        rating: 4.7,
        totalReviews: 95000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/258316_55e9_12.jpg',
        category: 'Development',
        lectures: []
    },
    {
        id: '108',
        title: 'Machine Learning A-Z: AI, Python & R + ChatGPT Bonus [2024]',
        description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.',
        instructorId: '9',
        instructorName: 'Kirill Eremenko',
        price: 699,
        rating: 4.5,
        totalReviews: 170000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg',
        category: 'Development',
        lectures: []
    },
    {
        id: '201',
        title: 'PMP Exam Prep Seminar - Earn 35 PDUs',
        description: 'Pass the PMP Exam on your first try! This course includes all 35 contact hours you need to sit for the PMP exam.',
        instructorId: '10',
        instructorName: 'Joseph Phillips',
        price: 999,
        rating: 4.6,
        totalReviews: 85000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/1361790_2eb2.jpg',
        category: 'Management',
        lectures: []
    },
    {
        id: '202',
        title: 'Agile Crash Course: Agile Project Management; Agile Delivery',
        description: 'Get agile certified & learn fundamental agile project management & delivery skills with the Agile Crash Course.',
        instructorId: '11',
        instructorName: 'Mauricio Rubio',
        price: 499,
        rating: 4.4,
        totalReviews: 32000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/605068_5a17.jpg',
        category: 'Management',
        lectures: []
    },
    {
        id: '203',
        title: 'Product Management 101',
        description: 'Learn to become a top Product Manager with this comprehensive course covering strategy, design, and launch.',
        instructorId: '18',
        instructorName: 'Todd Birzer',
        price: 599,
        rating: 4.5,
        totalReviews: 15000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/1445722_9872_3.jpg',
        category: 'Management',
        lectures: []
    },
    {
        id: '301',
        title: 'Operating Systems: from scratch',
        description: 'Learn the concepts of Operating Systems from scratch as they are implemented in standard OS like Linux and Windows.',
        instructorId: '12',
        instructorName: 'Vignesh Sekar',
        price: 449,
        rating: 4.5,
        totalReviews: 12000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/2259120_305f_6.jpg',
        category: 'Computer',
        lectures: []
    },
    {
        id: '302',
        title: 'Mastering Data Structures & Algorithms using C and C++',
        description: 'Learn, Analyse and Implement Data Structure using C and C++. Learn Recursion and Sorting.',
        instructorId: '13',
        instructorName: 'Abdul Bari',
        price: 799,
        rating: 4.8,
        totalReviews: 56000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/2121018_9de9_3.jpg',
        category: 'Computer',
        lectures: []
    },
    {
        id: '303',
        title: 'Computer Networking Complete Course',
        description: 'Beginner to Advanced Networking. Covers IP addressing, subnetting, VLANs, Routing, Switching, and more.',
        instructorId: '19',
        instructorName: 'David Bombal',
        price: 699,
        rating: 4.7,
        totalReviews: 28000,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/1202864_d3a3_2.jpg',
        category: 'Computer',
        lectures: []
    },
    {
        id: '401',
        title: 'Crash Course Electronics and PCB Design',
        description: 'Learn Electronics and PCB Design from the Ground up with Altium CircuitMaker and Labcenter Proteus.',
        instructorId: '14',
        instructorName: 'Andre LaMothe',
        price: 999,
        rating: 4.6,
        totalReviews: 9500,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/860882_382a_9.jpg',
        category: 'Electrical',
        lectures: []
    },
    {
        id: '402',
        title: 'Complete Electric Circuits Course for Electrical Engineering',
        description: 'A comprehensive guide to DC and AC circuit theory, essential for any aspiring electrical engineer.',
        instructorId: '15',
        instructorName: 'Ahmed Mahdy',
        price: 499,
        rating: 4.7,
        totalReviews: 4800,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/1715018_e2bb_5.jpg',
        category: 'Electrical',
        lectures: []
    },
    {
        id: '501',
        title: 'AutoCAD 2024 Course - from Beginner to Professional',
        description: 'Master AutoCAD 2D & 3D for Civil, Mechanical, and Electrical design with real-world examples.',
        instructorId: '16',
        instructorName: 'Awais Jamil',
        price: 549,
        rating: 4.5,
        totalReviews: 8900,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/5086780_b314.jpg',
        category: 'Civil',
        lectures: []
    },
    {
        id: '502',
        title: 'Civil Engineering: Structural Analysis',
        description: 'Understand the core concepts of structural analysis, including beams, frames, and trusses.',
        instructorId: '17',
        instructorName: 'Dr. Seán Carroll',
        price: 699,
        rating: 4.8,
        totalReviews: 3400,
        thumbnail: 'https://img-c.udemycdn.com/course/480x270/1252326_09d7.jpg',
        category: 'Civil',
        lectures: []
    }
];

export const MOCK_LECTURES = [
    // Course 1
    { id: 'l1', courseId: '1', title: 'Python Setup', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: 300, isPreview: true, order: 1 },
    { id: 'l2', courseId: '1', title: 'Basic Syntax', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: 450, isPreview: false, order: 2 },
    { id: 'l3', courseId: '1', title: 'Data Types', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: 600, isPreview: false, order: 3 },

    // Course 101 - Angela Yu
    { id: 'l4', courseId: '101', title: 'Welcome to the Course', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', duration: 180, isPreview: true, order: 1 },
    { id: 'l5', courseId: '101', title: 'Day 1: Variables', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', duration: 900, isPreview: false, order: 2 },

    // Course 103 - React
    { id: 'l6', courseId: '103', title: 'Introduction to React', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: 240, isPreview: true, order: 1 },
    { id: 'l7', courseId: '103', title: 'Javascript Refresher', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', duration: 1200, isPreview: false, order: 2 },

    // Lectures for NEW Courses (Management, Computer, etc.)
    // Management (201)
    { id: 'l_201_1', courseId: '201', title: 'PMP Introduction', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: 400, isPreview: true, order: 1 },
    { id: 'l_201_2', courseId: '201', title: 'Project Charter', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: 600, isPreview: false, order: 2 },

    // Management (202)
    { id: 'l_202_1', courseId: '202', title: 'What is Agile?', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: 300, isPreview: true, order: 1 },

    // Computer (301)
    { id: 'l_301_1', courseId: '301', title: 'OS Basics', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', duration: 500, isPreview: true, order: 1 },

    // Computer (302) - Data Structs
    { id: 'l_302_1', courseId: '302', title: 'Introduction to Algorithms', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', duration: 450, isPreview: true, order: 1 },

    // Electrical (401)
    { id: 'l_401_1', courseId: '401', title: 'Electricity Basics', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: 350, isPreview: true, order: 1 },

    // Civil (501)
    { id: 'l_501_1', courseId: '501', title: 'AutoCAD Interface', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', duration: 300, isPreview: true, order: 1 },

    // Generic fallback for older mocks
    { id: 'l8', courseId: '102', title: 'AWS Intro', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: 300, isPreview: true, order: 1 },
    { id: 'l9', courseId: '104', title: 'Marketing 101', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: 300, isPreview: true, order: 1 },
    { id: 'l10', courseId: '105', title: 'Excel Basics', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: 300, isPreview: true, order: 1 },
];

export const MOCK_ENROLLMENTS = [
    {
        id: 'e1',
        userId: '1', // Jeet
        courseId: '1', // Python Bootcamp (Instructor 2)
        enrolledAt: '2024-03-15T10:30:00Z',
        pricePaid: 499,
        progress: 15
    },
    {
        id: 'e2',
        userId: '1', // Jeet
        courseId: '101', // 100 Days of Code (Instructor 2)
        enrolledAt: '2024-03-10T14:20:00Z',
        pricePaid: 599,
        progress: 45
    },
    {
        id: 'e3',
        userId: '3', // Random User (to be created below if needed, or just mock ID)
        courseId: '1',
        enrolledAt: '2024-02-28T09:15:00Z',
        pricePaid: 450, // Discounted
        progress: 100
    }
];

// Add a few more mock users to simulate students
export const EXTRA_MOCK_USERS = [
    { id: '3', name: 'Rahul Sharma', email: 'rahul@test.com', role: 'student' },
    { id: '4', name: 'Priya Patel', email: 'priya@test.com', role: 'student' }
];

// Merge into main users list for logic consistency if needed, 
// but services usually import MOCK_USERS directly. 
// We'll update the initial MOCK_USERS to include these for easier lookup.
MOCK_USERS.push(...EXTRA_MOCK_USERS);

export const MOCK_REVIEWS = []; 
