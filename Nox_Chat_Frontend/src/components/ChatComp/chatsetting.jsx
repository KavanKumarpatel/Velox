import { Add, ArrowBack, CameraAlt } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLazyExitGroupQuery,
  useRemoveMembersMutation,
  useUpdateGroupInfoMutation,
} from "../../redux/api/api";
import AddMembers from "./AddMembers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChatSetting = ({ curChat, chatsetting, addMemberWindow, chatid, name, avatar }) => {

  const navigate = useNavigate()


  // const { _id, name, avatar, creator, groupChat, members } = curChat;


  const [curimage, setImage] = useState("");
  const [curname, setname] = useState("");

  useEffect(() => {
    setname(name);
    setImage(avatar);
  }, [curChat]);


  // Delete Group Handler -
  const [deleteChatMutation, isLoadingDeleteChatMutation] = useAsyncMutation( useDeleteChatMutation );

  const deleteChatHandler = async (e) => {

    await deleteChatMutation( "deleting group ...", chatid)
        chatsetting.current.classList.remove("active");
      navigate('/')
  };


  return (
    <>
      <article className="chatsetting" ref={chatsetting}>
        <div
          className="groupheadingdiv"
          style={{ borderBottom: "1px solid #F4F6F8", marginBottom: "3rem" }}
        >
          <button
            type="button"
            className="groupbackbtn"
            onClick={() => chatsetting.current.classList.remove("active")}
          >
            <ArrowBack />
          </button>

          <h3 style={{ color: "#F4F6F8" }}>Chat Details</h3>

          <button
            type="button"
            className="groupnextbtn"
            onClick={(e) => updateGroupInfoHandler(e)}
          >
            
          </button>
        </div>

        <div
          style={{
            height: "30%",
            margin: "1rem",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "1rem",
            paddingBottom: "2rem",
            backgroundColor: "transparent",
          }}
        >
          <div
            className="avatar"
            style={{
              position: "relative",
              backgroundColor: "transparent",
            }}
          >
            <div className="gsimagediv">
              <img
                src={curimage}
                className="gsimage"
                style={{
                  height: "13rem",
                  width: "13rem",
                  backgroundColor: "transparent",
                }}
              />
            </div>

            <div
              className="photo"
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                right: "0",
                bottom: "0.8rem",
                zIndex: 3,
              }}
            >
              <CameraAlt
                sx={{
                  color: "white",
                  position: "absolute",
                  backgroundColor: "grey",
                  borderRadius: "50%",
                  zIndex: -1,
                  visibility: "hidden",
                }}
              />
            </div>
          </div>

          <div
            style={{
              height: "90%",
              width: "80%",
              borderRadius: "0.6rem",
              marginLeft: "1rem",
              backgroundColor: "ffffff6d",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "70%",
                width: "80%",
                borderRadius: "0.6rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Group Name"
                value={curname}
                style={{
                  backgroundColor: "transparent",
                  width: "10rem",
                  height: "3rem",
                  borderRadius: "1rem",
                  color: "#F9FAFB",
                  border: "none",
                  fontSize: "1.2rem",
                  outline: "none",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              />
            </div>
          </div>
        </div>

        <div className="clearchatdiv" onClick={(e) => deleteChatHandler(e)}>
          <button className="clearchat">Delete Chat</button>
        </div>
      </article>
    </>
  );
};

export default ChatSetting;
