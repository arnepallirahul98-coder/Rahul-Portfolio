# Assets Directory

Place your images, fonts, and other static assets here.

## Profile Image
To use your own profile image:
1. Place it in this directory (e.g., `profile.jpg`)
2. Update `src/data/siteData.js` to import and reference it:
   ```js
   import profileImg from '../assets/profile.jpg';
   // then set: profileImage: profileImg,
   ```
