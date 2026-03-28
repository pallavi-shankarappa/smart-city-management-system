import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { UPLOADS_BASE_URL } from "../services/uploads";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";

function ViewComplaints() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  const navigate = useNavigate();

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints", {
        params: {
          keyword: search || undefined,
          category: category || undefined,
          status: status || undefined,
          sort,
          page,
          limit: 10,
        },
      });
      setComplaints(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [ category, status, sort, page]);

  const updateStatus = async (id, newStatus) => {
    console.log("Status sent from frontend:", newStatus);
    try {
      if (newStatus === "Resolved" && !evidenceFile) {
        setResolvingId(id);
        alert(t('evidence_required'));
        return;
      }

      const formData = new FormData();
      formData.append("status", newStatus);
      if (evidenceFile) {
        formData.append("evidenceImage", evidenceFile);
      }

      await API.put(`/complaints/${id}/status`, formData);
      
      setEvidenceFile(null);
      setResolvingId(null);
      loadComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t('complaints')}</h1>
          <p className="mt-1 text-sm text-slate-600">{t('manage_complaints_desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">{t('search') || "Search"}</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            type="text"
            placeholder={t('search_placeholder') || "Search by title..."}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t('category')}</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            <option value="">{t('all') || "All"}</option>
            {["Water", "Road", "Garbage", "Street Light", "Drainage", "Electricity", "Traffic", "Public Transport", "Park", "Sewage", "Other"].map(cat => (
              <option key={cat} value={cat}>{t(`categories.${cat.toLowerCase().split(' ')[0]}`, cat)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">{t('status')}</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">{t('all') || "All"}</option>
            {["Pending", "In Progress", "Resolved"].map(s => (
              <option key={s} value={s}>{t(`statuses.${s.toLowerCase().replace(' ', '_')}`, s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-3">{t('title')}</th>
                <th className="px-4 py-3">{t('category')}</th>
                <th className="px-4 py-3">{t('status')}</th>
                <th className="px-4 py-3">{t('citizen')}</th>
                <th className="px-4 py-3">{t('image') || "Image"}</th>
                <th className="px-4 py-3">{t('actions') || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : complaints.length ? (
                complaints.map((c) => (
                  <tr
                    key={c._id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => navigate(`/officer/complaints/${c._id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{c.title}</div>
                      <div className="mt-0.5 max-w-md truncate text-xs text-slate-600">{c.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{t(`categories.${c.category.toLowerCase().split(' ')[0]}`, c.category)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{c.citizen?.name || "—"}</td>
                    <td className="px-4 py-3">
                      {c.image ? (
                        <img
                          className="h-10 w-14 rounded-md border object-cover"
                          src={`${UPLOADS_BASE_URL}/${c.image}`}
                          alt="complaint"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-2">
                        {c.status === "Pending" && (
                          <button
                            className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-blue-700"
                            onClick={() => updateStatus(c._id, "In Progress")}
                          >
                            {t('start_work')}
                          </button>
                        )}
                        {c.status === "In Progress" && (
                          <div className="space-y-2">
                            {resolvingId === c._id ? (
                              <div className="flex flex-col gap-1">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="text-[10px]"
                                  onChange={(e) => setEvidenceFile(e.target.files[0])}
                                />
                                <button
                                  className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-emerald-700"
                                  onClick={() => updateStatus(c._id, "Resolved")}
                                >
                                  {t('submit') || "Submit"}
                                </button>
                                <button
                                  className="text-[10px] text-slate-500 underline"
                                  onClick={() => { setResolvingId(null); setEvidenceFile(null); }}
                                >
                                  {t('cancel') || "Cancel"}
                                </button>
                              </div>
                            ) : (
                              <button
                                className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-emerald-700"
                                onClick={() => setResolvingId(c._id)}
                              >
                                {t('resolve')}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-600" colSpan={6}>
                    {t('no_complaints_found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {t('page') || "Page"} <span className="font-medium text-slate-900">{page}</span> {t('of') || "of"}{" "}
          <span className="font-medium text-slate-900">{totalPages}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t('prev') || "Prev"}
          </button>
          <button
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {t('next') || "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewComplaints;