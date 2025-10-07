//Si se crea otro archivo de contexto se deberá de poner aquí para que AppProviders ya lo contenga y solamente se deba de envolver el layout en una sola etiqueta

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

