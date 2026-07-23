
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
} from "lucide-react";
import logo from "../assets/logo.png";

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

// ─── Admin Login ──────────────────────────────────────────────────────────

function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (
        username.trim() === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        saveJSON(STORAGE_KEYS.auth, true);
        onSuccess();
      } else {
        setError("Invalid username or password. Please try again.");
      }
      setLoading(false);
    }, 500);
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
            <img src={logo} alt="DMS AAROHI" className="h-12 object-contain bg-cream rounded-xl p-1.5 mb-8" />
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
            <img src={logo} alt="DMS AAROHI" className="h-10 object-contain mx-auto mb-3" />
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
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
  { key: "team", label: "Team", icon: Users },
  { key: "events", label: "Events", icon: Calendar },
  { key: "content", label: "Initiative Content", icon: FileText },
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
          <img src={logo} alt="DMS AAROHI" className="h-9 object-contain bg-cream rounded-lg p-1 mb-4" />
          <p className="font-display font-bold text-lg leading-tight">Admin Panel</p>
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

function DashboardOverview({ gallery, team, events, setActive }) {
  const totalImages = Object.values(gallery).reduce((sum, arr) => sum + arr.length, 0);

  const cards = [
    { label: "Gallery Images", value: totalImages, icon: ImageIcon, color: "bg-coral", tab: "gallery" },
    { label: "Team Members", value: team.length, icon: Users, color: "bg-teal", tab: "team" },
    { label: "Upcoming Events", value: events.length, icon: Calendar, color: "bg-gold", tab: "events" },
    { label: "Initiatives", value: INITIATIVES.length - 1, icon: FileText, color: "bg-coral", tab: "content" },
  ];

  return (
    <div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-1">
        Welcome back, Admin 👋
      </h2>
      <p className="text-charcoal/55 mb-8">
        Here's a quick overview of your website's content.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => setActive(c.tab)}
              className="text-left bg-white rounded-2xl p-6 shadow-sm border border-charcoal/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center mb-4 shadow-md`}>
                <Icon className="w-6 h-6 text-cream" />
              </div>
              <p className="font-display font-bold text-3xl text-charcoal mb-1">{c.value}</p>
              <p className="text-charcoal/55 text-sm font-medium flex items-center gap-1">
                {c.label}
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-charcoal/5">
        <h3 className="font-display font-bold text-xl text-charcoal mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Add Gallery Image", tab: "gallery", icon: ImageIcon, color: "text-coral" },
            { label: "Add Team Member", tab: "team", icon: Users, color: "text-teal" },
            { label: "Add Event", tab: "events", icon: Calendar, color: "text-gold" },
            { label: "Edit Initiative", tab: "content", icon: FileText, color: "text-coral" },
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
      </div>
    </div>
  );
}

// ─── Gallery Manager ──────────────────────────────────────────────────────

