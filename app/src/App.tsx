import React from "react";
import { AuthProvider, useAuth } from "./hooks/auth";
import UserLayout from "./layouts/UserLayout";
import ChatLayout from "./layouts/ChatLayout";
import *  as authConfig from "./config/auth-config.json";

function AppRoutes() {
  const auth = useAuth();
  if (auth?.user) {
    return <ChatLayout />
  } else {
    return <UserLayout />;
  }
}

function App() {
  return (
    <AuthProvider config={authConfig}>
     <AppRoutes />
    </AuthProvider>
  );
}

export default App;
