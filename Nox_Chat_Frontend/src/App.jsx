import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/Auth/ProtectRoute";
import Loaders from "./components/Loaders/Loaders";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducer/authslice";
import { server } from "./constants/config.js";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket.jsx";


// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Chat from "./pages/Chat";
// import NotFound from "./pages/NotFound";
// import AdminLogin from "./pages/Admin/AdminLogin";
// import Dashboard from "./pages/Admin/Dashboard";
// import UsersManagement from "./pages/Admin/UserManagement";
// import ChatsManagement from "./pages/Admin/ChatManagement";
// import Messages from "./pages/Admin/MessageManagement";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
// const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const UsersManagement = lazy(() => import("./pages/Admin/UserManagement"));
const ChatsManagement = lazy(() => import("./pages/Admin/ChatManagement"));
const Messages = lazy(() => import("./pages/Admin/MessageManagement"));
const AiBot = lazy(() => import("./components/ChatList/AiBot.jsx"));
const Meet = lazy(() => import("./components/Meet/Homepage.jsx"));
const MeetJoin = lazy(() => import("./components/Meet/VideoPage.jsx"));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/profile`, { withCredentials: true })
      .then(({ data }) => {
        dispatch(userExists(data?.user));
      })
      .catch((err) => {
        console.log(err);
        dispatch(userNotExists());
      });
  }, [dispatch]);

  return loader ? (
    <Loaders />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<Loaders />}>
        <Routes>
          <Route
            element={
              // socket client connection
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatid" element={<Chat />} />
            {/* <Route path="/groups" element={<Groups />} /> */}
          </Route>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/chats" element={<ChatsManagement />} />
          <Route path="/admin/messages" element={<Messages />} />

          <Route path="*" element={<NotFound />} />
          <Route path="/aibot" element={<AiBot />} />
          <Route path="/meet" element={<Meet />} />
          <Route path="/meetjoin/:id" element={<MeetJoin />} />

          
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
};

export default App;
