import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { UPLOADS_BASE_URL } from "../services/uploads";
import LoadingSpinner from "../components/LoadingSpinner";

function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/complaints/${id}`);
        setComplaint(res.data.data);
        setSelectedOfficer(res.data.data?.assignedOfficer?._id || "");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const updateStatus = async (status) => {
    await API.put(`/complaints/${id}/status`, { status });
    alert("Status Updated");
    const res = await API.get(`/complaints/${id}`);
    setComplaint(res.data.data);
  };

  useEffect(() => {
    const loadOfficers = async () => {
      try {
        const res = await API.get("/users/officers");
        setOfficers(res.data.data || []);
      } catch {
        setOfficers([]);
      }
    };
    loadOfficers();
  }, []);

  const assign = async () => {
    if (!selectedOfficer) return;
    await API.put(`/complaints/${id}/assign`, { officerId: selectedOfficer });
    const res = await API.get(`/complaints/${id}`);
    setComplaint(res.data.data);
  };

  if (loading) return <LoadingSpinner fullHeight />;
  if (!complaint) return <div className="text-sm text-slate-600">Not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{complaint.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={complaint.status} />
            <span className="text-sm text-slate-600">Category: {complaint.category}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <div className="font-medium">Description</div>
              <div className="mt-1 text-slate-700">{complaint.description}</div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="font-medium">Citizen</div>
                <div className="mt-1 text-slate-700">{complaint.citizen?.name || "—"}</div>
              </div>
              <div>
                <div className="font-medium">Assigned Officer</div>
                <div className="mt-1 text-slate-700">{complaint.assignedOfficer?.name || "—"}</div>
              </div>
            </div>

            {complaint.location?.lat && complaint.location?.lng && (
              <div>
                <div className="font-medium">Location</div>
                <div className="mt-1 text-slate-700">
                  {Number(complaint.location.lat).toFixed(5)}, {Number(complaint.location.lng).toFixed(5)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="text-lg font-semibold">Evidence</h2>
          <div className="mt-3">
            {complaint.image ? (
              <img className="w-full rounded-lg border object-cover" src={`${UPLOADS_BASE_URL}/${complaint.image}`} alt="" />
            ) : (
              <div className="text-sm text-slate-600">No image uploaded.</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold">Actions</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label className="text-sm font-medium">Assign to officer</label>
            <select
              className="mt-1 w-72 max-w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
            >
              <option value="">Select officer...</option>
              {officers.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={assign}
            disabled={!selectedOfficer}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            Assign
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => updateStatus("in-progress")}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Start Work
            </button>
            <button
              onClick={() => updateStatus("resolved")}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Resolve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;