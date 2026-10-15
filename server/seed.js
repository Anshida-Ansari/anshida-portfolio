/**
 * Seed script — populates the database with existing static portfolio data.
 * Run once: `node seed.js` from the server/ directory.
 * Safe to re-run: skips if data already exists.
 */

import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import Project from './models/Project.js';
import SkillGroup from './models/SkillGroup.js';
import Experience from './models/Experience.js';
import About from './models/About.js';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // ── Admin ──────────────────────────────────────────────────────────────────
  const existingAdmin = await Admin.findOne();
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await Admin.create({ email: process.env.ADMIN_EMAIL, passwordHash });
    console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log('⏭  Admin already exists — skipping');
  }

  // ── Projects ───────────────────────────────────────────────────────────────
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        number: '01',
        title: 'Sprintly',
        category: 'SaaS · Project Management',
        type: 'Personal Project',
        description:
          'A full-stack project management platform inspired by tools like Jira. Built around organizing projects, managing tasks, and supporting team workflows — exploring the engineering behind modern SaaS tools.',
        tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST API', 'Auth'],
        liveUrl: 'https://app.anshida.online/',
        repoUrl: 'https://github.com/Anshida-Ansari/Sprintly-Backend',
        repoLabel: 'Backend Repo',
        order: 0,
      },
      {
        number: '02',
        title: 'Lush Scents',
        category: 'E-commerce · Web Development',
        type: 'Personal Project',
        description:
          'An e-commerce application focused on product presentation, responsive interfaces, and core shopping functionality. Built full-stack from catalog to cart.',
        tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'CSS'],
        repoUrl: 'https://github.com/Anshida-Ansari/Lush-Scentes',
        repoLabel: 'View Repository',
        order: 1,
      },
      {
        number: '03',
        title: 'Dopeminex',
        category: 'Digital Marketing · Web Development',
        type: 'Client Work',
        description:
          'Frontend implementation and responsive design for a digital marketing business website. Focused on translating requirements into a performant, mobile-friendly experience.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        liveUrl: 'https://www.dopeminex.com/',
        repoUrl: 'https://github.com/Anshida-Ansari/dopeminex-websites',
        repoLabel: 'Repository',
        order: 2,
      },
      {
        number: '04',
        title: 'Healthcare Websites',
        category: 'Healthcare · Client Work',
        type: 'Internship',
        description:
          'Frontend development and responsive layout implementation for Salamatek Medical Center and Sameera Healthcare. Delivered as part of an internship engagement — translating design requirements into functional, accessible web pages.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        note: 'Internship contribution — frontend development and responsive layouts.',
        order: 3,
      },
      {
        number: '05',
        title: 'Dazz Tradlink',
        category: 'Business Website · Client Work',
        type: 'Internship',
        description:
          'Website development for a trading and business services company. Contribution included frontend implementation, responsive design, and meeting client specifications during my internship.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        note: 'Internship contribution — frontend development and responsiveness.',
        order: 4,
      },
    ]);
    console.log('✅ Projects seeded');
  } else {
    console.log('⏭  Projects already exist — skipping');
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  const skillCount = await SkillGroup.countDocuments();
  if (skillCount === 0) {
    await SkillGroup.insertMany([
      {
        label: 'Frontend',
        skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Redux', 'Zustand'],
        order: 0,
      },
      {
        label: 'Backend',
        skills: ['Node.js', 'Express.js', 'REST APIs', 'Authentication', 'Middleware'],
        order: 1,
      },
      {
        label: 'Databases',
        skills: ['MongoDB', 'Mongoose', 'SQL'],
        order: 2,
      },
      {
        label: 'Tools & Workflow',
        skills: ['Git', 'GitHub', 'Testing', 'Debugging', 'Deployment', 'CI/CD'],
        order: 3,
      },
    ]);
    console.log('✅ Skills seeded');
  } else {
    console.log('⏭  Skills already exist — skipping');
  }

  // ── Experience ─────────────────────────────────────────────────────────────
  const expCount = await Experience.countDocuments();
  if (expCount === 0) {
    await Experience.insertMany([
      {
        role: 'Web Developer Intern',
        company: 'Client Web Solutions',
        type: 'Internship',
        period: 'Recent',
        description:
          'Contributed to the development of real-world client websites as part of an internship engagement, working on frontend implementation, UI engineering, and responsive design across multiple active projects.',
        contributions: [
          'Developed and maintained client websites including Salamatek Medical Center, Sameera Healthcare, and Dazz Tradlink',
          'Implemented responsive layouts and translated design requirements into clean, performant web pages',
          'Collaborated on frontend development for the Dopeminex digital marketing website',
          'Worked within a professional development environment, adhering to client specifications and project timelines',
        ],
        order: 0,
      },
      {
        role: 'Full Stack Developer',
        company: 'Independent & SaaS Development',
        type: 'Projects',
        period: 'Ongoing',
        description:
          'Independently designing and building end-to-end full-stack web applications, exploring SaaS product development and e-commerce from initial architecture through API design, database schemas, authentication, and deployment.',
        contributions: [
          'Built Sprintly, a full-stack SaaS project management platform using the MERN stack with JWT authentication and role-based access',
          'Developed Lush Scents, an e-commerce platform with product catalogs, shopping cart flow, and responsive checkout UX',
          'Engineered RESTful backend APIs with Node.js and Express.js, integrated with MongoDB databases',
          'Managed cloud deployment, environment configuration, and continuous production monitoring',
        ],
        order: 1,
      },
    ]);
    console.log('✅ Experience seeded');
  } else {
    console.log('⏭  Experience already exists — skipping');
  }

  // ── About ──────────────────────────────────────────────────────────────────
  const aboutCount = await About.countDocuments();
  if (aboutCount === 0) {
    await About.create({
      lead: "I'm a full-stack developer who bridges the gap between clean product design and reliable backend systems.",
      paragraphs: [
        "From architecting applications from scratch to testing, deploying, and maintaining them in production, I genuinely enjoy working across the entire development lifecycle. I have contributed to real-world client websites during my internship and built full-stack SaaS projects that tackle real operational flows.",
        "I am particularly drawn to SaaS platforms and helping founders turn early ideas into scalable, functional digital products. The engineering puzzles behind product development — data modeling, authentication mechanics, state synchronization, and snappy user interfaces — are what make this work exciting.",
      ],
      status: 'Based in Kerala, India · Open to Remote & Relocation',
      interests: [
        'Full Stack Developer roles',
        'MERN Stack engineering',
        'SaaS product development',
        'React & Node.js positions',
        'RESTful API architecture',
        'Collaborative dev teams',
      ],
      principles: [
        {
          number: '01',
          title: 'Product-First Engineering',
          desc: 'Writing code that solves actual user problems and drives business value, not just implementing specs in isolation.',
        },
        {
          number: '02',
          title: 'End-to-End Ownership',
          desc: 'From data modeling and authentication to UI micro-interactions, responsive design, and production deployment.',
        },
        {
          number: '03',
          title: 'Maintainable & Scalable',
          desc: 'Clean directory structures, typed components, reusable patterns, and clear API boundaries that teams can grow with.',
        },
      ],
    });
    console.log('✅ About seeded');
  } else {
    console.log('⏭  About already exists — skipping');
  }

  await mongoose.disconnect();
  console.log('\n🎉 Seed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
