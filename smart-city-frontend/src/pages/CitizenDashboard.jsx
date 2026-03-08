import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import ComplaintChart from "../components/ComplaintChart";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";

function CitizenDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          API.get("/dashboard/stats"),
          API.get("/complaints", { params: { page: 1, limit: 5, sort: "latest" } }),
        ]);
        setStats(statsRes.data.data);
        setRecent(recentRes.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Citizen Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Track and report city issues.</p>
        </div>
        <button
          onClick={() => navigate("/citizen/create")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Complaint
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-600">Total Complaints</div>
          <div className="mt-1 text-2xl font-semibold">{loading ? "—" : stats.total}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-600">Pending</div>
          <div className="mt-1 text-2xl font-semibold">{loading ? "—" : stats.pending}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-600">In Progress</div>
          <div className="mt-1 text-2xl font-semibold">{loading ? "—" : stats.inProgress}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-600">Resolved</div>
          <div className="mt-1 text-2xl font-semibold">{loading ? "—" : stats.resolved}</div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Complaint Analytics</h2>
          <p className="text-sm text-slate-600">Status distribution of your complaints.</p>
        </div>
        <ComplaintChart stats={stats} />
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Recent complaints</h2>
            <p className="text-sm text-slate-600">Your latest submissions and current status.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={4}>
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : recent.length ? (
                recent.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-sm">{c.category}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-600" colSpan={4}>
                    No complaints yet. Create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CitizenDashboard;