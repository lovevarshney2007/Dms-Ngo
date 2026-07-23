/**
 * SeniorCitizen.jsx
 * Route: /initiatives/senior-citizen
 */
import { Users, Heart, ShieldCheck, Stethoscope, HandHeart, Megaphone, Home } from "lucide-react";
import { InitiativePage } from "./shared";

import heroImg1 from "../../assets/senior-citizen/senior-9.jpg";
import heroImg2 from "../../assets/senior-citizen/senior-4.jpg";
import heroImg3 from "../../assets/senior-citizen/senior-3.jpg";
import heroImg4 from "../../assets/senior-citizen/senior-1.jpg";

import g1 from "../../assets/senior-citizen/senior-10.jpg";
import g2 from "../../assets/senior-citizen/senior-6.jpg";
import g3 from "../../assets/senior-citizen/senior-7.jpg";
import g4 from "../../assets/senior-citizen/senior-8.jpg";
import g5 from "../../assets/senior-citizen/senior-9.jpg";
import g6 from "../../assets/senior-citizen/senior-3.jpg";
import g7 from "../../assets/senior-citizen/senior-11.jpg";
import g8 from "../../assets/senior-citizen/senior-12.JPG";
import g9 from "../../assets/senior-citizen/senior-13.JPG";
import g10 from "../../assets/senior-citizen/senior-14.JPG";
import g11 from "../../assets/senior-citizen/senior-15.JPG";
import g12 from "../../assets/senior-citizen/senior-2.jpg";


const HERO_SLIDES = [
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

const ABOUT_TEXT = [
  "Senior citizens deserve respect, care and a life filled with dignity. Through our Senior Citizen Welfare initiative, DMS AAROHI organizes activities that promote health, emotional well-being and social engagement.",
  "DMS AAROHI conducts health check-up camps, recreational activities, and community gatherings to help senior citizens remain active, connected, and engaged with society.",
  "Beyond meeting physical needs, our initiative focuses on providing emotional support and companionship to reduce loneliness and isolation among the elderly. Our mission is to ensure that every senior citizen experiences care, respect, and a sense of belonging in their later years.",
  "We strive to create a supportive environment where elderly individuals feel valued and cared for.",
];

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
  return (
    <InitiativePage
      heroSlides={HERO_SLIDES}
      heroTitle="Senior Citizen Welfare"
      heroTagline="Caring for Those Who Once Cared for Us"
      accentColor="bg-teal"
      accentText="text-teal"
      aboutText={ABOUT_TEXT}
      aboutImage={g10}
      aboutBadges={ABOUT_BADGES}
      activities={ACTIVITIES}
      galleryImages={[g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12]}
      statsRow={STATS}
      ctaTitle="Support Our Senior Citizens"
      ctaBody="Join us in bringing care, respect, and happiness to our elders. Volunteer your time or donate to make a real difference in their lives."
      ctaButtonLabel="Become a Volunteer"
      ctaButtonHref="/#contact"
      ctaSideImage={g5}
      statsRow={STATS}
      socialImpact={SOCIAL_IMPACT}
      icon={Users}
    />
  );
}