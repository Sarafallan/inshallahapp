var FIREBASE_ACCOUNT = process.env.FIREBASE_ACCOUNT || 'blazing-torch-7074';

module.exports = {
  FIREBASE_SECRET: process.env.FIREBASESECRET,
  FIREBASE_ACCOUNT: FIREBASE_ACCOUNT,
  FIREBASE_DOMAIN: 'https://' + FIREBASE_ACCOUNT + '.firebaseio.com'
};
