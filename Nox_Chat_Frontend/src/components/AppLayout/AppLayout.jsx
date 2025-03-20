import React, { useCallback, useRef, useState } from "react";
import "../../Css/allchats.css";
import "../../Css/chat.css";
import "../../Css/creategroup.css";
import "../../Css/groupsettings.css";
import "../../Css/login.css";
import "../../Css/navbar.css";
import "../../Css/noxVerse.css";
import "../../Css/noxVerseResponsive.css";
import "../../Css/profilewindow.css";
import "../../Css/responsiveAllChats.css";
import "../../Css/responsiveChat.css";
import "../../Css/responsiveCreateGroup.css";
import "../../Css/responsiveNavbar.css";
import Title from "../shared/Title";
import Navbar from "./Navbar";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  MEMBER_REMOVED,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
  START_TYPING,
  STOP_TYPING,
} from "../../constants/events.js";
import { useErrors, useSocketEvents } from "../../hooks/hook.jsx";
import { useMyChatsQuery } from "../../redux/api/api.js";
import {
  incrementNotification,
  setAllChatsTyping,
  setNewMessagesAlert,
  setOnlineMembers,
  setTyping,
} from "../../redux/reducer/chat.js";
import { getSocket } from "../../socket.jsx";
import AllChats from "../ChatList/allChats";
import NoxVerse from "../Nox Verse/NoxVerse.jsx";

const AppLayout = () => (WrapComp) => {
  return (props) => {
    const { isTyping } = useSelector((state) => state.chat); // Cur User
    const { user } = useSelector((state) => state.auth); // Cur User
    const navigate = useNavigate();

    const { chatid } = useParams();
    const allChats = useRef(); // ref to chat
    const navbarref = useRef(); // ref to chat
    const [playsound, setPlaySound] = useState(false);

    const [curnav, setnav] = useState("chats");
    const dispatch = useDispatch();

    const socket = getSocket();

    const [search, setSearch] = useState("");

    // // marked all messages to online
    // const [updateMessageSendToOnline] = useLazyChangeMessageToOnlineQuery();

    // useEffect(() => {
    //   // marked all send messages to online if user is online

    //   updateMessageSendToOnline()
    //     .then(({ data }) => console.log(data?.message))
    //     .catch((e) => console.log(e));
    // }, []);

    // my chats fetching ...
    const { isLoading, data, isError, error, refetch } =
      useMyChatsQuery(search);
    useErrors([{ isError, error }]);

    const newMessagesAlert = useCallback(
      (data) => {
        if (!data.members.includes(user._id.toString())) return;
        if (!chatid === data?.chatid) {
          playsound;
        }
        dispatch(setNewMessagesAlert(data));
      },
      [chatid]
    );

    const newRequestAlert = useCallback((userId) => {
      if (user._id.toString() !== userId.toString()) return;
      dispatch(incrementNotification());
    }, []);

    const startTypingListner = useCallback((data) => {
      if (data.filteredMembers.includes(user._id.toString())) {
        dispatch(
          setAllChatsTyping({
            isTyping: true,
            typingChatid: data?.chatid,
            name: data?.username,
          })
        );
      }
    }, []);

    const stopTypingListner = useCallback((data) => {
      if (data.filteredMembers.includes(user._id.toString())) {
        dispatch(
          setAllChatsTyping({
            isTyping: false,
            typingChatid: data?.chatid,
          })
        );
      }
    }, []);

    const refetchListner = useCallback((members) => {
      if (!members.includes(user._id.toString())) return;
      refetch();
    }, []);

    const refetchNewMembers = useCallback((data) => {
      if (!data.allChatMembers.includes(user._id.toString())) return;
      if (data?.userId === user._id.toString()) navigate(`/`);
      refetch();
    }, []);

    const onlineUsersListener = useCallback((data) => {
      dispatch(setOnlineMembers(data));
    }, []);

    const eventHandler = {
      [NEW_MESSAGE_ALERT]: newMessagesAlert,
      [NEW_REQUEST]: newRequestAlert,
      [START_TYPING]: startTypingListner,
      [STOP_TYPING]: stopTypingListner,
      [REFETCH_CHATS]: refetchListner,
      [MEMBER_REMOVED]: refetchNewMembers,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandler);

    return (
      <>
        <Title />
        <main>
          <Navbar setnav={setnav} curnav={curnav} navbarref={navbarref} />

          {curnav === "chats" && (
            <AllChats
              curnav={curnav}
              allChats={allChats}
              navbarref={navbarref}
              isLoading={isLoading}
              data={data}
              refetch={refetch}
              setSearch={setSearch}
              search={search}
            />
          )}

          {curnav === "calls" && (
            <AllChats curnav={curnav} allChats={allChats} />
          )}

          {curnav === "Nox Verse" && (
            <NoxVerse curnav={curnav} allChats={allChats} />
          )}

          <WrapComp chatid={chatid} allChats={allChats} navbarref={navbarref} />
        </main>
      </>
    );
  };
};

export default AppLayout;
