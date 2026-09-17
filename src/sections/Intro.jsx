/* ============================================================
   Intro.jsx — Bio / Introduction Section
   ============================================================
   Features:
     - Typewriter text animation (letter-by-letter reveal)
     - Re-triggers cleanly whenever scrolled into view
     - Includes VoicePlayer audio component below bio
     - Smooth scroll-linked fade in
   ============================================================ */

import { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useInView } from 'framer-motion';
import VoicePlayer from '../components/VoicePlayer';

const BIO_TEXT =
  "I'm Rahul Arnipalli, a Mechanical Engineering graduate from GMR Institute of Technology (GMRIT), with a minor in AI and Data Science, and a Diploma from MRAGR Polytechnic before that. I specialize in CAD design (SolidWorks, AutoCAD, IronCAD), GD&T, and CNC operation, with a growing interest in data-driven process optimization.\n\nI've interned at Vizag Steel Plant (RINL) and the Centre of Excellence in Maritime and Shipbuilding (CEMS), and built projects ranging from a machining performance predictive model using Taguchi DOE and Python ML, to an Arduino-based autonomous marine vehicle, to a fabricated vegetable cleaning machine.";

const TYPING_SPEED_MS = 15;

function Intro({ scrollYProgress }) {
  const [charCount, setCharCount] = useState(0);
  const containerRef = useRef(null);

  const isInView = useInView(containerRef, { amount: 0.3, once: false });

  // Fades in smoothly as user scrolls past 20% mark
  const introOpacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.2) return 0;
    if (v > 0.45) return 1;
    return (v - 0.2) / 0.25;
  });

  useEffect(() => {
    let interval = null;

    if (isInView) {
      setCharCount(0);
      interval = setInterval(() => {
        setCharCount((prev) => {
          if (prev >= BIO_TEXT.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, TYPING_SPEED_MS);
    } else {
      setCharCount(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInView]);

  const isTypingComplete = charCount >= BIO_TEXT.length;
  const visibleText = BIO_TEXT.slice(0, charCount);

  return (
    <motion.div
      ref={containerRef}
      className="absolute left-0 top-0 h-full w-full md:w-1/2 flex items-center justify-center md:justify-start z-30 pointer-events-auto px-6 sm:px-12 md:pl-16 lg:pl-20"
      style={{ opacity: introOpacity }}
    >
      <div className="w-full max-w-md lg:max-w-xl bg-black/80 md:bg-black/60 p-6 md:p-8 rounded-2xl backdrop-blur-md border border-neutral-800/80 shadow-2xl">
        {/* Bio text with typewriter effect */}
        <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-light mb-6 md:mb-8 text-center md:text-left whitespace-pre-line">
          {visibleText}
          {!isTypingComplete && charCount > 0 && (
            <span className="inline-block ml-0.5 animate-pulse text-accent font-normal">
              |
            </span>
          )}
        </p>

        {/* Voice player */}
        <div className="flex justify-center md:justify-start">
          <VoicePlayer />
        </div>
      </div>
    </motion.div>
  );
}

export default Intro;
