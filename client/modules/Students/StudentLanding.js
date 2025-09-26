import React from 'react';
import ExclusiveTec from './ExclusiveTec';
import Footer from './FooterStudent';
import HeroStudent from './HeroStudent';
import Testimonials from './TestimonialsStudent';
import WhyChooseUs from './WhyChooseUs';
import SignUpForm from './SignUpForm';

const StudentLanding = () => {
 return (
     <>
      <HeroStudent />
      <WhyChooseUs/>
      <ExclusiveTec/>
      <Testimonials/>
      <SignUpForm/>
     </>
 );
};

export default StudentLanding;
