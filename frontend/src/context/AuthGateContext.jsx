import { createContext, useContext, useState, useCallback } from "react";
import LoginPromptModal from "../Components/LoginPromptModal";

const AuthGateContext = createContext();

export function AuthGateProvider({ children }) {
  const [showModal, setShowModal] = useState(false);

  const requireAuth = useCallback((user, callback) => {
    if (!user) {
      setShowModal(true);
      window.dispatchEvent(new Event("login-prompt-open"));
      return false;
    }
    if (callback) callback();
    return true;
  }, []);

  const openLoginModal = useCallback(() => {
    setShowModal(true);
    window.dispatchEvent(new Event("login-prompt-open"));
  }, []);

  const closeLoginModal = useCallback(() => setShowModal(false), []);

  return (
    <AuthGateContext.Provider value={{ requireAuth, openLoginModal }}>
      {children}
      {showModal && <LoginPromptModal onClose={closeLoginModal} />}
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  return useContext(AuthGateContext);
}
