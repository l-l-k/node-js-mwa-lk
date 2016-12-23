/* Global Variables */

/* navigation support */
// Registration and  Login
var elSignup = document.getElementById('signup');
var elLogin = document.getElementById('login');
var elUserData = document.getElementById('userdata');
var elAccountSection = document.getElementById('account');
// Administration
var elAddUser = document.getElementById('addUser');
var elRemoveUser = document.getElementById('removeUser');
var elCleanupTweets = document.getElementById('cleanupTweets');
var elStatistics = document.getElementById('statistics');
var elAdminSection = document.getElementById('administration');
// Tweets
var elTweetSection = document.getElementById('tweets');
var elEmptyPageSection = document.getElementById('emptyPage')

//=============================================================
// disable navigation to admin-tools
var elAdminLink = document.getElementById('adminLink');
//elAdminLink.className = 'hidden';

// Hide Sections
elAccountSection.className = 'hidden';
elEmptyPageSection.className = 'notHidden';
elTweetSection.className = 'hidden';
elAdminSection.className = 'hidden';

// Hide all fieldsets in section account (Registration and  Login)
elSignup.className = 'hidden';
elLogin.className = 'hidden';
elUserData.className = 'hidden';

// Hide all fieldsets in section administration
elAddUser.className = 'hidden';
elRemoveUser.className = 'hidden';
elCleanupTweets.className = 'hidden';
elStatistics.className = 'hidden';
