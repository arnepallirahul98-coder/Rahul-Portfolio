/* ============================================================
   Home.jsx — Hero / Home Section
   ============================================================
   Scroll Orchestration:
     1. Initial View (Scroll = 0%):
        - ONLY Name ("Rahul Arnipalli") & Designation ("Mechanical Engineer") visible.
        - Profile Image is COMPLETELY HIDDEN (opacity = 0) at the starting point.

     2. Scroll Down Progression (Scroll > 0%):
        - Name & Designation shrink out (scale 1.0 -> 0.7) and move UPWARDS (y: 0 -> -150px) while fading.
        - Profile Image slowly & smoothly FADES IN (opacity 0 -> 1 over 10% -> 35% scroll),
          moves DOWNWARDS (+40px) & RIGHTWARDS (+22vw), and grows bigger into place on the right side.
        - Intro bio text types out on the left side with VoicePlayer.
   ============================================================ */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import siteData from '../data/siteData';
import ProfileImage from '../components/ProfileImage';
import Intro from './Intro';

function Home() {
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  });

  // ---- SCROLL-LINKED ANIMATIONS ----

  // 1. Initial Name & Designation: Shrinks out (scale 1.0 -> 0.7), moves UPWARDS (y: 0 -> -150px), and fades out (opacity 1.0 -> 0)
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const heroTextScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.7]);
  const heroTextY = useTransform(scrollYProgress, (v) => {
    const progress = Math.min(v / 0.35, 1);
    return progress * -150; // Moves UPWARDS
  });

  // 2. Profile Image Opacity:
  // Starts COMPLETELY HIDDEN (0.0 opacity) at scroll 0%!
  // Fades in slowly & smoothly as you scroll down (0.0 at 10% scroll -> 1.0 at 35% scroll)
  const imageOpacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.1) return 0;
    if (v > 0.35) return 1;
    return (v - 0.1) / 0.25;
  });

  // 3. Profile Image Movement & Scaling:
  // Moves DOWNWARDS (+40px) AND RIGHTWARDS (+22vw) while growing bigger (scale 1.0 -> 1.5x)
  const circleTranslateX = useTransform(scrollYProgress, (v) => {
    const progress = Math.min(v / 0.6, 1);
    return progress * window.innerWidth * 0.22; // Moves RIGHTWARDS
  });

  const circleTranslateY = useTransform(scrollYProgress, (v) => {
    const progress = Math.min(v / 0.6, 1);
    return progress * 40; // Moves DOWNWARDS (+40px)
  });

  const circleScale = useTransform(scrollYProgress, (v) => {
    const progress = Math.min(v / 0.6, 1);
    return 1 + progress * 0.5; // Grows bigger (1.0 -> 1.5x)
  });

  return (
    <section
      ref={scrollRef}
      id="home"
      className="relative w-full bg-black"
      style={{ height: '200vh' }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
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

        {/* PROFILE IMAGE: HIDDEN AT START (opacity 0), slowly fades in, moves DOWNWARDS & RIGHTWARDS as you scroll */}
        <motion.div
          className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 shrink-0 z-20"
          style={{
            opacity: imageOpacity,
            x: circleTranslateX,
            y: circleTranslateY,
            scale: circleScale,
          }}
        >
          <ProfileImage className="w-full h-full" />
        </motion.div>

        {/* INTRO SECTION: Typewriter Bio + VoicePlayer typing on the LEFT side */}
        <Intro scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}

export default Home;
