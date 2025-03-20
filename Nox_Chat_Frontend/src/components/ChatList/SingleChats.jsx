import { Skeleton } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NEW_MESSAGE_ALERT } from "../../constants/events";
import { getOrSaveFromStorage } from "../../lib/features";
// import GroupChats from "./GroupsChats";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import { useGetLastMessageTimeQuery } from "../../redux/api/api";

const SingleChats = ({
  chat,
  allChats,
  navbarref,
  profilewindow,
  setCurChatId,
  index
}) => {
  
  const { allChatsIsTyping } = useSelector((state) => state.chat); // Cur User
    const { onlineMembers } = useSelector((state) => state.chat);

  const { newMessageAlert } = useSelector((state) => state.chat);
  const { typing } = useSelector((state) => state.chat);

  useEffect(() => {
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessageAlert });
  }, [newMessageAlert]);

  const handleDeleteChatOpen = (e, _id, groupChat) => {
    e.preventDefault();
    console.log(_id, groupChat);
  };


        const { _id, name, avatar, creator, members, groupChat } = chat;

        const {isLoading, isError, error, data, refetch} = useGetLastMessageTimeQuery(_id)
        const lastMessageTime = data?.lastMessage?.createdAt
        const lastMessageContent = data?.lastMessage?.content || `Say hi to ${name}}`;
        let lastMsgData = "..."
                if(lastMessageTime)  lastMsgData = moment(data?.lastMessage?.createdAt).fromNow();
        useErrors([{isError, error}])


              let isOnline = false;
              if (!groupChat) {
                const otherMember = members[0]?._id;
                if (onlineMembers.includes(otherMember.toString()))
                  isOnline = true;
              }

              const msgAlert = newMessageAlert?.find(
                (i) => i.chatid.toString() === _id.toString()
              );
              const notificationCount = msgAlert?.count || 0;
              const messageAlert = msgAlert?.message || "No new message";
              let msg =
                messageAlert?.content?.slice(0, 28) ||
                lastMessageContent.slice(0, 28);
              if (msg.length >= 28) msg += "...";

              let startTyping = false;
              if (_id.toString() === allChatsIsTyping.typingChatid.toString())
                startTyping = allChatsIsTyping.isTyping;


  return (
    <>
      {groupChat ? (
        <GroupChats
          key={_id}
          chat={chat}
          index={index}
          allChats={allChats}
          navbarref={navbarref}
          handleDeleteChatOpen={handleDeleteChatOpen}
          profilewindow={profilewindow}
          setCurChatId={setCurChatId}
          lastMsgData={lastMsgData}
          isLoading={isLoading}
          msg={msg}
        />
      ) : (
        <SingleChatDiv
          key={_id}
          chat={chat}
          index={index}
          allChats={allChats}
          handleDeleteChatOpen={handleDeleteChatOpen}
          profilewindow={profilewindow}
          setCurChatId={setCurChatId}
          lastMsgData={lastMsgData}
          isLoading={isLoading}
          msg={msg}
          isOnline={isOnline}
          startTyping={startTyping}
          notificationCount={notificationCount}
        />
      )}
    </>
  );
};

const SingleChatDiv = ({
  allChats,
  chat,
  handleDeleteChatOpen,
  index,
  msg,
  lastMsgData,
  isLoading,
  profilewindow,
  setCurChatId,
  isOnline,
  startTyping,
  notificationCount
}) => {
  const { _id, name, avatar, groupChat } = chat;


  return (
    <div
      onContextMenu={(e) => handleDeleteChatOpen(e, _id, groupChat)}
      className="person-div"
      key={index}
    >
      <button
        className="person-dp"
        value={_id}
        onClick={(e) => {
          profilewindow.current.classList.add("active");
          allChats.current.classList.add("lightblur");
          setCurChatId(e.currentTarget.value);
        }}
      >
        <img
          src={
            avatar ||
            "https://res.cloudinary.com/dki615p7n/image/upload/v1715486888/default_avatar_tvgr8w.jpg"
          }
          alt=""
          className="person-image"
          style={{ height: "70px", width: "70px" }}
        />
        {isOnline && <div className="online"></div>}
      </button>

      <Link
        to={`/chat/${_id}`}
        className="person-details"
        onClick={() => {
          // allChats.current.style.zIndex = "0";
          // navbarref.current.style.zIndex = "1";
        }}
      >
        <h5>{name}</h5>
        {startTyping ? (
          <span style={{ color: "green" }}>typing ...</span>
        ) : (
          <span>{msg}</span>
        )}
      </Link>

      {isLoading ? (
        <Skeleton />
      ) : (
        <span className="person-time">{lastMsgData}</span>
      )}

      {notificationCount !== 0 && (
        <span className="person-notification-count">{notificationCount}</span>
      )}
    </div>
  );
};

const GroupChats = ({
  allChats,
  chat,
  navbarref,
  handleDeleteChatOpen,
  index,
  msg,
  lastMsgData,
  isLoading,
  profilewindow,
  setCurChatId,
}) => {
  const { allChatsIsTyping } = useSelector((state) => state.chat); // Cur User

  const { newMessageAlert } = useSelector((state) => state.chat);
  const { typing } = useSelector((state) => state.chat);

  const { _id, name, avatar, groupChat } = chat;

  const msgAlert = newMessageAlert?.find(
    (i) => i.chatid.toString() === _id.toString()
  );
  const notificationCount = msgAlert?.count || 0;
  const messageAlert = msgAlert?.message || "No new message";
  // let msg = messageAlert?.content?.slice(0, 28) || [];
  // if (msg.length === 28) msg += "...";

  let startTyping = false;
  let whoIsTyping;
  if (_id.toString() === allChatsIsTyping.typingChatid.toString()) {
    whoIsTyping = allChatsIsTyping.name;
    startTyping = allChatsIsTyping.isTyping;
  }

  if (!groupChat) return;

  return (
    <>
      <div
        // onContextMenu={(e) => handleDeleteChatOpen(e, _id, groupChat)}
        className="person-div"
      >
        <button
          value={_id}
          className="person-dp"
          onClick={(e) => {
            profilewindow.current.classList.add("active");
            allChats.current.classList.add("lightblur");
            setCurChatId(e.currentTarget.value);
          }}
        >
          <div className="groupbg1"> </div>
          <div className="groupbg2"></div>
          <img
            src={
              transformImage(avatar) ||
              "https://res.cloudinary.com/dki615p7n/image/upload/v1715486888/default_avatar_tvgr8w.jpg"
            }
            alt=""
            className="group-image"
            style={{ height: "58px", width: "58px" }}
          />
        </button>
        <Link
          to={`/chat/${_id}`}
          className="person-details"
          onClick={() => {
            // navbarref.current.style.zIndex = "1";
            // allChats.current.style.zIndex = "0";
          }}
        >
          <h5>{name}</h5>
          {startTyping ? (
            <span style={{ color: "yellowgreen" }}>
              {groupChat && `${whoIsTyping} : `}typing ...
            </span>
          ) : (
            <span>{msg}</span>
          )}
        </Link>
        {/* <span className="person-time">
          {moment(messageAlert?.sender?.createdAt).fromNow()}
        </span> */}

        {isLoading ? (
          <Skeleton />
        ) : (
          <span className="person-time">{lastMsgData}</span>
        )}
        {notificationCount !== 0 && (
          <span className="person-notification-count">{notificationCount}</span>
        )}
      </div>
    </>
  );
};

export default SingleChats;
