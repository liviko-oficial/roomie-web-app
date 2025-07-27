import Hero from "@/modules/home/sections/Hero";
import Nav from "@/modules/home/sections/Nav";
import FeaturedProperties from "@/modules/home/sections/FeaturedProperties";
import HowItWorks from "@/modules/home/sections/HowItWorks";
import Testimonials from "@/modules/home/sections/Testimonials";
import CallToAction from "@/modules/home/sections/CallToAction";
import Footer from "@/modules/home/sections/Footer"

export default function Home() {
  return (
    <>
      <Nav/> 
      <Hero/>
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer /> 
    </>
  );
}