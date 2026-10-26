/* ============================================================
   Education.jsx — Vertical Timeline Education Section
   ============================================================
   Responsive Behavior:
     - Desktop: Hover or click to reveal detail cards.
     - Mobile: Automatically reveals each detail card sequentially
       as you scroll down, mimicking a cursor moving down the timeline.
   ============================================================ */

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import educationData from '../data/educationData';

function TimelineNode({ item, isMobile, index }) {
  const [isManualOpen, setIsManualOpen] = useState(null);
  const nodeRef = useRef(null);

  const isInView = useInView(nodeRef, { amount: 0.25, once: false });

  // Reset manual interaction state when scrolled out of view so it can replay cleanly
  useEffect(() => {
    if (!isInView) {
      setIsManualOpen(null);
    }
  }, [isInView]);

  // On mobile: automatically reveals when scrolled into view (like a cursor moving down)
  // On desktop: controlled strictly by hover / click
  const isCardVisible = isMobile
    ? (isManualOpen !== null ? isManualOpen : isInView)
    : (isManualOpen ?? false);

  return (
    <div
      ref={nodeRef}
      className="relative flex items-start gap-4 sm:gap-8 min-h-[140px] sm:min-h-[200px]"
      onMouseEnter={() => {
        if (!isMobile) setIsManualOpen(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setIsManualOpen(false);
      }}
      onClick={() => {
        setIsManualOpen((prev) => (prev === null ? !isInView : !prev));
      }}
    >
      {/* Node Dot on the Vertical Line */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black border-2 border-accent flex items-center justify-center shrink-0 mt-2 shadow-[0_0_12px_rgba(113,128,150,0.5)]"
      >
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent" />
      </motion.div>

      {/* Main Label and Detail Container */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: isMobile ? 0.05 : 0.1 }}
        className="flex-1 cursor-pointer"
      >
        {/* Stage Level Name */}
        <div className="inline-block">
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight hover:text-accent transition-colors duration-300">
            {item.level}
          </h3>
          {!isMobile && (
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-medium mt-1">
              Hover or tap to view details
            </p>
          )}
        </div>

        {/* Revealed Detail Card */}
        <AnimatePresence>
          {isCardVisible && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{
                duration: 0.35,
                ease: 'easeOut',
                delay: isMobile ? 0.12 : 0,
              }}
              className="mt-3 sm:mt-4 max-w-xl rounded-2xl bg-neutral-900/95 border border-neutral-800 p-4 sm:p-6 shadow-2xl backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-neutral-800">
                <h4 className="text-base sm:text-xl font-bold text-white leading-snug">
                  {item.institution}
                </h4>
                <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-accent tracking-wider w-fit shrink-0">
                  {item.duration}
                </span>
              </div>

              <p className="text-xs sm:text-base font-medium text-neutral-300 leading-relaxed mb-2">
                {item.detail}
              </p>

              {item.extra && (
                <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-2 mt-2">
                  {item.extra}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Education() {
  const sectionRef = useRef(null);
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
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="w-full bg-black py-12 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-10 sm:mb-16">
          Education
        </h2>

        {/* Timeline Container */}
        <div className="relative pl-2 sm:pl-8">
          {/* Static Line Track */}
          <div className="absolute left-[11px] sm:left-[27px] top-4 bottom-8 w-0.5 bg-neutral-900" />

          {/* Animated Line */}
          <motion.div
            style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
            className="absolute left-[11px] sm:left-[27px] top-4 bottom-8 w-0.5 bg-accent"
          />

          {/* Nodes */}
          <div className="flex flex-col gap-8 sm:gap-16">
            {educationData.map((item, index) => (
              <TimelineNode key={item.id} item={item} isMobile={isMobile} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
