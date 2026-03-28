import StatusBadge from "./StatusBadge";

export default function ComplaintCard({ complaint }) {
  if (!complaint) return null;

  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{complaint.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-600">{complaint.description}</p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize text-slate-700">
          {complaint.category || complaint.department}
        </span>
        {complaint.createdAt && <span>{new Date(complaint.createdAt).toLocaleString()}</span>}
      </div>
    </article>
  );
}

