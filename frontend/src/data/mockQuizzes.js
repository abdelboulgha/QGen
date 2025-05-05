export const mockQuizzes = [
    {
      id: 1,
      title: 'Introduction to JavaScript',
      description: 'Test your knowledge of JavaScript basics',
      createdBy: 2, // Professor ID
      duration: 30, // in minutes
      totalPoints: 20,
      isPublished: true,
      publishDate: '2023-02-01',
      endDate: '2023-12-31',
      createdAt: '2023-01-25',
      updatedAt: '2023-01-30',
      questions: [
        {
          id: 1,
          questionText: 'What is JavaScript?',
          questionType: 'mcq',
          points: 2,
          options: [
            { id: 1, text: 'A programming language', isCorrect: true },
            { id: 2, text: 'A markup language', isCorrect: false },
            { id: 3, text: 'A database system', isCorrect: false },
            { id: 4, text: 'A server', isCorrect: false }
          ]
        },
        {
          id: 2,
          questionText: 'Which of these are JavaScript data types?',
          questionType: 'mcq-multiple',
          points: 3,
          options: [
            { id: 1, text: 'String', isCorrect: true },
            { id: 2, text: 'Boolean', isCorrect: true },
            { id: 3, text: 'Character', isCorrect: false },
            { id: 4, text: 'Object', isCorrect: true }
          ]
        },
        {
          id: 3,
          questionText: 'JavaScript was created in 10 days?',
          questionType: 'true-false',
          points: 1,
          options: [
            { id: 1, text: 'True', isCorrect: true },
            { id: 2, text: 'False', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'React Fundamentals',
      description: 'Test your understanding of React core concepts',
      createdBy: 2, // Professor ID
      duration: 45, // in minutes
      totalPoints: 30,
      isPublished: true,
      publishDate: '2023-03-01',
      endDate: '2023-12-31',
      createdAt: '2023-02-20',
      updatedAt: '2023-02-28',
      questions: [
        {
          id: 1,
          questionText: 'What is React?',
          questionType: 'mcq',
          points: 2,
          options: [
            { id: 1, text: 'A JavaScript library for building user interfaces', isCorrect: true },
            { id: 2, text: 'A programming language', isCorrect: false },
            { id: 3, text: 'A database system', isCorrect: false },
            { id: 4, text: 'A server-side framework', isCorrect: false }
          ]
        },
        {
          id: 2,
          questionText: 'Which of these are React hooks?',
          questionType: 'mcq-multiple',
          points: 3,
          options: [
            { id: 1, text: 'useState', isCorrect: true },
            { id: 2, text: 'useEffect', isCorrect: true },
            { id: 3, text: 'useData', isCorrect: false },
            { id: 4, text: 'useContext', isCorrect: true }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Database Concepts',
      description: 'Basic database theory and SQL concepts',
      createdBy: 3, // Professor ID
      duration: 60, // in minutes
      totalPoints: 40,
      isPublished: false,
      publishDate: null,
      endDate: null,
      createdAt: '2023-03-10',
      updatedAt: '2023-03-10',
      questions: [
        {
          id: 1,
          questionText: 'What is a primary key?',
          questionType: 'mcq',
          points: 2,
          options: [
            { id: 1, text: 'A column that uniquely identifies each row in a table', isCorrect: true },
            { id: 2, text: 'The first column in a table', isCorrect: false },
            { id: 3, text: 'A column that contains only numeric values', isCorrect: false },
            { id: 4, text: 'A column that cannot contain NULL values', isCorrect: false }
          ]
        },
        {
          id: 2,
          questionText: 'SQL stands for Structured Query Language',
          questionType: 'true-false',
          points: 1,
          options: [
            { id: 1, text: 'True', isCorrect: true },
            { id: 2, text: 'False', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Data Structures',
      description: 'Introduction to fundamental data structures',
      createdBy: 3, // Professor ID
      duration: 45, // in minutes
      totalPoints: 25,
      isPublished: true,
      publishDate: '2023-04-01',
      endDate: '2023-12-31',
      createdAt: '2023-03-25',
      updatedAt: '2023-03-30',
      questions: []
    }
  ];