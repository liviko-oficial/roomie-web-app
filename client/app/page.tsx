import Hero from "@/modules/home/sections/Hero";
import FeaturedProperties from "@/modules/home/sections/FeaturedProperties";
import HowItWorks from "@/modules/home/sections/HowItWorks";
import Testimonials from "@/modules/home/sections/Testimonials";
import CallToAction from "@/modules/home/sections/CallToAction";
import Footer from "@/modules/home/sections/Footer"
import NavBar from "@/modules/home/components/NavBar"

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero/>
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer /> 
    </>
  );
}