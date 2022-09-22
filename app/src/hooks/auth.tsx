/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useEffect } from "react";
import { getAccessTokenFromCode, getMe } from "../services";

type AuthContextValue = {
  user: any | null;
  loading: boolean;
  loginWithGoogle: () => any;
};
type CurrentUserType = {
  user: any;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: any) {
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null);
  const [loading, setLoading] = useState(true);

  function loginWithGoogle() {
    const queryString = new URLSearchParams(props.config).toString();
    return (window.location.href =
      "http://localhost:8081/auth/google?" + queryString);
  }
  const loginCallback = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.code) {
      await getAccessTokenFromCode({
        clientId: props.config.client_id,
        code: params.code,
      });
      window.location.href = window.location.origin
    }
  };
  useEffect(() => {
    const init = async () => {
      if (window.location.pathname === "/login/callback/") {
        return loginCallback();
      }
      const user = await getMe();
      setLoading(false);
      if (user && user?.id) {
        setCurrentUser({
          user: user,
        });
        return;
      }
    };
    init();
  }, []);

  const value: AuthContextValue = {
    user: null,
    loading: loading,
    ...currentUser,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && props.children}
    </AuthContext.Provider>
  );
}
