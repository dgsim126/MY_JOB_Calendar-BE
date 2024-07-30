// company table 데이터 테스트용
// 서버 실행 중 새 터미널로 실행 -> node seedDatabase
const Company = require('./models/Company/company');

const companies = [
  {
    companyName: "Example Corp",
    establish: "2000-01-01",
    logo: "example_logo.png",
    pic1: "example_pic1.png",
    pic2: "example_pic2.png",
    pic3: "example_pic3.png",
    pic4: "example_pic4.png",
    pic5: "example_pic5.png",
    body: "Example Corp is a leading company in the tech industry.",
    track: "Software Development",
    stack: "JavaScript, Node.js, React",
    welfare: "Health insurance, Paid time off",
    salary: "Competitive",
    location: "San Francisco, CA",
    employee: 500,
    link: "https://www.example.com",
    revenue: "$10M"
  },
  {
    companyName: "Tech Innovations",
    establish: "2010-05-15",
    logo: "tech_innovations_logo.png",
    pic1: "tech_innovations_pic1.png",
    pic2: "tech_innovations_pic2.png",
    pic3: "tech_innovations_pic3.png",
    pic4: "tech_innovations_pic4.png",
    pic5: "tech_innovations_pic5.png",
    body: "Tech Innovations focuses on cutting-edge technology solutions.",
    track: "AI and Machine Learning",
    stack: "Python, TensorFlow, Keras",
    welfare: "Gym membership, Flexible hours",
    salary: "Attractive",
    location: "New York, NY",
    employee: 200,
    link: "https://www.techinnovations.com",
    revenue: "$5M"
  },
  {
    companyName: "Global Enterprises",
    establish: "1995-09-20",
    logo: "global_enterprises_logo.png",
    pic1: "global_enterprises_pic1.png",
    pic2: "global_enterprises_pic2.png",
    pic3: "global_enterprises_pic3.png",
    pic4: "global_enterprises_pic4.png",
    pic5: "global_enterprises_pic5.png",
    body: "Global Enterprises is a multinational conglomerate with a diverse portfolio.",
    track: "Manufacturing and Retail",
    stack: "SAP, Oracle",
    welfare: "Stock options, Health insurance",
    salary: "Generous",
    location: "Chicago, IL",
    employee: 1000,
    link: "https://www.globalenterprises.com",
    revenue: "$50M"
  },
  {
    companyName: "ABC Corporation",
    establish: "2023-01-01T00:00:00.000Z",
    logo: "test_logo.png",
    pic1: "pic1.png",
    pic2: "pic2.png",
    pic3: "pic3.png",
    pic4: "pic4.png",
    pic5: "pic5.png",
    body: "This is a test company.",
    track: "Test Track",
    stack: "Test Stack",
    welfare: "Test Welfare",
    salary: "Test Salary",
    location: "Test Location",
    employee: "100",
    link: "http://testcompany.com",
    revenue: "1000000"
  },
  {
    companyName: "ABC Corporation2",
    establish: "2023-01-01T00:00:00.000Z",
    logo: "test_logo.png",
    pic1: "pic1.png",
    pic2: "pic2.png",
    pic3: "pic3.png",
    pic4: "pic4.png",
    pic5: "pic5.png",
    body: "This is a test company.",
    track: "Test Track",
    stack: "Test Stack",
    welfare: "Test Welfare",
    salary: "Test Salary",
    location: "Test Location",
    employee: "100",
    link: "http://testcompany.com",
    revenue: "1000000"
  },
  {
    companyName: "ABC Corporation3",
    establish: "2023-01-01T00:00:00.000Z",
    logo: "test_logo.png",
    pic1: "pic1.png",
    pic2: "pic2.png",
    pic3: "pic3.png",
    pic4: "pic4.png",
    pic5: "pic5.png",
    body: "This is a test company.",
    track: "Test Track",
    stack: "Test Stack",
    welfare: "Test Welfare",
    salary: "Test Salary",
    location: "Test Location",
    employee: "100",
    link: "http://testcompany.com",
    revenue: "1000000"
  }
];

async function seedDatabase() {
  try {
    await Company.bulkCreate(companies);
    console.log('Companies inserted successfully');
  } catch (error) {
    console.error('Error inserting companies:', error);
  }
}

seedDatabase();