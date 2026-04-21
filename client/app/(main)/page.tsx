import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Happy Roomie — la plataforma para encontrar tu cuarto ideal cerca del Tec de Monterrey.",
};

import Hero from "@/modules/home/sections/Hero";
import FeaturedProperties from "@/modules/home/sections/FeaturedProperties";
import HowItWorks from "@/modules/home/sections/HowItWorks";
import Testimonials from "@/modules/home/sections/Testimonials";
import CallToAction from "@/modules/home/sections/CallToAction";
import Footer from "@/modules/home/sections/Footer";
//import NavBar from "@/modules/home/sections/NavBar";
import SearchBar from "@/modules/home/components/SearchBar";
//import { AppProviders } from "@/modules/context_files/AppProviders";

export default function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
