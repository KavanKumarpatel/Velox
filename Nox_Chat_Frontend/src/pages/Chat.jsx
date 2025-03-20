import { useInfiniteScrollTop } from "6pp";
import {
  Add,
  ArrowBackIosNew,
  MoreVert,
  Send,
  Timer,
  EmojiEmotions,
  Mic,
} from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import { Popover, Skeleton } from "@mui/material";
import moment from "moment";
import dynamic from "next/dynamic";

import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout/AppLayout";
import ChatFilesMenu from "../components/ChatComp/ChatFilesMenu.jsx";
import ChatSettings from "../components/ChatComp/ChatSettings";
import Messages from "../components/ChatComp/Messages";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVE,
  CHAT_ONLINE_USERS,
  LAST_ONLINE,
  NEW_MESSAGE,
  SCHEDULE_MESSAGE,
  START_TYPING,
  STOP_TYPING,
  UPDATE_POLL,
} from "../constants/events.js";
import { useErrors, useSocketEvents } from "../hooks/hook.jsx";
import {
  useGetChatDetailsQuery,
  useGetMessagesQuery,
} from "../redux/api/api.js";
import {
  removeNewMessagesAlert,
  setAllMessages,
  setChatOnlineMembers,
  setNewGroupAlert,
  setTyping,
  updateAMessage,
} from "../redux/reducer/chat.js";
import { getSocket } from "../socket";
import toast from "react-hot-toast";


const CaptureAudio = dynamic(() => import("./CaptureAudio.jsx"), {
  ssr: false,
});

// import GroupSettings from "../components/ChatComp/groupsettings";
const GroupSettings = lazy(() =>
  import("../components/ChatComp/groupsettings")
);
const ChatSetting = lazy(() =>
  import("../components/ChatComp/chatsetting.jsx")
);

