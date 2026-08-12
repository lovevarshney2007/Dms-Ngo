/**
 * shared.jsx — Reusable components for all DMS AAROHI initiative pages.
 * Rebuilt with:
 *  1) Hero slider with sliding controls (like Homepage)
 *  2) Compact About section with badge cards (like Homepage)
 *  3) Animated counter stats (like Homepage)
 *  4) Improved activity cards (icon + number treatment like Homepage)
 *  5) CTA section with image/icon beside text
 *  6) Bigger, image-backed Upcoming Events cards
 */

import { useState, useEffect, useRef } from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import {
  Heart,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
  XIcon,
  Star,
  GraduationCap,
  Droplet,
  ShieldCheck,
  Shirt,
  Send,
  Leaf,
  UsersIcon,
  HeartPulseIcon,
  DropletIcon,
  HeartIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
} from "lucide-react";
import logo from "../../assets/logo.png";
import footerLogo from "../../assets/DMS_Logo1.png";
import { submitBloodDonor } from "../../lib/api";

// ─── Constants ────────────────────────────────────────────────────────────────

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/dmsaarohi",
  instagram: "https://instagram.com/dmsaarohi",
  youtube: "https://www.youtube.com/@dmsaarohi5483",
  twitter: "https://twitter.com/dmsaarohi",
};

export const CONTACT = {
  phone: "+91 9810225442",
  email: "dmsaarohi@gmail.com",
  address: "Paschim Vihar, Delhi",
};

const MAIN_SITE_URL = typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:5176" : "https://dms-pqry.vercel.app";

export const NAV_LINKS = [
  { label: "Main Site", href: MAIN_SITE_URL },
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Our Initiatives", href: "/#initiatives" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
];

const IMPACT_AREAS = [
  {
    icon: Droplet,
    title: "Blood Donation & Heathcare",
    href: "/initiatives/blood-donation",
    desc: "Building a verified blood donor network and organizing blood donation drives to support patients during medical emergencies.",
  },
  {
    icon: GraduationCap,
    title: "Child Education",
    href: "/initiatives/child-education",
    desc: "Providing educational support and learning opportunities for underprivileged children in rural and urban communities.",
  },
  {
    icon: ShieldCheck,
    title: "Beti Bachao Initiative",
    href: "/initiatives/beti-bachao",
    desc: "Promoting the protection, education, and empowerment of the girl child through awareness campaigns and community programs.",
  },
  {
    icon: Shirt,
    title: "Cloth Distribution",
    href: "/initiatives/cloth-distribution",
    desc: "Collecting and distributing clothes and essential items to underprivileged families, especially during seasonal and emergency needs.",
  },
  {
    icon: Users,
    title: "Senior Citizen Welfare",
    href: "/initiatives/senior-citizen",
    desc: "Supporting senior citizens through healthcare, social engagement, and initiatives that promote dignity, well-being, and a better quality of life.",
  },
  {
    icon: Leaf,
    title: "Environment Awareness",
    href: "/initiatives/environment",
    desc: "Creating awareness about environmental conservation through plantation drives, cleanliness campaigns, and sustainable community initiatives.",
  },
];

// ─── Utility Components ───────────────────────────────────────────────────────