function GalleryManager({ gallery, setGallery, showToast }) {
  const [selected, setSelected] = useState(INITIATIVES[0].key);
  const [newUrl, setNewUrl] = useState("");
  const fileInputRef = useRef(null);

  const images = gallery[selected] || [];

  const commit = (updatedImages) => {
    const updated = { ...gallery, [selected]: updatedImages };
    setGallery(updated);
    saveJSON(STORAGE_KEYS.gallery, updated);
  };

  const addImage = () => {
    if (!newUrl.trim()) return;
    commit([...images, { id: genId(), url: newUrl.trim() }]);
    setNewUrl("");
    showToast("Image added to gallery");
  };

  const removeImage = (id) => {
    commit(images.filter((img) => img.id !== id));
    showToast("Image removed");
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">Gallery Management</h2>
          <p className="text-charcoal/55 text-sm mt-1">Manage photos shown in each initiative's gallery.</p>
        </div>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={`${inputCls} sm:w-72`}
        >
          {INITIATIVES.map((i) => (
            <option key={i.key} value={i.key}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      {/* Add image */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-charcoal/5 mb-6">
        <p className="text-sm font-semibold text-charcoal mb-3">Add New Image</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={typeof newUrl === "string" && newUrl.startsWith("data:") ? "Image selected from device" : newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Paste image URL, or upload from your device →"
            className={`${inputCls} flex-1`}
          />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl border border-charcoal/15 text-charcoal font-medium text-sm hover:bg-cream/60 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button
            type="button"
            onClick={addImage}
            disabled={!newUrl.trim()}
            className="px-6 py-2.5 rounded-xl bg-coral text-cream font-semibold text-sm shadow-md hover:bg-coral-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-40 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Images grid */}
      {images.length === 0 ? (
        <EmptyState icon={ImageIcon} text="No images yet for this initiative. Add your first one above." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-charcoal/5"
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-colors duration-200 flex items-center justify-center">
                <button
                  onClick={() => removeImage(img.id)}
                  className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-full bg-coral text-cream flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
                  aria-label="Remove image"
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

// ─── Team Manager ─────────────────────────────────────────────────────────

function TeamManager({ team, setTeam, showToast }) {
  const emptyForm = { name: "", role: "", image: "" };
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const commit = (updated) => {
    setTeam(updated);
    saveJSON(STORAGE_KEYS.team, updated);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (member) => {
    setForm({ name: member.name, role: member.role, image: member.image });
    setEditingId(member.id);
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.role.trim()) return;
    if (editingId) {
      commit(team.map((m) => (m.id === editingId ? { ...m, ...form } : m)));
      showToast("Team member updated");
    } else {
      commit([...team, { id: genId(), ...form }]);
      showToast("Team member added");
    }
    setFormOpen(false);
  };

  const handleDelete = (id) => {
    commit(team.filter((m) => m.id !== id));
    showToast("Team member removed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">Team Management</h2>
          <p className="text-charcoal/55 text-sm mt-1">Manage the team members shown on the Homepage.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-coral text-cream font-semibold text-sm shadow-md hover:bg-coral-dark transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {formOpen && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-charcoal/5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-charcoal">{editingId ? "Edit Member" : "New Member"}</p>
            <button onClick={() => setFormOpen(false)} className="text-charcoal/40 hover:text-charcoal">
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
            <div>
              <label className={labelCls}>Photo URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className={inputCls}
                placeholder="Image URL"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-teal text-cream font-semibold text-sm shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingId ? "Update Member" : "Save Member"}
          </button>
        </div>
      )}

      {team.length === 0 ? (
        <EmptyState icon={Users} text="No team members added yet." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-charcoal/5 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/25">
                    <UserIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-charcoal truncate">{member.name}</p>
                <p className="text-coral text-sm font-medium truncate">{member.role}</p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openEdit(member)}
                  className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center hover:bg-teal hover:text-cream transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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

function EventsManager({ events, setEvents, showToast }) {
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

  const commit = (updated) => {
    setEvents(updated);
    saveJSON(STORAGE_KEYS.events, updated);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setForm({ ...emptyForm, ...event });
    setEditingId(event.id);
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.date.trim()) return;
    if (editingId) {
      commit(events.map((e) => (e.id === editingId ? { ...e, ...form } : e)));
      showToast("Event updated");
    } else {
      commit([...events, { id: genId(), ...form }]);
      showToast("Event added");
    }
    setFormOpen(false);
  };

  const handleDelete = (id) => {
    commit(events.filter((e) => e.id !== id));
    showToast("Event removed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">Events Management</h2>
          <p className="text-charcoal/55 text-sm mt-1">Manage the "Upcoming Events" shown on the Homepage.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-coral text-cream font-semibold text-sm shadow-md hover:bg-coral-dark transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {formOpen && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-charcoal/5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-charcoal">{editingId ? "Edit Event" : "New Event"}</p>
            <button onClick={() => setFormOpen(false)} className="text-charcoal/40 hover:text-charcoal">
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
              placeholder="Short description of the event"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>Cover Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className={inputCls}
                placeholder="Image URL"
              />
            </div>
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
            <Save className="w-4 h-4" />
            {editingId ? "Update Event" : "Save Event"}
          </button>
        </div>
      )}

      {events.length === 0 ? (
        <EmptyState icon={Calendar} text="No events added yet." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal/5 flex"
            >
              <div className="w-28 flex-shrink-0 bg-cream">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/25">
                    <Calendar className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className={`${event.tagColor} text-cream text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}>
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
                      onClick={() => handleDelete(event.id)}
                      className="w-7 h-7 rounded-lg bg-coral/10 text-coral flex items-center justify-center hover:bg-coral hover:text-cream transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="font-display font-bold text-charcoal text-sm truncate">{event.title}</p>
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

function ContentManager({ content, setContent, showToast }) {
  const editableInitiatives = INITIATIVES.filter((i) => i.key !== "home");
  const [selected, setSelected] = useState(editableInitiatives[0].key);

  const data = content[selected] || {
    heroTitle: "",
    heroTagline: "",
    aboutText: "",
    ctaTitle: "",
    ctaBody: "",
    ctaButtonLabel: "",
  };

  const [form, setForm] = useState(data);

  useEffect(() => {
    setForm(
      content[selected] || {
        heroTitle: "",
        heroTagline: "",
        aboutText: "",
        ctaTitle: "",
        ctaBody: "",
        ctaButtonLabel: "",
      },
    );
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    const updated = { ...content, [selected]: form };
    setContent(updated);
    saveJSON(STORAGE_KEYS.content, updated);
    showToast("Initiative content saved");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">Initiative Content Management</h2>
          <p className="text-charcoal/55 text-sm mt-1">Edit hero, about, and CTA text for each initiative page.</p>
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

      <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-charcoal/5 space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-coral mb-4">Hero Section</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Hero Title</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className={inputCls}
                placeholder="e.g. Blood Donation & Healthcare"
              />
            </div>
            <div>
              <label className={labelCls}>Hero Tagline</label>
              <input
                type="text"
                value={form.heroTagline}
                onChange={(e) => setForm({ ...form, heroTagline: e.target.value })}
                className={inputCls}
                placeholder="e.g. Saving Lives Through Voluntary Blood Donation"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-charcoal/8" />

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal mb-4">About Section</p>
          <label className={labelCls}>About Paragraphs (one per line)</label>
          <textarea
            rows={6}
            value={form.aboutText}
            onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
            className={`${inputCls} resize-none`}
            placeholder="Write each paragraph on a new line..."
          />
        </div>

        <div className="h-px bg-charcoal/8" />

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gold mb-4">Call To Action</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>CTA Title</label>
              <input
                type="text"
                value={form.ctaTitle}
                onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
                className={inputCls}
                placeholder="e.g. Become a Blood Donor"
              />
            </div>
            <div>
              <label className={labelCls}>CTA Button Label</label>
              <input
                type="text"
                value={form.ctaButtonLabel}
                onChange={(e) => setForm({ ...form, ctaButtonLabel: e.target.value })}
                className={inputCls}
                placeholder="e.g. Register as a Blood Donor"
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
              placeholder="Short supporting text for the CTA section"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-7 py-3 rounded-full bg-coral text-cream font-semibold text-sm shadow-lg shadow-coral/30 hover:bg-coral-dark hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
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

  const [gallery, setGallery] = useState(() =>
    loadJSON(
      STORAGE_KEYS.gallery,
      INITIATIVES.reduce((acc, i) => ({ ...acc, [i.key]: [] }), {}),
    ),
  );
  const [team, setTeam] = useState(() => loadJSON(STORAGE_KEYS.team, []));
  const [events, setEvents] = useState(() => loadJSON(STORAGE_KEYS.events, []));
  const [content, setContent] = useState(() => loadJSON(STORAGE_KEYS.content, {}));

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
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-charcoal/5 px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-charcoal p-1.5 -ml-1.5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="font-display font-bold text-charcoal">{activeLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-cream font-semibold text-sm">
              A
            </div>
            <span className="hidden sm:inline text-sm font-medium text-charcoal/70">Admin</span>
          </div>
        </div>

        <main className="p-5 md:p-8">
          {active === "dashboard" && (
            <DashboardOverview gallery={gallery} team={team} events={events} setActive={setActive} />
          )}
          {active === "gallery" && (
            <GalleryManager gallery={gallery} setGallery={setGallery} showToast={showToast} />
          )}
          {active === "team" && (
            <TeamManager team={team} setTeam={setTeam} showToast={showToast} />
          )}
          {active === "events" && (
            <EventsManager events={events} setEvents={setEvents} showToast={showToast} />
          )}
          {active === "content" && (
            <ContentManager content={content} setContent={setContent} showToast={showToast} />
          )}
        </main>
      </div>

      <Toast message={toast} />
    </div>
  );
}

// ─── Entry Point ──────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => loadJSON(STORAGE_KEYS.auth, false));

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        saveJSON(STORAGE_KEYS.auth, false);
        setAuthed(false);
      }}
    />
  );
}