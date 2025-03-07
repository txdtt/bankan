import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // Clean up function for previous socket
        const cleanupSocket = (socketInstance: Socket) => {
            socketInstance.disconnect();
        };

        if (token) {
            // Create a new socket or reconnect existing one
            const newSocket = io('http://localhost:3000', {
                auth: { token },
                transports: ['websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
            });

            newSocket.on("disconnect", (reason) => {
                console.warn("Socket disconnected:", reason);
            });

            newSocket.on("connect_error", (error) => {
                console.error("Connection error:", error);
            });

            setSocket(newSocket);

            // Cleanup function for useEffect
            return () => {
                cleanupSocket(newSocket);
            };
        }
        
        // If no token or socket becomes invalid, ensure we clean up
        return () => {
            if (socket) {
                cleanupSocket(socket);
            }
        };
    }, []);  // Still empty dependency array as we want this to run once on mount

    // Add this useEffect to handle token changes
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                // Force reconnection when token changes
                if (socket) {
                    socket.disconnect();
                }
                // Component will re-render and the first useEffect will run again
                setSocket(undefined);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): Socket | undefined => {
    const context = useContext(SocketContext);
    return context;
};
