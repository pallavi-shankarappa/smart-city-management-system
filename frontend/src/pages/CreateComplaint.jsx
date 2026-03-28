import { useState } from "react";
import API from "../services/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LocationMarker({ setLocation, location }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return location ? <Marker position={location} /> : null;
}

const CATEGORIES = [
  "Water",
  "Road",
  "Garbage",
  "Street Light",
  "Drainage",
  "Electricity",
  "Traffic",
  "Public Transport",
  "Park",
  "Sewage",
  "Other"
];

const PRIORITIES = ["Low", "Medium", "High", "Emergency"];
const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10"];

const complaintOptions = {
  "Water": {
    titles: ["No Water Supply", "Low Water Pressure", "Pipe Leakage"],
    descriptions: {
      "No Water Supply": ["No water supply since morning"],
      "Low Water Pressure": ["Water pressure extremely low"],
      "Pipe Leakage": ["Water leaking from pipeline", "Dirty water coming from taps"],
    },
  },
  "Road": {
    titles: ["Large Pothole", "Road Completely Damaged"],
    descriptions: {
      "Large Pothole": ["Large pothole causing accidents"],
      "Road Completely Damaged": ["Road flooded with water"],
    },
  },
  "Garbage": {
    titles: ["Garbage Not Collected", "Dustbin Overflow"],
    descriptions: {
        "Garbage Not Collected": ["Garbage not collected for many days"],
        "Dustbin Overflow": ["Dustbin overflowing with waste"],
    },
  },
  "Street Light": {
    titles: ["Street Light Not Working"],
    descriptions: {
      "Street Light Not Working": ["Street light flickering or not working"],
    },
  },
  "Drainage": {
    titles: ["Drainage Blocked"],
    descriptions: {
      "Drainage Blocked": ["Drainage blocked causing water stagnation"],
    },
  },
  "Electricity": {
    titles: ["Power Outage", "Electric Pole Damaged"],
    descriptions: {
      "Power Outage": ["Power outage in the area"],
      "Electric Pole Damaged": ["Electric pole damaged or tilted"],
    },
  },
  "Traffic": {
    titles: ["Traffic Signal Not Working", "Illegal Parking"],
    descriptions: {
      "Traffic Signal Not Working": ["Traffic signal lights not functioning"],
      "Illegal Parking": ["Illegal parking blocking traffic"],
    },
  },
  "Public Transport": {
    titles: ["Public Bus Delay"],
    descriptions: {
      "Public Bus Delay": ["Public transport delay"],
    },
  },
  "Park": {
    titles: ["Park Maintenance Required"],
    descriptions: {
      "Park Maintenance Required": ["Park area not maintained"],
    },
  },
  "Sewage": {
    titles: ["Sewage Overflow"],
    descriptions: {
      "Sewage Overflow": ["Sewage overflowing on road"],
    },
  },
};

function CreateComplaint() {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [ward, setWard] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Category is required";
    if (!ward) newErrors.ward = "Ward is required";
    if (!location) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("ward", ward);
      formData.append("priority", priority);
      
      if (category === "Other") {
        formData.append("customCategory", customCategory);
      }

      if (title === "Other") {
        formData.append("customTitle", customTitle);
      }

      if (description === "Other") {
        formData.append("customDescription", customDescription);
      }

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

      alert(t('submit_success'));
      navigate("/citizen");
    } catch (error) {
      alert(error.response?.data?.message || t('submit_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('create_complaint')}</h1>
        <p className="mt-1 text-sm text-slate-600">Describe the issue and pin its location on the map.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-2 relative z-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('category')}</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">{t('category')}</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {t(`categories.${cat.toLowerCase().split(' / ')[0].split(' ')[0]}`, cat)}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {category === "Other" && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="block text-sm font-semibold text-slate-700 mb-1">{t('other_category')}</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                type="text"
                placeholder={t('other_category')}
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('title')}</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={!category || category === 'Other'}
            >
              <option value="">{t('title')}</option>
              {category && complaintOptions[category]?.titles.map(opt => <option key={opt} value={opt}>{t(`complaint_titles.${opt.toLowerCase().replace(/ /g, '_')}`, opt)}</option>)}
              <option value="Other">{t('other')}</option>
            </select>
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {title === 'Other' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Custom Title</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                type="text"
                placeholder="Enter a custom title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('description')}</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={!title || title === 'Other'}
            >
              <option value="">{t('description')}</option>
              {title && complaintOptions[category]?.descriptions[title]?.map(opt => <option key={opt} value={opt}>{t(`complaint_descriptions.${opt.toLowerCase().replace(/ /g, '_')}`, opt)}</option>)}
              <option value="Other">{t('other')}</option>
            </select>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {description === 'Other' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Custom Description</label>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Enter a custom description"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('ward')}</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              required
            >
              <option value="">{t('ward')}</option>
              {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('priority')}</label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    priority === p 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t(`priorities.${p.toLowerCase()}`, p)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('image')} ({t('optional')})</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-500 transition-colors cursor-pointer relative">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-slate-600">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    {t('upload_image')}
                  </span>
                  <p className="pl-1">{t('drag_drop')}</p>
                </div>
                <p className="text-xs text-slate-500">{t('image_spec')}</p>
              </div>
              <input
                id="imageInput"
                className="absolute inset-0 opacity-0 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImage(file || null);
                  setPreviewUrl(file ? URL.createObjectURL(file) : "");
                }}
              />
            </div>
            {previewUrl && (
              <div className="mt-4 relative group">
                <img
                  className="w-full h-48 rounded-lg border border-slate-200 object-cover shadow-sm"
                  src={previewUrl}
                  alt="Preview"
                />
                <button 
                  onClick={() => { setImage(null); setPreviewUrl(""); }}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:bg-blue-700 hover:shadow-xl active:transform active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? "Submitting..." : t('submit')}
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">{t('select_location')}</h2>
            <p className="text-sm text-slate-600">{t('pin_location_desc')}</p>
          </div>

          <div className="flex-1 overflow-hidden rounded-xl border border-slate-300 min-h-[400px]">
            <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker setLocation={setLocation} location={location} />
            </MapContainer>
          </div>

          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}

          {location && (
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              Selected Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateComplaint;
