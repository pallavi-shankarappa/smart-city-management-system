export default function StatusBadge({ status }) {
  const styles =
    status === "Pending"
      ? "bg-amber-100 text-amber-800"
      : status === "In Progress"
      ? "bg-blue-100 text-blue-800"
      : "bg-emerald-100 text-emerald-800";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

