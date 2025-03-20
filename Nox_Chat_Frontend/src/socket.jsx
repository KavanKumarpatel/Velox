import { createContext, useContext, useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    
  const socket = useMemo(() => io.connect(server, { withCredentials: true}), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};


// const SocketProvider = ({ children }) => {

//   const [socket, setSocket] = useState(null)
    
// useEffect(() => {
//     const socket = io("http://localhost:3333", { withCredentials: true });

//     setSocket(socket);


//     // return () => socket.close();
 
// }, []);

//  console.log("OUter Socket :", socket)

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

export { SocketProvider, getSocket };
