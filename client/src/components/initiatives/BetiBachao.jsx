/**
 * BetiBachao.jsx
 * Route: /initiatives/beti-bachao
 *
 * Replace heroImg2/3/4 and gallery with dedicated Beti Bachao event photos
 * when available.
 */

import { ShieldCheck, Heart, Users, Megaphone, GraduationCap, Sparkles, Handshake } from "lucide-react";
import { InitiativePage } from "./shared";

import heroImg1 from "../../assets/beti-bachao/beti-2.jpg";
import heroImg2 from "../../assets/beti-bachao/beti-15.jpg";
import heroImg3 from "../../assets/beti-bachao/beti-3.jpg";
import heroImg4 from "../../assets/beti-bachao/beti-8.JPG";

import g1 from "../../assets/beti-bachao/beti-15.jpg";
import g2 from "../../assets/beti-bachao/beti-12.jpg";
import g3 from "../../assets/beti-bachao/beti-5.jpg";
import g4 from "../../assets/beti-bachao/beti-6.jpg";
import g5 from "../../assets/beti-bachao/beti-7.jpg";
import g6 from "../../assets/beti-bachao/beti-8.JPG";
import g7 from "../../assets/beti-bachao/beti-10.jpg";
import g8 from "../../assets/beti-bachao/beti-11.jpg";
import g9 from "../../assets/beti-bachao/beti-9.JPG";
import g10 from "../../assets/beti-bachao/beti-13.jpg";
import g11 from "../../assets/beti-bachao/beti-14.jpg";
import g12 from "../../assets/beti-bachao/beti-4.jpg";

const HERO_SLIDES = [
  {
    image: heroImg1,
    title: "Beti Bachao Initiative",
    subtitle: "Empowering Every Girl for a Better Tomorrow.",
  },
  {
    image: heroImg2,
    title: "Every Girl Deserves a Chance",
    subtitle: "We champion the rights, safety and education of the girl child through community-driven action.",
  },
  {
    image: heroImg3,
    title: "Breaking Barriers Together",
    subtitle: "Our awareness campaigns foster positive change in communities and create equal opportunities for girls.",
  },
  {
    image: heroImg4,
    title: "Empowered Girls, Stronger Society",
    subtitle: "Workshops, outreach programs and social events designed to uplift and inspire the girl child.",
  },
];

const ABOUT_TEXT = [
  "Every girl deserves the opportunity to live, learn, and achieve her dreams. Through the Beti Bachao Initiative, DMS AAROHI promotes awareness about the importance of girl child education, safety, equality and empowerment.",
  "Through awareness campaigns, educational support, and community outreach programs, DMS AAROHI strives to create an environment where girls are valued, respected, and given equal opportunities to succeed.",
  "By supporting the dreams and aspirations of young girls, we aim to nurture confident, educated, and empowered individuals who can shape a better future for themselves and for society.",
  "We work with communities to encourage positive social change and support girls in reaching their full potential.",
];

const ABOUT_BADGES = [
  { icon: ShieldCheck, label: "Girl Child Protection", sub: "Awareness & safety drives" },
  { icon: Users, label: "Community Outreach", sub: "School & Local events" },
];

const ACTIVITIES = [
  {
    title: "Girl Child Awareness Campaigns",
    description: "Raising awareness in communities about the importance of valuing, protecting and empowering the girl child.",
    icon: Megaphone,
  },
  {
    title: "Educational Support",
    description: "Ensuring girls have access to education and the resources needed to pursue their academic goals.",
    icon: GraduationCap,
  },
  {
    title: "Community Outreach Programs",
    description: "Engaging with families and local communities to promote equality and challenge harmful social norms.",
    icon: Users,
  },
  {
    title: "Women Empowerment Sessions",
    description: "Conducting workshops that build confidence, skills and independence among girls and women.",
    icon: Sparkles,
  },
  {
    title: "Social Awareness Events",
    description: "Hosting events that spark conversations and drive community action around gender equality.",
    icon: Handshake,
  },
  {
    title: "Self-Defense & Safety Workshops",
    description: "Conducting self-defense training and safety awareness sessions to empower girls with confidence and security.",
    icon: ShieldCheck,
  },
];

const STATS = [
  { value: 200, suffix: "+", label: "Girls Reached" },
  { value: 30, suffix: "+", label: "Awareness Camps" },
  { value: 15, suffix: "+", label: "Schools Engaged" },
  { value: 50, suffix: "+", label: "Community Sessions" },
];

const SOCIAL_IMPACT = {
  title: "Empowering Every Girl's Story",
  subtitle: "Every awareness drive brings us closer to a more equal, empowered generation.",
  points: [
    {
      icon: Megaphone,
      label: "Voices Amplified",
      description: "Awareness campaigns that challenge stereotypes and champion the girl child's rights.",
    },
    {
      icon: Sparkles,
      label: "Confidence Built",
      description: "Workshops and mentorship that nurture self-belief, safety and independence in girls.",
    },
    {
      icon: Handshake,
      label: "Communities Changed",
      description: "Families and neighborhoods embracing equality, one conversation at a time.",
    },
  ],
};

export default function BetiBachao() {
  return (
    <InitiativePage
      heroSlides={HERO_SLIDES}
      heroTitle="Beti Bachao Initiative"
      heroTagline="Empowering Every Girl for a Better Tomorrow"
      accentColor="bg-coral"
      accentText="text-amber-600"
      aboutText={ABOUT_TEXT}
      aboutImage={g7}
      aboutBadges={ABOUT_BADGES}
      activities={ACTIVITIES}
      galleryImages={[g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12]}
      statsRow={STATS}
      ctaTitle="Support Girl Child Empowerment"
      ctaBody="Join us in creating equal opportunities and brighter futures for every girl. Your participation strengthens communities and transforms lives."
      ctaButtonLabel="Join the Initiative"
      ctaButtonHref="/#contact"
      ctaSideImage={heroImg3}
      statsRow={STATS}
      socialImpact={SOCIAL_IMPACT}
      icon={GraduationCap}
    />
  );
}