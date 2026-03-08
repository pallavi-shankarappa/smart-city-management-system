export default function StatusBadge({ status }) {
  const styles =
    status === "pending"
      ? "bg-amber-100 text-amber-800"
      : status === "in-progress"
      ? "bg-blue-100 text-blue-800"
      : "bg-emerald-100 text-emerald-800";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

