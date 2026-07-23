/**
 * BloodDonation.jsx
 * Route: /initiatives/blood-donation
 *
 * Swap gallery imports with your real blood-camp photos.
 * heroSlides: use 3-4 different blood camp / awareness photos for variety.
 */
import { useState } from "react";
import { Droplet, Heart, ShieldCheck, HeartPulse, HeartHandshake, Megaphone, Stethoscope, UserPlus, Users } from "lucide-react";
import { InitiativePage, BloodDonorModal } from "./shared";

import heroImg1 from "../../assets/hero/blood-camp-1.jpg";
import heroImg2 from "../../assets/blood-camp/blood-img-1.jpg";
import heroImg3 from "../../assets/blood-camp/blood-img-2.jpg";
import heroImg4 from "../../assets/blood-camp/blood-img-3.jpg";
import aboutImg from "../../assets/blood-camp/blood-about.jpg";

import g1 from "../../assets/blood-ground/blood-1.jpg";
import g2 from "../../assets/blood-ground/blood-2.jpg";
import g3 from "../../assets/blood-ground/blood-9.jpg";
import g4 from "../../assets/blood-ground/blood-4.jpg";
import g5 from "../../assets/blood-ground/blood-5.jpg";
import g6 from "../../assets/blood-ground/blood-6.jpg";
import g7 from "../../assets/blood-ground/blood-7.jpg";
import g8 from "../../assets/blood-ground/blood-8.jpg";
import g10 from "../../assets/blood-ground/blood-10.jpg";
import g11 from "../../assets/blood-ground/blood-11.jpg";
import g12 from "../../assets/blood-ground/blood-12.jpg";
import g13 from "../../assets/blood-ground/blood-13.jpg";

const HERO_SLIDES = [
  {
    image: heroImg1,
    title: "Every Drop Counts",
    subtitle: "Building a reliable chain of voluntary blood donors for patients in need, especially those battling Thalassemia.",
  },
  {
    image: heroImg2,
    title: "Be a Lifesaver",
    subtitle: "One donation of blood can save up to three lives. Join our verified donor network today.",
  },
  {
    image: heroImg3,
    title: "Awareness Saves Lives",
    subtitle: "We spread knowledge about the importance of regular blood donation through community camps.",
  },
  {
    image: heroImg4,
    title: "Emergency Support",
    subtitle: "Connecting verified donors with patients during emergencies — fast, verified, and compassionate.",
  },
];

const ABOUT_TEXT = [
  "At DMS AAROHI, we believe that every drop of blood can save a life. Our Blood Donation & Healthcare initiative focuses on organizing voluntary blood donation camps, creating awareness about regular blood donation and connecting verified donors with patients during emergencies.",
  "We are committed to ensuring timely support for those in need, especially individuals suffering from Thalassemia and other critical medical conditions.","We encourage individuals to become regular donors and ambassadors for this life-saving cause. Our mission is not only to respond during emergencies but also to foster a culture of compassion, responsibility, and community healthcare support for future generations.",
];

const ABOUT_BADGES = [
  { icon: Droplet, label: "Verified Donor Network", sub: "Trusted & emergency-ready" },
  { icon: ShieldCheck, label: "Patient Assistance", sub: "Thalassemia & critical care" },
];

const ACTIVITIES = [
  {
    title: "Blood Donation Camps",
    description: "Organizing regular voluntary blood donation camps across communities to build a steady, reliable supply of blood units.",
    icon: Droplet,
  },
  {
    title: "Emergency Blood Support",
    description: "Connecting verified donors with patients in critical need, ensuring a fast response during medical emergencies.",
    icon: HeartPulse,
  },
  {
    title: "Thalassemia Patient Assistance",
    description: "Providing ongoing blood support and care coordination for patients battling Thalassemia and other blood disorders.",
    icon: HeartHandshake,
  },
  {
    title: "Blood Donation Awareness Programs",
    description: "Educating communities about the life-saving impact of regular blood donation through outreach and campaigns.",
    icon: Megaphone,
  },
  {
    title: "Community Health Camps",
    description: "Conducting health check-up camps that combine blood donation with basic wellness screening for local communities.",
    icon: Stethoscope,
  },
  {
    title: "Voluntary Donor Registration",
    description: "Registering and onboarding new voluntary donors to continuously grow our verified, life-saving donor network.",
    icon: UserPlus,
  },
];

const STATS = [
  { value: 25000, suffix: "+", label: "Blood Units Facilitated" },
  { value: 100, suffix: "+", label: "Camps Organized" },
  { value: 14, suffix: "+", label: "Years of Service" },
  { value: 1000, suffix: "+", label: "Lives Impacted" },
];

const SOCIAL_IMPACT = {
  title: "Every Drop Creates a Ripple",
  subtitle: "Behind every unit of blood is a story of survival, trust and community spirit.",
  points: [
    {
      icon: HeartPulse,
      label: "Lives Saved",
      description: "One donation can save up to three lives — multiplying hope with every camp we hold.",
    },
    {
      icon: ShieldCheck,
      label: "Trust Built",
      description: "A verified, emergency-ready donor network hospitals and families can count on.",
    },
    {
      icon: Users,
      label: "Community United",
      description: "Hundreds of compassionate donors coming together as one life-saving family.",
    },
  ],
};

export default function BloodDonation() {
   const [donorOpen, setDonorOpen] = useState(false);
  return (
    <>
      <InitiativePage
        heroSlides={HERO_SLIDES}
        heroTitle="Blood Donation & Healthcare"
        heroTagline="Saving Lives Through Voluntary Blood Donation"
        accentColor="bg-coral"
        accentText="text-coral"
        aboutText={ABOUT_TEXT}
        aboutImage={aboutImg}
        aboutBadges={ABOUT_BADGES}
        activities={ACTIVITIES}
        galleryImages={[g1, g2, g3, g4, g5, g6, g7, g8, g10, g11, g12, g13]}
        statsRow={STATS}
        ctaTitle="Become a Blood Donor"
        ctaBody="Your one donation can save multiple lives. Join our network of voluntary blood donors and help patients during medical emergencies."
        ctaButtonLabel="Register as a Blood Donor"
        ctaButtonHref="/#contact"
        ctaSideImage={heroImg2}
        socialImpact={SOCIAL_IMPACT}
        icon={Droplet}
        onCtaClick={() => setDonorOpen(true)}
      />
      <BloodDonorModal isOpen={donorOpen} onClose={() => setDonorOpen(false)} />
    </>
  );
}