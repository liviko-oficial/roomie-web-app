'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import LandingHero from '@/modules/lessor/components/LandingHero';
import LandingHeader from '@/modules/lessor/components/LandingHeader';
import LandingBenefits from '@/modules/lessor/components/LandingBenefits';
import LandingHowItWorks from '@/modules/lessor/components/LandingHowItWorks';
import LandingTestimonials from '@/modules/lessor/components/LandingTestimonials';
import LandingStats from '@/modules/lessor/components/LandingStats';
import LandingRegisterForm from '@/modules/lessor/components/LandingRegisterForm';
import LandingFooter from '@/modules/lessor/components/LandingFooter';


export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login-landlord');
  };

  const handleRegisterSuccess = () => {
    router.push('/dashboard');
  };
  
  return (
    <>
      <LandingHeader/>
      <LandingHero />
      <LandingStats />
      <LandingBenefits />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingRegisterForm
        onLoginClick={handleLoginClick}
        onRegisterSuccess={handleRegisterSuccess}
      />      
      <LandingFooter />
    </>
  );
}
