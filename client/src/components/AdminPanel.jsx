/**
 * AdminPanel.jsx
 * Route: /admin
 *
 * Single-file Admin Panel: Login, Gallery, Team, Events, and
 * Initiative Content management. Data persists to localStorage
 * (no backend wired up yet — see note in chat).
 */

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  Calendar,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Search,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  Menu,
  ChevronRight,
  Upload,
  Check,
  ExternalLink,
  MapPin,
  Layers,
  ClipboardList,
  Droplet,
  Phone,
  Mail,
} from "lucide-react";

import logo from "../assets/logo.png";
import {
  login,
  isLoggedIn,
  setToken,
  clearToken,
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getContent,
  updateContent,
  uploadImage,
  getStats,
  getHeroSlides,
  addHeroSlide,
  deleteHeroSlide,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
  getBloodDonors,
  updateBloodDonorStatus,
  deleteBloodDonor,
} from "../lib/api";

// ─── Config ───────────────────────────────────────────────────────────────

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "aarohi@2026",
};

const INITIATIVES = [
  { key: "home", label: "Homepage" },
  { key: "blood-donation", label: "Blood Donation & Healthcare" },
  { key: "child-education", label: "Child Education" },
  { key: "beti-bachao", label: "Beti Bachao Initiative" },
  { key: "cloth-distribution", label: "Cloth Distribution" },
  { key: "senior-citizen", label: "Senior Citizen Welfare" },
  { key: "environment", label: "Environment Awareness" },
];

const TAG_COLORS = [
  { value: "bg-coral", label: "Coral" },
  { value: "bg-teal", label: "Teal" },
  { value: "bg-gold", label: "Gold" },
];

const STATUS_STYLES = {
  new: "bg-coral/10 text-coral",
  contacted: "bg-gold/15 text-amber-700",
  onboarded: "bg-teal/10 text-teal",
  verified: "bg-teal/10 text-teal",
};

const STORAGE_KEYS = {
  auth: "dms_admin_auth",
  gallery: "dms_admin_gallery",
  team: "dms_admin_team",
  events: "dms_admin_events",
  content: "dms_admin_content",
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

let idSeed = Date.now();
const genId = () => `id_${idSeed++}`;

// ─── Toast Hook ───────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  return [toast, showToast];
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-fade-in-up">
      <div className="flex items-center gap-3 bg-teal text-cream rounded-2xl shadow-2xl px-5 py-3.5">
        <div className="w-7 h-7 rounded-full bg-cream/20 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4" />
        </div>
        <p className="font-medium text-sm">{message}</p>
      </div>
    </div>
  );
}

// ─── Shared field styles ──────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all duration-200 text-charcoal placeholder:text-charcoal/35 text-sm";
const labelCls =
  "block text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1.5";

function ImageUploadField({ label = "Image URL", value, onChange, showToast }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
      showToast("Image uploaded successfully");
    } catch (err) {
      showToast(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} min-w-0 flex-1`}
          placeholder="Paste image URL"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2.5 rounded-xl border border-charcoal/15 text-charcoal font-medium text-sm hover:bg-cream/60 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
        >
          <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────

function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await login(username.trim(), password);
      setToken(token);
      onSuccess();
    } catch (err) {
      setError(
        err.message || "Invalid username or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-charcoal p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-coral/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 border-2 border-gold/20 rounded-full" />

      <div className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-[28px] overflow-hidden shadow-2xl">
        {/* Left brand panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-teal via-teal to-[#0a3f39] p-10 text-cream relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-52 h-52 bg-gold/10 rounded-full" />
          <div className="absolute bottom-0 -left-10 w-64 h-64 bg-cream/5 rounded-full" />

          <div className="relative">
            <img
              src={logo}
              alt="DMS AAROHI"
              className="h-12 object-contain bg-cream rounded-xl p-1.5 mb-8"
            />
            <span className="inline-block text-gold font-semibold uppercase tracking-[0.25em] text-xs mb-3">
              Admin Console
            </span>
            <h2 className="font-display font-bold text-3xl leading-tight mb-4">
              Manage your
              <br />
              impact, in one place.
            </h2>
            <p className="text-cream/70 text-sm leading-relaxed max-w-xs">
              Update galleries, team profiles, events, and initiative content
              across the DMS AAROHI website.
            </p>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <p className="text-xs text-cream/60">
              Access restricted to authorized administrators only.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
          <div className="md:hidden mb-6 text-center">
            <img
              src={logo}
              alt="DMS AAROHI"
              className="h-10 object-contain mx-auto mb-3"
            />
          </div>
          <span className="inline-block text-coral font-semibold uppercase tracking-[0.25em] text-xs mb-2">
            Welcome Back
          </span>
          <h3 className="font-display font-bold text-2xl text-charcoal mb-1">
            Admin Sign In
          </h3>
          <p className="text-charcoal/55 text-sm mb-7">
            Enter your credentials to access the admin panel.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={labelCls}>Username</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-charcoal/35 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className={`${inputCls} pl-11`}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className={labelCls}>Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal/35 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`${inputCls} pl-11 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/35 hover:text-charcoal/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 bg-coral/10 border border-coral/20 text-coral text-sm rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 rounded-full bg-coral text-cream font-semibold shadow-lg shadow-coral/30 hover:bg-coral-dark hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 text-center text-sm text-charcoal/50 hover:text-teal transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Back to website
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "hero", label: "Hero & About Images", icon: Layers },
  { key: "team", label: "Team", icon: Users },
  { key: "events", label: "Events", icon: Calendar },
  { key: "content", label: "Initiative Content", icon: FileText },
  { key: "volunteers", label: "Volunteers", icon: ClipboardList },
  { key: "donors", label: "Blood Donors", icon: Droplet },
];

