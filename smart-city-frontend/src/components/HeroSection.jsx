import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const scrollToServices = () => {
    const el = document.getElementById("services-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#2563EB22,_transparent_55%)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:py-20">
        <div className="relative z-10 max-w-xl space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl"
          >
            Smart City Management System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm text-slate-300 sm:text-base"
          >
            A modern, citizen-first platform to report issues, track resolutions, and help officers run a smarter city
            with real-time visibility across departments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/register"
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500"
            >
              Get Started as Citizen
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-600 bg-slate-900/60 px-6 py-2.5 text-sm font-medium text-slate-50 hover:bg-slate-800/80"
            >
              Officer Login
            </Link>
            <button
              type="button"
              onClick={scrollToServices}
              className="rounded-full border border-slate-700 bg-transparent px-6 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-900/60"
            >
              Explore services
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-10 w-full max-w-md md:max-w-lg"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/70 shadow-2xl">
            <img
              src="https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Smart city skyline at night"
              className="h-64 w-full object-cover sm:h-80"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-300">Real-time urban insights</p>
              <p className="text-sm text-slate-100">
                Monitor complaints across water, roads, electricity, and sanitation departments from a unified console.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

