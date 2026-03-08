import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function OfficerDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await API.get("/dashboard/stats");
        setStats(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Officer Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Manage, assign, and resolve citizen complaints.</p>
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

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/officer/complaints")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Manage Complaints
        </button>
        <button
          onClick={() => navigate("/officer/map")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          View Complaint Map
        </button>
      </div>
    </div>
  );
}

export default OfficerDashboard;