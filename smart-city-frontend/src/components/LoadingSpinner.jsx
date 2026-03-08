export default function LoadingSpinner({ fullHeight = false }) {
  const containerClass = fullHeight
    ? "flex h-64 items-center justify-center"
    : "flex items-center justify-center py-8";

  return (
    <div className={containerClass}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  );
}

