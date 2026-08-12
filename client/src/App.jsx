/**
 * App.jsx — React Router setup for DMS AAROHI website
 *
 * Install react-router-dom if not already installed:
 *   npm install react-router-dom
 *
 * Replace your existing App.jsx with this file.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Homepage from "./components/Homepage";
import BloodDonation from "./components/initiatives/BloodDonation";
import ChildEducation from "./components/initiatives/ChildEducation";
import BetiBachao from "./components/initiatives/BetiBachao";
import ClothDistribution from "./components/initiatives/ClothDistribution";
import SeniorCitizen from "./components/initiatives/SeniorCitizen";
import EnvironmentAwareness from "./components/initiatives/EnvironmentAwareness";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Initiative pages */}
        <Route path="/initiatives/blood-donation" element={<BloodDonation />} />
        <Route path="/initiatives/child-education" element={<ChildEducation />} />
        <Route path="/initiatives/beti-bachao" element={<BetiBachao />} />
        <Route path="/initiatives/cloth-distribution" element={<ClothDistribution />} />
        <Route path="/initiatives/senior-citizen" element={<SeniorCitizen />} />
        <Route path="/initiatives/environment" element={<EnvironmentAwareness />} />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center font-display text-teal text-2xl">
              Page not found — <a href="/" className="underline ml-2 text-coral">Go Home</a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}