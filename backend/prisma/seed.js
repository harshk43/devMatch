/**
 * DevMatch DB seeder.
 *
 *   node prisma/seed.js          → seeds 500 users (default)
 *   node prisma/seed.js 1000     → seeds 1000 users
 *   SEED_COUNT=200 npm run db:seed
 *
 * Idempotent: any user whose email already exists is skipped, so existing
 * accounts (alice@test.dev, sameet@gmail.com, etc.) are never touched.
 *
 * All seeded users share the password:  password123
 * Their emails follow the pattern:      dev.<n>@devmatch.test
 */

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ----------------------------- Data pools ---------------------------------

const FIRST_NAMES = [
  'Aarav', 'Aanya', 'Aditi', 'Aditya', 'Akash', 'Aman', 'Ananya', 'Anika',
  'Arjun', 'Aryan', 'Ayush', 'Bhavna', 'Chirag', 'Dev', 'Diya', 'Esha',
  'Farhan', 'Gaurav', 'Harshita', 'Ishaan', 'Ishita', 'Jay', 'Karan',
  'Kavya', 'Krish', 'Lakshmi', 'Manav', 'Meera', 'Naina', 'Nikhil', 'Nisha',
  'Om', 'Pari', 'Pranav', 'Priya', 'Rahul', 'Rajat', 'Ravi', 'Riya', 'Rohan',
  'Sahil', 'Saksham', 'Sanya', 'Shivani', 'Shreya', 'Siddharth', 'Simran',
  'Tanvi', 'Tara', 'Uday', 'Varun', 'Vedika', 'Vihaan', 'Yash', 'Zara',
  'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Henry', 'Lucas',
  'Mia', 'Olivia', 'Emma', 'Charlotte', 'Sophia', 'Amelia', 'Isabella', 'Ava',
  'Hiroshi', 'Yuki', 'Mei', 'Wei', 'Jin', 'Sakura', 'Ravi', 'Anil',
  'Ethan', 'Mason', 'Jacob', 'Daniel', 'Logan', 'Carter',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Kumar', 'Singh', 'Reddy', 'Mehta',
  'Iyer', 'Nair', 'Pillai', 'Menon', 'Das', 'Bose', 'Banerjee', 'Chatterjee',
  'Mukherjee', 'Roy', 'Sen', 'Khan', 'Ahmed', 'Joshi', 'Kapoor', 'Malhotra',
  'Chopra', 'Bhatt', 'Bhatia', 'Agarwal', 'Aggarwal', 'Goyal', 'Mittal',
  'Saxena', 'Sinha', 'Mishra', 'Tiwari', 'Pandey', 'Yadav', 'Choudhary',
  'Nayak', 'Patro', 'Mohanty', 'Behera', 'Dash', 'Rao', 'Naidu', 'Kanaujia',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen',
  'Young', 'King', 'Wright', 'Scott', 'Green', 'Adams',
];

// Roles are intentionally varied free-form strings so search like "backend",
// "frontend", "ML", "android" all return diverse results.
const ROLES = [
  // Frontend
  'Frontend Developer', 'Senior Frontend Engineer', 'React Developer',
  'Vue Developer', 'Frontend Architect', 'UI Engineer',
  // Backend
  'Backend Developer', 'Backend Engineer', 'Senior Backend Engineer',
  'Node.js Backend Engineer', 'Python Backend Developer', 'Go Backend Engineer',
  'Java Backend Developer', 'Backend Systems', 'API Engineer',
  // Fullstack
  'Fullstack Developer', 'Fullstack Engineer', 'Senior Fullstack Engineer',
  'MERN Stack Developer', 'MEAN Stack Developer',
  // Mobile
  'Android Developer', 'iOS Developer', 'Flutter Developer',
  'React Native Developer', 'Mobile Engineer', 'Senior Android Developer',
  // Data / ML / AI
  'Machine Learning Engineer', 'ML Engineer', 'Senior ML Engineer',
  'Data Scientist', 'Data Engineer', 'AI Researcher', 'NLP Engineer',
  'Computer Vision Engineer', 'Deep Learning Engineer',
  // DevOps / Cloud
  'DevOps Engineer', 'Senior DevOps Engineer', 'Cloud Engineer', 'SRE',
  'Platform Engineer', 'Infrastructure Engineer',
  // Other niches
  'Game Developer', 'Unity Developer', 'Unreal Engine Developer',
  'Embedded Systems Engineer', 'IoT Engineer', 'Firmware Engineer',
  'Blockchain Developer', 'Smart Contract Engineer', 'Web3 Developer',
  'QA Engineer', 'Test Automation Engineer', 'Security Engineer',
  'UI/UX Designer', 'Product Designer',
  // Senior / Lead
  'Tech Lead', 'Engineering Manager', 'Solutions Architect',
  'Software Architect', 'Principal Engineer',
];

