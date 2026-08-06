import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import TeamMember from "./models/TeamMember.js";
import Event from "./models/Event.js";
import InitiativeContent from "./models/InitiativeContent.js";

dotenv.config();

const TEAM = [
  { name: "Pankaj Mathur", role: "President, DMS AAROHI", image: "", order: 1 },
  { name: "Kapil Tiwari", role: "Vice President", image: "", order: 2 },
  { name: "Shalinder Kumar", role: "Vice President", image: "", order: 3 },
  { name: "Dr. Bhawna Bhat", role: "General Secretary", image: "", order: 4 },
  { name: "Pratibha Asthana", role: "Secretary", image: "", order: 5 },
  { name: "G.B. Mathur", role: "Advisor", image: "", order: 6 },
  { name: "Shalini Lal", role: "Executive Member", image: "", order: 7 },
  { name: "Sumit Kumar", role: "Legal Advisor", image: "", order: 8 },
];

const EVENTS = [
  {
    title: "Cloth Distribution Drive",
    date: "August 2026",
    location: "Greater Noida West — Near Char Murti",
    desc: "Join us as we collect and distribute clothes to underprivileged families. Every garment donated brings warmth, dignity and hope to someone in need.",
    image: "",
    tag: "Distribution Drive",
    tagColor: "bg-gold",
    icon: "👕",
  },
  {
    title: "Blood Donation Camp",
    date: "September 2026",
    location: "Surya Nagar, Ghaziabad",
    desc: "Join us in saving lives through voluntary blood donation. Your contribution can provide timely support to patients in critical need and bring hope during medical emergencies.",
    image: "",
    tag: "Health Camp",
    tagColor: "bg-coral",
    icon: "🩸",
  },
];

const CONTENT = {
  "blood-donation": {
    heroTitle: "Blood Donation & Healthcare",
    heroTagline: "Saving Lives Through Voluntary Blood Donation",
    aboutText:
      "At DMS AAROHI, we believe that every drop of blood can save a life. Our Blood Donation & Healthcare initiative focuses on organizing voluntary blood donation camps, creating awareness about regular blood donation and connecting verified donors with patients during emergencies.\nWe are committed to ensuring timely support for those in need, especially individuals suffering from Thalassemia and other critical medical conditions.\nWe encourage individuals to become regular donors and ambassadors for this life-saving cause.",
    ctaTitle: "Become a Blood Donor",
    ctaBody: "Your one donation can save multiple lives. Join our network of voluntary blood donors and help patients during medical emergencies.",
    ctaButtonLabel: "Register as a Blood Donor",
  },
  "child-education": {
    heroTitle: "Child Education",
    heroTagline: "Empowering Children Through Education",
    aboutText:
      "Education is the foundation of a brighter future. Through our Child Education initiative, DMS AAROHI supports underprivileged children by providing learning opportunities, educational resources and guidance.\nOur goal is to help every child develop the knowledge and confidence needed to build a successful future.",
    ctaTitle: "Support a Child's Education",
    ctaBody: "Together, we can create opportunities that change a child's future.",
    ctaButtonLabel: "Support Education",
  },
  "beti-bachao": {
    heroTitle: "Beti Bachao Initiative",
    heroTagline: "Empowering Every Girl for a Better Tomorrow",
    aboutText:
      "Every girl deserves the opportunity to live, learn, and achieve her dreams. Through the Beti Bachao Initiative, DMS AAROHI promotes awareness about girl child education, safety, equality and empowerment.",
    ctaTitle: "Support Girl Child Empowerment",
    ctaBody: "Join us in creating equal opportunities and brighter futures for every girl.",
    ctaButtonLabel: "Join the Initiative",
  },
  "cloth-distribution": {
    heroTitle: "Cloth Distribution",
    heroTagline: "Sharing Warmth, Spreading Kindness",
    aboutText:
      "Many families struggle to meet basic clothing needs throughout the year. Our Cloth Distribution initiative collects and distributes clean, usable clothes to underprivileged families.",
    ctaTitle: "Donate Clothes Today",
    ctaBody: "Your unused clothes can make a meaningful difference in someone's life.",
    ctaButtonLabel: "Donate Clothes",
  },
  environment: {
    heroTitle: "Environment Awareness",
    heroTagline: "Together for a Cleaner and Greener Future",
    aboutText:
      "Protecting the environment is a shared responsibility. Through our Environment Awareness initiative, DMS AAROHI encourages sustainable practices, tree plantation drives, cleanliness campaigns and environmental education.",
    ctaTitle: "Join Our Green Mission",
    ctaBody: "Together, we can protect nature and create a sustainable future.",
    ctaButtonLabel: "Join the Green Drive",
  },
  "senior-citizen": {
    heroTitle: "Senior Citizen Welfare",
    heroTagline: "Caring for Those Who Once Cared for Us",
    aboutText:
      "Senior citizens deserve respect, care and a life filled with dignity. Through our Senior Citizen Welfare initiative, DMS AAROHI organizes activities that promote health, emotional well-being and social engagement.",
    ctaTitle: "Support Our Senior Citizens",
    ctaBody: "Join us in bringing care, respect, and happiness to our elders.",
    ctaButtonLabel: "Become a Volunteer",
  },
};

async function run() {
  await connectDB();

  const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ username: process.env.ADMIN_USERNAME, passwordHash });
    console.log(`Admin created: ${process.env.ADMIN_USERNAME}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  if ((await TeamMember.countDocuments()) === 0) {
    await TeamMember.insertMany(TEAM);
    console.log("Team seeded.");
  }

  if ((await Event.countDocuments()) === 0) {
    await Event.insertMany(EVENTS);
    console.log("Events seeded.");
  }

  for (const [slug, data] of Object.entries(CONTENT)) {
    await InitiativeContent.findOneAndUpdate({ slug }, data, { upsert: true });
  }
  console.log("Initiative content seeded.");

  console.log("Seeding complete. NOTE: gallery images were not seeded — add them via the admin panel's Upload button.");
  process.exit(0);
}

run();