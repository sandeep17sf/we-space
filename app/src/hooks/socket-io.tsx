/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextValue = {
  loading: boolean;
  socket: Socket | null;
  connected: boolean;
};
const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}
type SocketProviderProps = {
  url: string;
  channelId: string | null;
  children: React.ReactNode;
};
export function SocketProvider(props: SocketProviderProps) {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  useEffect(() => {
    const init = async () => {
      const socketClient = io(props.url, {
        transports: ["websocket"],
      });
      socketClient.on("connect", () => {
        setSocket(socketClient);
        setLoading(false);
        setConnected(true);
        const channelsToAdd = [props?.channelId];
        socketClient.emit("subscribe-to-channel", channelsToAdd);
      });
      socketClient?.on("message", console.log);
      socketClient.on("userNotif", (message) => {
        console.log(message); //NOSONAR
      });
    };
    init();
  }, []);

  const value: SocketContextValue = {
    loading: loading,
    socket,
    connected,
  };

  return (
    <SocketContext.Provider value={value}>
      {!loading && props.children}
    </SocketContext.Provider>
  );
}
