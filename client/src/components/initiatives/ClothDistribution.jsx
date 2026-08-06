/**
 * ClothDistribution.jsx
 * Route: /initiatives/cloth-distribution
 */

import { Shirt, Heart, Users, Snowflake, HandHeart, Package, ShoppingBag } from "lucide-react";
import { InitiativePage } from "./shared";
import { useGallery, useInitiativeContent } from "../../hooks/useSiteData";
import { useHeroSlides } from "../../hooks/useSiteData";

import heroImg1 from "../../assets/hero/clothes-donation.jpeg";
import heroImg2 from "../../assets/cloth-donation/cloth-2.jpg";
import heroImg3 from "../../assets/cloth-donation/cloth-1.jpg";
import heroImg4 from "../../assets/cloth-donation/cloth-3.jpg";
import aboutImg from "../../assets/cloth-donation/cloth-4.jpg";

const SLUG = "cloth-distribution";

const DEFAULT_CONTENT = {
  heroTitle: "Cloth Distribution",
  heroTagline: "Sharing Warmth, Spreading Kindness",
  aboutText:
    "Many families struggle to meet basic clothing needs throughout the year. Our Cloth Distribution initiative collects and distributes clean, usable clothes to underprivileged families, helping them live with dignity and comfort.\nThrough donation drives and community support, DMS AAROHI collects clothing for people of all ages, ensuring that children, women, and elderly individuals receive essential garments suited to their needs.\nBeyond providing clothing, this initiative aims to restore dignity and confidence to those facing difficult circumstances. By encouraging the spirit of sharing and compassion, we strive to build a community where no one is left without warmth, comfort, and care.\nEvery donation brings warmth, hope, and happiness to someone in need.",
  ctaTitle: "Donate Clothes Today",
  ctaBody:
    "Your unused clothes can make a meaningful difference in someone's life. Drop off donations or join our next collection drive.",
  ctaButtonLabel: "Donate Clothes",
  aboutImage: "",
};

const DEFAULT_HERO_SLIDES = [
  {
    image: heroImg1,
    title: "Warmth That Reaches Far",
    subtitle: "Distributing clothes and essentials to families who need them the most.",
  },
  {
    image: heroImg2,
    title: "Sharing Warmth, Spreading Kindness",
    subtitle: "Every garment donated brings comfort, dignity and hope to an underserved family.",
  },
  {
    image: heroImg3,
    title: "Donate What You Don't Wear",
    subtitle: "Your unused clothes could be someone else's greatest need. Join our collection drive.",
  },
  {
    image: heroImg4,
    title: "Community Drives, Real Impact",
    subtitle: "Our volunteers ensure clean, usable clothing reaches the right families across Delhi NCR.",
  },
];

const DEFAULT_ABOUT_IMAGE = aboutImg;

const ABOUT_BADGES = [
  { icon: Shirt, label: "10,000+ Garments", sub: "Collected & distributed" },
  { icon: Users, label: "5,000+ Families", sub: "Supported across NCR" },
];

const ACTIVITIES = [
  {
    title: "Cloth Collection Drives",
    description: "Organizing collection points to gather clean, usable clothes from generous donors across the community.",
    icon: Shirt,
  },
  {
    title: "Winter Distribution Campaigns",
    description: "Distributing warm clothing and blankets to vulnerable families during the harsh winter months.",
    icon: Snowflake,
  },
  {
    title: "Community Support Programs",
    description: "Identifying families in need and ensuring essential clothing reaches them with dignity and care.",
    icon: HandHeart,
  },
  {
    title: "Essential Item Distribution",
    description: "Providing everyday essentials alongside clothing to support families facing difficult circumstances.",
    icon: Package,
  },
  {
    title: "Volunteer Donation Drives",
    description: "Mobilizing volunteers to run city-wide donation drives that multiply our reach and impact.",
    icon: Users,
  },
  {
    title: "Footwear & Essentials Drive",
    description: "Distributing shoes and other daily essentials alongside clothing to fully support families in need.",
    icon: ShoppingBag,
  },
];

const STATS = [
  { value: 5000, suffix: "+", label: "Families Supported" },
  { value: 20, suffix: "+", label: "Distribution Drives" },
  { value: 300, suffix: "+", label: "Volunteers Engaged" },
  { value: 10000, suffix: "+", label: "Garments Distributed" },
];

const SOCIAL_IMPACT = {
  title: "Warmth That Changes Lives",
  subtitle: "Every garment donated restores dignity and comfort to a family in need.",
  points: [
    {
      icon: HandHeart,
      label: "Dignity Restored",
      description: "Clean, usable clothing that helps families face each day with confidence and comfort.",
    },
    {
      icon: Snowflake,
      label: "Winters Made Warmer",
      description: "Blankets and warm clothes reaching vulnerable families when they need it most.",
    },
    {
      icon: Heart,
      label: "Kindness Multiplied",
      description: "Thousands of garments passed from generous hands to those who need them the most.",
    },
  ],
};

export default function ClothDistribution() {
  const { images: galleryImages } = useGallery(SLUG);
  const { content } = useInitiativeContent(SLUG, DEFAULT_CONTENT);
  const { slides: fetchedSlides } = useHeroSlides(SLUG);

  const heroSlides =
    fetchedSlides.length > 0
      ? fetchedSlides.map((s) => ({ image: s.image, title: s.title, subtitle: s.subtitle }))
      : DEFAULT_HERO_SLIDES;

  const aboutImage = content.aboutImage || DEFAULT_ABOUT_IMAGE;

  return (
    <InitiativePage
      heroSlides={heroSlides}
      heroTitle={content.heroTitle}
      heroTagline={content.heroTagline}
      accentColor="bg-coral"
      accentText="text-coral"
      aboutText={content.aboutText.split("\n")}
      aboutImage={aboutImage}
      aboutBadges={ABOUT_BADGES}
      activities={ACTIVITIES}
      galleryImages={galleryImages.map((img) => img.url)}
      statsRow={STATS}
      ctaTitle={content.ctaTitle}
      ctaBody={content.ctaBody}
      ctaButtonLabel={content.ctaButtonLabel}
      ctaButtonHref="/#contact"
      ctaSideImage={heroImg1}
      socialImpact={SOCIAL_IMPACT}
      icon={Shirt}
    />
  );
}
