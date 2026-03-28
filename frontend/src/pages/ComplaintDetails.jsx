import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { UPLOADS_BASE_URL } from "../services/uploads";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";

function ComplaintDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evidenceFile, setEvidenceFile] = useState(null);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/complaints/${id}`);
      setComplaint(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const updateStatus = async (status) => {
    console.log("Status sent from frontend:", status);
    try {
      if (status === "Resolved" && !evidenceFile && !complaint.evidenceImage) {
        alert(t('evidence_required'));
        return;
      }

      const formData = new FormData();
      formData.append("status", status);
      if (evidenceFile) {
        formData.append("evidenceImage", evidenceFile);
      }

      await API.put(`/complaints/${id}/status`, formData);
      
      alert(t('status_updated') || "Status Updated");
      setEvidenceFile(null);
      fetchComplaint();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading) return <LoadingSpinner fullHeight />;
  if (!complaint) return <div className="text-sm text-slate-600">{t('not_found') || "Not found."}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{complaint.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={complaint.status} />
            <span className="text-sm text-slate-600">
              {t('category')}: {t(`categories.${complaint.category.toLowerCase().split(' ')[0]}`, complaint.category)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="text-lg font-semibold">{t('details') || "Details"}</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <div className="font-medium">{t('description')}</div>
              <div className="mt-1 text-slate-700">{complaint.description}</div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="font-medium">{t('citizen')}</div>
                <div className="mt-1 text-slate-700">{complaint.citizen?.name || "—"}</div>
              </div>
            </div>

            {complaint.location?.lat && complaint.location?.lng && (
              <div>
                <div className="font-medium">{t('location')}</div>
                <div className="mt-1 text-slate-700">
                  {Number(complaint.location.lat).toFixed(5)}, {Number(complaint.location.lng).toFixed(5)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="text-lg font-semibold">{t('evidence') || "Evidence"}</h2>
          <div className="mt-3 space-y-4">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">{t('citizen_photo') || "Citizen Photo"}</div>
              {complaint.image ? (
                <img className="w-full h-48 rounded-lg border object-cover" src={`${UPLOADS_BASE_URL}/${complaint.image}`} alt="" />
              ) : (
                <div className="text-sm text-slate-600">{t('no_image_uploaded')}</div>
              )}
            </div>
            
            {complaint.evidenceImage && (
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">{t('evidence_photo')}</div>
                <img className="w-full h-48 rounded-lg border object-cover" src={`${UPLOADS_BASE_URL}/${complaint.evidenceImage}`} alt="" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold">{t('actions') || "Actions"}</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="flex flex-wrap gap-2">
            {complaint.status === "Pending" && (
              <button
                onClick={() => updateStatus("In Progress")}
                className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
              >
                {t('start_work')}
              </button>
            )}
            
            {complaint.status === "In Progress" && (
              <div className="flex flex-wrap items-center gap-2 border-l pl-3 ml-1">
                <input 
                  type="file" 
                  accept="image/*"
                  className="text-xs"
                  onChange={(e) => setEvidenceFile(e.target.files[0])}
                />
                <button
                  onClick={() => updateStatus("Resolved")}
                  className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700"
                >
                  {t('resolve')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;