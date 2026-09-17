/* ============================================================
   Projects.jsx — Interactive Projects Section
   ============================================================
   Sizing Fixes:
     - All lightbox modals dynamically adapt their width/height
       to fit the content's natural aspect ratio without forcing wide empty dark bars.
     - Technical drawing sheets & standalone drawings scale to fit up to 80vh max-height.
   ============================================================ */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { PenTool, Box, Layers, X, Play, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import projectsData from '../data/projectsData';

const TABS = [
  {
    id: 'drawings',
    label: 'Drawings',
    icon: PenTool,
    dataKey: 'drawings',
  },
  {
    id: '3d-modeling',
    label: '3D Modeling',
    icon: Box,
    dataKey: 'threeDModels',
  },
  {
    id: 'sheet-metal',
    label: 'Sheet Metal',
    icon: Layers,
    dataKey: 'sheetMetal',
  },
];

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  // Fallback for short links with query params
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }
  } catch (e) {
    // Ignore invalid URLs
  }
  return null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25 },
  },
  exit: (direction) => ({
    x: direction < 0 ? 120 : -120,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
};

function ProjectCard({ item, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoId = item.type === 'video' ? getYouTubeId(item.youtubeUrl) : null;
  const thumbnailUrl =
    item.type === 'video' && videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : item.thumbnail;

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
      className="group relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 cursor-pointer shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-black relative">
        <AnimatePresence mode="wait">
          {item.type === 'video' && isHovered && videoId ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full pointer-events-none"
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`}
                title={item.title}
                className="w-full h-full border-0 scale-125"
                allow="autoplay; encrypted-media"
              />
            </motion.div>
          ) : (
            <motion.div
              key="thumbnail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              <img
                src={thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-black/60 border border-neutral-600 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 ml-0.5 fill-white" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-gradient-to-t from-neutral-950 to-neutral-900/90 border-t border-neutral-800/50 flex items-center justify-between">
        <h4 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors duration-300 line-clamp-1">
          {item.title}
        </h4>
        {item.type === 'video' && (
          <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
            Video
          </span>
        )}
      </div>
    </motion.div>
  );
}

function Projects() {
  const [activeTab, setActiveTab] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Navigation Modal State: 'assembly' | 'partView' | 'drawingView'
  const [modalStep, setModalStep] = useState('assembly');
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const sectionRef = useRef(null);
  const expandedCardRef = useRef(null);

  const isSectionInView = useInView(sectionRef, { amount: 0.2, once: false });

  useEffect(() => {
    if (!isSectionInView) {
      setActiveTab(null);
    }
  }, [isSectionInView]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        activeTab !== null &&
        expandedCardRef.current &&
        !expandedCardRef.current.contains(event.target) &&
        !selectedItem
      ) {
        setActiveTab(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeTab, selectedItem]);

  const activeTabObj = TABS.find((t) => t.id === activeTab);
  const inactiveTabs = TABS.filter((t) => t.id !== activeTab);
  const parts = selectedItem?.parts || [];
  const currentPart = parts[activePartIndex] || null;

  const handleNextPart = () => {
    if (parts.length === 0) return;
    setSlideDirection(1);
    setActivePartIndex((prev) => (prev + 1) % parts.length);
  };

  const handlePrevPart = () => {
    if (parts.length === 0) return;
    setSlideDirection(-1);
    setActivePartIndex((prev) => (prev - 1 + parts.length) % parts.length);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setModalStep('assembly');
    setActivePartIndex(0);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="w-full bg-black py-12 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-12">
          Projects
        </h2>

        {/* DEFAULT STATE */}
        {activeTab === null && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.div
                  key={tab.id}
                  layout
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative h-64 rounded-2xl p-6 bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-300"
                >
                  <Icon className="w-10 h-10 text-neutral-400 group-hover:text-white" strokeWidth={1.5} />
                  <span className="text-xl font-medium tracking-wide text-white">{tab.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* EXPANDED STATE */}
        {activeTab !== null && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="flex flex-col gap-6"
          >
            {/* 1. EXPANDED TAB */}
            {activeTabObj && (
              <motion.div
                ref={expandedCardRef}
                key={activeTabObj.id}
                layout
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                className="w-full rounded-2xl bg-neutral-900 border border-accent/80 p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <activeTabObj.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                    <h3 className="text-2xl font-semibold tracking-wide text-white">
                      {activeTabObj.label}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(null);
                    }}
                    className="px-3 py-1.5 text-xs uppercase tracking-wider font-medium text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-750 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Close
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`grid-${activeTabObj.id}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {(projectsData[activeTabObj.dataKey] || []).map((item) => (
                      <ProjectCard
                        key={item.id}
                        item={item}
                        onSelect={(selected) => {
                          setSelectedItem(selected);
                          setModalStep('assembly');
                          setActivePartIndex(0);
                        }}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* 2. INACTIVE SHRUNK TABS */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className="grid grid-cols-2 gap-4"
            >
              {inactiveTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.div
                    key={tab.id}
                    layout
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(tab.id);
                    }}
                    className="h-20 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
                    <span className="text-base font-medium text-neutral-300">{tab.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {/* Dynamic Aspect-Ratio Modal Overlay */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl my-auto transition-all duration-300 flex flex-col ${
                  // Dynamic sizing based on active step:
                  // Video/Assembly = max-w-4xl w-full
                  // Drawing or Part Image = inline-flex fitting natural image bounds without excess side bars
                  modalStep === 'assembly'
                    ? 'max-w-4xl w-full'
                    : 'w-auto max-w-[90vw] sm:max-w-[85vw]'
                }`}
              >
                {/* Top Right Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-neutral-700 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Back Button */}
                {modalStep === 'partView' && (
                  <button
                    onClick={() => setModalStep('assembly')}
                    className="absolute top-4 left-4 z-20 px-3 py-2 rounded-full bg-black/60 hover:bg-black/90 border border-neutral-700 flex items-center gap-2 text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Assembly
                  </button>
                )}

                {modalStep === 'drawingView' && (
                  <button
                    onClick={() => setModalStep('partView')}
                    className="absolute top-4 left-4 z-20 px-3 py-2 rounded-full bg-black/60 hover:bg-black/90 border border-neutral-700 flex items-center gap-2 text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Part View
                  </button>
                )}

                <AnimatePresence mode="wait">
                  {/* STEP 3: TECHNICAL DRAWING VIEW (Hugs natural image dimensions up to 80vh height) */}
                  {modalStep === 'drawingView' && currentPart && (
                    <motion.div
                      key="drawingView"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="p-4 sm:p-6 flex flex-col items-center"
                    >
                      <div className="w-full text-center pt-8 md:pt-4 mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                          {currentPart.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400">
                          Dimensioned Technical Drawing Sheet — Component of {selectedItem.title}
                        </p>
                      </div>

                      {/* Image container hugging image bounds without side bars */}
                      <div className="bg-black rounded-xl border border-neutral-800 overflow-hidden flex items-center justify-center p-2">
                        <img
                          src={currentPart.drawingImage}
                          alt={`Drawing sheet for ${currentPart.name}`}
                          className="max-h-[75vh] w-auto h-auto object-contain rounded-lg"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: INTERMEDIATE LARGE PART IMAGE VIEW */}
                  {modalStep === 'partView' && currentPart && (
                    <motion.div
                      key="partView"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="p-6 md:p-8 flex flex-col items-center pt-12 md:pt-8"
                    >
                      <h3 className="text-2xl font-bold text-white mb-1 text-center">
                        {currentPart.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mb-6 text-center">
                        Part {activePartIndex + 1} of {parts.length} in {selectedItem.title}
                      </p>

                      <div className="relative flex items-center justify-center w-full max-w-lg gap-4 my-2">
                        <button
                          onClick={handlePrevPart}
                          className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 z-10"
                          aria-label="Previous Part"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 overflow-hidden flex items-center justify-center">
                          <AnimatePresence custom={slideDirection} mode="wait">
                            <motion.div
                              key={currentPart.id}
                              custom={slideDirection}
                              variants={slideVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => setModalStep('drawingView')}
                              className="group w-full h-full rounded-2xl overflow-hidden bg-neutral-950 border-2 border-neutral-800 hover:border-accent transition-colors cursor-pointer shadow-xl relative"
                            >
                              <img
                                src={currentPart.partImage}
                                alt={currentPart.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-xs font-semibold uppercase tracking-wider text-white bg-black/70 px-3 py-1.5 rounded-full border border-neutral-600">
                                  Click to view drawing
                                </span>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        <button
                          onClick={handleNextPart}
                          className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 z-10"
                          aria-label="Next Part"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-xs text-neutral-400 mt-6 font-medium">
                        Click the image to view technical drawing sheet
                      </p>
                    </motion.div>
                  )}

                  {/* STEP 1: MAIN ASSEMBLY VIEW (Video or Drawings Tab Image) */}
                  {modalStep === 'assembly' && (
                    <motion.div
                      key="assembly"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Media Display */}
                      <div className="w-full bg-black flex items-center justify-center overflow-hidden">
                        {selectedItem.type === 'video' ? (
                          <div className="w-full aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeId(selectedItem.youtubeUrl)}?autoplay=1&controls=1&rel=0`}
                              title={selectedItem.title}
                              className="w-full h-full border-0"
                              allow="autoplay; encrypted-media; fullscreen"
                            />
                          </div>
                        ) : (
                          /* Standalone Technical Drawing (Drawings Tab) — Hugs Image Aspect Ratio */
                          <div className="p-4 sm:p-6 w-full flex justify-center">
                            <img
                              src={selectedItem.thumbnail}
                              alt={selectedItem.title}
                              className="max-h-[75vh] w-auto h-auto object-contain rounded-xl border border-neutral-800"
                            />
                          </div>
                        )}
                      </div>

                      {/* Modal Info Footer */}
                      <div className="p-6 bg-neutral-900 border-t border-neutral-800">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {selectedItem.title}
                        </h3>
                        <p className="text-sm text-neutral-400 mb-6">
                          Type: {selectedItem.type === 'video' ? 'Video Preview Assembly' : 'Technical Drawing'}
                        </p>

                        {/* PARTS GRID BREAKDOWN */}
                        {parts.length > 0 && (
                          <div className="pt-6 border-t border-neutral-800/80">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                              Parts Breakdown
                            </h4>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                              {parts.map((part, index) => (
                                <motion.div
                                  key={part.id}
                                  whileHover={{ scale: 1.08 }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  onClick={() => {
                                    setActivePartIndex(index);
                                    setModalStep('partView');
                                  }}
                                  className="group flex flex-col items-center gap-3 cursor-pointer w-full"
                                >
                                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 group-hover:border-accent transition-colors shadow-lg">
                                    <img
                                      src={part.partImage}
                                      alt={part.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-neutral-200 group-hover:text-white text-center line-clamp-2 leading-snug">
                                    {part.name}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Projects;
