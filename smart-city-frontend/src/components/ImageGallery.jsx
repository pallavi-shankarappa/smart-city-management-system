import {motion} from "framer-motion"
const galleryItems = [
  {
    id: 1,
    title: "Live traffic monitoring",
    image:
      "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: 2,
    title: "Waste collection & routing",
    image:
      "https://images.pexels.com/photos/1166413/pexels-photo-1166413.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: 3,
    title: "Water infrastructure",
    image:
       "https://images.pexels.com/photos/5131196/pexels-photo-5131196.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default function ImageGallery() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-4 sm:pb-16">
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Built for real city operations</h2>
            <p className="mt-1 text-sm text-slate-400 sm:text-base">
              From field teams to control rooms, the platform adapts to how modern cities run.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70"
            >
              <div className="relative h-44 overflow-hidden sm:h-52">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-sm font-medium text-slate-50">
                  {item.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

