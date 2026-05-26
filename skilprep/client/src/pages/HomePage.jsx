import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const WELCOME_POPUP_SEEN_KEY = 'skilprep_welcome_popup_seen_v1';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    try {
      const hasSeenPopup = localStorage.getItem(WELCOME_POPUP_SEEN_KEY) === 'true';
      if (hasSeenPopup) return;
    } catch {
      // If storage is unavailable, fallback to showing popup on mount.
    }

    const timer = window.setTimeout(() => setShowPopup(true), 450);

    try {
      localStorage.setItem(WELCOME_POPUP_SEEN_KEY, 'true');
    } catch {
      // Ignore storage write failures.
    }

    return () => window.clearTimeout(timer);
  }, []);

  const fields = [
    { name: 'Coding (DSA)', icon: '{ }', color: 'bg-blue-500/20 text-blue-300' },
    { name: 'Mathematics', icon: '∑', color: 'bg-purple-500/20 text-purple-300' },
    { name: 'Science', icon: '⚛', color: 'bg-emerald-500/20 text-emerald-300' },
    { name: 'Logic & Puzzles', icon: '◈', color: 'bg-amber-500/20 text-amber-300' },
    { name: 'General Knowledge', icon: '?', color: 'bg-rose-500/20 text-rose-300' },
  ];

  const aboutText = 'SkillPrep is an innovative, multi-disciplinary evaluation platform designed to bridge the gap between niche coding platforms and generalized learning management systems. While platforms like LeetCode focus exclusively on algorithmic proficiency in computer science, SkillPrep introduces a unified architecture capable of evaluating skills across Computer Science, Management, Commerce, and Arts. By utilizing domain-specific evaluation engines ranging from automated test-case executors to rubric-based assessment models, SkillPrep provides a holistic evaluation environment. This report details the design, architecture, and implementation of SkillPrep, highlighting its secure authentication, real-time feedback mechanisms, and optimized data structure utilization.';

  const sectionLinks = [
    { href: '#know-about', label: 'Know About' },
    { href: '#team', label: 'Team' },
    { href: '#contact', label: 'Contact' },
  ];

  const ctaLinks = user
    ? [
      { to: '/code-executor', label: 'Code Executor', primary: true },
      { to: '/learning-tracks', label: 'Learning Tracks', primary: false },
    ]
    : [
      { to: '/register', label: 'Get Started Free', primary: true },
      { to: '/code-executor', label: 'Code Executor', primary: false },
      { to: '/learning-tracks', label: 'Learning Tracks', primary: false },
    ];

  const infoCards = [
    {
      id: 'team',
      title: 'Team',
      label: 'Team Name',
      value: 'Zpreps',
    },
    {
      id: 'contact',
      title: 'Contact',
      label: 'Phone',
      value: '7828969147',
      href: 'tel:7828969147',
    },
  ];

  const sectionLinkClass = 'inline-block rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white no-underline hover:border-teal-400 hover:text-teal-300 transition-all duration-300 hover:bg-white/10';
  const ctaPrimaryClass = 'inline-block bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3.5 rounded-xl text-lg font-medium no-underline transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1';
  const ctaSecondaryClass = 'inline-block border border-white/30 hover:border-white/60 text-white bg-white/5 backdrop-blur-md px-8 py-3.5 rounded-xl text-lg font-medium no-underline transition-all duration-300 hover:-translate-y-1 hover:bg-white/10';

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      className="py-12 md:py-16 space-y-16 md:space-y-24"
    >
      {showPopup && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="max-w-lg w-full bg-slate-900/80 border border-white/10 shadow-2xl rounded-2xl backdrop-blur-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-3">Welcome to SkillPrep</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              Explore coding, math, science, and more with real-time evaluation, progress tracking, and interactive practice. Experience our new 3D platform.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/problems"
                className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-teal-500/30"
                onClick={() => setShowPopup(false)}
              >
                Start Practicing
              </Link>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.section 
        variants={fadeInUp}
        className="premium-shell px-6 py-16 md:px-12 md:py-20 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none rounded-2xl"></div>
        <p className="text-sm uppercase tracking-[0.3em] text-teal-400 font-bold mb-4">Platform</p>
        <h2 className="premium-heading text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mt-2 mb-6 drop-shadow-sm">
          Master Skills Across Disciplines
        </h2>
        <p className="text-xl text-slate-300 mt-6 max-w-3xl mx-auto leading-relaxed">
          Practice coding, math, science, logic and more. Track your progress, compete on leaderboards, and level up your skills in an immersive environment.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap relative z-10">
          {sectionLinks.map((item) => (
            <a key={item.href} href={item.href} className={sectionLinkClass}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-5 flex-wrap relative z-10">
          {ctaLinks.map((item) => (
            <Link key={item.to} to={item.to} className={item.primary ? ctaPrimaryClass : ctaSecondaryClass}>
              {item.label}
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {fields.map((f) => (
          <motion.div variants={fadeInUp} key={f.name}>
            <Link
              to="/problems"
              className="block premium-shell p-8 hover:bg-white/10 transition-all duration-300 group cursor-pointer hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
            >
              <div className={`w-14 h-14 rounded-xl ${f.color} flex items-center justify-center text-2xl font-bold mb-5 shadow-lg`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-xl text-white group-hover:text-teal-300 transition-colors mb-3">{f.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Explore tailored challenges and adaptive evaluation across this exciting discipline.</p>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      <motion.section 
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        id="know-about" 
        className="premium-shell p-8 md:p-12 scroll-mt-32 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <h3 className="premium-heading text-3xl font-bold text-white mb-6 relative z-10">Know About SkillPrep</h3>
        <p className="text-slate-300 text-lg leading-loose relative z-10">{aboutText}</p>
      </motion.section>

      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {infoCards.map((card) => (
          <motion.div
            variants={fadeInUp}
            key={card.id}
            id={card.id}
            className="premium-shell p-8 md:p-10 scroll-mt-32 hover:bg-white/10 transition-colors duration-300"
          >
            <h3 className="premium-heading text-2xl font-bold text-white mb-2">{card.title}</h3>
            <p className="text-slate-400 mb-4 font-medium uppercase tracking-wider text-xs">{card.label}</p>
            {card.href ? (
              <a href={card.href} className="text-3xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
                {card.value}
              </a>
            ) : (
              <p className="text-3xl font-bold text-white">{card.value}</p>
            )}
          </motion.div>
        ))}
      </motion.section>
    </motion.div>
  );
}
