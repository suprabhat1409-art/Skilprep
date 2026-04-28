import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowPopup(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const fields = [
    { name: 'Coding (DSA)', icon: '{ }', color: 'bg-blue-100 text-blue-700' },
    { name: 'Mathematics', icon: '∑', color: 'bg-purple-100 text-purple-700' },
    { name: 'Science', icon: '⚛', color: 'bg-green-100 text-green-700' },
    { name: 'Logic & Puzzles', icon: '◈', color: 'bg-amber-100 text-amber-700' },
    { name: 'General Knowledge', icon: '?', color: 'bg-rose-100 text-rose-700' },
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
      delay: null,
    },
    {
      id: 'contact',
      title: 'Contact',
      label: 'Phone',
      value: '7828969147',
      href: 'tel:7828969147',
      delay: '120ms',
    },
  ];

  const sectionLinkClass = 'inline-block rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 no-underline hover:border-teal-300 hover:text-teal-700 transition-colors';
  const ctaPrimaryClass = 'inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-lg text-lg font-medium no-underline transition-colors';
  const ctaSecondaryClass = 'inline-block border border-gray-300 hover:border-gray-400 text-gray-700 bg-white px-7 py-3 rounded-lg text-lg font-medium no-underline transition-colors';

  return (
    <div className="py-12 md:py-16 space-y-10 md:space-y-12">
      {showPopup && (
        <div className="popup-overlay" role="dialog" aria-modal="true" aria-label="Welcome popup">
          <div className="popup-card premium-shell">
            <h3 className="premium-heading text-xl font-bold text-slate-900">Welcome to SkillPrep</h3>
            <p className="text-sm text-slate-600 mt-2">
              Explore coding, math, science, and more with real-time evaluation, progress tracking, and interactive practice.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Link
                to="/problems"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors"
                onClick={() => setShowPopup(false)}
              >
                Start Practicing
              </Link>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="inline-block border border-slate-300 hover:border-slate-400 text-slate-700 bg-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="premium-shell px-6 py-10 md:px-10 md:py-14 text-center reveal-up">
        <p className="text-xs uppercase tracking-[0.2em] text-teal-700 font-semibold">Platform</p>
        <h2 className="premium-heading text-4xl md:text-5xl font-bold text-gray-900 mt-3">
          Master Skills Across Disciplines
        </h2>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          Practice coding, math, science, logic and more. Track your progress, compete on leaderboards, and level up your skills.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          {sectionLinks.map((item) => (
            <a key={item.href} href={item.href} className={sectionLinkClass}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          {ctaLinks.map((item) => (
            <Link key={item.to} to={item.to} className={item.primary ? ctaPrimaryClass : ctaSecondaryClass}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-up">
        {fields.map((f, index) => (
          <Link
            key={f.name}
            to="/problems"
            className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow no-underline group floating-card"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className={`w-12 h-12 rounded-lg ${f.color} flex items-center justify-center text-xl font-bold mb-3`}>
              {f.icon}
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{f.name}</h3>
            <p className="text-sm text-gray-500 mt-2">Explore tailored challenges and adaptive evaluation.</p>
          </Link>
        ))}
      </section>

      <section id="know-about" className="premium-shell p-6 md:p-8 reveal-up scroll-mt-24">
        <h3 className="premium-heading text-2xl font-bold text-slate-900">Know About SkillPrep</h3>
        <p className="text-slate-600 mt-4 leading-7">{aboutText}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-up">
        {infoCards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className="premium-shell p-6 md:p-7 section-pulse scroll-mt-24"
            style={card.delay ? { animationDelay: card.delay } : undefined}
          >
            <h3 className="premium-heading text-2xl font-bold text-slate-900">{card.title}</h3>
            <p className="text-slate-600 mt-3">{card.label}</p>
            {card.href ? (
              <a href={card.href} className="text-xl font-semibold text-teal-700 hover:text-teal-800 no-underline mt-1 inline-block">
                {card.value}
              </a>
            ) : (
              <p className="text-xl font-semibold text-slate-900 mt-1">{card.value}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
