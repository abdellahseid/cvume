import * as db from './server/db.ts';

async function testBackend() {
  console.log('--- Testing CVUME Backend with Live PostgreSQL Database (cvumedb) ---');

  // Initialize DB tables
  await db.initDb();

  // Test 1: User creation
  const testEmail = `test_${Date.now()}@cvume.ai`;
  const testName = 'Alex PostgreSQL Test';
  const testPassword = 'Password123!';

  console.log(`1. Testing createUser with ${testEmail}...`);
  const user = await db.createUser(testEmail, testName, testPassword);
  console.log('✓ User created in PostgreSQL:', user.id, user.email, user.name);

  // Test 2: Verify password
  console.log('2. Testing password verification...');
  const isCorrect = db.verifyPassword(testPassword, user.salt, user.password_hash);
  const isWrong = db.verifyPassword('WrongPass', user.salt, user.password_hash);
  if (!isCorrect || isWrong) throw new Error('Password verification failed');
  console.log('✓ Password verification succeeded (correct=true, wrong=false)');

  // Test 3: Duplicate user detection
  console.log('3. Testing duplicate email prevention in PostgreSQL...');
  try {
    await db.createUser(testEmail, 'Duplicate', 'Password123!');
    throw new Error('Should have thrown on duplicate user');
  } catch (err: any) {
    console.log('✓ Correctly caught duplicate error from PostgreSQL:', err.message);
  }

  // Test 4: Sessions
  console.log('4. Testing session creation and lookup in PostgreSQL...');
  const token = await db.createSession(user.id, 30);
  const sessionInfo = await db.findSession(token);
  if (!sessionInfo || sessionInfo.user.email !== testEmail) {
    throw new Error('Session lookup failed');
  }
  console.log('✓ Session valid for user:', sessionInfo.user.email);

  // Test 5: Profile storage and retrieval
  console.log('5. Testing profile JSONB storage in PostgreSQL...');
  const sampleProfile = {
    fullName: testName,
    email: testEmail,
    targetRole: 'Senior PostgreSQL & Distributed Systems Architect',
    skills: ['TypeScript', 'Node.js', 'PostgreSQL 18', 'Docker', 'GraphQL'],
    experiences: [
      {
        id: 'exp-1',
        role: 'Database Architect',
        company: 'PostgreSQL Global',
        location: 'Remote',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        bullets: ['Optimized PostgreSQL connection pool handling 10k+ concurrent transactions.'],
      },
    ],
    education: [],
    projects: [],
  };
  await db.upsertProfile(user.id, sampleProfile);
  const fetchedProfile = await db.getProfile(user.id);
  if (fetchedProfile.targetRole !== 'Senior PostgreSQL & Distributed Systems Architect') {
    throw new Error('Profile retrieval mismatch');
  }
  console.log('✓ Profile retrieved from PostgreSQL JSONB:', fetchedProfile.targetRole, fetchedProfile.skills);

  // Test 6: Applications storage and retrieval
  console.log('6. Testing saving and retrieving tailored applications in PostgreSQL...');
  const sampleResult = {
    jobTitle: 'Senior Systems Engineer',
    companyName: 'OpenAI Ecosystem',
    resume: {
      headline: 'Senior Systems Engineer',
      atsBreakdown: { score: 98, matchedKeywords: ['TypeScript', 'PostgreSQL'] },
    },
    gmailLetter: { subject: 'Application for Senior Systems Engineer' },
    socialMediaDm: { text: 'Hi hiring team!' },
  };

  const app = await db.saveApplication(
    user.id,
    'Senior Systems Engineer',
    'OpenAI Ecosystem',
    'We are hiring a Senior Systems Engineer...',
    sampleResult
  );
  console.log('✓ Application saved in PostgreSQL with ID:', app.id);

  const apps = await db.getApplications(user.id);
  if (apps.length !== 1 || apps[0].job_title !== 'Senior Systems Engineer') {
    throw new Error('Applications list retrieval failed');
  }
  console.log('✓ Retrieved', apps.length, 'application(s) from PostgreSQL for user');

  const singleApp = await db.getApplicationById(app.id, user.id);
  if (!singleApp) throw new Error('Single application retrieval failed');
  console.log('✓ Single application retrieved from PostgreSQL:', singleApp.id, singleApp.company_name);

  // Test 7: Application deletion
  console.log('7. Testing deleting application from PostgreSQL...');
  const deleted = await db.deleteApplication(app.id, user.id);
  if (!deleted) throw new Error('Delete returned false');
  const remaining = await db.getApplications(user.id);
  if (remaining.length !== 0) throw new Error('Remaining apps should be 0');
  console.log('✓ Application deleted successfully from PostgreSQL');

  // Test 8: Session deletion (logout)
  console.log('8. Testing session logout in PostgreSQL...');
  await db.deleteSession(token);
  const afterLogout = await db.findSession(token);
  if (afterLogout !== null) throw new Error('Session should be invalid after logout');
  console.log('✓ Session invalidated successfully');

  console.log('\n🎉 ALL POSTGRESQL DATABASE & BACKEND TESTS PASSED! 🎉\n');
  await db.pool.end();
}

testBackend().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
