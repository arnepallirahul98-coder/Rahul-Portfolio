/* ============================================================
   Contact.jsx — Contact & Formspree Message Section
   ============================================================
   Features:
     - Direct Contact Info Links (Mail, Phone, LinkedIn) with Lucide Icons
     - Interactive Formspree Contact Form (`https://formspree.io/f/xkjwavzq`)
     - Inline form validation & field error messages
     - Asynchronous submission state management (idle, sending, success, error)
     - Reversible scroll visibility using `useInView(..., { once: false })`
   ============================================================ */

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';

// Custom LinkedIn SVG Icon component
function LinkedinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkjwavzq';

const CONTACT_INFO = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: 'arnepallirahul98@gmail.com',
    href: 'mailto:arnepallirahul98@gmail.com',
    isExternal: false,
  },
  {
    id: 'phone',
    icon: Phone,
    label: 'Phone',
    value: '+91 85550 29725',
    href: 'tel:+918555029725',
    isExternal: false,
  },
  {
    id: 'linkedin',
    icon: LinkedinIcon,
    label: 'LinkedIn',
    value: 'Rahul Arnipalli',
    href: 'https://linkedin.com/in/rahul-arnipalli-89b551368',
    isExternal: true,
  },
];

function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: false });

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on field edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('sending');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form fields
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setStatus('error');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="w-full bg-black py-12 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-16 text-center"
        >
          Get in Touch
        </motion.h2>

        {/* Contact Info Cards Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.isExternal ? '_blank' : '_self'}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-accent hover:bg-neutral-850 flex flex-col items-center justify-center text-center gap-3 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-accent group-hover:border-accent/50 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-white group-hover:text-accent transition-colors line-clamp-1">
                  {item.value}
                </span>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 p-8 shadow-2xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Send Me a Message
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl bg-neutral-950 border text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-neutral-800 focus:border-accent'
                }`}
              />
              {errors.name && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`w-full px-4 py-3 rounded-xl bg-neutral-950 border text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-neutral-800 focus:border-accent'
                }`}
              />
              {errors.email && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </span>
              )}
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className={`w-full px-4 py-3 rounded-xl bg-neutral-950 border text-white placeholder-neutral-600 focus:outline-none transition-colors resize-none ${
                  errors.message
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-neutral-800 focus:border-accent'
                }`}
              />
              {errors.message && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={status !== 'sending' ? { scale: 1.02 } : {}}
              whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-xl font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                status === 'sending'
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-accent hover:bg-neutral-300 text-black'
              }`}
            >
              {status === 'sending' ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>

            {/* Success Notification */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>Message sent! I'll get back to you soon.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Notification */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-sm flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>Something went wrong, please try again or email me directly.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
