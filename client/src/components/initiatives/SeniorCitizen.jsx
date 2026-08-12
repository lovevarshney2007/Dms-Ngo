/**
 * SeniorCitizen.jsx
 * Route: /initiatives/senior-citizen
 */

import { Users, Heart, ShieldCheck, Stethoscope, HandHeart, Megaphone, Home } from "lucide-react";
import { InitiativePage } from "./shared";
import { useGallery, useInitiativeContent, useHeroSlides } from "../../hooks/useSiteData";
import { useState } from "react";
import { VolunteerModal } from "../Homepage";

import heroImg1 from "../../assets/senior-citizen/senior-9.jpg";
import heroImg2 from "../../assets/senior-citizen/senior-4.jpg";
import heroImg3 from "../../assets/senior-citizen/senior-3.jpg";
import heroImg4 from "../../assets/senior-citizen/senior-1.jpg";
import aboutImg from "../../assets/senior-citizen/senior-5.jpg";

const SLUG = "senior-citizen";

const DEFAULT_CONTENT = {
  heroTitle: "Senior Citizen Welfare",
  heroTagline: "Caring for Those Who Once Cared for Us",
  aboutText:
    "Senior citizens deserve respect, care and a life filled with dignity. Through our Senior Citizen Welfare initiative, DMS AAROHI organizes activities that promote health, emotional well-being and social engagement.\nDMS AAROHI conducts health check-up camps, recreational activities, and community gatherings to help senior citizens remain active, connected, and engaged with society.\nBeyond meeting physical needs, our initiative focuses on providing emotional support and companionship to reduce loneliness and isolation among the elderly. Our mission is to ensure that every senior citizen experiences care, respect, and a sense of belonging in their later years.\nWe strive to create a supportive environment where elderly individuals feel valued and cared for.",
  ctaTitle: "Support Our Senior Citizens",
  ctaBody:
    "Join us in bringing care, respect, and happiness to our elders. Volunteer your time or donate to make a real difference in their lives.",
  ctaButtonLabel: "Become a Volunteer",
  aboutImage: "",
};

const DEFAULT_HERO_SLIDES = [
  {
    image: heroImg1,
    title: "Caring for Those Who Cared for Us",
    subtitle: "Bringing dignity, health and happiness to our senior citizens.",
  },
  {
    image: heroImg2,
    title: "Every Elder Deserves Dignity",
    subtitle: "Health camps, wellness programs and social activities designed to uplift the elderly.",
  },
  {
    image: heroImg3,
    title: "Health & Happiness Together",
    subtitle: "Our volunteers bring companionship, care and health services to senior citizens across the community.",
  },
  {
    image: heroImg4,
    title: "A Community That Cares",
    subtitle: "Empowering elders with the support, joy and social connection they deserve.",
  },
];
 
const DEFAULT_ABOUT_IMAGE = aboutImg;

const ABOUT_BADGES = [
  { icon: Heart, label: "Health Check-up Camps", sub: "Free medical & wellness" },
  { icon: Users, label: "Social Programs", sub: "Interaction events" },
];

const ACTIVITIES = [
  {
    title: "Health Check-up Camps",
    description: "Organizing free medical check-ups and wellness screenings to monitor and support elderly health.",
    icon: Stethoscope,
  },
  {
    title: "Wellness & Recreation Programs",
    description: "Hosting recreational activities that promote physical well-being and joyful social engagement.",
    icon: Heart,
  },
  {
    title: "Community Support Activities",
    description: "Providing everyday assistance and care to help senior citizens live with comfort and dignity.",
    icon: HandHeart,
  },
  {
    title: "Social Interaction Events",
    description: "Creating spaces for elders to connect, socialize and build meaningful friendships in the community.",
    icon: Users,
  },
  {
    title: "Elder Care Awareness Programs",
    description: "Spreading awareness about elder care, rights and respect within families and communities.",
    icon: Megaphone,
  },
  {
    title: "Home Visit & Companionship Program",
    description: "Organizing home visits and companionship programs to combat loneliness and provide emotional support for elders.",
    icon: Home,
  },
];

const STATS = [
  { value: 1000, suffix: "+", label: "Seniors Supported" },
  { value: 40, suffix: "+", label: "Health Camps Held" },
  { value: 200, suffix: "+", label: "Volunteer Hours" },
  { value: 25, suffix: "+", label: "Community Programs" },
];

const SOCIAL_IMPACT = {
  title: "Honoring a Lifetime of Care",
  subtitle: "Every visit, every check-up, every smile brings dignity back into our elders' lives.",
  points: [
    {
      icon: Stethoscope,
      label: "Health Protected",
      description: "Regular health camps ensuring our elders receive the care they deserve.",
    },
    {
      icon: HandHeart,
      label: "Loneliness Eased",
      description: "Companionship and home visits that bring warmth to isolated seniors.",
    },
    {
      icon: Heart,
      label: "Dignity Restored",
      description: "Creating a community where every elder feels valued, respected and cared for.",
    },
  ],
};

export default function SeniorCitizen() {
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const { images: galleryImages } = useGallery(SLUG);
  const { content } = useInitiativeContent(SLUG, DEFAULT_CONTENT);
  const { slides: fetchedSlides } = useHeroSlides(SLUG);

  const heroSlides =
    fetchedSlides.length > 0
      ? fetchedSlides.map((s) => ({ image: s.image, title: s.title, subtitle: s.subtitle }))
      : DEFAULT_HERO_SLIDES;

  const aboutImage = content.aboutImage || DEFAULT_ABOUT_IMAGE;

  return (
    <>
    <InitiativePage
      heroSlides={heroSlides}
      heroTitle={content.heroTitle}
      heroTagline={content.heroTagline}
      accentColor="bg-teal"
      accentText="text-teal"
      aboutText={content.aboutText.split("\n")}
      aboutImage={aboutImage}
      aboutBadges={ABOUT_BADGES}
      activities={ACTIVITIES}
      galleryImages={galleryImages.map((img) => img.url)}
      statsRow={STATS}
      ctaTitle={content.ctaTitle}
      ctaBody={content.ctaBody}
      ctaButtonLabel={content.ctaButtonLabel}
      ctaButtonHref={undefined}
      ctaSideImage={heroImg2}
      socialImpact={SOCIAL_IMPACT}
      icon={Users}
      onCtaClick={() => setVolunteerModalOpen(true)}
    />
    <VolunteerModal isOpen={volunteerModalOpen} onClose={() => setVolunteerModalOpen(false)} />
    </>
  );
}
