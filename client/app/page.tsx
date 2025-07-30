import Hero from "@/modules/home/sections/Hero";
import FeaturedProperties from "@/modules/home/sections/FeaturedProperties";
import HowItWorks from "@/modules/home/sections/HowItWorks";
import Testimonials from "@/modules/home/sections/Testimonials";
import CallToAction from "@/modules/home/sections/CallToAction";
import Footer from "@/modules/home/sections/Footer";
import NavBar from "@/modules/home/sections/NavBar";
import SearchBar from "@/modules/home/components/SearchBar";

export default function Home() {
  return (
    <>
      <NavBar />
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
