// contexto del modal de registro para tener la logica solo aquí y poder usarlo en cualquier componente

import { createContext, useContext, useState } from "react";
import RegistrationModal from "../Students/components/RegistrationModal";
const RegistrationModalContext = createContext();

export const RegistrationModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleOption = (option) => {
    setIsOpen(false);
    if (option === "estudiante") {
      console.log("Navegar al dashboard de estudiante");
    } else if (option === "rentar") {
      console.log("Navegar al registro de propietario");
    }
  };

  return (
    <RegistrationModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <RegistrationModal
        isOpen={isOpen}
        onClose={closeModal}
        onOptionSelect={handleOption}
      />
    </RegistrationModalContext.Provider>
  );
};

// hook de conveniencia
export const useRegistrationModal = () => useContext(RegistrationModalContext);

