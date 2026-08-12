/**
 * EnvironmentAwareness.jsx
 * Route: /initiatives/environment
 */

import { Leaf, TreePine, Globe, Trash2, Users, Recycle, Droplet } from "lucide-react";
import { InitiativePage } from "./shared";
import { useGallery, useInitiativeContent, useHeroSlides } from "../../hooks/useSiteData";
import { useState } from "react";
import { VolunteerModal } from "../Homepage";

import heroImg1 from "../../assets/env-awareness/env-1.jpg";
import heroImg2 from "../../assets/env-awareness/env-6.jpg";
import heroImg3 from "../../assets/env-awareness/env-3.jpg";
import heroImg4 from "../../assets/env-awareness/env-11.jpg";
import aboutImg from "../../assets/env-awareness/env-10.jpg";

const SLUG = "environment";

const DEFAULT_CONTENT = {
  heroTitle: "Environment Awareness",
  heroTagline: "Together for a Cleaner and Greener Future",
  aboutText:
    "Protecting the environment is a shared responsibility. Through our Environment Awareness initiative, DMS AAROHI encourages sustainable practices, tree plantation drives, cleanliness campaigns and environmental education.\nDMS AAROHI actively engages communities through awareness drives, workshops, and volunteer programs that inspire individuals to adopt eco-friendly habits in their daily lives.\nThrough tree plantation campaigns and environmental initiatives, we aim to foster a sense of responsibility towards nature among people of all ages. Our vision is to create greener, cleaner, and more sustainable communities for present and future generations.\nTogether, we can build a healthier planet for future generations.",
  ctaTitle: "Join Our Green Mission",
  ctaBody:
    "Together, we can protect nature and create a sustainable future. Join a plantation drive, participate in a cleanliness campaign or volunteer with us.",
  ctaButtonLabel: "Join the Green Drive",
  aboutImage: "",
};

const DEFAULT_HERO_SLIDES = [
  {
    image: heroImg1,
    title: "Together for a Greener Future",
    subtitle: "Protecting the environment is a shared responsibility — and it starts with us.",
  },
  {
    image: heroImg2,
    title: "Plant a Tree, Plant a Hope",
    subtitle: "Our tree plantation drives are creating greener, healthier communities across the city.",
  },
  {
    image: heroImg3,
    title: "Clean Communities, Better Lives",
    subtitle: "Cleanliness campaigns and waste-awareness drives for a healthier environment.",
  },
  {
    image: heroImg4,
    title: "Education for Sustainability",
    subtitle: "Teaching communities how small daily changes build a sustainable future for generations.",
  },
];

const DEFAULT_ABOUT_IMAGE = aboutImg;

const ABOUT_BADGES = [
  { icon: Leaf, label: "2,000+ Trees Planted", sub: "And growing every season" },
  { icon: Globe, label: "Community Drives", sub: "Cleanliness & sustainability" },
];

const ACTIVITIES = [
  {
    title: "Tree Plantation Drives",
    description: "Organizing plantation drives to increase green cover and restore natural balance in local areas.",
    icon: TreePine,
  },
  {
    title: "Cleanliness Campaigns",
    description: "Running community clean-up drives to reduce waste and promote hygienic, litter-free neighborhoods.",
    icon: Trash2,
  },
  {
    title: "Environmental Awareness Programs",
    description: "Educating communities on sustainable practices and the importance of protecting our natural environment.",
    icon: Leaf,
  },
  {
    title: "Community Participation Events",
    description: "Bringing together volunteers and residents to actively contribute to a cleaner, greener community.",
    icon: Users,
  },
  {
    title: "Sustainability Initiatives",
    description: "Promoting recycling, reduced waste and eco-friendly habits for a more sustainable future.",
    icon: Recycle,
  },
  {
    title: "Water Conservation Awareness",
    description: "Promoting water-saving practices and rainwater harvesting awareness to conserve this vital natural resource.",
    icon: Droplet,
  },
];

const STATS = [
  { value: 2000, suffix: "+", label: "Trees Planted" },
  { value: 30, suffix: "+", label: "Cleanliness Drives" },
  { value: 500, suffix: "+", label: "Participants" },
  { value: 15, suffix: "+", label: "Awareness Programs" },
];

const SOCIAL_IMPACT = {
  title: "Nurturing a Greener Tomorrow",
  subtitle: "Every tree planted and every drive organized brings us closer to a sustainable future.",
  points: [
    {
      icon: TreePine,
      label: "Green Cover Restored",
      description: "Thousands of trees planted, restoring balance to our local ecosystems.",
    },
    {
      icon: Leaf,
      label: "Communities Educated",
      description: "Awareness programs inspiring eco-friendly habits across neighborhoods.",
    },
    {
      icon: Trash2,
      label: "Cleaner Surroundings",
      description: "Cleanliness drives creating healthier, litter-free spaces for everyone.",
    },
  ],
};

export default function EnvironmentAwareness() {
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
      icon={Leaf}
      onCtaClick={() => setVolunteerModalOpen(true)}
    />
    <VolunteerModal isOpen={volunteerModalOpen} onClose={() => setVolunteerModalOpen(false)} />
    </>
  );
}
