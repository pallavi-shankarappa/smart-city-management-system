export default function Footer() {
  return (
    <footer className="border-t bg-slate-950/95 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Smart City Management System
          </div>
          <p className="mt-1 text-sm text-slate-400">
            A unified platform for citizens and city officers to collaborate on a better urban experience.
          </p>
        </div>
        <div className="text-sm text-slate-400">
          Contact:{" "}
          <a href="mailto:support@smartcity.gov" className="font-medium text-slate-100 hover:underline">
            support@smartcity.gov
          </a>
          <div className="mt-1">© {new Date().getFullYear()} Smart City Authority</div>
        </div>
      </div>
    </footer>
  );
}

