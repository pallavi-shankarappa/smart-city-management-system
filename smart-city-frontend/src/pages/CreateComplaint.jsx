import { useState } from "react";
import API from "../services/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";

function LocationMarker({ setLocation, location }) {

  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });

  return location ? <Marker position={location} /> : null;
}

function CreateComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      if (location) {
        formData.append("lat", location.lat);
        formData.append("lng", location.lng);
      }

      await API.post("/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Complaint submitted successfully");

      setTitle("");
      setDescription("");
      setCategory("");
      setImage(null);
      setLocation(null);
      setPreviewUrl("");

      document.getElementById("imageInput").value = "";

      navigate("/citizen");
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Complaint</h1>
        <p className="mt-1 text-sm text-slate-600">Describe the issue and pin its location on the map.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              type="text"
              placeholder="e.g., Overflowing garbage bin"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Provide details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="garbage">Garbage</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="road">Road</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Image (optional)</label>
            <input
              id="imageInput"
              className="mt-1 w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImage(file || null);
                setPreviewUrl(file ? URL.createObjectURL(file) : "");
              }}
            />
            {previewUrl && (
              <img
                className="mt-3 w-full rounded-lg border object-cover"
                src={previewUrl}
                alt="Preview"
              />
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">Select location</h2>
            <p className="text-sm text-slate-600">Click on the map to drop a pin.</p>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: "420px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker setLocation={setLocation} location={location} />
            </MapContainer>
          </div>

          {location && (
            <div className="mt-3 text-sm text-slate-700">
              Selected: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateComplaint;