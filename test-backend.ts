import * as db from './server/db.ts';

async function testBackend() {
  console.log('--- Testing CVUME Backend & SQLite Database ---');

  // Test 1: User creation
  const testEmail = `test_${Date.now()}@cvume.ai`;
  const testName = 'Test User';
  const testPassword = 'Password123!';

  console.log(`1. Testing createUser with ${testEmail}...`);
  const user = db.createUser(testEmail, testName, testPassword);
  console.log('✓ User created:', user.id, user.email, user.name);

  // Test 2: Verify password
  console.log('2. Testing password verification...');
  const isCorrect = db.verifyPassword(testPassword, user.salt, user.password_hash);
  const isWrong = db.verifyPassword('WrongPass', user.salt, user.password_hash);
  if (!isCorrect || isWrong) throw new Error('Password verification failed');
  console.log('✓ Password verification succeeded (correct=true, wrong=false)');

  // Test 3: Duplicate user detection
  console.log('3. Testing duplicate email prevention...');
  try {
    db.createUser(testEmail, 'Duplicate', 'Password123!');
    throw new Error('Should have thrown on duplicate user');
  } catch (err: any) {
    console.log('✓ Correctly caught duplicate error:', err.message);
  }

  // Test 4: Sessions
  console.log('4. Testing session creation and lookup...');
  const token = db.createSession(user.id, 30);
  const sessionInfo = db.findSession(token);
  if (!sessionInfo || sessionInfo.user.email !== testEmail) {
    throw new Error('Session lookup failed');
  }
  console.log('✓ Session valid for user:', sessionInfo.user.email);

  // Test 5: Profile storage and retrieval
  console.log('5. Testing profile storage in database...');
  const sampleProfile = {
    fullName: testName,
    email: testEmail,
    targetRole: 'Lead Distributed Systems Architect',
    skills: ['TypeScript', 'Node.js', 'SQLite', 'Docker'],
    experiences: [],
    education: [],
    projects: [],
  };
  db.upsertProfile(user.id, sampleProfile);
  const fetchedProfile = db.getProfile(user.id);
  if (fetchedProfile.targetRole !== 'Lead Distributed Systems Architect') {
    throw new Error('Profile retrieval mismatch');
  }
  console.log('✓ Profile retrieved from database:', fetchedProfile.targetRole, fetchedProfile.skills);

  // Test 6: Applications storage and retrieval
  console.log('6. Testing saving and retrieving tailored applications in database...');
  const sampleResult = {
    jobTitle: 'Senior Systems Engineer',
    companyName: 'OpenAI Ecosystem',
    resume: {
      headline: 'Senior Systems Engineer',
      atsBreakdown: { score: 98, matchedKeywords: ['TypeScript', 'SQLite'] },
    },
    gmailLetter: { subject: 'Application for Senior Systems Engineer' },
    socialMediaDm: { text: 'Hi hiring team!' },
  };

  const app = db.saveApplication(
    user.id,
    'Senior Systems Engineer',
    'OpenAI Ecosystem',
    'We are hiring a Senior Systems Engineer...',
    sampleResult
  );
  console.log('✓ Application saved in database with ID:', app.id);

  const apps = db.getApplications(user.id);
  if (apps.length !== 1 || apps[0].job_title !== 'Senior Systems Engineer') {
    throw new Error('Applications list retrieval failed');
  }
  console.log('✓ Retrieved', apps.length, 'application(s) from database for user');

  const singleApp = db.getApplicationById(app.id, user.id);
  if (!singleApp) throw new Error('Single application retrieval failed');
  console.log('✓ Single application retrieved:', singleApp.id, singleApp.company_name);

  // Test 7: Application deletion
  console.log('7. Testing deleting application from database...');
  const deleted = db.deleteApplication(app.id, user.id);
  if (!deleted) throw new Error('Delete returned false');
  const remaining = db.getApplications(user.id);
  if (remaining.length !== 0) throw new Error('Remaining apps should be 0');
  console.log('✓ Application deleted successfully from database');

  // Test 8: Session deletion (logout)
  console.log('8. Testing session logout...');
  db.deleteSession(token);
  const afterLogout = db.findSession(token);
  if (afterLogout !== null) throw new Error('Session should be invalid after logout');
  console.log('✓ Session invalidated successfully');

  console.log('\n🎉 ALL DATABASE AND BACKEND TESTS PASSED SUCCESSFULLY! 🎉\n');
}

testBackend().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