/** Scroll-triggered fade-up reveal */
export function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function BloodDonorModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    bloodGroup: "",
    weight: "",
    city: "",
    lastDonationDate: "",
    preferredCamp: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setError("");
      setForm({
        name: "",
        phone: "",
        email: "",
        age: "",
        bloodGroup: "",
        weight: "",
        city: "",
        lastDonationDate: "",
        preferredCamp: "",
        notes: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitBloodDonor(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const BLOOD_FACTS = [
    { icon: HeartPulseIcon, text: "One donation can save up to 3 lives" },
    {
      icon: ShieldCheckIcon,
      text: "Your blood group stays confidential & verified",
    },
    { icon: UsersIcon, text: "Join 1000+ donors in our life-saving network" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-charcoal/50 backdrop-blur-md animate-fade-in-up"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:w-[68vw] max-w-5xl max-h-[92vh] bg-cream rounded-[28px] md:rounded-[32px] shadow-2xl overflow-hidden grid md:grid-cols-[42%_58%]"
      >
        <button
          onClick={onClose}
          aria-label="Close blood donor form"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white shadow-md flex items-center justify-center text-charcoal transition-all duration-200 hover:rotate-90"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* LEFT panel — unchanged */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-coral/15 via-cream to-red-100/40 p-8 lg:p-10">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-coral/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 -right-10 w-64 h-64 bg-red-200/30 rounded-full blur-2xl" />
          <div className="absolute top-1/3 right-0 w-24 h-24 border-2 border-coral/30 rounded-full" />

          <div className="relative flex-1 flex items-center justify-center">
            <div className="relative w-52 h-52 lg:w-60 lg:h-60 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-coral/20 animate-ping-slow" />
              <span className="absolute inset-4 rounded-full bg-coral/15" />
              <span className="absolute inset-10 rounded-full bg-white shadow-xl flex items-center justify-center">
                <DropletIcon
                  className="w-16 h-16 lg:w-[68px] lg:h-[68px] text-coral animate-pulse"
                  fill="#E8543E"
                  fillOpacity={0.12}
                />
              </span>
              <div className="absolute -top-2 -left-4 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-float">
                <HeartPulseIcon className="w-6 h-6 text-coral" />
              </div>
              <div
                className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-float"
                style={{ animationDelay: "0.6s" }}
              >
                <StethoscopeIcon className="w-6 h-6 text-teal" />
              </div>
              <div
                className="absolute top-4 -right-8 w-11 h-11 rounded-full bg-coral shadow-lg flex items-center justify-center animate-float"
                style={{ animationDelay: "1.1s" }}
              >
                <HeartIcon className="w-5 h-5 text-cream" />
              </div>
            </div>
          </div>

          <div className="relative">
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">
              Be a Lifesaver
            </span>
            <h3 className="font-display font-bold text-2xl lg:text-[28px] text-charcoal leading-tight mb-4">
              A drop of yours,
              <br />a lifetime for someone.
            </h3>
            <div className="space-y-3">
              {BLOOD_FACTS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-coral" />
                    </div>
                    <p className="text-sm text-charcoal/70 font-medium">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT panel */}
        <div className="relative bg-white overflow-y-auto max-h-[92vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          <div className="md:hidden bg-gradient-to-br from-coral/15 to-red-100/40 px-6 pt-8 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4">
              <DropletIcon className="w-7 h-7 text-coral" />
            </div>
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">
              Be a Lifesaver
            </span>
            <h3 className="font-display font-bold text-2xl text-charcoal leading-tight">
              Register as a Blood Donor
            </h3>
          </div>

          {submitted ? (
            <div className="px-6 py-14 md:px-9 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center mb-5">
                <DropletIcon className="w-8 h-8 text-coral" />
              </div>
              <h3 className="font-display font-bold text-2xl text-charcoal mb-2">
                Thank you, {form.name.split(" ")[0]}!
              </h3>
              <p className="text-charcoal/60 text-sm max-w-sm mb-8">
                You're now part of our verified donor network. Our team will
                verify and contact you within 24–48 hours.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-coral text-cream font-semibold shadow-lg shadow-coral/30 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="px-6 py-7 md:px-9 md:py-10">
              <div className="hidden md:block mb-6">
                <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">
                  Donor Registration
                </span>
                <h3 className="font-display font-bold text-[26px] text-charcoal leading-tight">
                  Join our verified donor network
                </h3>
                <p className="text-charcoal/55 text-sm mt-1.5">
                  Fields marked * are required — everything else is optional.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+91 00000 00000"
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                      Blood Group
                    </label>
                    <select
                      value={form.bloodGroup}
                      onChange={set("bloodGroup")}
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal"
                    >
                      <option value="">Select blood group</option>
                      {[
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "O+",
                        "O-",
                        "AB+",
                        "AB-",
                        "Not sure",
                      ].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={set("city")}
                      placeholder="Your city"
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                  />
                </div>

                <div className="h-px bg-charcoal/8 mb-5" />
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/35 mb-4">
                  Optional details — help us match you to a camp
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                      Age
                    </label>
                    <input
                      type="number"
                      min="18"
                      value={form.age}
                      onChange={set("age")}
                      placeholder="Your age"
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.weight}
                      onChange={set("weight")}
                      placeholder="e.g. 60"
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                      Last Donation Date
                    </label>
                    <input
                      type="date"
                      value={form.lastDonationDate}
                      onChange={set("lastDonationDate")}
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                      Preferred Camp Location
                    </label>
                    <input
                      type="text"
                      value={form.preferredCamp}
                      onChange={set("preferredCamp")}
                      placeholder="Nearest area / camp"
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    Medical Conditions / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Any allergies, medications, or health notes we should know..."
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30 resize-none"
                  />
                </div>

                {error && (
                  <div className="mb-4 bg-coral/10 border border-coral/20 text-coral text-sm rounded-xl px-4 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full px-8 py-3.5 rounded-full bg-gradient-to-r from-coral to-red-500 text-cream font-bold shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? "Registering..." : "Register as Donor"}
                  {!submitting && (
                    <DropletIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  )}
                </button>
                <p className="text-center text-xs text-charcoal/40 mt-3">
                  Our team will verify and contact you within 24–48 hours.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Animated count-up number — triggers on scroll into view */
export function Counter({ value, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const animate = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * value));
              if (progress < 1) requestAnimationFrame(animate);
              else setCount(value);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/** SVG wave divider */
export function WaveDivider({ flip = false, color = "#FBF7F0" }) {
  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-[55px] md:h-[80px]"
      >
        <path
          d="M0,40 C240,90 480,0 720,30 C960,60 1200,100 1440,40 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

function VolunteerModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", age: "", city: "",
    occupation: "", availability: "", mode: "", heardFrom: "", interestArea: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setError("");
      setForm({ name: "", phone: "", email: "", age: "", city: "", occupation: "", availability: "", mode: "", heardFrom: "", interestArea: "", message: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitVolunteer(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const WHY_VOLUNTEER = [
    { icon: Heart, text: "Create real, lasting impact in your community" },
    { icon: Users, text: "Join a warm, driven family of 1000+ volunteers" },
    { icon: Star, text: "Gain experience, certificates & recognition" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-charcoal/50 backdrop-blur-md animate-fade-in-up"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:w-[68vw] max-w-5xl max-h-[92vh] bg-cream rounded-[28px] md:rounded-[32px] shadow-2xl overflow-hidden grid md:grid-cols-[42%_58%]"
      >
        {/* Close button — floats above both panels */}
        <button
          onClick={onClose}
          aria-label="Close volunteer form"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white shadow-md flex items-center justify-center text-charcoal transition-all duration-200 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── LEFT: Animated visual panel ── */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-gold/15 via-cream to-coral/10 p-8 lg:p-10">
          {/* Decorative floating circles */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gold/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 -right-10 w-64 h-64 bg-coral/10 rounded-full blur-2xl" />
          <div className="absolute top-1/3 right-0 w-24 h-24 border-2 border-gold/30 rounded-full" />

          {/* Animated icon composition */}
          <div className="relative flex-1 flex items-center justify-center">
            <div className="relative w-52 h-52 lg:w-60 lg:h-60 flex items-center justify-center">
              {/* Pulsing rings */}
              <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping-slow" />
              <span className="absolute inset-4 rounded-full bg-gold/25" />
              <span className="absolute inset-10 rounded-full bg-white shadow-xl flex items-center justify-center">
                <Heart className="w-14 h-14 lg:w-16 lg:h-16 text-coral animate-pulse" />
              </span>

              {/* Orbiting badges */}
              <div className="absolute -top-2 -left-4 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-float">
                <GraduationCap className="w-6 h-6 text-teal" />
              </div>
              <div
                className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-float"
                style={{ animationDelay: "0.6s" }}
              >
                <Droplet className="w-6 h-6 text-coral" />
              </div>
              <div
                className="absolute top-4 -right-8 w-11 h-11 rounded-full bg-gold shadow-lg flex items-center justify-center animate-float"
                style={{ animationDelay: "1.1s" }}
              >
                <Leaf className="w-5 h-5 text-cream" />
              </div>
            </div>
          </div>

          {/* Text + why-volunteer list */}
          <div className="relative">
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">
              Join Our Mission
            </span>
            <h3 className="font-display font-bold text-2xl lg:text-[28px] text-charcoal leading-tight mb-4">
              Your time can change
              <br />
              someone's story.
            </h3>
            <div className="space-y-3">
              {WHY_VOLUNTEER.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-coral" />
                    </div>
                    <p className="text-sm text-charcoal/70 font-medium">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form panel ── */}
        <div className="relative bg-white overflow-y-auto max-h-[92vh] scrollbar-hide">
          {/* Mobile-only compact header (since left panel is hidden below md) */}
          <div className="md:hidden bg-gradient-to-br from-gold/15 to-coral/10 px-6 pt-8 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-coral" />
            </div>
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">
              Join Our Mission
            </span>
            <h3 className="font-display font-bold text-2xl text-charcoal leading-tight">
              Become a Volunteer
            </h3>
          </div>

          <div className="px-6 py-7 md:px-9 md:py-10">
            <div className="hidden md:block mb-6">
              <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">
                Volunteer Registration
              </span>
              <h3 className="font-display font-bold text-[26px] text-charcoal leading-tight">
                Tell us about yourself
              </h3>
              <p className="text-charcoal/55 text-sm mt-1.5">
                Fields marked * are required — everything else is optional.
              </p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-6 py-10">
                <div className="w-16 h-16 rounded-full bg-teal/15 flex items-center justify-center mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-charcoal mb-2">Thank You!</h3>
                <p className="text-charcoal/60 mb-6">Your volunteer registration has been submitted. We'll get back to you within 24–48 hours.</p>
                <button onClick={onClose} className="px-8 py-3 rounded-full bg-coral text-cream font-semibold hover:scale-105 active:scale-95 transition-all">
                  Close
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit}>
              {/* Required section */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 00000 00000"
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    min="12"
                    value={form.age}
                    onChange={set("age")}
                    placeholder="Your age"
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={set("city")}
                    placeholder="Your city"
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                />
              </div>

              <div className="h-px bg-charcoal/8 mb-5" />
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/35 mb-4">
                Optional details — help us match you better
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={form.occupation}
                    onChange={set("occupation")}
                    placeholder="Student, professional, etc."
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    Availability
                  </label>
                  <select
                    value={form.availability}
                    onChange={set("availability")}
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal"
                  >
                    <option value="">Select availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="flexible">Flexible / Anytime</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    Preferred Mode
                  </label>
                  <select
                    value={form.mode}
                    onChange={set("mode")}
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal"
                  >
                    <option value="">Select mode</option>
                    <option value="onground">On-ground</option>
                    <option value="online">Remote / Online</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                    How did you hear about us?
                  </label>
                  <select
                    value={form.heardFrom}
                    onChange={set("heardFrom")}
                    className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal"
                  >
                    <option value="">Select an option</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend / Family</option>
                    <option value="event">An Event / Camp</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                  Area of Interest
                </label>
                <select
                  value={form.interestArea}
                  onChange={set("interestArea")}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal"
                >
                  <option value="">Select an initiative</option>
                  {IMPACT_AREAS.map((area) => (
                    <option key={area.title} value={area.title}>
                      {area.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30 resize-none"
                />
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group w-full px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-coral text-cream font-bold shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? "Submitting…" : "Submit Registration"}
                {!submitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
              <p className="text-center text-xs text-charcoal/40 mt-3">
                We'll get back to you within 24–48 hours.
              </p>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

export function Navbar({ onVolunteerOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FFF8F0]/95 backdrop-blur-md shadow-lg py-1"
          : "bg-black/10 backdrop-blur-sm py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <a href="/" className="z-50 flex items-center">
          <img
            src={logo}
            alt="DMS AAROHI"
            className={`object-contain transition-all duration-300 ${
              scrolled ? "h-8 md:h-10" : "h-10 md:h-12"
            }`}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative font-medium transition-colors group ${
                scrolled
                  ? "text-charcoal/80 hover:text-teal"
                  : "text-cream hover:text-gold"
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-coral transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => onVolunteerOpen?.()}
            className="group px-7 py-3.5 rounded-full bg-coral text-cream font-semibold shadow-xl shadow-coral/40 hover:bg-coral-dark hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            Volunteer Now
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="lg:hidden z-50 p-2 text-teal"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      <div
        className={`lg:hidden fixed top-0 right-0 h-screen w-72 bg-cream shadow-2xl transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 pt-28 px-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 border-b border-charcoal/10 font-medium text-lg text-charcoal hover:text-teal hover:translate-x-1 transition-all"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#donate"
            onClick={() => setMenuOpen(false)}
            className="mt-6 text-center px-6 py-3 rounded-full bg-coral text-cream font-semibold shadow-lg"
          >
            Donate Now
          </a>
        </div>
      </div>
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-charcoal/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

const INITIATIVE_LINKS = [
  { label: "Blood Donation", href: "/initiatives/blood-donation" },
  { label: "Child Education", href: "/initiatives/child-education" },
  { label: "Beti Bachao", href: "/initiatives/beti-bachao" },
  { label: "Cloth Distribution", href: "/initiatives/cloth-distribution" },
  { label: "Senior Citizen Welfare", href: "/initiatives/senior-citizen" },
  { label: "Environment Awareness", href: "/initiatives/environment" },
];

export function SocialImpact({
  accentColor = "bg-coral",
  accentText = "text-coral",
  impact,
}) {
  if (!impact || !impact.points || impact.points.length === 0) return null;

  return (
    <section className="bg-cream py-14 md:py-18">
      <div className="max-w-6xl mx-auto px-5 md:px-8 ">
        <Reveal className="text-center max-w-2xl mx-auto mb-16 ">
          <span
            className={`inline-block font-semibold uppercase tracking-[0.25em] text-lg mb-5 text-coral`}
          >
            Social Impact
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-teal leading-tight mb-5">
            {impact.title}
          </h2>
          {impact.subtitle && (
            <p className="text-charcoal/65 text-lg leading-relaxed">
              {impact.subtitle}
            </p>
          )}
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8 relative">
          {/* Connector line for desktop — echoes Homepage "How We Work" */}
          <div className="hidden md:block absolute top-9 left-[16%] right-[16%] h-[1px] bg-charcoal/10" />

          {impact.points.map((point, i) => {
            const PointIcon = point.icon;
            return (
              <Reveal
                key={point.label}
                delay={i * 130}
                className="relative text-center group"
              >
                <div
                  className={`relative z-10 mx-auto w-[72px] h-[72px] rounded-full ${accentColor} shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}
                >
                  <PointIcon className="w-8 h-8 text-cream" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-charcoal mb-2">
                  {point.label}
                </h3>
                <p className="text-charcoal/65 leading-relaxed max-w-xs mx-auto">
                  {point.description}
                </p>
                {/* Small accent underline */}
                <div
                  className={`mt-4 h-[2px] w-8 mx-auto rounded-full opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-300 ${accentColor}`}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row flex-wrap lg:flex-nowrap justify-between gap-10 lg:gap-6 mb-12">
        <div className="w-full lg:max-w-xs">
          <div className="mb-4">
            <img src={footerLogo} alt="DMS AAROHI" className="h-14 md:h-16 object-contain brightness-0 invert" />
          </div>
          <p className="text-cream/60 text-sm leading-relaxed mb-5">
            A registered non-profit society working since 2013 for blood
            donation, child education, senior citizen care, environment
            awareness and community welfare in New Delhi.
          </p>
          <div className="flex gap-3">
            {[
              [SOCIAL_LINKS.facebook, <FaFacebook key="fb" />],
              [SOCIAL_LINKS.instagram, <FaInstagram key="ig" />],
              [SOCIAL_LINKS.youtube, <FaYoutube key="yt" />],
              [SOCIAL_LINKS.twitter, <FaTwitter key="tw" />],
            ].map(([href, icon], i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-coral hover:border-coral transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-cream/70">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-coral transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-4">
            Our Initiatives
          </h4>
          <ul className="space-y-2 text-cream/70">
            {INITIATIVE_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-coral transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-cream/70">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
              <span>{CONTACT.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-coral flex-shrink-0" />
              <a
                href={`tel:${CONTACT.phone}`}
                className="hover:text-coral transition-colors"
              >
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-coral flex-shrink-0" />
              <a
                href={`mailto:${CONTACT.email}`}
                className="hover:text-coral transition-colors"
              >
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-6 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-cream/50">
        <p>
          &copy; {new Date().getFullYear()} DMS AAROHI. All rights reserved.
        </p>
        <p>
          Registered under 12A &amp; 80G (5)(VI) of the Income Tax Act, 1961
        </p>
      </div>
    </footer>
  );
}

// ─── Initiative Page Template ─────────────────────────────────────────────────

/**
 * InitiativePage props:
 *   heroSlides       {Array<{image, title, subtitle}>}  — 3-4 slides for the hero slider
 *   heroTitle        {string}
 *   heroTagline      {string}
 *   accentColor      {string}   — Tailwind bg- class e.g. "bg-coral"
 *   accentText       {string}   — Tailwind text- class e.g. "text-coral"
 *   aboutText        {string[]} — paragraphs
 *   aboutImage       {string}   — side image for About section
 *   aboutBadges      {Array<{icon, label, sub}>} — 2 badge cards (like Homepage)
 *   activities       {string[]} — activity names
 *   galleryImages    {string[]} — 5-6 images
 *   statsRow         {Array<{value:number, suffix, label}>}  — numeric stats (animated)
 *   ctaTitle         {string}
 *   ctaBody          {string}
 *   ctaButtonLabel   {string}
 *   ctaButtonHref    {string}
 *   ctaSideImage     {string}   — image shown beside CTA text
 *   icon             {ReactNode} — Lucide icon component
 */

export function InitiativePage({
  heroSlides = [],
  heroTitle,
  heroTagline,
  accentColor = "bg-coral",
  accentText = "text-coral",
  aboutText = [],
  aboutImage,
  aboutBadges = [],
  activities = [],
  galleryImages = [],
  statsRow = [],
  ctaTitle,
  ctaBody,
  ctaButtonLabel,
  ctaButtonHref = "/#contact",
  ctaSideImage,
  socialImpact,
  icon: Icon,
  onCtaClick,
}) {
  // ── Hero slider state ──
  const [activeSlide, setActiveSlide] = useState(0);
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const slides =
    heroSlides.length > 0
      ? heroSlides
      : [{ image: aboutImage, title: heroTitle, subtitle: heroTagline }];

  useEffect(() => {
    if (activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [slides.length, activeSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Defensive read — the render below runs before the clamp effect above
  // has a chance to fire, so this guard is what actually prevents the crash.
  const currentSlide = slides[activeSlide] || slides[0] || {};

  return (
    <div className="font-body text-charcoal bg-cream overflow-x-hidden">
      <Navbar onVolunteerOpen={() => setVolunteerOpen(true)} />

      {/* ════════════════════════════════════════════════════
          1. HERO SLIDER — same controls as Homepage
          ════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover ${i === activeSlide ? "animate-slow-zoom" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/45 to-charcoal/15" />
          </div>
        ))}

        {/* Slide content */}
        <div className="relative z-10 h-full flex flex-col items-start justify-center max-w-7xl mx-auto px-5 md:px-8 pt-20">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-cream text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-5 ${accentColor}/90 animate-fade-in-up`}
          >
            DMS AAROHI Initiative
          </span>
          <h1
            key={activeSlide}
            className="font-display font-bold text-4xl sm:text-5xl md:text-7xl text-cream leading-[1.05] max-w-3xl mb-5 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {currentSlide.title || heroTitle}
          </h1>
          <p
            className="text-lg md:text-2xl text-cream/85 max-w-2xl leading-relaxed font-medium animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {currentSlide.subtitle || heroTagline}
          </p>
          <div
            className="mt-8 flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href={ctaButtonHref}
              onClick={(e) => {
                if (onCtaClick) {
                  e.preventDefault();
                  onCtaClick();
                } else if (
                  ctaButtonHref &&
                  ctaButtonHref.includes("#contact")
                ) {
                  e.preventDefault();
                  window.location.href = ctaButtonHref;
                }
              }}
              className={`group px-7 py-3.5 rounded-full bg-coral text-cream font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2`}
            >
              {ctaButtonLabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/#contact"
              className="px-7 py-3.5 rounded-full bg-cream/10 border border-cream/40 text-cream font-semibold backdrop-blur-sm hover:bg-cream/20 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Slide controls — identical to Homepage */}
        <div className="absolute z-10 bottom-8 right-5 md:right-8 flex items-center gap-3">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-cream/40 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "w-8 bg-coral" : "w-2 bg-cream/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full border border-cream/40 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll cue */}
        <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-cream/70 animate-bounce-slow">
          <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-10 bg-cream/50" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          2. ABOUT — compact like Homepage about section
          ════════════════════════════════════════════════════ */}
      <section id="about" className="relative bg-cream pt-20 md:pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          {/* Image collage */}
          <Reveal>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[4/5]">
                <img
                  src={aboutImage}
                  alt={heroTitle}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Gold decorative ring */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-gold rounded-full hidden md:block" />
              {/* Icon badge */}
              {Icon && (
                <div
                  className={`absolute -bottom-5 -right-5 w-16 h-16 rounded-2xl ${accentColor} shadow-xl flex items-center justify-center animate-float`}
                >
                  <Icon className="w-8 h-8 text-cream" />
                </div>
              )}
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={150}>
            <span
              className={`inline-block font-semibold uppercase tracking-[0.25em] text-sm mb-3 text-coral`}
            >
              About the Initiative
            </span>
            <h2 className="font-display font-bold text-3xl md:text-[42px] text-teal leading-tight mb-5">
              {heroTitle}
            </h2>
            <div className="space-y-6 mb-10">
              {aboutText.map((para, i) => (
                <p key={i} className="text-charcoal/75 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Badge cards — like Homepage 12A / 80G badges */}
            {aboutBadges.length > 0 && (
              <div className="flex flex-wrap gap-5 mb-2">
                {aboutBadges.map((badge, i) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          i % 2 === 0 ? "bg-teal/10" : "bg-coral/10"
                        }`}
                      >
                        <BadgeIcon
                          className={`w-6 h-6 ${i % 2 === 0 ? "text-teal" : "text-coral"}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">
                          {badge.label}
                        </p>
                        <p className="text-sm text-charcoal/60">{badge.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          3. STATS — animated counters like Homepage
          ════════════════════════════════════════════════════ */}
      {/* {statsRow.length > 0 && (
        <>
          <WaveDivider color="#0E5A52" />
          <section className="bg-teal py-14 md:py-16 -mt-1">
            <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {statsRow.map((s, i) => (
                <Reveal key={s.label} delay={i * 100}>
                  <p className="font-display font-bold text-4xl md:text-[50px] text-gold">
                    <Counter value={s.value} suffix={s.suffix || ""} />
                  </p>
                  <p className="mt-2 text-cream/80 text-sm md:text-base font-medium">
                    {s.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>
          <WaveDivider flip color="#FBF7F0" />
        </>
      )} */}

      {/* ════════════════════════════════════════════════════
          4. ACTIVITIES — improved cards like Homepage
          ════════════════════════════════════════════════════ */}
      <section className="bg-cream py-16 md:py-14 -mt-1">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-gold font-semibold uppercase tracking-[0.25em] text-sm mb-3">
              What We Do
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-teal leading-tight">
              {heroTitle} Activities
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, i) => {
              const ActivityIcon = activity.icon || CheckCircle2;
              return (
                <Reveal key={activity.title} delay={i * 80}>
                  <div className="group relative bg-white rounded-2xl p-7 h-full border border-charcoal/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                    {/* Accent corner blob */}
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-gold/10 rounded-full group-hover:scale-150 transition-transform duration-500" />

                    {/* Icon box — activity-specific icon */}
                    <div
                      className={`relative w-14 h-14 rounded-xl bg-teal flex items-center justify-center mb-5 group-hover:bg-coral transition-colors duration-300 shadow-md`}
                    >
                      <ActivityIcon className="w-6 h-6 text-cream" />
                    </div>

                    {/* Step number */}
                    <span className="absolute top-5 right-6 font-display font-bold text-4xl text-charcoal/5 select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="font-display font-bold text-xl text-charcoal mb-2 relative">
                      {activity.title}
                    </h3>

                    <p className="text-charcoal/65 leading-relaxed relative">
                      {activity.description}
                    </p>

                    {/* Animated underline on hover */}
                    <div
                      className={`mt-5 h-[2px] w-0 ${accentColor.replace("bg-", "bg-")} group-hover:w-16 transition-all duration-300`}
                      style={{
                        background:
                          accentColor === "bg-coral"
                            ? "#E8543E"
                            : accentColor === "bg-teal"
                              ? "#0E5A52"
                              : "#F4B740",
                      }}
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          GALLERY
          ════════════════════════════════════════════════════ */}
      <WaveDivider color="#0E5A52" />
      <section className="bg-teal py-14 md:py-20 -mt-1">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-5xl mx-auto mb-14">
            <span className="inline-block text-gold font-semibold uppercase tracking-[0.25em] text-sm mb-3">
              Media Gallery
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-cream leading-[1.2] md:leading-[1.15]">
              Glimpses of {heroTitle} work on ground
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[160px] md:auto-rows-[200px]">
            {galleryImages.map((src, i) => (
              <Reveal
                key={src}
                delay={i * 60}
                className={`${i === 0 ? "col-span-2 row-span-2" : ""} ${i === 5 ? "md:row-span-2" : ""}`}
              >
                <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                  <img
                    src={src}
                    alt={`${heroTitle} activity ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-cream opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider flip color="#FBF7F0" />

      <SocialImpact
        accentColor={accentColor}
        accentText={accentText}
        impact={socialImpact}
      />

      {/* ════════════════════════════════════════════════════
          5. INITIATIVE-SPECIFIC CTA — with side image/icon
          ════════════════════════════════════════════════════ */}
      <section className="relative bg-coral py-16 md:py-20 overflow-hidden -mt-1">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-cream/10 rounded-full" />
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-cream/10 rounded-full" />

        <div className="relative max-w-6xl mx-auto px-5 md:px-8">
          <div
            className={`grid ${ctaSideImage ? "md:grid-cols-[1fr_340px]" : "md:grid-cols-1"} gap-10 md:gap-16 items-center`}
          >
            {/* Text side */}
            <Reveal>
              <span className="inline-block text-cream/75 font-semibold uppercase tracking-[0.25em] text-sm mb-4">
                Take Action
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-cream leading-tight mb-5">
                {ctaTitle}
              </h2>
              <p className="text-cream/90 text-lg leading-relaxed mb-8 max-w-xl">
                {ctaBody}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={ctaButtonHref || "#"}
                  onClick={(e) => {
                    if (onCtaClick) {
                      e.preventDefault();
                      onCtaClick();
                    } else if (
                      ctaButtonHref &&
                      ctaButtonHref.includes("#contact")
                    ) {
                      e.preventDefault();
                      window.location.href = ctaButtonHref;
                    }
                  }}
                  className="group inline-flex items-center gap-2 px-9 py-4 rounded-full bg-cream text-coral font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  {ctaButtonLabel}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-transparent border-2 border-cream/60 text-cream font-bold hover:bg-cream/10 transition-all duration-200"
                >
                  Contact Us
                </a>
              </div>
            </Reveal>

            {/* Image/Icon side */}
            {ctaSideImage && (
              <Reveal delay={150} className="hidden md:block">
                <div className="relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                    <img
                      src={ctaSideImage}
                      alt={ctaTitle}
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-charcoal/10" />
                  </div>
                  {/* Floating stat badge */}
                  <div className="absolute -bottom-5 -left-5 bg-cream rounded-2xl px-5 py-4 shadow-xl border border-charcoal/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-coral" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-charcoal text-lg leading-none">
                          1,000+
                        </p>
                        <p className="text-charcoal/55 text-xs">
                          Lives Impacted
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
      <Footer />
      <VolunteerModal
        isOpen={volunteerOpen}
        onClose={() => setVolunteerOpen(false)}
      />
    </div>
  );
}
