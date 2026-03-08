import { motion } from "framer-motion";
import { FaWater, FaBolt, FaTrashAlt, FaRoad } from "react-icons/fa";

const services = [
  {
    id: "water",
    title: "Water Supply",
    description: "Report leaks, low pressure, and contamination issues with instant routing to water authorities.",
    icon: FaWater,
    image:
      "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "electricity",
    title: "Electricity",
    description: "Log power outages, unsafe wiring, and street light failures directly from your neighborhood.",
    icon: FaBolt,
    image:
      "https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "waste",
    title: "Waste Management",
    description: "Track garbage pickup, overflowing bins, and sanitation complaints in real time.",
    icon: FaTrashAlt,
    image:
      "https://images.pexels.com/photos/12762218/pexels-photo-12762218.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "roads",
    title: "Roads & Traffic",
    description: "Report potholes, broken signals, and congestion hotspots to the roads department.",
    icon: FaRoad,
    image:
      "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default function ServiceCards() {
  return (
    <section id="services-section" className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">City services at your fingertips</h2>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            A unified complaint system across critical city services, designed for fast triage and transparent
            resolution.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-sm"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                  <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-medium text-slate-100">
                    <Icon className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                    {service.title}
                  </div>
                </div>
                <div className="space-y-2 px-4 py-4">
                  <h3 className="text-sm font-semibold text-white">{service.title}</h3>
                  <p className="text-xs text-slate-400 sm:text-sm">{service.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

