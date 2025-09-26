// components/context_files/AppProviders.js
"use client"
import { RegistrationModalProvider } from "./RegistrationModalContext"; // Contexto del registration Modal
import { LoginModalProvider } from "./LoginModalContext"; // Contexto del login Modal

export const AppProviders = ({ children }) => {
  return (
    <RegistrationModalProvider>
      <LoginModalProvider>
        {children}
      </LoginModalProvider>
    </RegistrationModalProvider>
  );
};

