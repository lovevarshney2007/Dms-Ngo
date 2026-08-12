/**
 * ChildEducation.jsx
 * Route: /initiatives/child-education
 */

import { GraduationCap, BookOpen, Star, Backpack, Lightbulb, Compass, Users, Laptop } from "lucide-react";
import { InitiativePage } from "./shared";
import { useGallery, useInitiativeContent, useHeroSlides } from "../../hooks/useSiteData";
import { useState } from "react";
import { VolunteerModal } from "../Homepage";

import heroImg1 from "../../assets/child-hero/child-1.jpg";
import heroImg2 from "../../assets/child-hero/child-2.jpg";
import heroImg3 from "../../assets/hero/child-education-1.jpg";
import heroImg4 from "../../assets/child-hero/child-14.jpg";
import aboutImg from "../../assets/child-hero/child-1.jpg";

const SLUG = "child-education";

const DEFAULT_CONTENT = {
  heroTitle: "Child Education",
  heroTagline: "Empowering Children Through Education",
  aboutText:
    "Education is the foundation of a brighter future. Through our Child Education initiative, DMS AAROHI supports underprivileged children by providing learning opportunities, educational resources and guidance.\nWe organize educational support programs, distribute study materials, and assist children with access to quality learning resources that may otherwise be beyond their reach. By reducing barriers to education, we aim to ensure that every child has an equal opportunity to learn and grow.\nBeyond academics, DMS AAROHI encourages creativity, curiosity, and personal development through mentorship and community engagement activities.\nOur goal is to help every child develop the knowledge and confidence needed to build a successful future.",
  ctaTitle: "Support a Child's Education",
  ctaBody:
    "Together, we can create opportunities that change a child's future. Your support — big or small — makes a real difference.",
  ctaButtonLabel: "Support Education",
  aboutImage: "",
};

const DEFAULT_HERO_SLIDES = [
  {
    image: heroImg1,
    title: "Educating Today, Empowering Tomorrow",
    subtitle: "Creating platforms for underprivileged children to learn, grow and dream bigger.",
  },
  {
    image: heroImg2,
    title: "Every Child Deserves an Education",
    subtitle: "We provide learning resources, guidance and support to children who need it most.",
  },
  {
    image: heroImg3,
    title: "Building Confident Futures",
    subtitle: "Through our programs, children develop the knowledge and skills to succeed in life.",
  },
  {
    image: heroImg4,
    title: "Community-Powered Learning",
    subtitle: "Our volunteer-driven sessions bring quality education to rural and urban communities alike.",
  },
];

const DEFAULT_ABOUT_IMAGE = aboutImg;

const ABOUT_BADGES = [
  { icon: BookOpen, label: "Learning Resources", sub: "Books, stationery & more" },
  { icon: Star, label: "Career Guidance", sub: "Mentorship & orientation" },
];

const ACTIVITIES = [
  {
    title: "Educational Support Programs",
    description: "Providing tutoring, learning materials and mentorship to help underprivileged children keep pace with their studies.",
    icon: BookOpen,
  },
  {
    title: "School Supply Distribution",
    description: "Distributing books, stationery and school essentials so no child is held back by a lack of resources.",
    icon: Backpack,
  },
  {
    title: "Learning & Awareness Sessions",
    description: "Conducting interactive sessions that build curiosity, confidence and essential life skills in young learners.",
    icon: Lightbulb,
  },
  {
    title: "Career Guidance Activities",
    description: "Guiding students on career paths, higher education options and skill-building opportunities for their future.",
    icon: Compass,
  },
  {
    title: "Community Learning Initiatives",
    description: "Partnering with schools and local communities to create sustainable, accessible learning environments for all.",
    icon: Users,
  },
  {
    title: "Digital Literacy Workshops",
    description: "Introducing children to basic computer and digital skills to prepare them for a technology-driven future.",
    icon: Laptop,
  },
];

const STATS = [
  { value: 500, suffix: "+", label: "Children Supported" },
  { value: 50, suffix: "+", label: "Sessions Conducted" },
  { value: 10, suffix: "+", label: "Partner Schools" },
  { value: 100, suffix: "+", label: "Volunteers Involved" },
];

const SOCIAL_IMPACT = {
  title: "Shaping Brighter Futures",
  subtitle: "Every book, every lesson, every mentor moves a child closer to their dreams.",
  points: [
    {
      icon: Lightbulb,
      label: "Minds Empowered",
      description: "Curiosity ignited and confidence built in children who once had limited access to learning.",
    },
    {
      icon: GraduationCap,
      label: "Futures Unlocked",
      description: "Opening doors to education that pave the way for brighter, self-reliant futures.",
    },
    {
      icon: Users,
      label: "Communities Uplifted",
      description: "Families and neighborhoods strengthened as more children stay in school and thrive.",
    },
  ],
};

export default function ChildEducation() {
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
      ctaSideImage={heroImg3}
      socialImpact={SOCIAL_IMPACT}
      icon={GraduationCap}
      onCtaClick={() => setVolunteerModalOpen(true)}
    />
    <VolunteerModal isOpen={volunteerModalOpen} onClose={() => setVolunteerModalOpen(false)} />
    </>
  );
}
