import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import ComplaintChart from "../components/ComplaintChart";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";

function CitizenDashboard() {
  const { t } = useTranslation();
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
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('citizen_dashboard')}</h1>
          <p className="mt-1 text-sm text-slate-600">{t('track_and_report')}</p>
        </div>
        <button
          onClick={() => navigate("/citizen/create")}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
        >
          {t('create_complaint')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'total', value: stats.total, color: 'blue' },
          { label: 'pending', value: stats.pending, color: 'amber' },
          { label: 'in_progress', value: stats.inProgress, color: 'blue' },
          { label: 'resolved', value: stats.resolved, color: 'emerald' }
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{t(item.label)}</div>
            <div className={`mt-2 text-3xl font-bold text-${item.color}-600`}>
              {loading ? "—" : item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">{t('complaint_analytics')}</h2>
            <p className="text-sm text-slate-600">{t('status_distribution_desc')}</p>
          </div>
          <ComplaintChart stats={stats} />
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('recent_complaints')}</h2>
              <p className="text-sm text-slate-600">{t('latest_submissions')}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">{t('title')}</th>
                  <th className="px-6 py-4">{t('category')}</th>
                  <th className="px-6 py-4">{t('status')}</th>
                  <th className="px-6 py-4">{t('created')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td className="px-6 py-10 text-center" colSpan={4}>
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : recent.length > 0 ? (
                  <>
                    {recent.map((complaint) => (
                      <tr 
                        key={complaint._id} 
                        className="hover:bg-slate-50 transition-colors cursor-pointer" 
                        onClick={() => navigate(`/complaints/${complaint._id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">
                            {complaint.title}
                          </div>
                          <div className="text-xs text-slate-500 uppercase font-bold">
                            {complaint.ward}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            {t(`categories.${complaint.category?.toLowerCase().split(' / ')[0].split(' ')[0]}`, complaint.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={complaint.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td className="px-6 py-10 text-center text-sm text-slate-500" colSpan={4}>
                      {t('no_complaints_found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CitizenDashboard;
