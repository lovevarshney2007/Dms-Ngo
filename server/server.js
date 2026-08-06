import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";
import galleryRoutes from "./routes/gallery.js";
import eventsRoutes from "./routes/events.js";
import contentRoutes from "./routes/content.js";
import uploadRoutes from "./routes/upload.js";
import statsRoutes from "./routes/stats.js";
import heroRoutes from "./routes/hero.js";
import volunteerRoutes from "./routes/volunteers.js";
import bloodDonorRoutes from "./routes/bloodDonors.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/blood-donors", bloodDonorRoutes);

app.get("/", (req, res) => res.send("DMS AAROHI API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));