import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";
import ComplaintChart from "../components/ComplaintChart";
import StatusBadge from "../components/StatusBadge";

function OfficerDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsRes, complaintsRes] = await Promise.all([
          API.get("/dashboard/stats"),
          API.get("/complaints", { params: { limit: 5 } })
        ]);
        setStats(statsRes.data.data);
        setRecent(complaintsRes.data.data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('officer_dashboard')}</h1>
          <p className="mt-1 text-sm text-slate-600">{t('manage_complaints_desc')}</p>
        </div>
        <button
          onClick={() => navigate("/officer/complaints")}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {t('view_complaints')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'total', value: stats.total, color: 'blue', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { label: 'pending', value: stats.pending, color: 'amber', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'in_progress', value: stats.inProgress, color: 'blue', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
          { label: 'resolved', value: stats.resolved, color: 'emerald', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{t(item.label)}</div>
              <svg className={`w-5 h-5 text-${item.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
            </div>
            <div className={`mt-3 text-3xl font-bold text-slate-900`}>{item.value}</div>
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
              <h2 className="text-lg font-bold text-slate-900">{t('recent_complaints') || "Recent Complaints"}</h2>
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
                {recent.length > 0 ? (
                  recent.map((c) => (
                    <tr 
                      key={c._id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer" 
                      onClick={() => navigate(`/officer/complaints/${c._id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">
                          {c.title}
                        </div>
                        <div className="text-xs text-slate-500 uppercase font-bold">
                          {c.ward}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {t(`categories.${c.category.toLowerCase().split(' ')[0]}`, c.category)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
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

export default OfficerDashboard;