import { useEffect, useState } from "react";
import API from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import StatusBadge from "../components/StatusBadge";

function ComplaintMap() {

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {

    const fetchComplaints = async () => {

      const res = await API.get("/complaints");

      setComplaints(res.data.data);

    };

    fetchComplaints();

  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Complaint Map</h1>
        <p className="mt-1 text-sm text-slate-600">All complaints plotted by location.</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: "520px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {complaints.map((c) => {
            if (!c.location) return null;

            return (
              <Marker key={c._id} position={[c.location.lat, c.location.lng]}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-slate-700">Category: {c.category}</div>
                    <div>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default ComplaintMap;