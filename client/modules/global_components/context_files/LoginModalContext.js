// context del modal de inicio de sesión, la logica ya solo se hace aquí y se puede usar en cualquier componente sin tener que declarar nada

import { createContext, useContext, useState } from "react";
import LoginModal from "../components/LoginModal";

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  return (
    <LoginModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <LoginModal
        isOpen={isOpen}
        onClose={closeModal}
      />
    </LoginModalContext.Provider>
  );
};

// hook de conveniencia
export const useLoginModal = () => useContext(LoginModalContext);
