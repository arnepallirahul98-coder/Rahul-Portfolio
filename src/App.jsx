/* ============================================================
   App.jsx — Root Application Component
   ============================================================
   Currently renders only the Home section.
   Additional sections (Intro, Projects, Education, Contact)
   and a Navbar will be added in later stages.
   ============================================================ */

import Home from './sections/Home';
import Projects from './sections/Projects';
import Education from './sections/Education';
import Contact from './sections/Contact';

function App() {
  return (
    <main className="bg-black text-white min-h-screen">
      {/* ---- Home / Hero & Intro Section ---- */}
      <Home />

      {/* ---- Projects Section ---- */}
      <Projects />

      {/* ---- Education Section ---- */}
      <Education />

      {/* ---- Contact Section ---- */}
      <Contact />
    </main>
  );
}

export default App;