const SKILLS = [
  // Frontend
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Svelte', 'Next.js',
  'Nuxt.js', 'Tailwind CSS', 'CSS3', 'HTML5', 'Redux', 'GraphQL', 'Vite',
  // Backend
  'Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Flask', 'FastAPI',
  'Java', 'Spring Boot', 'Go', 'Rust', 'Ruby', 'Rails', 'PHP', 'Laravel',
  'C#', '.NET', 'Kotlin',
  // Mobile
  'Swift', 'Flutter', 'React Native', 'Android SDK', 'Jetpack Compose',
  'SwiftUI',
  // DB
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB',
  'Cassandra', 'Elasticsearch',
  // Cloud / DevOps
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'Jenkins',
  'GitHub Actions', 'CI/CD', 'Nginx', 'Linux',
  // Data / ML
  'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'Spark',
  'Airflow', 'Hadoop', 'OpenCV', 'Hugging Face',
  // Other
  'Git', 'Microservices', 'REST API', 'gRPC', 'WebSockets', 'OAuth', 'JWT',
  'Prisma', 'Tailwind', 'Figma',
  // Game / Embedded / Web3
  'Unity', 'Unreal Engine', 'C++', 'Solidity', 'Ethereum', 'Web3.js',
  'Arduino', 'Raspberry Pi',
];

const CITIES = [
  'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata',
  'Bhubaneswar', 'Gurugram', 'Noida', 'Ahmedabad', 'Kochi', 'Indore',
  'Jaipur', 'Berlin', 'London', 'San Francisco', 'New York', 'Toronto',
  'Singapore', 'Dubai', 'Tokyo', 'Sydney', 'Amsterdam',
];

const BIO_TEMPLATES = [
  '{role} based in {city}. {years}+ years shipping production systems with {skill1} and {skill2}.',
  'Passionate {role} who loves clean architecture, automated tests, and good coffee. Currently exploring {skill1}.',
  'Building things at the intersection of {skill1} and {skill2}. Open to collaborating on side projects.',
  '{years} years of experience in {role}. Strong with {skill1}, {skill2}, and modern dev workflows.',
  'Hi! {role} from {city}. Looking for teammates for a hackathon — my stack is {skill1} + {skill2}.',
  'Mostly write {skill1} day-to-day. Side projects in {skill2}. DM me if you want to ship something fun.',
  '{role} | {skill1} enthusiast | OSS contributor | {city} 🌆',
  'Ex-{prevRole}, currently a {role}. Comfortable across {skill1}, {skill2}, and a dash of {skill3}.',
  'I care about developer experience, accessibility, and shipping fast. {skill1} is my go-to.',
  'College + freelance. Built {projectIdea} with {skill1}. Always learning.',
];

const PROJECT_IDEAS = [
  'a real-time chat app',
  'a campus marketplace',
  'a habit tracker',
  'an e-commerce store',
  'a CI/CD dashboard',
  'an AI image classifier',
  'a budget planner',
  'a social fitness tracker',
  'a code-review bot',
  'a study-group matcher',
];

// ----------------------------- Helpers ------------------------------------

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rndFloat(min, max, decimals = 1) {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
}

function buildBio(role, years, skills) {
  const template = pick(BIO_TEMPLATES);
  const [s1 = 'JavaScript', s2 = 'Python', s3 = 'Docker'] = skills;
  return template
    .replace('{role}', role)
    .replace('{prevRole}', pick(ROLES))
    .replace('{years}', String(years || 1))
    .replace('{city}', pick(CITIES))
    .replace('{skill1}', s1)
    .replace('{skill2}', s2)
    .replace('{skill3}', s3)
    .replace('{projectIdea}', pick(PROJECT_IDEAS));
}

