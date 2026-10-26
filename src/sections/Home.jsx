/* ============================================================
   Home.jsx — Hero / Home Section
   ============================================================
   Scroll Orchestration:
     - Desktop / Laptop / Large Displays:
         1. Initial: Name ("Rahul Arnipalli") & Designation ("Mechanical Engineer") centered.
         2. Scroll: Name shrinks and moves UP. Image fades in, moves DOWNWARDS (+40px)
            & RIGHTWARDS (+22vw), growing to 1.5x.
         3. Intro bio types out on the left side with VoicePlayer.
         -> Perfect side-by-side layout, zero changes.

     - Mobile (< 768px):
         1. Initial: Name & Designation centered, full prominence.
         2. Scroll Down: Name shrinks and moves up. Profile Image fades in
            alone in the center (no overlap with bio).
         3. Scroll Down Further: Profile Image smoothly exits, and Intro
            About card fades in and triggers the live typing animation!
         -> 3 clean sequential phases with ZERO overlap.
   ============================================================ */

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import siteData from '../data/siteData';
import ProfileImage from '../components/ProfileImage';
import Intro from './Intro';

function Home() {
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  });

  // ---- SCROLL-LINKED ANIMATIONS ----

  // 1. Initial Name & Designation
  const heroTextOpacity = useTransform(scrollYProgress, (v) => {
    const end = isMobile ? 0.22 : 0.35;
    if (v <= 0) return 1;
    if (v >= end) return 0;
    return 1 - v / end;
  });

  const heroTextScale = useTransform(scrollYProgress, (v) => {
    const end = isMobile ? 0.22 : 0.35;
    const progress = Math.min(v / end, 1);
    return 1 - progress * 0.3; // 1.0 -> 0.7
  });

  const heroTextY = useTransform(scrollYProgress, (v) => {
    const end = isMobile ? 0.22 : 0.35;
    const progress = Math.min(v / end, 1);
    return progress * (isMobile ? -110 : -150); // Moves UPWARDS
  });

  // 2. Profile Image Opacity:
  // Desktop: Fades in 0.1 -> 0.35 and stays at 1.0 on right side
  // Mobile: Fades in 0.20 -> 0.32, stays visible 0.32 -> 0.48, fades out 0.48 -> 0.58 so it NEVER overlays About
  const imageOpacity = useTransform(scrollYProgress, (v) => {
    if (!isMobile) {
      if (v < 0.1) return 0;
      if (v > 0.35) return 1;
      return (v - 0.1) / 0.25;
    } else {
      if (v < 0.20) return 0;
      if (v < 0.32) return (v - 0.20) / 0.12;
      if (v <= 0.48) return 1;
      if (v < 0.58) return 1 - (v - 0.48) / 0.10;
      return 0;
    }
  });

  // 3. Profile Image Movement (X):
  // Desktop: Moves to the right side (0 -> 22vw)
  // Mobile: Stays cleanly centered (0px)
  const circleTranslateX = useTransform(scrollYProgress, (v) => {
    if (isMobile) return 0;
    const progress = Math.min(v / 0.6, 1);
    return progress * window.innerWidth * 0.22;
  });

  // 4. Profile Image Movement (Y):
  // Desktop: Moves downwards (+40px)
  // Mobile: Stays centered while visible, moves slightly upwards on exit
  const circleTranslateY = useTransform(scrollYProgress, (v) => {
    if (!isMobile) {
      const progress = Math.min(v / 0.6, 1);
      return progress * 40;
    } else {
      if (v <= 0.48) return 0;
      const exitProgress = Math.min((v - 0.48) / 0.10, 1);
      return exitProgress * -40;
    }
  });

  // 5. Profile Image Scaling:
  // Desktop: Scales 1.0 -> 1.5x
  // Mobile: Subtle scale (1.0 -> 1.1) while visible, shrinks on exit
  const circleScale = useTransform(scrollYProgress, (v) => {
    if (!isMobile) {
      const progress = Math.min(v / 0.6, 1);
      return 1 + progress * 0.5;
    } else {
      if (v <= 0.48) {
        const inProgress = Math.min(Math.max((v - 0.20) / 0.25, 0), 1);
        return 1 + inProgress * 0.1;
      }
      const exitProgress = Math.min((v - 0.48) / 0.10, 1);
      return 1.1 - exitProgress * 0.2;
    }
  });

  return (
    <section
      ref={scrollRef}
      id="home"
      className="relative w-full bg-black"
      style={{ height: isMobile ? '240vh' : '200vh' }}
    >
      {/* Sticky Viewport Container using 100dvh for mobile address bar safety */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        
        {/* INITIAL HERO CONTENT: Name + Designation (Shrinks out & moves UPWARDS) */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center z-10 pointer-events-none mb-40 sm:mb-48 md:mb-56"
          style={{
            opacity: heroTextOpacity,
            scale: heroTextScale,
            y: heroTextY,
          }}
        >
          {/* Name */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-white leading-none text-center select-none whitespace-nowrap">
            {siteData.firstName}
          </h1>

          {/* Designation */}
          <p className="text-xl sm:text-2xl md:text-3xl text-neutral-400 font-light tracking-widest uppercase text-center">
            {siteData.tagline}
          </p>
        </motion.div>

        {/* PROFILE IMAGE:
            Desktop: Appears and glides to the right side
            Mobile: Appears in center alone during scroll stage 2
        */}
        <motion.div
          className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 shrink-0 z-20"
          style={{
            opacity: imageOpacity,
            x: circleTranslateX,
            y: circleTranslateY,
            scale: circleScale,
          }}
        >
          <ProfileImage className="w-full h-full" />
        </motion.div>

        {/* INTRO SECTION: Typewriter Bio + VoicePlayer
            Desktop: Types out on the left side
            Mobile: Appears after profile image during scroll stage 3
        */}
        <Intro scrollYProgress={scrollYProgress} isMobile={isMobile} />
      </div>
    </section>
  );
}

export default Home;
