import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Estudiantes",
  description: "Encuentra tu cuarto ideal cerca del Tec de Monterrey. Plataforma exclusiva para estudiantes.",
};

import ExclusiveTec from '@/modules/Students/ExclusiveTec';
import Footer from '@/modules/Students/FooterStudent';
import HeroStudent from '@/modules/Students/HeroStudent';
import Testimonials from '@/modules/Students/TestimonialsStudent';
import WhyChooseUs from '@/modules/Students/WhyChooseUs';
import SignUpForm from '@/modules/Students/SignUpForm';


export default function Home() {
  return (
    <>
      <HeroStudent />
      <div id="WhyChooseUs">
      <WhyChooseUs/>
      </div>
      <ExclusiveTec/>
      <Testimonials/>
      <div id="signup">
      <SignUpForm/>
      </div>
    </>
  );
}
