'use client';
import React, { useState } from 'react';
import LandingHero from '@/modules/lessor/components/LandingHero';
import LandingHeader from '@/modules/lessor/components/LandingHeader';
import LandingBenefits from '@/modules/lessor/components/LandingBenefits';
import LandingHowItWorks from '@/modules/lessor/components/LandingHowItWorks';
import LandingTestimonials from '@/modules/lessor/components/LandingTestimonials';
import LandingStats from '@/modules/lessor/components/LandingStats';
import LandingRegisterForm from '@/modules/lessor/components/LandingRegisterForm';
import LandingLoginPopup from '@/modules/lessor/components/LandingLoginPopup';
import LandingFooter from '@/modules/lessor/components/LandingFooter';


export default function Home() {

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setShowLoginPopup(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Redirect to dashboard or show success message
    alert('¡Inicio de sesión exitoso! Redirigiendo al panel de arrendador...');
  };

  const handleRegisterSuccess = () => {
    // After successful registration attempt (shows verification popup)
    console.log('Registro exitoso, esperando verificación de correo');
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
