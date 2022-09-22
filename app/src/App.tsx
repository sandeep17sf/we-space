import React from "react";
import { AuthProvider, useAuth } from "./hooks/auth";
import UserLayout from "./layouts/UserLayout";
import ChatLayout from "./layouts/ChatLayout";
import * as authConfig from "./config/auth-config.json";
import * as socketConfig from "./config/socket-config.json";
import { SocketProvider } from "./hooks";

function AppRoutes() {
  const auth = useAuth();
  if (auth?.user) {
    return (
      <SocketProvider {...socketConfig} channelId={auth.user?.defaultTenantId}>
        <ChatLayout />
      </SocketProvider>
    );
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
