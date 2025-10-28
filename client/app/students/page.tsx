import ExclusiveTec from '@/modules/Students/ExclusiveTec';
import Footer from '@/modules/Students/FooterStudent';
import HeroStudent from '@/modules/Students/HeroStudent';
import Testimonials from '@/modules/Students/TestimonialsStudent';
import WhyChooseUs from '@/modules/Students/WhyChooseUs';
import SignUpForm from '@/modules/Students/SignUpForm';
import NavbarStudent from '@/modules/Students/NavbarStudent';
import { AppProviders } from "@/modules/global_components/context_files/AppProviders";

export default function Home() {
  return (
    <>
      <AppProviders>
      <NavbarStudent />
      <HeroStudent />
      <div id="WhyChooseUs">
      <WhyChooseUs/>
      </div>
      <ExclusiveTec/>
      <Testimonials/>
      <div id="signup">
      <SignUpForm/>
      </div>
      </AppProviders>
    </>
  );
}