function buildHandle(first, last, idx) {
  const clean = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
  return `${clean(first)}.${clean(last)}.${idx}`;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ----------------------------- Main ---------------------------------------

async function main() {
  const target = parseInt(process.argv[2] || process.env.SEED_COUNT || '500', 10);
  const startedAt = Date.now();

  console.log(`\n🌱  DevMatch seeder — target: ${target} users\n`);

  // 1. Upsert all skills (idempotent).
  console.log('1) Upserting skills...');
  const skillRows = await Promise.all(
    SKILLS.map((name) =>
      prisma.skill.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  const skillIdByName = Object.fromEntries(skillRows.map((s) => [s.name, s.id]));
  console.log(`   ✓ ${skillRows.length} skills ready.\n`);

  // 2. Hash the shared password once. (bcrypt is slow per-call;
  //    seeding 500 users with individual hashes would take minutes.)
  console.log('2) Hashing default password...');
  const passwordHash = await bcrypt.hash('password123', 10);
  console.log('   ✓ Password hashed.\n');

  // 3. Find which dev.<n>@devmatch.test emails already exist.
  console.log('3) Checking for existing seeded users...');
  const candidateEmails = Array.from(
    { length: target },
    (_, i) => `dev.${i + 1}@devmatch.test`
  );
  const existing = await prisma.user.findMany({
    where: { email: { in: candidateEmails } },
    select: { email: true },
  });
  const existingSet = new Set(existing.map((u) => u.email));
  const toCreate = candidateEmails.filter((e) => !existingSet.has(e));
  console.log(
    `   ✓ ${existingSet.size} already seeded, ${toCreate.length} to create.\n`
  );

  if (toCreate.length === 0) {
    console.log('Nothing to do. ✅');
    return;
  }

  // 4. Insert in batches so we don't open hundreds of parallel connections.
  console.log(`4) Creating ${toCreate.length} users (batches of 25)...`);
  const BATCH_SIZE = 25;
  let createdCount = 0;

  for (const batch of chunk(toCreate, BATCH_SIZE)) {
    await Promise.all(
      batch.map(async (email) => {
        const idx = parseInt(email.split('.')[1], 10);
        const first = pick(FIRST_NAMES);
        const last = pick(LAST_NAMES);
        const handle = buildHandle(first, last, idx);
        const role = pick(ROLES);

        // 3-7 random skills per user
        const userSkills = pickN(SKILLS, rndInt(3, 7));
        const exp = rndInt(0, 15);
        const rating = rndFloat(3.5, 5.0, 1);
        const phone = `+91 9${rndInt(100000000, 999999999)}`;

        const hasLinkedin = Math.random() < 0.7;
        const hasGithub = Math.random() < 0.7;
        const hasTelegram = Math.random() < 0.4;

        await prisma.user.create({
          data: {
            email,
            passwordHash,
            name: `${first} ${last}`,
            role,
            bio: buildBio(role, exp, userSkills),
            experienceYears: exp,
            rating,
            isAvailable: Math.random() < 0.85,
            phone,
            linkedin: hasLinkedin ? `https://linkedin.com/in/${handle}` : null,
            github: hasGithub ? `https://github.com/${handle}` : null,
            telegram: hasTelegram ? `@${handle.replace(/\./g, '_')}` : null,
            skills: {
              create: userSkills.map((name) => ({
                skillId: skillIdByName[name],
              })),
            },
          },
        });
      })
    );
    createdCount += batch.length;
    process.stdout.write(`   ... ${createdCount}/${toCreate.length}\r`);
  }
  console.log(`\n   ✓ Created ${createdCount} users.\n`);

  // 5. Summary.
  const totals = await prisma.user.aggregate({ _count: { _all: true } });
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log('────────────────────────────────────────');
  console.log(`✅ Done in ${seconds}s.`);
  console.log(`   Users in DB:    ${totals._count._all}`);
  console.log(`   Skills in DB:   ${skillRows.length}`);
  console.log(`   Default login:  dev.<n>@devmatch.test  /  password123`);
  console.log(`   (e.g. dev.1@devmatch.test)`);
  console.log('────────────────────────────────────────\n');
}

main()
  .catch((err) => {
    console.error('\n❌ Seeder failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