const Chat = ({ chatid, allChats, navbarref, value, setValue }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Cur User
  const { allMessages } = useSelector((state) => state.chat); // Cur User

  const { onlineMembers } = useSelector((state) => state.chat); // Cur User
  const { onlineChatMembers } = useSelector((state) => state.chat);
  const { isTyping } = useSelector((state) => state.chat);
  const { allChatsIsTyping } = useSelector((state) => state.chat); // Cur User
  const { newGroupAlert } = useSelector((state) => state.chat); // Cur User
  const [pollLen, setPollLen] = useState(2);

  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const [message, setcurmessage] = useState(""); // CurMessage
  const [messages, setMessages] = useState([]); // Messages List
  // const [allMessages, setAllMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [imTyping, setImTyping] = useState(false);
  const [onlineLastSeen, setOnlineLastSeen] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const navigate = useNavigate();

  const scrollElement = useRef(); // for infinite scroll

  const groupsetting = useRef();

  const chatsetting = useRef();

  const pollWindow = useRef();

  const scheduleMessage = useRef();

  const clearTime = useRef();

  const addMemberWindow = useRef();

  const chat = useRef(); // ref to chat

  const chatDetails = useGetChatDetailsQuery({ chatid, populate: true });
  const oldMessagesChunk = useGetMessagesQuery({ chatid, page });

  const error = [
    { error: chatDetails?.error, isError: chatDetails?.isError },
    { error: oldMessagesChunk?.error, isError: oldMessagesChunk?.isError },
  ];

  useEffect(() => {
    if (chatDetails.error) return navigate("/");
  }, [chatDetails.error]);

  useErrors(error);

  const curChat = chatDetails?.data?.curchat;
  const members = curChat?.members;

  const chatOnlineUsersMap = new Map(Object.entries(onlineChatMembers));

  const curChatMembersName = curChat?.members.map((i) => i.name).join(", ");
  let avatar = curChat?.avatar?.url;
  let name = curChat?.name;
  let otherMember = "";
  if (!curChat?.groupChat) {
    otherMember = curChat?.members.find(
      (i) => i._id.toString() !== user._id.toString()
    );
    avatar = otherMember?.avatar?.url;
    name = otherMember?.name;
  }

  const lastSeenTime = otherMember?.lastSeen;

  let isOnline = false;
  let isChatOnline = false;
  if (!curChat?.groupChat) {
    isOnline = onlineMembers.includes(otherMember?._id.toString());
    if (
      chatOnlineUsersMap?.has(otherMember?._id?.toString()) &&
      chatOnlineUsersMap?.get(otherMember?._id?.toString()).toString() ===
        chatid.toString()
    ) {
      isChatOnline = true;
    }
  }

  // last seen for message seen, received status ....
  useEffect(() => {
    setOnlineLastSeen(otherMember?.lastSeen);
  }, [chatDetails?.data]);

  // infinite scroll
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    scrollElement,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.messages
  );

  useEffect(() => {
    if (members)
      socket.emit(CHAT_JOINED, { userId: user._id, members, chatid });

    dispatch(removeNewMessagesAlert(chatid));

    return () => {
      setOldMessages([]);
      setPage(1);
      setMessages([]);
      setcurmessage("");
      if (members)
        socket.emit(CHAT_LEAVE, { userId: user._id, members, chatid });
    };
  }, [chatid, members]);

  useEffect(() => {
    // setAllMessages([...oldMessages, ...messages]);
    dispatch(setAllMessages([...oldMessages, ...messages]));
  }, [oldMessages, messages]);

  const socket = getSocket();

  const messageSubmitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    let membersId = [];

    members.map((i) => {
      if (i._id.toString() != user._id.toString()) membersId.push(i._id);
    });

    // emitting message to the server ...
    socket.emit(NEW_MESSAGE, {
      chatid,
      members: membersId,
      message,
      otherMember,
      isChatOnline,
    });
    setcurmessage("");
  };

  const scheduleMessageHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    let membersId = [];

    members.map((i) => membersId.push(i._id));

    // emitting message to the server ...
    socket.emit(SCHEDULE_MESSAGE, {
      chatid,
      members: membersId,
      message,
      otherMember,
      scheduleTime,
    });

    setcurmessage("");
    setScheduleTime("");

    scheduleMessage.current.classList.remove("active");
  };

  const onChangeHandler = (e) => {
    setcurmessage(e.target.value);
    let filteredMembers = [];
    members.map((i) => {
      if (i._id.toString() !== user._id.toString())
        filteredMembers.push(i._id.toString());
    });
    if (!imTyping) {
      socket.emit(START_TYPING, {
        filteredMembers,
        chatid,
        username: user.name,
      });
      setImTyping(true);
    }

    if (clearTime.current) clearTimeout(clearTime.current);

    clearTime.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { filteredMembers, chatid });
      setImTyping(false);
    }, [2000]);
  };

  // will use newMessages function inside useCallback so that it won't created everytime we got new message
  const newMessageListner = useCallback(({ chatId, message }) => {
    if (chatId.toString() !== chatid.toString()) {
      return;
    }

    setMessages((pre) => [...pre, message]);
  }, []);

  // update message status for other users
  const lastOnlineListner = useCallback((data) => {
    setOnlineLastSeen(data);
  }, []);

  const alertListener = useCallback((data) => {
    if (data?.chatid?.toString() !== chatid?.toString()) return;
    setNewGroupAlert(dispatch(data));
  }, []);

  const chatOnlineUsersListener = useCallback(
    ({ chatOnlineMembers, chatId }) => {
      if (chatId.toString() != chatid.toString()) return;
      dispatch(setChatOnlineMembers(chatOnlineMembers));
    },
    []
  );

  const startTypingListner = useCallback((data) => {
    if (data.filteredMembers.includes(user._id.toString())) {
      if (data?.chatid.toString() !== chatid.toString()) return;
      dispatch(setTyping(true));
    }
  }, []);

  const stopTypingListner = useCallback((data) => {
    if (data.filteredMembers.includes(user._id.toString())) {
      if (data?.chatid.toString() !== chatid.toString()) return;
      dispatch(setTyping(false));
    }
  }, []);

  const updatePollListner = useCallback(
    ({ tempId, messageData, chatId, userId }) => {
      if (chatId.toString() !== chatid.toString()) return;

      dispatch(updateAMessage({ tempId, messageData }));
    },
    []
  );

  const events = {
    [NEW_MESSAGE]: newMessageListner,
    [ALERT]: alertListener,
    [START_TYPING]: startTypingListner,
    [STOP_TYPING]: stopTypingListner,
    [CHAT_ONLINE_USERS]: chatOnlineUsersListener,
    [LAST_ONLINE]: lastOnlineListner,
    [UPDATE_POLL]: updatePollListner,
  };

  useSocketEvents(socket, events); // using a custom hook to listen for events array

  // Polls
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const content = e.target.question.value;
    const options = [];

    for (let i = 2; i < e.target.length; i++) {
      options.push({ content: e.target[i].value.toString(), members: [] });
    }

    console.log(options, content);

    if (!content.trim()) return;

    let membersId = [];

    members.map((i) => {
      if (i._id.toString() != user._id.toString()) membersId.push(i._id);
    });

    // emitting message to the server ...
    socket.emit(NEW_MESSAGE, {
      chatid,
      members: membersId,
      message: content,
      otherMember,
      isPoll: true,
      options,
      isChatOnline,
    });

    pollWindow.current.classList.remove("active");
    e.target.reset();
  };

  const onEmojiClick = (emoji) => {
    setcurmessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleEmojiClick = (event) => {
    setShowEmojiPicker(event.currentTarget);
  };

  const handleClose = () => {
    setShowEmojiPicker(null);
  };

  const handleFormChange = (e) => {};

  return chatDetails?.isLoading ? (
    <div className="chat">
      <Skeleton className="chat-person-div" />
      <Skeleton className="chat-message-div" />
    </div>
  ) : (
    <section className="chat" ref={chat}>
      {curChat?.groupChat ? (
        <Suspense fallback={<Skeleton />}>
          <GroupSettings
            groupsetting={groupsetting}
            curChat={curChat}
            addMemberWindow={addMemberWindow}
            chatid={chatid}
            oldMessagesChunk={oldMessagesChunk}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<Skeleton />}>
          <ChatSetting
            chatsetting={chatsetting}
            curChat={curChat}
            avatar={avatar}
            name={name}
            addMemberWindow={addMemberWindow}
            chatid={chatid}
          />
        </Suspense>
      )}
      <div className="chat-person-div">
        <button
          className="backButton"
          onClick={() => {
            // allChats.current.style.zIndex = "4";
            // navbarref.current.style.zIndex = "5";
            navigate("/");
            setOldMessages([]);
            setPage(1);
            setMessages([]);
            setcurmessage("");
            if (members) socket.emit(CHAT_LEAVE, { userId: user._id, members });
          }}
        >
          <ArrowBackIosNew sx={{ width: "2rem", height: "2rem" }} />
        </button>

        <div
          className="person-dp"
          onClick={() => {
            if (curChat?.groupChat) {
              groupsetting.current.classList.add("active");
              return;
            }
            chatsetting.current.classList.add("active");
          }}
        >
          <img
            src={avatar}
            alt="img"
            className="person-image"
            style={{ height: "70px", width: "70px" }}
          />
          {isOnline && <div className="online"></div>}
        </div>

        <div className="chat-person-details">
          <h5>{name}</h5>
          {isTyping ? (
            curChat?.groupChat ? (
              <p className="chattypingspan">
                {allChatsIsTyping?.typingChatid.toString() ===
                  chatid.toString() &&
                  allChatsIsTyping?.isTyping &&
                  `${allChatsIsTyping?.name}: `}
                typing ...
              </p>
            ) : (
              <p className="chattypingspan">typing ...</p>
            )
          ) : (
            curChat?.groupChat && (
              <p className="chattypingspan" style={{ color: "whitesmoke" }}>
                {curChatMembersName.slice(0, 30)}
                {curChatMembersName.length > 29 && " ..."}
              </p>
            )
          )}
          {(!isTyping && !curChat?.groupChat && isChatOnline && (
            <p className="chattypingspan">online</p>
          )) ||
            (!curChat?.groupChat && !isOnline && !isTyping && (
              <p className="chattypingspan" style={{ color: "whitesmoke" }}>
                {`last seen ${moment(lastSeenTime).fromNow()}`}
              </p>
            ))}
          {/* {isOnline ? <span>Online</span> : <span>Offline</span>} */}
        </div>

        <span
          className="morevert chatsettingsSpan"
          onClick={() => {
            if (!chat.current.classList.contains("activesettings")) {
              chat.current.classList.add("activesettings");
              return;
            }
            chat.current.classList.remove("activesettings");
          }}
        >
          <MoreVert sx={{ color: "#f9fafb" }} />
        </span>
      </div>
      <ChatSettings />
      {chatDetails?.isLoading ? (
        <Skeleton />
      ) : (
        <Messages
          user={user}
          scrollElement={scrollElement}
          allMessages={allMessages}
          chat={chat}
          messages={messages}
          groupChat={curChat?.groupChat}
          otherMember={otherMember}
          isOnline={isOnline}
          isChatOnline={isChatOnline}
          chatId={chatid}
        />
      )}

      {!showAudioRecorder && (
        <>
          <form
            className="chat-message-div"
            onSubmit={(e) => messageSubmitHandler(e)}
          >
            <span className="addspan">
              <Add
                sx={{
                  fontSize: "2.4rem",
                }}
                onClick={(e) => {
                  if (!chat.current.classList.contains("active-files")) {
                    chat.current.classList.add("active-files");
                    return;
                  }
                  chat.current.classList.remove("active-files");
                }}
              />
            </span>

            <EmojiEmotions
              sx={{
                fontSize: "1.8rem",
              }}
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiClick}
            />
            <Popover
              open={Boolean(showEmojiPicker)}
              anchorEl={showEmojiPicker}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              style={{ marginLeft: -15, marginTop: -40 }}
            >
              <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
            </Popover>

            <div className="message-div">
              <input
                type="text"
                className="chat-message"
                value={message}
                onChange={(e) => {
                  onChangeHandler(e);
                  setcurmessage(e.target.value);
                }}
              />

              <div className="scheduleMessage" ref={scheduleMessage}>
                <div className="scheduleCross">
                  <p>Schedule a message</p>
                </div>
                <div className="scheduleInputDiv">
                  <input
                    type="number"
                    className="scheduleInput"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.currentTarget.value)}
                  />
                  <p className="scheduleText">MIN</p>
                </div>
                <div className="sendButtonDiv">
                  <button
                    className="scheduleCancel"
                    onClick={() => {
                      scheduleMessage.current.classList.remove("active");
                      setScheduleTime("");
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    className="scheduleSend"
                    onClick={(e) => scheduleMessageHandler(e)}
                  >
                    SCHEDULE
                  </button>
                </div>
              </div>

              <div
                className="scheduleIconDiv"
                onClick={() => {
                  if (scheduleMessage.current.classList.contains("active")) {
                    scheduleMessage.current.classList.remove("active");
                    setScheduleTime("");
                    return;
                  }
                  scheduleMessage.current.classList.add("active");
                }}
              >
                <Timer className="scheduleIcon" />
              </div>
            </div>

            <button
              type="button"
              className="sendmessage"
              onClick={(e) => messageSubmitHandler(e)}
            >
              {message.length ? (
                <Send
                  sx={{
                    color: "#f9fafb",
                    marginRight: "2rem",
                    fontSize: "1.8rem",
                    position: "absolute",
                    right: "-0.9rem",
                  }}
                />
              ) : (
                <Mic
                  sx={{
                    color: "#f9fafb",
                    marginRight: "2rem",
                    fontSize: "1.8rem",
                    position: "absolute",
                    right: "-0.8rem",
                  }}
                  title="Record"
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </form>
        </>
      )}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder}/>}

      <ChatFilesMenu pollWindow={pollWindow} chat={chat} chatid={chatid} />
      {/* <div>
        <div className="pollSendOuterDiv">

        </div>
        <div className="pollQuestionOuterDiv">
          <input type="text" className="pollQuestion" />
        </div>
        <select className="pollOptionOuterDiv">
         <option value=""></option>
         <option value=""></option>
        </select>
      </div>
      <input type="checkbox" /> */}
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        onChange={(e) => handleFormChange(e)}
        className="PollWindowDiv"
        ref={pollWindow}
      >
        <div className="PollControls">
          <ArrowBackIosNew
            style={{ color: "#dfe3e8", fontWeight: "700px" }}
            onClick={() => {
              pollWindow.current.classList.remove("active");
            }}
          />
          <button type="submit">Send</button>
        </div>
        <div className="pollBody">
          <div className="pollQuestion">
            <p>Question</p>
            <textarea name="question" id=""></textarea>
          </div>
          <div className="pollQuestion">
            <p>Options</p>
            <textarea name="option1" id=""></textarea>
            <textarea name="option2" id=""></textarea>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AppLayout()(Chat);
