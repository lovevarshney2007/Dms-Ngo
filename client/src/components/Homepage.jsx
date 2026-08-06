import { useState, useEffect, useRef } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import {
  Heart,
  Droplet,
  GraduationCap,
  Users,
  Leaf,
  Shirt,
  ShieldCheck,
  ArrowRight,
  Quote,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Menu,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import communityImg from "../assets/about/community-work.JPG";
import logo from "../assets/logo.png";

import bloodCamp1 from "../assets/hero/blood-camp-1.jpg";
import childEducation1 from "../assets/hero/child-education-1.jpg";
import seniorCitizen1 from "../assets/hero/senior-citizen-1.jpg";
import clothDistribution1 from "../assets/hero/clothes-donation.jpeg";
import presidentImg from "../assets/team/president.png";
import { useTeam, useGallery, useEvents, useHeroSlides, useInitiativeContent } from "../hooks/useSiteData";
import { submitVolunteer } from "../lib/api";

const PHONE = "+91 9810225442";
const EMAIL = "dmsaarohi@gmail.com";
const ADDRESS = "A5, 272, Paschim Vihar, New Delhi";

const SOCIAL_LINKS = {
  facebook: "https://facebook.com/dmsaarohi",
  instagram: "https://instagram.com/dmsaarohi",
  youtube: "https://www.youtube.com/@dmsaarohi5483",
  twitter: "https://twitter.com/dmsaarohi",
};

// Hero slider images — swap with real event photos (blood camps, etc.)
const DEFAULT_HERO_SLIDES = [
  {
    image: bloodCamp1,
    title: "Every drop counts",
    subtitle:
      "Building a reliable chain of voluntary blood donors for patients in need, especially those battling Thalassemia.",
  },
  {
    image: childEducation1,
    title: "Educating today, empowering tomorrow",
    subtitle:
      "Creating platforms for underprivileged children to learn, grow and dream bigger.",
  },
  {
    image: seniorCitizen1,
    title: "Caring for those who cared for us",
    subtitle: "Bringing dignity, health and happiness to our senior citizens.",
  },
  {
    image: clothDistribution1,
    title: "Warmth that reaches far",
    subtitle:
      "Distributing clothes and essentials to families who need them the most.",
  },
];

// Impact / focus areas — mirrors DTH's "Categories" grid
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

// "How We Work" — mirrors DTH's 3-step "How To Participate"
const HOW_WE_WORK = [
  {
    step: "01",
    title: "Identify Community Needs",
    desc: "We work closely with local communities, volunteers, and our partners to identify individuals and families who need immediate support.",
  },
  {
    step: "02",
    title: "Plan & Organize",
    desc: "Our dedicated team coordinates donation drives, awareness campaigns, blood donation camps, educational program and community welfare activities.",
  },
  {
    step: "03",
    title: "Deliver Meaningful Impact",
    desc: "With the support of our volunteers, donors, and partners, we create meaningful change through healthcare, education, and environmental initiatives.",
  },
];


// Impact stats — animated counters
const STATS = [
  { value: 14, suffix: "+", label: "Years of Service" },
  { value: 6, suffix: "+", label: "Community Initiatives" },
  { value: 100, suffix: "+", label: "Awareness Programs" },
  { value: 1000, suffix: "+", label: "Lives Positively Impacted" },
];

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Initiatives", href: "#initiatives" },
  { label: "Gallery", href: "#gallery" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

function Counter({ value, suffix = "", duration = 1800 }) {
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
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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

/** Wraps a section and fades/slides it in on scroll */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const shouldScroll =
      sessionStorage.getItem("scrollTo") === "contact" ||
      window.location.hash === "#contact";
    if (!shouldScroll) return;
    const scrollToContact = () => {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        try {
          sessionStorage.removeItem("scrollTo");
        } catch (err) {}
      } else {
        // retry briefly until element mounts
        setTimeout(scrollToContact, 100);
      }
    };
    // delay slightly to let React mount content
    setTimeout(scrollToContact, 80);
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

function WaveDivider({ flip = false, color = "#FBF7F0" }) {
  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[90px]"
      >
        <path
          d="M0,40 C240,90 480,0 720,30 C960,60 1200,100 1440,40 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

// ─── Upcoming Events Section (IMPROVED — big image cards) ────────────────────

export function UpcomingEvents({ events = [] }) {
  return (
    <section className="bg-cream py-16 md:py-18">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Reveal className="text-center mb-14">
          <span className="inline-block text-coral font-semibold uppercase tracking-[0.25em] text-sm mb-3">
            Mark Your Calendar
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-teal leading-tight">
            Upcoming Events
          </h2>
          <p className="mt-4 text-charcoal/65 max-w-xl mx-auto">
            Be part of something meaningful. Join us at our upcoming drives and
            camps to make a direct, lasting impact in your community.
          </p>
        </Reveal>

        <div className="bg-[#F3EEE7] border border-[#E7DED4] rounded-[32px] p-6 md:p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, i) => (
            <Reveal key={event._id} delay={i * 150}>
                <div className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                  {/* Image */}
                  <div className="relative h-48 md:h-60 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Dark gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

                    {/* Tag badge on image */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`${event.tagColor} text-cream text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md`}
                      >
                        {event.tag}
                      </span>
                    </div>

                    {/* Emoji on image bottom-right */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/30">
                      {event.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <h3 className="font-display font-bold text-xl md:text-2xl text-charcoal mb-3 group-hover:text-teal transition-colors duration-300">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-charcoal/65">
                        <div className="w-7 h-7 rounded-lg bg-coral/10 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-coral" />
                        </div>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-charcoal/65">
                        <div className="w-7 h-7 rounded-lg bg-teal/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-teal" />
                        </div>
                        <span className="font-medium">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-charcoal/65 text-sm leading-relaxed mb-6">
                      {event.desc}
                    </p>

                    <a
                      href="/#contact"
                      className="inline-flex items-center gap-2 text-sm font-bold text-teal hover:text-coral transition-colors group/link"
                    >
                      Register Your Interest
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-teal to-coral transition-all duration-500" />
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA below events */}
          {/* <Reveal delay={300} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-teal/5 border border-teal/20 rounded-2xl px-8 py-5">
            <Star className="w-5 h-5 text-gold flex-shrink-0" />
            <p className="text-charcoal/75 text-sm md:text-base">
              Want to stay updated on all our events?
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-teal text-cream font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0"
            >
              Stay Connected
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </Reveal> */}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section (Map + Form) ────────────────────────────────────────────
function ContactSection() {
  return (
    <div className="bg-cream">
      <section id="contact" className="relative py-12 md:py-8 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-coral/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.25em] text-sm mb-3">
              Get In Touch
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-teal leading-tight">
              Let's Create Change Together
            </h2>
            <p className="mt-3 text-charcoal/65 max-w-xl mx-auto">
              Have a question, want to volunteer, or wish to partner with us?
              Reach out — we'd love to hear from you.
            </p>
          </Reveal>

          {/* Contact info cards */}
          <div className="bg-[#F3EEE7] border border-[#E7DED4] rounded-[32px] p-6 md:p-8 shadow-sm">
            {/* Contact info cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Reveal delay={0}>
                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-charcoal/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-charcoal/50 font-semibold mb-0.5">
                      Call Us
                    </p>

                    <a
                      href={`tel:${PHONE}`}
                      className="font-semibold text-charcoal hover:text-coral transition-colors"
                    >
                      {PHONE}
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-charcoal/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-charcoal/50 font-semibold mb-0.5">
                      Email Us
                    </p>

                    <a
                      href={`mailto:${EMAIL}`}
                      className="font-semibold text-charcoal hover:text-teal transition-colors break-all"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-charcoal/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-charcoal/50 font-semibold mb-0.5">
                      Visit Us
                    </p>
                    <p className="font-semibold text-charcoal leading-snug">
                      {ADDRESS}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Map + Form */}
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              {/* Map */}
              <Reveal className="h-full">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl h-full min-h-[320px] border-4 border-white">
                  <iframe
                    title="DMS AAROHI Location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
                    className="w-full h-full min-h-[320px]"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {/* Floating location badge — moved to bottom-left so it no longer
                    sits over Google's own "View larger map" link (top-left) */}
                  <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-5 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-coral flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-cream" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-charcoal">
                        DMS AAROHI
                      </p>
                      <p className="text-xs text-charcoal/60">
                        Paschim Vihar, New Delhi
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Contact form */}
              <Reveal delay={150} className="h-full">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="h-full bg-white rounded-3xl shadow-2xl p-4 md:p-5 flex flex-col"
                >
                  <h3 className="font-display font-bold text-xl text-charcoal mb-1">
                    Send Us a Message
                  </h3>
                  <p className="text-charcoal/60 text-sm mb-4">
                    We usually respond within 24–48 hours.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all duration-200 text-charcoal placeholder:text-charcoal/35"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 00000 00000"
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all duration-200 text-charcoal placeholder:text-charcoal/35"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all duration-200 text-charcoal placeholder:text-charcoal/35"
                    />
                  </div>

                  <div className="mb-4 flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us how you'd like to get involved..."
                      className="w-full h-full min-h-[80px] px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all duration-200 text-charcoal placeholder:text-charcoal/35 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full sm:w-auto self-start px-8 py-3 rounded-full bg-coral text-cream font-semibold shadow-lg shadow-coral/30 hover:bg-coral-dark hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function VolunteerModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", age: "", city: "", occupation: "",
    availability: "", mode: "", heardFrom: "", interestArea: "", message: "",
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
        <button
          onClick={onClose}
          aria-label="Close volunteer form"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white shadow-md flex items-center justify-center text-charcoal transition-all duration-200 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: Animated visual panel */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-gold/15 via-cream to-coral/10 p-8 lg:p-10">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gold/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 -right-10 w-64 h-64 bg-coral/10 rounded-full blur-2xl" />
          <div className="absolute top-1/3 right-0 w-24 h-24 border-2 border-gold/30 rounded-full" />

          <div className="relative flex-1 flex items-center justify-center">
            <div className="relative w-52 h-52 lg:w-60 lg:h-60 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping-slow" />
              <span className="absolute inset-4 rounded-full bg-gold/25" />
              <span className="absolute inset-10 rounded-full bg-white shadow-xl flex items-center justify-center">
                <Heart className="w-14 h-14 lg:w-16 lg:h-16 text-coral animate-pulse" />
              </span>
              <div className="absolute -top-2 -left-4 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-float">
                <GraduationCap className="w-6 h-6 text-teal" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "0.6s" }}>
                <Droplet className="w-6 h-6 text-coral" />
              </div>
              <div className="absolute top-4 -right-8 w-11 h-11 rounded-full bg-gold shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "1.1s" }}>
                <Leaf className="w-5 h-5 text-cream" />
              </div>
            </div>
          </div>

          <div className="relative">
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">Join Our Mission</span>
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
                    <p className="text-sm text-charcoal/70 font-medium">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Form panel */}
        <div className="relative bg-white overflow-y-auto max-h-[92vh] scrollbar-hide">
          <div className="md:hidden bg-gradient-to-br from-gold/15 to-coral/10 px-6 pt-8 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-coral" />
            </div>
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">Join Our Mission</span>
            <h3 className="font-display font-bold text-2xl text-charcoal leading-tight">Become a Volunteer</h3>
          </div>

          {submitted ? (
            <div className="px-6 py-14 md:px-9 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-5">
                <Heart className="w-8 h-8 text-teal" />
              </div>
              <h3 className="font-display font-bold text-2xl text-charcoal mb-2">Thank you, {form.name.split(" ")[0]}!</h3>
              <p className="text-charcoal/60 text-sm max-w-sm mb-8">
                Your registration has been received. Our team will reach out to you within 24–48 hours.
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
                <span className="inline-block text-coral font-semibold uppercase tracking-[0.2em] text-xs mb-2">Volunteer Registration</span>
                <h3 className="font-display font-bold text-[26px] text-charcoal leading-tight">Tell us about yourself</h3>
                <p className="text-charcoal/55 text-sm mt-1.5">Fields marked * are required — everything else is optional.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Full Name *</label>
                    <input type="text" required value={form.name} onChange={set("name")} placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Phone Number *</label>
                    <input type="tel" required value={form.phone} onChange={set("phone")} placeholder="+91 00000 00000" className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Age</label>
                    <input type="number" min="12" value={form.age} onChange={set("age")} placeholder="Your age" className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">City</label>
                    <input type="text" value={form.city} onChange={set("city")} placeholder="Your city" className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30" />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Email Address *</label>
                  <input type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30" />
                </div>

                <div className="h-px bg-charcoal/8 mb-5" />
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/35 mb-4">Optional details — help us match you better</p>

                

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Occupation</label>
                    <input type="text" value={form.occupation} onChange={set("occupation")} placeholder="Student, professional, etc." className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Availability</label>
                    <select value={form.availability} onChange={set("availability")} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal">
                      <option value="">Select availability</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Weekends">Weekends</option>
                      <option value="Flexible / Anytime">Flexible / Anytime</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Preferred Mode</label>
                    <select value={form.mode} onChange={set("mode")} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal">
                      <option value="">Select mode</option>
                      <option value="On-ground">On-ground</option>
                      <option value="Remote / Online">Remote / Online</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">How did you hear about us?</label>
                    <select value={form.heardFrom} onChange={set("heardFrom")} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal">
                      <option value="">Select an option</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Friend / Family">Friend / Family</option>
                      <option value="An Event / Camp">An Event / Camp</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Area of Interest</label>
                  <select value={form.interestArea} onChange={set("interestArea")} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal">
                    <option value="">Select an initiative</option>
                    {IMPACT_AREAS.map((area) => (
                      <option key={area.title} value={area.title}>{area.title}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-1.5">Message</label>
                  <textarea rows={3} value={form.message} onChange={set("message")} placeholder="Tell us a bit about yourself..." className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/40 focus:bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200 text-charcoal placeholder:text-charcoal/30 resize-none" />
                </div>

                {error && (
                  <div className="mb-4 bg-coral/10 border border-coral/20 text-coral text-sm rounded-xl px-4 py-2.5">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-coral text-cream font-bold shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Registration"}
                  {!submitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
                <p className="text-center text-xs text-charcoal/40 mt-3">We'll get back to you within 24–48 hours.</p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ─── "Be a Part of the Change" CTA ───────────────────────────────────────────

export function BeAPartCTA() {
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  return (
    <section className="relative bg-teal py-16 md:py-24 overflow-hidden mt-16">
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-gold/10 rounded-full" />
      <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-cream/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream/5 rounded-full" />

      <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
        <Reveal>
          <span className="inline-block text-gold font-semibold uppercase tracking-[0.25em] text-sm mb-4">
            Together We Can
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-cream leading-tight mb-5">
            Be a Part of the Change
          </h2>
          <p className="text-cream/85 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Every contribution — whether through volunteering, donating or
            participating in our initiatives — helps us create stronger
            communities and transform lives. Together, we can build a healthier,
            more compassionate and sustainable future.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* <a
              href="/#donate"
              className="group px-8 py-4 rounded-full bg-coral text-cream font-bold shadow-xl shadow-coral/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              Donate Now
              <Heart className="w-4 h-4 group-hover:scale-125 transition-transform" />
            </a> */}
            <button
              onClick={() => setVolunteerOpen(true)}
              className="px-8 py-4 rounded-full bg-coral text-cream font-bold shadow-xl shadow-coral/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              Become a Volunteer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/#contact"
              className="px-8 py-4 rounded-full bg-gold text-charcoal font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </Reveal>
      </div>
      <VolunteerModal
        isOpen={volunteerOpen}
        onClose={() => setVolunteerOpen(false)}
      />
    </section>
  );
}

export default function Homepage() {
const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [volunteerOpen, setVolunteerOpen] = useState(false);

  const { team } = useTeam();
  const { images: galleryImages } = useGallery("home");
  const { events } = useEvents();
  const { slides: fetchedSlides } = useHeroSlides("home");
  const { content: homeContent } = useInitiativeContent("home", { aboutImage: "" });

  const HERO_SLIDES =
    fetchedSlides.length > 0
      ? fetchedSlides.map((s) => ({ image: s.image, title: s.title, subtitle: s.subtitle }))
      : DEFAULT_HERO_SLIDES;
  const aboutImage = homeContent.aboutImage || communityImg;

  // Defensive read — prevents a crash if activeSlide is briefly out of
  // range (e.g. right after fetchedSlides swaps in with a different count).
  const currentHeroSlide = HERO_SLIDES[activeSlide] || HERO_SLIDES[0] || {};

  // Keep activeSlide in range whenever the slide count changes
  useEffect(() => {
    if (activeSlide >= HERO_SLIDES.length) {
      setActiveSlide(0);
    }
  }, [HERO_SLIDES.length, activeSlide]);

  // Hero autoplay — depends on HERO_SLIDES.length so the interval is
  // rebuilt (not left running on a stale slide count) whenever admin
  // slides load in with a different array length than the defaults.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [HERO_SLIDES.length]);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nextSlide = () =>
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () =>
    setActiveSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );

  return (
    <div className="font-body text-charcoal bg-cream overflow-x-hidden">
      {/* ============================ NAVBAR ============================ */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FFF8F0]/95 backdrop-blur-md shadow-lg py-2"
            : "bg-black/10 backdrop-blur-sm py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="z-50 flex items-center">
            <img
              src={logo}
              alt="DMS Aarohi"
              className={`object-contain transition-all duration-300 ${
                scrolled ? "h-8 md:h-10" : "h-10 md:h-12"
              }`}
            />
          </a>
          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative font-medium transition-colors group ${scrolled ? "text-charcoal/80 hover:text-teal" : "text-cream hover:text-gold"}`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-coral transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setVolunteerOpen(true)}
              className="group px-7 py-3.5 rounded-full bg-coral text-cream font-semibold shadow-xl shadow-coral/40 hover:bg-coral-dark hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              Volunteer Now
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden z-50 p-2 text-teal"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Mobile nav drawer */}
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
              href="#donate"
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

      <section
        id="home"
        className="relative h-screen min-h-[600px] w-full overflow-hidden pt-[72px]"
      >
        {/* Slides */}
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover ${
                i === activeSlide ? "animate-slow-zoom" : ""
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-charcoal/10" />
          </div>
        ))}

        {/* Slide content */}
        <div className="relative z-10 h-full flex flex-col items-start justify-center max-w-7xl mx-auto px-5 md:px-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-coral/90 text-cream text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-5 animate-fade-in-up">
            Registered Society &middot; 12A &amp; 80G Certified
          </span>
          <h1
            key={activeSlide}
            className="font-display font-bold text-4xl sm:text-5xl md:text-7xl text-cream leading-[1.1] max-w-3xl animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {currentHeroSlide.title}
          </h1>
          <p
            className="mt-5 text-base md:text-xl text-cream/90 max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {currentHeroSlide.subtitle}
          </p>
          <div
            className="mt-8 flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={() => setVolunteerOpen(true)}
              className="group px-7 py-3.5 rounded-full bg-coral text-cream font-semibold shadow-xl shadow-coral/40 hover:bg-coral-dark hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              Become a Volunteer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#initiatives"
              className="px-7 py-3.5 rounded-full bg-cream/10 border border-cream/40 text-cream font-semibold backdrop-blur-sm hover:bg-cream/20 transition-all duration-200"
            >
              Explore Our Initiatives
            </a>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute z-10 bottom-8 right-5 md:right-8 flex items-center gap-3">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-cream/40 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
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

      {/* ============================ ABOUT ============================ */}
      <section id="about" className="relative bg-cream pt-20 md:pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          {/* Image collage */}
          <Reveal>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[4/5]">
                <img
                  src={aboutImage}
                  alt="DMS AAROHI volunteers at a community event"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-4 md:-right-8 bg-teal text-cream rounded-2xl shadow-xl px-6 py-5 animate-float">
                <p className="font-display font-bold text-3xl md:text-4xl">
                  2013
                </p>
                <p className="text-xs md:text-sm uppercase tracking-wider text-cream/80">
                  Since
                </p>
              </div>
              {/* Decorative ring */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-gold rounded-full hidden md:block" />
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={150}>
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.25em] text-sm mb-3">
              About Us
            </span>
            <h3 className="font-display font-bold text-2xl md:text-[42px] text-teal leading-tight mb-5">
              Together, We Empower
              <br />
              Lives and Build a
              <br />
              Better Tomorrow.
            </h3>
            <p className="text-charcoal/75 leading-relaxed mb-4">
              Established in 2013, DMS AAROHI is a registered non-profit
              organization based in New Delhi, recognized under Sections 12A and
              80G of the Income Tax Act, 1961. We are committed to creating
              meaningful social impact by improving the lives of individuals and
              communities through sustainable initiatives.
            </p>
            <p className="text-charcoal/75 leading-relaxed mb-6">
              Our key focus areas include Blood Donation & Healthcare Support,
              Child Education, Beti Bachao Initiative, Cloth Distribution,
              Senior Citizen Welfare and Environmental Awareness.
            </p>
            <p className="text-charcoal/75 leading-relaxed mb-8">
              Driven by dedicated volunteers, generous donors and compassionate
              supporters, we believe that every contribution, whether through
              time, resources or kindness has the power to transform lives.
              Together, we are building stronger communities and creating a
              brighter, more inclusive future for all.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal">12A Registered</p>
                  <p className="text-sm text-charcoal/60">
                    Income Tax Act, 1961
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal">80G (5)(VI)</p>
                  <p className="text-sm text-charcoal/60">
                    Tax-exempt donations
                  </p>
                </div>
              </div>
            </div>
            <a
              href="#initiatives"
              className="inline-flex items-center gap-2 mt-8 font-semibold text-teal hover:text-coral transition-colors group"
            >
              Explore our initiatives
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Reveal>
        </div>
      </section>

      <WaveDivider color="#0E5A52" />

      {/* ============================ STATS RIBBON ============================ */}
      <section className="bg-teal py-14 md:py-16 -mt-1">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100}>
              <p className="font-display font-bold text-4xl md:text-[50px] text-gold">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-cream/80 text-sm md:text-base font-medium">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <WaveDivider flip color="#FBF7F0" />

      {/* =================== IMPACT AREAS (like DTH "Categories") ==================== */}
      <section
        id="initiatives"
        className="bg-cream pt-4 pb-16 md:pt-8 md:pb-24 -mt-1"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.25em] text-sm mb-3">
              What We Do
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-teal leading-tight">
              Choose a cause and see the change it creates
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {IMPACT_AREAS.map((area, i) => {
              const Icon = area.icon;
              return (
                <Reveal key={area.title} delay={i * 80}>
                  <div className="group relative bg-white rounded-2xl p-7 h-full border border-charcoal/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                    {/* Accent corner */}
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-gold/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative w-14 h-14 rounded-xl bg-teal flex items-center justify-center mb-5 group-hover:bg-coral transition-colors duration-300">
                      <Icon className="w-7 h-7 text-cream" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-charcoal mb-2 relative">
                      {area.title}
                    </h3>
                    <p className="text-charcoal/65 leading-relaxed relative">
                      {area.desc}
                    </p>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="h-[2px] w-0 bg-coral group-hover:w-16 transition-all duration-300" />
                      <a
                        href={area.href}
                        className="flex items-center gap-1 text-sm font-semibold text-teal group-hover:text-coral hover:gap-2 transition-all duration-300"
                      >
                        Learn More
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW WE WORK (like DTH "How to participate") =================== */}
      <section className="relative bg-teal py-16 md:py-24 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-cream rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-cream rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-gold rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-gold font-semibold uppercase tracking-[0.25em] text-sm mb-3">
              How We Create Impact
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-cream leading-[1.2] md:leading-[1.2]">
              Three steps that turn intention into impact
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[2px] bg-cream/20" />

            {HOW_WE_WORK.map((step, i) => (
              <Reveal key={step.step} delay={i * 150}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 w-20 h-20 rounded-full bg-gold flex items-center justify-center font-display font-bold text-2xl text-teal shadow-xl mb-6 group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-cream mb-3">
                    {step.title}
                  </h3>
                  <p className="text-cream/75 leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PRESIDENT SPEAKS ============================ */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-center">
            <Reveal>
              <div className="relative mx-auto md:mx-0 w-56 md:w-full">
                <div className="rounded-full md:rounded-3xl overflow-hidden aspect-square shadow-2xl border-4 border-white">
                  <img
                    src={presidentImg}
                    alt="President, DMS AAROHI"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-coral flex items-center justify-center shadow-lg">
                  <Quote className="w-7 h-7 text-cream" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <span className="inline-block text-coral font-semibold uppercase tracking-[0.25em] text-md mb-3">
                President Speaks
              </span>
              <blockquote className="font-display text-xl md:text-3xl text-charcoal leading-relaxed mb-6">
                "Our purpose is deeply rooted in creating meaningful change in
                society. We believe true progress lies in uplifting those who
                need it the most and building a compassionate, inclusive
                community."
              </blockquote>
              <p className="text-charcoal/70 leading-relaxed mb-6">
                Through our initiatives in education, health awareness and
                social support, we strive to bring hope, dignity and opportunity
                to underserved sections of society. Every small effort is a step
                toward a brighter, more equitable future — and together with our
                volunteers, partners and well-wishers, we remain committed to
                making a lasting difference.
              </p>
              <div>
                <p className="font-display font-bold text-lg text-teal">
                  — Pankaj Mathur
                </p>
                <p className="text-charcoal/60">President, DMS Aarohi</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <WaveDivider color="#0E5A52" />

      {/* ============== GALLERY ("Media Gallery") ===================== */}
      <section id="gallery" className="bg-teal py-14 md:py-20 -mt-1">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-gold font-semibold uppercase tracking-[0.25em] text-sm mb-3">
              Media Gallery
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-cream leading-tight">
              Glimpses of our work on ground
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[160px] md:auto-rows-[200px]">
            {galleryImages.map((img, i) => (
              <Reveal
                key={img._id}
                delay={i * 60}
                className={`${
                  i === 0 ? "col-span-2 row-span-2" : ""
                } ${i === 5 ? "md:row-span-2" : ""}`}
              >
                <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                  <img
                    src={img.url}
                    alt={`DMS AAROHI activity ${i + 1}`}
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

      {/* ============================ TEAM ============================ */}
      <section id="team" className="bg-cream py-16 md:py-14 -mt-1">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-coral font-semibold uppercase tracking-[0.25em] text-sm mb-3">
              Our Team
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-teal leading-[1.2] md:leading-[1.3]">
              The people behind every initiative
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <Reveal key={member._id} delay={i * 100}>
                <div className="group text-center">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-4 shadow-md">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/70 to-transparent" />
                    {/* <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex gap-2 justify-center">
                        <a
                          href={SOCIAL_LINKS.facebook}
                          className="w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center hover:bg-coral hover:text-cream transition-colors"
                        >
                          <FaFacebook />
                        </a>
                        <a
                          href={SOCIAL_LINKS.instagram}
                          className="w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center hover:bg-coral hover:text-cream transition-colors"
                        >
                          <FaInstagram />
                        </a>
                      </div>
                    </div> */}
                  </div>
                  <h3 className="font-display font-bold text-lg text-charcoal">
                    {member.name}
                  </h3>
                  <p className="text-coral text-sm font-medium">
                    {member.role}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          6. UPCOMING EVENTS (Big image cards)
          ════════════════════════════════════════════════════ */}
      <UpcomingEvents events={events} />

      {/* =========================================
         7. CONTACT (Map + Form)
        ========================================= */}

        <ContactSection />

      {/* "Be a Part of the Change" */}
      <BeAPartCTA />

      {/* ============================ FOOTER ============================ */}
      <footer className="bg-charcoal text-cream pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <a href="#home" className="z-50 flex items-center">
                <img
                  src={logo}
                  alt="DMS Aarohi"
                  className="object-contain transition-all duration-300 h-10 md:h-12"
                />
              </a>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed mb-5">
              A registered non-profit society working since 2013 for blood
              donation, child education, senior citizen care, environment
              awareness and community welfare in New Delhi.
            </p>
            <div className="flex gap-3"></div>
          </div>

          {/* Quick links */}
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

          {/* Initiatives */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">
              Our Initiatives
            </h4>
            <ul className="space-y-2 text-cream/70">
              {IMPACT_AREAS.map((area) => (
                <li key={area.title}>
                  <a
                    href="#initiatives"
                    className="hover:text-coral transition-colors"
                  >
                    {area.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-cream/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                <span>{ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-coral flex-shrink-0" />
                <a
                  href={`tel:${PHONE}`}
                  className="hover:text-coral transition-colors"
                >
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-coral flex-shrink-0" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="hover:text-coral transition-colors"
                >
                  {EMAIL}
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
      <VolunteerModal
        isOpen={volunteerOpen}
        onClose={() => setVolunteerOpen(false)}
      />
    </div>
  );
}