function Sidebar({ active, setActive, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-charcoal text-cream z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-cream/10">
          <img
            src={logo}
            alt="DMS AAROHI"
            className="h-9 object-contain bg-cream rounded-lg p-1 mb-4"
          />
          <p className="font-display font-bold text-lg leading-tight">
            Admin Panel
          </p>
          <p className="text-cream/45 text-xs mt-0.5">DMS AAROHI</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActive(item.key);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-coral text-cream shadow-lg shadow-coral/20"
                    : "text-cream/60 hover:bg-cream/5 hover:text-cream"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream/10 space-y-1.5">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-cream/60 hover:bg-cream/5 hover:text-cream transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            View Website
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-coral hover:bg-coral/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────
function DashboardOverview({ setActive }) {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats(null));
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const INITIATIVE_LABELS = {
    home: "Homepage",
    "blood-donation": "Blood Donation & Healthcare",
    "child-education": "Child Education",
    "beti-bachao": "Beti Bachao Initiative",
    "cloth-distribution": "Cloth Distribution",
    "senior-citizen": "Senior Citizen Welfare",
    environment: "Environment Awareness",
  };

  const cards = [
    { label: "Team Members", value: stats?.teamCount ?? "—", icon: Users, color: "bg-teal", tab: "team" },
    { label: "Upcoming Events", value: stats?.eventsCount ?? "—", icon: Calendar, color: "bg-gold", tab: "events" },
    { label: "Volunteer Registrations", value: stats?.volunteersCount ?? "—", icon: ClipboardList, color: "bg-teal", tab: "volunteers" },
    { label: "Blood Donor Registrations", value: stats?.bloodDonorsCount ?? "—", icon: Droplet, color: "bg-coral", tab: "donors" },
  ];

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal via-teal to-[#0a3f39] text-cream p-7 md:p-9 mb-8">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-gold/10 rounded-full" />
        <div className="absolute -bottom-16 -left-10 w-64 h-64 bg-cream/5 rounded-full" />
        <div className="relative">
          <span className="inline-block text-gold font-semibold uppercase tracking-[0.25em] text-xs mb-3">
            Admin Console
          </span>
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-1">
            Welcome back, Admin 👋
          </h2>
          <p className="text-cream/70 max-w-lg">
             Every change here is saved to the database
            and reflects live on the website instantly.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => setActive(c.tab)}
              className="text-left bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center mb-4 shadow-md`}
              >
                <Icon className="w-6 h-6 text-cream" />
              </div>
              <p className="font-display font-bold text-3xl text-charcoal mb-1">
                {c.value}
              </p>
              <p className="text-charcoal/55 text-sm font-medium flex items-center gap-1">
                {c.label}
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-charcoal/5">
          <h3 className="font-display font-bold text-lg text-charcoal mb-4">
            Gallery by Initiative
          </h3>
          <div className="space-y-3">
            {stats &&
              Object.entries(stats.galleryByInitiative).map(([key, count]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3"
                >
                  <p className="text-sm text-charcoal/70 truncate">
                    {INITIATIVE_LABELS[key] || key}
                  </p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-28 h-1.5 rounded-full bg-cream overflow-hidden">
                      <div
                        className="h-full bg-coral rounded-full"
                        style={{
                          width: `${Math.min(100, (count / 12) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-charcoal w-6 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-charcoal/5">
          <h3 className="font-display font-bold text-lg text-charcoal mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Add Gallery Image",
                tab: "gallery",
                icon: ImageIcon,
                color: "text-coral",
              },
              {
                label: "Add Team Member",
                tab: "team",
                icon: Users,
                color: "text-teal",
              },
              {
                label: "Add Event",
                tab: "events",
                icon: Calendar,
                color: "text-gold",
              },
              {
                label: "Edit Initiative Text",
                tab: "content",
                icon: FileText,
                color: "text-coral",
              },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={() => setActive(a.tab)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-charcoal/10 hover:border-coral/40 hover:bg-coral/5 transition-all duration-200 text-sm font-medium text-charcoal"
                >
                  <Icon className={`w-4 h-4 ${a.color}`} />
                  {a.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-charcoal/8">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40 mb-3">
              Upcoming Events
            </p>
            <div className="space-y-2">
              {events.slice(0, 3).map((e) => (
                <div key={e._id} className="flex items-center gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-charcoal/70 truncate">{e.title}</span>
                  <span className="text-charcoal/40 text-xs ml-auto flex-shrink-0">
                    {e.date}
                  </span>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-charcoal/40">No events yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gallery Manager ──────────────────────────────────────────────────────
const ADMIN_INITIATIVES = [
  { key: "home", label: "Homepage" },
  { key: "blood-donation", label: "Blood Donation & Healthcare" },
  { key: "child-education", label: "Child Education" },
  { key: "beti-bachao", label: "Beti Bachao Initiative" },
  { key: "cloth-distribution", label: "Cloth Distribution" },
  { key: "senior-citizen", label: "Senior Citizen Welfare" },
  { key: "environment", label: "Environment Awareness" },
];

function GalleryManager({ showToast }) {
  const [selected, setSelected] = useState(ADMIN_INITIATIVES[0].key);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    getGallery(selected)
      .then(setImages)
      .catch(() => showToast("Failed to load gallery"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const addImage = async () => {
    if (!newUrl.trim()) return;
    try {
      await addGalleryImage(selected, newUrl.trim());
      setNewUrl("");
      load();
      showToast("Image added — now live on the website");
    } catch (err) {
      showToast(err.message || "Failed to add image");
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      await addGalleryImage(selected, url);
      load();
      showToast("Image uploaded and added to the website");
    } catch (err) {
      showToast(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = async (id) => {
    try {
      await deleteGalleryImage(selected, id);
      setImages((prev) => prev.filter((img) => img._id !== id));
      showToast("Image removed from the website");
    } catch (err) {
      showToast(err.message || "Failed to remove image");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">
            Gallery Management
          </h2>
          <p className="text-charcoal/55 text-sm mt-1">
            Changes here appear directly in this page's gallery on the live
            website.
          </p>
        </div>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={`${inputCls} sm:w-72`}
        >
          {ADMIN_INITIATIVES.map((i) => (
            <option key={i.key} value={i.key}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-charcoal/5 mb-6">
        <p className="text-sm font-semibold text-charcoal mb-3">
          Add New Image
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Paste image URL, or upload from your device →"
            className={`${inputCls} flex-1`}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl border border-charcoal/15 text-charcoal font-medium text-sm hover:bg-cream/60 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />{" "}
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <button
            type="button"
            onClick={addImage}
            disabled={!newUrl.trim()}
            className="px-6 py-2.5 rounded-xl bg-coral text-cream font-semibold text-sm shadow-md hover:bg-coral-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-40 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-charcoal/40 text-sm">Loading gallery...</p>
      ) : images.length === 0 ? (
        <EmptyState icon={ImageIcon} text="No images for this page yet." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img._id}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-charcoal/5"
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-colors duration-200 flex items-center justify-center">
                <button
                  onClick={() => removeImage(img._id)}
                  className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-full bg-coral text-cream flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HeroImagesManager({ showToast }) {
  const [selected, setSelected] = useState(ADMIN_INITIATIVES[0].key);
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(true);
  const [slideForm, setSlideForm] = useState({ image: "", title: "", subtitle: "" });
  const [uploadingSlide, setUploadingSlide] = useState(false);
  const slideFileRef = useRef(null);

  const [aboutImage, setAboutImage] = useState("");
  const [loadingAbout, setLoadingAbout] = useState(true);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const aboutFileRef = useRef(null);

  const loadSlides = () => {
    setLoadingSlides(true);
    getHeroSlides(selected).then(setSlides).catch(() => showToast("Failed to load hero slides")).finally(() => setLoadingSlides(false));
  };
  const loadAbout = () => {
    setLoadingAbout(true);
    getContent(selected).then((data) => setAboutImage(data?.aboutImage || "")).catch(() => setAboutImage("")).finally(() => setLoadingAbout(false));
  };

  useEffect(() => { loadSlides(); loadAbout(); }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const addSlide = async () => {
    if (!slideForm.image.trim()) return;
    try {
      await addHeroSlide(selected, slideForm);
      setSlideForm({ image: "", title: "", subtitle: "" });
      loadSlides();
      showToast("Hero slide added — now live on the website");
    } catch (err) {
      showToast(err.message || "Failed to add slide");
    }
  };

  const handleSlideFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlide(true);
    try {
      const { url } = await uploadImage(file);
      setSlideForm((f) => ({ ...f, image: url }));
    } catch (err) {
      showToast(err.message || "Upload failed");
    } finally {
      setUploadingSlide(false);
      e.target.value = "";
    }
  };

  const removeSlide = async (id) => {
    try {
      await deleteHeroSlide(selected, id);
      setSlides((prev) => prev.filter((s) => s._id !== id));
      showToast("Hero slide removed");
    } catch (err) {
      showToast(err.message || "Failed to remove slide");
    }
  };

  const handleAboutFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAbout(true);
    try {
      const { url } = await uploadImage(file);
      setAboutImage(url);
      await updateContent(selected, { aboutImage: url });
      showToast("About image updated — now live on the website");
    } catch (err) {
      showToast(err.message || "Upload failed");
    } finally {
      setUploadingAbout(false);
      e.target.value = "";
    }
  };

  const saveAboutUrl = async () => {
    try {
      await updateContent(selected, { aboutImage });
      showToast("About image updated — now live on the website");
    } catch (err) {
      showToast(err.message || "Failed to save about image");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">Hero & About Images</h2>
          <p className="text-charcoal/55 text-sm mt-1">Manage the rotating hero slider and the About section photo for each page.</p>
        </div>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className={`${inputCls} sm:w-72`}>
          {ADMIN_INITIATIVES.map((i) => <option key={i.key} value={i.key}>{i.label}</option>)}
        </select>
      </div>

      {/* Hero Slides */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-charcoal/5 mb-6">
        <p className="text-sm font-semibold text-charcoal mb-3">Hero Slider Images</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input type="text" value={slideForm.title} onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })} placeholder="Slide title" className={inputCls} />
          <input type="text" value={slideForm.subtitle} onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })} placeholder="Slide subtitle" className={inputCls} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={slideForm.image}
            onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
            placeholder="Paste image URL, or upload →"
            className={`${inputCls} flex-1`}
          />
          <input ref={slideFileRef} type="file" accept="image/*" onChange={handleSlideFile} className="hidden" />
          <button type="button" onClick={() => slideFileRef.current?.click()} disabled={uploadingSlide} className="px-5 py-2.5 rounded-xl border border-charcoal/15 text-charcoal font-medium text-sm hover:bg-cream/60 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50">
            <Upload className="w-4 h-4" /> {uploadingSlide ? "Uploading..." : "Upload"}
          </button>
          <button type="button" onClick={addSlide} disabled={!slideForm.image.trim()} className="px-6 py-2.5 rounded-xl bg-coral text-cream font-semibold text-sm shadow-md hover:bg-coral-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-40 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        {loadingSlides ? (
          <p className="text-charcoal/40 text-sm mt-4">Loading slides...</p>
        ) : slides.length === 0 ? (
          <p className="text-charcoal/40 text-sm mt-4">No custom slides yet — the page is showing its built-in default slides.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            {slides.map((slide) => (
              <div key={slide._id} className="group relative rounded-2xl overflow-hidden shadow-sm border border-charcoal/5 aspect-[4/5]">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-cream text-xs font-semibold truncate">{slide.title}</p>
                </div>
                <button onClick={() => removeSlide(slide._id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-coral text-cream flex items-center justify-center shadow-lg transition-all duration-200">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Image */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-charcoal/5">
        <p className="text-sm font-semibold text-charcoal mb-3">About Section Image</p>
        {loadingAbout ? (
          <p className="text-charcoal/40 text-sm">Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-[160px_1fr] gap-5 items-start">
            <div className="w-full sm:w-40 aspect-[4/5] rounded-2xl overflow-hidden bg-cream border border-charcoal/10 flex-shrink-0">
              {aboutImage ? (
                <img src={aboutImage} alt="About section" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal/25"><ImageIcon className="w-6 h-6" /></div>
              )}
            </div>
            <div>
              <p className="text-xs text-charcoal/50 mb-3">
                {aboutImage ? "This image is live on the website." : "No custom image set — the page is using its built-in default photo."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={aboutImage} onChange={(e) => setAboutImage(e.target.value)} placeholder="Paste image URL, or upload →" className={`${inputCls} flex-1`} />
                <input ref={aboutFileRef} type="file" accept="image/*" onChange={handleAboutFile} className="hidden" />
                <button type="button" onClick={() => aboutFileRef.current?.click()} disabled={uploadingAbout} className="px-5 py-2.5 rounded-xl border border-charcoal/15 text-charcoal font-medium text-sm hover:bg-cream/60 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50">
                  <Upload className="w-4 h-4" /> {uploadingAbout ? "Uploading..." : "Upload"}
                </button>
                <button type="button" onClick={saveAboutUrl} className="px-6 py-2.5 rounded-xl bg-teal text-cream font-semibold text-sm shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 whitespace-nowrap">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VolunteersManager({ showToast }) {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    getVolunteers().then(setVolunteers).catch(() => showToast("Failed to load volunteers")).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatus = async (id, status) => {
    try {
      await updateVolunteerStatus(id, status);
      setVolunteers((prev) => prev.map((v) => (v._id === id ? { ...v, status } : v)));
    } catch (err) {
      showToast(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVolunteer(id);
      setVolunteers((prev) => prev.filter((v) => v._id !== id));
      showToast("Volunteer entry removed");
    } catch (err) {
      showToast(err.message || "Failed to remove entry");
    }
  };

  const filtered = volunteers.filter((v) =>
    `${v.name} ${v.email} ${v.phone} ${v.city}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">Volunteer Registrations</h2>
          <p className="text-charcoal/55 text-sm mt-1">People who submitted the "Become a Volunteer" form on the website.</p>
        </div>
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-charcoal/35 absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone..." className={`${inputCls} pl-11`} />
        </div>
      </div>

      {loading ? (
        <p className="text-charcoal/40 text-sm">Loading volunteers...</p>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} text="No volunteer registrations yet." />
      ) : (
        <div className="space-y-4">
          {filtered.map((v) => (
            <div key={v._id} className="bg-white rounded-2xl p-5 shadow-sm border border-charcoal/5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-display font-bold text-charcoal">{v.name}</p>
                  <p className="text-xs text-charcoal/45 mt-0.5">
                    Submitted {new Date(v.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={v.status} onChange={(e) => handleStatus(v._id, e.target.value)} className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 ${STATUS_STYLES[v.status]}`}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="onboarded">Onboarded</option>
                  </select>
                  <button onClick={() => handleDelete(v._id)} className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center hover:bg-coral hover:text-cream transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                <p className="flex items-center gap-2 text-charcoal/70"><Phone className="w-3.5 h-3.5 text-coral flex-shrink-0" /> {v.phone}</p>
                <p className="flex items-center gap-2 text-charcoal/70 truncate"><Mail className="w-3.5 h-3.5 text-coral flex-shrink-0" /> {v.email}</p>
                {v.city && <p className="text-charcoal/70">City: {v.city}</p>}
                {v.age && <p className="text-charcoal/70">Age: {v.age}</p>}
                {v.occupation && <p className="text-charcoal/70">Occupation: {v.occupation}</p>}
                {v.availability && <p className="text-charcoal/70">Availability: {v.availability}</p>}
                {v.mode && <p className="text-charcoal/70">Mode: {v.mode}</p>}
                {v.interestArea && <p className="text-charcoal/70">Interest: {v.interestArea}</p>}
                {v.heardFrom && <p className="text-charcoal/70">Heard from: {v.heardFrom}</p>}
              </div>
              {v.message && <p className="mt-3 text-sm text-charcoal/60 bg-cream/60 rounded-xl p-3">{v.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BloodDonorsManager({ showToast }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    getBloodDonors().then(setDonors).catch(() => showToast("Failed to load blood donors")).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatus = async (id, status) => {
    try {
      await updateBloodDonorStatus(id, status);
      setDonors((prev) => prev.map((d) => (d._id === id ? { ...d, status } : d)));
    } catch (err) {
      showToast(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBloodDonor(id);
      setDonors((prev) => prev.filter((d) => d._id !== id));
      showToast("Blood donor entry removed");
    } catch (err) {
      showToast(err.message || "Failed to remove entry");
    }
  };

  const filtered = donors.filter((d) =>
    `${d.name} ${d.email} ${d.phone} ${d.city} ${d.bloodGroup}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">Blood Donor Registrations</h2>
          <p className="text-charcoal/55 text-sm mt-1">People who registered as blood donors on the Blood Donation page.</p>
        </div>
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-charcoal/35 absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, blood group..." className={`${inputCls} pl-11`} />
        </div>
      </div>

      {loading ? (
        <p className="text-charcoal/40 text-sm">Loading donors...</p>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Droplet} text="No blood donor registrations yet." />
      ) : (
        <div className="space-y-4">
          {filtered.map((d) => (
            <div key={d._id} className="bg-white rounded-2xl p-5 shadow-sm border border-charcoal/5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {d.bloodGroup && (
                    <span className="w-10 h-10 rounded-full bg-coral text-cream font-bold text-xs flex items-center justify-center flex-shrink-0">{d.bloodGroup}</span>
                  )}
                  <div>
                    <p className="font-display font-bold text-charcoal">{d.name}</p>
                    <p className="text-xs text-charcoal/45 mt-0.5">
                      Registered {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={d.status} onChange={(e) => handleStatus(d._id, e.target.value)} className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 ${STATUS_STYLES[d.status]}`}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="verified">Verified</option>
                  </select>
                  <button onClick={() => handleDelete(d._id)} className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center hover:bg-coral hover:text-cream transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                <p className="flex items-center gap-2 text-charcoal/70"><Phone className="w-3.5 h-3.5 text-coral flex-shrink-0" /> {d.phone}</p>
                <p className="flex items-center gap-2 text-charcoal/70 truncate"><Mail className="w-3.5 h-3.5 text-coral flex-shrink-0" /> {d.email}</p>
                {d.city && <p className="text-charcoal/70">City: {d.city}</p>}
                {d.age && <p className="text-charcoal/70">Age: {d.age}</p>}
                {d.weight && <p className="text-charcoal/70">Weight: {d.weight} kg</p>}
                {d.lastDonationDate && <p className="text-charcoal/70">Last donation: {d.lastDonationDate}</p>}
                {d.preferredCamp && <p className="text-charcoal/70">Preferred camp: {d.preferredCamp}</p>}
              </div>
              {d.notes && <p className="mt-3 text-sm text-charcoal/60 bg-cream/60 rounded-xl p-3">{d.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Team Manager ─────────────────────────────────────────────────────────
function TeamManager({ showToast }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const emptyForm = { name: "", role: "", image: "" };
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    getTeam()
      .then(setTeam)
      .catch(() => showToast("Failed to load team"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };
  const openEdit = (m) => {
    setForm({ name: m.name, role: m.role, image: m.image });
    setEditingId(m._id);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    try {
      if (editingId) {
        await updateTeamMember(editingId, form);
        showToast("Team member updated on the website");
      } else {
        await createTeamMember(form);
        showToast("Team member added to the website");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      showToast(err.message || "Failed to save member");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeamMember(id);
      setTeam((prev) => prev.filter((m) => m._id !== id));
      showToast("Team member removed");
    } catch (err) {
      showToast(err.message || "Failed to remove member");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">
            Team Management
          </h2>
          <p className="text-charcoal/55 text-sm mt-1">
            Changes here appear in the Team section on the Homepage.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-coral text-cream font-semibold text-sm shadow-md hover:bg-coral-dark transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {formOpen && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-charcoal/5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-charcoal">
              {editingId ? "Edit Member" : "New Member"}
            </p>
            <button
              onClick={() => setFormOpen(false)}
              className="text-charcoal/40 hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
                placeholder="e.g. Pankaj Mathur"
              />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputCls}
                placeholder="e.g. President"
              />
            </div>
            <ImageUploadField
              label="Photo URL"
              value={form.image}
              onChange={(image) => setForm({ ...form, image })}
              showToast={showToast}
            />
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-teal text-cream font-semibold text-sm shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />{" "}
            {editingId ? "Update Member" : "Save Member"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-charcoal/40 text-sm">Loading team...</p>
      ) : team.length === 0 ? (
        <EmptyState icon={Users} text="No team members added yet." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-charcoal/5 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/25">
                    <UserIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-charcoal truncate">
                  {member.name}
                </p>
                <p className="text-coral text-sm font-medium truncate">
                  {member.role}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openEdit(member)}
                  className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center hover:bg-teal hover:text-cream transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center hover:bg-coral hover:text-cream transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Events Manager ───────────────────────────────────────────────────────

function EventsManager({ showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const emptyForm = {
    title: "",
    date: "",
    location: "",
    desc: "",
    image: "",
    tag: "Event",
    tagColor: "bg-coral",
    icon: "📅",
  };
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    getEvents()
      .then(setEvents)
      .catch(() => showToast("Failed to load events"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };
  const openEdit = (event) => {
    setForm({ ...emptyForm, ...event });
    setEditingId(event._id);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date.trim()) return;
    try {
      if (editingId) {
        await updateEvent(editingId, form);
        showToast("Event updated on the website");
      } else {
        await createEvent(form);
        showToast("Event added to the website");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      showToast(err.message || "Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      showToast("Event removed");
    } catch (err) {
      showToast(err.message || "Failed to remove event");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">
            Events Management
          </h2>
          <p className="text-charcoal/55 text-sm mt-1">
            Changes here appear in "Upcoming Events" on the Homepage.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-coral text-cream font-semibold text-sm shadow-md hover:bg-coral-dark transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {formOpen && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-charcoal/5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-charcoal">
              {editingId ? "Edit Event" : "New Event"}
            </p>
            <button
              onClick={() => setFormOpen(false)}
              className="text-charcoal/40 hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Event Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
                placeholder="e.g. Blood Donation Camp"
              />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputCls}
                placeholder="e.g. September 2026"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputCls}
              placeholder="e.g. Surya Nagar, Ghaziabad"
            />
          </div>
          <div className="mb-4">
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              className={`${inputCls} resize-none`}
              placeholder="Short description"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <ImageUploadField
              label="Cover Image URL"
              value={form.image}
              onChange={(image) => setForm({ ...form, image })}
              showToast={showToast}
            />
            <div>
              <label className={labelCls}>Tag Label</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className={inputCls}
                placeholder="e.g. Health Camp"
              />
            </div>
            <div>
              <label className={labelCls}>Tag Color</label>
              <select
                value={form.tagColor}
                onChange={(e) => setForm({ ...form, tagColor: e.target.value })}
                className={inputCls}
              >
                {TAG_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4 sm:w-1/3">
            <label className={labelCls}>Emoji Icon</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className={inputCls}
              placeholder="e.g. 🩸"
            />
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-teal text-cream font-semibold text-sm shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />{" "}
            {editingId ? "Update Event" : "Save Event"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-charcoal/40 text-sm">Loading events...</p>
      ) : events.length === 0 ? (
        <EmptyState icon={Calendar} text="No events added yet." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal/5 flex"
            >
              <div className="w-28 flex-shrink-0 bg-cream">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/25">
                    <Calendar className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`${event.tagColor} text-cream text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}
                  >
                    {event.tag}
                  </span>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => openEdit(event)}
                      className="w-7 h-7 rounded-lg bg-teal/10 text-teal flex items-center justify-center hover:bg-teal hover:text-cream transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="w-7 h-7 rounded-lg bg-coral/10 text-coral flex items-center justify-center hover:bg-coral hover:text-cream transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="font-display font-bold text-charcoal text-sm truncate">
                  {event.title}
                </p>
                <p className="text-charcoal/55 text-xs mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {event.date}
                </p>
                <p className="text-charcoal/55 text-xs mt-0.5 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 flex-shrink-0" /> {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Initiative Content Manager ───────────────────────────────────────────

function ContentManager({ showToast }) {
  const editableInitiatives = ADMIN_INITIATIVES.filter((i) => i.key !== "home");
  const [selected, setSelected] = useState(editableInitiatives[0].key);
  const [loading, setLoading] = useState(true);
  const emptyForm = {
    heroTitle: "",
    heroTagline: "",
    aboutText: "",
    ctaTitle: "",
    ctaBody: "",
    ctaButtonLabel: "",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setLoading(true);
    getContent(selected)
      .then((data) => setForm(data || emptyForm))
      .catch(() => setForm(emptyForm))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleSave = async () => {
    try {
      await updateContent(selected, form);
      showToast("Initiative content saved — now live on the website");
    } catch (err) {
      showToast(err.message || "Failed to save content");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">
            Initiative Content Management
          </h2>
          <p className="text-charcoal/55 text-sm mt-1">
            Edit hero, about, and CTA text for each initiative page.
          </p>
        </div>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={`${inputCls} sm:w-72`}
        >
          {editableInitiatives.map((i) => (
            <option key={i.key} value={i.key}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-charcoal/40 text-sm">Loading content...</p>
      ) : (
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-charcoal/5 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-coral mb-4">
              Hero Section
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Hero Title</label>
                <input
                  type="text"
                  value={form.heroTitle}
                  onChange={(e) =>
                    setForm({ ...form, heroTitle: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Hero Tagline</label>
                <input
                  type="text"
                  value={form.heroTagline}
                  onChange={(e) =>
                    setForm({ ...form, heroTagline: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
            </div>
            {/* <div className="mt-4">
              <ImageUploadField
                label="Hero Image URL"
                value={form.heroImage}
                onChange={(heroImage) => setForm({ ...form, heroImage })}
                showToast={showToast}
              />
            </div> */}
          </div>
          <div className="h-px bg-charcoal/8" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal mb-4">
              About Section
            </p>
            <label className={labelCls}>About Paragraphs (one per line)</label>
            <textarea
              rows={6}
              value={form.aboutText}
              onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="h-px bg-charcoal/8" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold mb-4">
              Call To Action
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>CTA Title</label>
                <input
                  type="text"
                  value={form.ctaTitle}
                  onChange={(e) =>
                    setForm({ ...form, ctaTitle: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>CTA Button Label</label>
                <input
                  type="text"
                  value={form.ctaButtonLabel}
                  onChange={(e) =>
                    setForm({ ...form, ctaButtonLabel: e.target.value })
                  }
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>CTA Body Text</label>
              <textarea
                rows={2}
                value={form.ctaBody}
                onChange={(e) => setForm({ ...form, ctaBody: e.target.value })}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-7 py-3 rounded-full bg-coral text-cream font-semibold text-sm shadow-lg shadow-coral/30 hover:bg-coral-dark hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
// ─── Empty State ──────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-dashed border-charcoal/15 text-center">
      <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-charcoal/30" />
      </div>
      <p className="text-charcoal/50 text-sm">{text}</p>
    </div>
  );
}

// ─── Main Dashboard Shell ─────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, showToast] = useToast();
  const activeLabel = NAV_ITEMS.find((n) => n.key === active)?.label || "";

  return (
    <div className="min-h-screen bg-[#FBF7F0] font-body text-charcoal">
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="md:ml-64">
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-charcoal/5 px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-charcoal p-1.5 -ml-1.5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="font-display font-bold text-charcoal">
              {activeLabel}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-cream font-semibold text-sm">
              A
            </div>
            <span className="hidden sm:inline text-sm font-medium text-charcoal/70">
              Admin
            </span>
          </div>
        </div>
        <main className="p-5 md:p-8">
          {active === "dashboard" && <DashboardOverview setActive={setActive} />}
          {active === "gallery" && <GalleryManager showToast={showToast} />}
          {active === "hero" && <HeroImagesManager showToast={showToast} />}
          {active === "team" && <TeamManager showToast={showToast} />}
          {active === "events" && <EventsManager showToast={showToast} />}
          {active === "content" && <ContentManager showToast={showToast} />}
          {active === "volunteers" && <VolunteersManager showToast={showToast} />}
          {active === "donors" && <BloodDonorsManager showToast={showToast} />}
        </main>
      </div>
      <Toast message={toast} />
    </div>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(isLoggedIn());

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        clearToken();
        setAuthed(false);
      }}
    />
  );
}
