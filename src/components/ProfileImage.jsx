/* ============================================================
   ProfileImage.jsx — Profile Image Component
   ============================================================
   Displays the user's real profile photo inside the circular container.
   Features:
     - Imported from src/assets/images/profile.jpg
     - object-fit: cover with object-position: center 20% to keep face framed
     - Fallback icon only on broken image load
   ============================================================ */

import { useState } from 'react';
import { User } from 'lucide-react';
import profileImg from '../assets/images/profile.jpg';
import siteData from '../data/siteData';

function ProfileImage({ className = '' }) {
  const [hasError, setHasError] = useState(false);
  const { firstName } = siteData;

  if (hasError) {
    return (
      <div
        className={`rounded-full flex items-center justify-center bg-neutral-900 border border-neutral-800 ${className}`}
      >
        <User className="w-1/3 h-1/3 text-neutral-600" strokeWidth={1} />
      </div>
    );
  }

  return (
    <div className={`rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 ${className}`}>
      <img
        src={profileImg}
        alt={`${firstName}'s profile`}
        className="w-full h-full object-cover rounded-full select-none"
        style={{ objectPosition: 'center 20%' }}
        draggable={false}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default ProfileImage;
