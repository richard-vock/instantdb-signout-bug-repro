import { init, tx, id } from '@instantdb/admin';

const APP_ID = 'a3e69c07-8647-4e6f-8932-23256a6cf694';

const db = init({
  appId: APP_ID,
  adminToken: 'correct admin code goes here',
});

(async () => {
  try {
    await db.auth.signOut('email you signed in with goes here');
    console.log('Successfully signed out');
  } catch (err) {
    console.error('Sign out failed:', err.message);
  }
})();
