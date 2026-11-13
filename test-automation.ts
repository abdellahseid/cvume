import {
  initDb,
  createUser,
  createSession,
  getProfile,
  getDiscoveredJobs,
  getApplications,
  getAutomationSettings,
  saveAutomationSettings,
  saveApplication,
  updateApplicationStatus,
} from './server/db.ts';

async function runAutomationTests() {
  console.log('--- Testing CVUME Auto-Pilot & Sourcing Engine ---');
  await initDb();

  const testEmail = `auto_test_${Date.now()}@cvume.ai`;
  const user = await createUser(testEmail, 'Alex Automation Test', 'Password123!');
  console.log('✓ Test user created:', user.email);

  const token = await createSession(user.id);
  console.log('✓ Session created for test user');

  // 1. Test Discovered Jobs fetching
  const jobs = await getDiscoveredJobs(20);
  console.log(`✓ Fetched ${jobs.length} discovered jobs from PostgreSQL`);
  if (jobs.length === 0) {
    throw new Error('Expected seed jobs in discovered_jobs table');
  }

  const firstJob = jobs[0];
  console.log(`  Sample job: "${firstJob.title}" at "${firstJob.company}" [${firstJob.source.toUpperCase()}]`);

  // 2. Test saving automation application with modern fields
  const savedApp = await saveApplication(
    user.id,
    firstJob.title,
    firstJob.company,
    firstJob.description,
    { resume: { headline: 'Test Headline', summary: 'Test Summary' } },
    undefined,
    'applied',
    firstJob.source,
    94,
    firstJob.source_url,
    [
      { step: '1. Scraped', timestamp: new Date().toISOString(), status: 'success', message: 'Job discovered' },
      { step: '2. Auto-Applied', timestamp: new Date().toISOString(), status: 'success', message: 'Submitted package' },
    ]
  );

  console.log('✓ Saved auto-pilot application in PostgreSQL with ID:', savedApp.id);
  console.log(`  Status: ${savedApp.status}, Platform: ${savedApp.platform}, Match Score: ${savedApp.match_score}%`);

  // 3. Test updating status in pipeline
  const updated = await updateApplicationStatus(savedApp.id, user.id, 'interviewing');
  if (updated?.status !== 'interviewing') {
    throw new Error('Failed to update status to interviewing');
  }
  console.log('✓ Successfully progressed application status to "interviewing"');

  // 4. Test automation settings
  const settings = await getAutomationSettings(user.id);
  console.log(`✓ Default automation settings loaded: Min Match = ${settings.min_match_score}%, Daily Limit = ${settings.daily_limit}`);

  const updatedSettings = await saveAutomationSettings(user.id, {
    min_match_score: 85,
    daily_limit: 20,
    telegram_handle: '@alex_test_recruiter',
  });
  if (updatedSettings.min_match_score !== 85 || updatedSettings.telegram_handle !== '@alex_test_recruiter') {
    throw new Error('Failed to update automation settings');
  }
  console.log('✓ Custom automation settings saved & verified in PostgreSQL');

  console.log('\n🎉 ALL AUTOMATION DATABASE & PIPELINE TESTS PASSED! 🎉');
  process.exit(0);
}

runAutomationTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

