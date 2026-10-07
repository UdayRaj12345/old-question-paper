const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

dotenv.config({ path: './.env.example' }); // using example env for testing, change to .env in production

// Load models
const User = require('./models/User');
const University = require('./models/University');
const College = require('./models/College');
const Department = require('./models/Department');
const Course = require('./models/Course');
const Subject = require('./models/Subject');
const Paper = require('./models/Paper');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const generateData = async () => {
  try {
    console.log('Clearing old data...');
    await User.deleteMany();
    await University.deleteMany();
    await College.deleteMany();
    await Department.deleteMany();
    await Course.deleteMany();
    await Subject.deleteMany();
    await Paper.deleteMany();

    console.log('Generating University...');
    const university = await University.create({
      name: 'Tech Global University',
      location: 'Silicon Valley, CA',
      website: 'https://techglobal.edu'
    });

    console.log('Generating Colleges...');
    const colleges = [];
    for (let i = 0; i < 2; i++) {
      colleges.push(await College.create({
        name: `${faker.company.name()} Engineering College`,
        university: university._id,
        code: faker.string.alphanumeric(5).toUpperCase()
      }));
    }

    console.log('Generating Departments...');
    const departments = [];
    for (const college of colleges) {
      for (let i = 0; i < 3; i++) {
        departments.push(await Department.create({
          name: `Department of ${faker.science.chemicalElement().name} Engineering`,
          college: college._id
        }));
      }
    }

    console.log('Generating Courses...');
    const courses = [];
    for (let i = 0; i < 15; i++) {
      courses.push(await Course.create({
        name: `B.Tech in ${faker.commerce.department()}`,
        department: departments[i % departments.length]._id,
        durationYears: 4
      }));
    }

    console.log('Generating Subjects...');
    const subjects = [];
    for (let i = 0; i < 50; i++) {
      subjects.push(await Subject.create({
        name: faker.hacker.noun() + ' Systems',
        code: faker.string.alphanumeric(6).toUpperCase(),
        course: courses[i % courses.length]._id,
        semester: faker.number.int({ min: 1, max: 8 }),
        credits: faker.number.int({ min: 2, max: 4 })
      }));
    }

    console.log('Generating Users (Admins, Faculty, Students)...');
    const users = [];
    
    // 2 Admins
    for (let i = 0; i < 2; i++) {
      users.push(await User.create({
        name: faker.person.fullName(),
        email: `admin${i}@example.com`,
        password: 'password123',
        role: 'Admin',
        isVerified: true
      }));
    }

    // 10 Faculty
    const faculty = [];
    for (let i = 0; i < 10; i++) {
      const f = await User.create({
        name: faker.person.fullName(),
        email: `faculty${i}@example.com`,
        password: 'password123',
        role: 'Faculty',
        college: colleges[i % colleges.length]._id,
        isVerified: true
      });
      users.push(f);
      faculty.push(f);
    }

    // 100 Students
    const students = [];
    for (let i = 0; i < 100; i++) {
      const s = await User.create({
        name: faker.person.fullName(),
        email: `student${i}@example.com`,
        password: 'password123',
        role: 'Student',
        college: colleges[i % colleges.length]._id,
        course: courses[i % courses.length]._id,
        semester: faker.number.int({ min: 1, max: 8 }),
        isVerified: true
      });
      users.push(s);
      students.push(s);
    }

    console.log('Generating Papers...');
    for (let i = 0; i < 300; i++) {
      const subj = subjects[i % subjects.length];
      const coll = colleges[i % colleges.length];
      const dept = departments[i % departments.length];
      const crs = courses[i % courses.length];
      const upldr = students[i % students.length];

      await Paper.create({
        title: `${subj.name} Previous Year Paper ${2020 + faker.number.int({ min: 0, max: 5 })}`,
        university: university._id,
        college: coll._id,
        department: dept._id,
        course: crs._id,
        subject: subj._id,
        subjectCode: subj.code,
        semester: subj.semester,
        academicYear: `20${faker.number.int({ min: 20, max: 24 })}-${faker.number.int({ min: 21, max: 25 })}`,
        examYear: faker.number.int({ min: 2020, max: 2025 }),
        pdfURL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // dummy pdf link
        uploadedBy: upldr._id,
        approved: true,
        status: 'Approved',
        downloads: faker.number.int({ min: 0, max: 500 }),
        views: faker.number.int({ min: 0, max: 1000 })
      });
    }

    console.log('Data Imported successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

generateData();
