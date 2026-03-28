import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaCheckCircle, FaClock } from "react-icons/fa";

const statsConfig = [
  { id: "citizens", label: "Citizens served", icon: FaUsers, target: 12500 },
  { id: "resolved", label: "Complaints resolved", icon: FaCheckCircle, target: 8400 },
  { id: "sla", label: "Avg. resolution time (hrs)", icon: FaClock, target: 18 },
];

function Counter({ target, duration = 1200 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round((duration / 1000) * 60);
    const interval = setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      setValue(Math.round(target * progress));
      if (progress === 1) clearInterval(interval);
    }, duration / totalFrames || 16);

    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{value.toLocaleString()}</span>;
}

export default function AnimatedStats() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:grid-cols-3 sm:p-8">
          {statsConfig.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex items-center gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white sm:text-xl">
                    <Counter target={stat.target} />
                  </div>
                  <div className="text-xs text-slate-400 sm:text-sm">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

