/**
 * EnvironmentAwareness.jsx
 * Route: /initiatives/environment
 *
 * Replace heroImg1-4 and gallery with dedicated environment/plantation
 * photos once you have them.
 */

import { Leaf, TreePine, Globe, Trash2, Users, Recycle, Droplet } from "lucide-react";
import { InitiativePage } from "./shared";

import heroImg1 from "../../assets/env-awareness/env-1.jpg";
import heroImg2 from "../../assets/env-awareness/env-6.jpg";
import heroImg3 from "../../assets/env-awareness/env-3.jpg";
import heroImg4 from "../../assets/env-awareness/env-11.jpg";

import g1 from "../../assets/env-awareness/env-5.jpg";
import g2 from "../../assets/env-awareness/env-2.jpg";
import g3 from "../../assets/env-awareness/env-4.jpg";
import g4 from "../../assets/env-awareness/env-9.jpg";
import g5 from "../../assets/env-awareness/env-8.jpg";
import g6 from "../../assets/env-awareness/env-11.jpg";
import g7 from "../../assets/env-awareness/env-12.jpg";
import g8 from "../../assets/env-awareness/env-13.jpg";
import g9 from "../../assets/env-awareness/env-3.jpg";
import g10 from "../../assets/env-awareness/env-2.jpg";
import g11 from "../../assets/env-awareness/env-14.jpg";
import g12 from "../../assets/env-awareness/env-15.jpg";

const HERO_SLIDES = [
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

const ABOUT_TEXT = [
  "Protecting the environment is a shared responsibility. Through our Environment Awareness initiative, DMS AAROHI encourages sustainable practices, tree plantation drives, cleanliness campaigns and environmental education.",
  "DMS AAROHI actively engages communities through awareness drives, workshops, and volunteer programs that inspire individuals to adopt eco-friendly habits in their daily lives. ",
  "Through tree plantation campaigns and environmental initiatives, we aim to foster a sense of responsibility towards nature among people of all ages. Our vision is to create greener, cleaner, and more sustainable communities for present and future generations.",
  "Together, we can build a healthier planet for future generations.",
];

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
  return (
    <InitiativePage
      heroSlides={HERO_SLIDES}
      heroTitle="Environment Awareness"
      heroTagline="Together for a Cleaner and Greener Future"
      accentColor="bg-teal"
      accentText="text-teal"
      aboutText={ABOUT_TEXT}
      aboutImage={g8}
      aboutBadges={ABOUT_BADGES}
      activities={ACTIVITIES}
      galleryImages={[g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12]}
      statsRow={STATS}
      ctaTitle="Join Our Green Mission"
      ctaBody="Together, we can protect nature and create a sustainable future. Join a plantation drive, participate in a cleanliness campaign or volunteer with us."
      ctaButtonLabel="Join the Green Drive"
      ctaButtonHref="/#contact"
      ctaSideImage={g1}
      statsRow={STATS}
      socialImpact={SOCIAL_IMPACT}
      icon={Leaf}
    />
  );
}