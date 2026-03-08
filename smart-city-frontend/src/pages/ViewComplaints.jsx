import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { UPLOADS_BASE_URL } from "../services/uploads";
import LoadingSpinner from "../components/LoadingSpinner";

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
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

    loadComplaints();
  }, [search, category, status, sort, page]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/${id}/status`, { status });
      const res = await API.get("/complaints", { params: { page, limit: 10 } });
      setComplaints(res.data.data);
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Complaints</h1>
          <p className="mt-1 text-sm text-slate-600">Search, filter, and update complaint status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Search</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="garbage">Garbage</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="road">Road</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="pending">pending</option>
            <option value="in-progress">in-progress</option>
            <option value="resolved">resolved</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Sort</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Citizen</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Actions</th>
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
                    <td className="px-4 py-3 text-sm">{c.category}</td>
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
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(c._id, "in-progress");
                          }}
                        >
                          Start
                        </button>
                        <button
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(c._id, "resolved");
                          }}
                        >
                          Resolve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-600" colSpan={6}>
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Page <span className="font-medium text-slate-900">{page}</span> of{" "}
          <span className="font-medium text-slate-900">{totalPages}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewComplaints;