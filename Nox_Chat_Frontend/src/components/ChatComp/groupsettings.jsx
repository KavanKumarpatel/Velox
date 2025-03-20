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

const GroupSettings = ({
  curChat,
  groupsetting,
  addMemberWindow,
  chatid,
  oldMessagesChunk,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { onlineMembers } = useSelector((state) => state.chat);

  const { _id, name, avatar, creator, groupChat, members } = curChat;

  let isAdmin = false;
  if (user._id.toString() === creator.toString()) isAdmin = true;

  const [file, setFile] = useState("");
  const [curimage, setImage] = useState("");
  const [curname, setname] = useState("");
  const [isChange, setChange] = useState(false);

  useEffect(() => {
    setname(name);
    setImage(avatar?.url);
  }, [curChat]);

  // Remove the selected member
  const [removeMemberMutation, isLoadingRemoveMemberMutation] =
    useAsyncMutation(useRemoveMembersMutation);

  const removeMemberHandler = async (e) => {
    const member = [e.currentTarget.value];
    const data = {
      chatId: chatid,
      remove_members: member,
    };

    const name = members.find(
      (i) => i._id.toString() === e.currentTarget.value.toString()
    ).name;

    await removeMemberMutation(`removing ${name} from the group`, data);
  };

  // Exit Group
  const [useExitGroupQuery] = useLazyExitGroupQuery();

  const exitGroupHandler = async (e) => {
    try {
      const res = await useExitGroupQuery(chatid);
      if (res?.data?.success) toast.success(res?.data?.message);
      else toast.error(res?.error?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      groupsetting.current.classList.remove("active");
    }
  };

  // Update Group Info -
  const [updateGroupMutation, isLoadingGroupMutation] = useAsyncMutation(
    useUpdateGroupInfoMutation
  );

  const updateGroupInfoHandler = async (e) => {
                      oldMessagesChunk?.refetch();
    if (!isChange) {
      groupsetting.current.classList.remove("active");
      return;
    }
    const formdata = new FormData();
    formdata.append("name", curname);
    formdata.append("avatar", file);

    await updateGroupMutation("updating group info ...", { formdata, chatid });
    setChange(false);
    groupsetting.current.classList.remove("active");
  };

  // Delete Group Handler -
  const [deleteChatMutation, isLoadingDeleteChatMutation] = useAsyncMutation(
    useDeleteChatMutation
  );

  const deleteChatHandler = async (e) => {
    await deleteChatMutation("deleting group ...", chatid);
    groupsetting.current.classList.remove("active");
    navigate("/");
  };

  const handleImageChange = (e) => {
    setChange(true);
    if (e.target.files[0].size > 3000000) {
      setcheck("Img size must be < 3mb");
    }
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  return (
    <>
      <article className="groupsettings" ref={groupsetting}>
        <div
          className="groupheadingdiv"
          style={{ borderBottom: "1px solid #F4F6F8", marginBottom: "3rem" }}
        >
          <button
            type="button"
            className="groupbackbtn"
            onClick={() => {
              groupsetting.current.classList.remove("active");
              oldMessagesChunk?.refetch()
            }}
          >
            <ArrowBack />
          </button>

          <h3 style={{ color: "#F4F6F8" }}>Group Details</h3>

          <button
            type="button"
            className="groupnextbtn"
            onClick={(e) => updateGroupInfoHandler(e)}
          >
            Save
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
                  height: "12rem",
                  width: "12rem",
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
                }}
              />
              <input
                type="file"
                id="image"
                onChange={(e) => handleImageChange(e)}
                accept="image/png, image/jpeg, image/gif"
                style={{
                  margin: "0px",
                  padding: "0px",
                  height: "1.3rem",
                  width: "1.3rem",
                  position: "relative",
                  opacity: 0,
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
                onChange={(e) => {
                  setChange(true);
                  setname(e.target.value);
                }}
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

        <div className="addMemberOUterDiv" style={{ height: "6rem" }}>
          <button
            className="AddMembersButton"
            onClick={(e) => {
              addMemberWindow.current.classList.add("active");
            }}
          >
            <Add
              sx={{
                fontSize: "2rem",
              }}
            />
          </button>
          <div className="addMembers">
            <p>Add Member</p>
          </div>
        </div>

        <ul className="groupsettingsmembersdiv">
          {members.map((member) => {
            // let isAdmin = false;
            // console.log(creator);
            // if (member?._id === creator.toString()) isAdmin = true;
            let isOnline = false;
            if (onlineMembers.includes(member?._id.toString())) isOnline = true;

            return (
              <li key={member?._id} className="groupsettingsmembers">
                <img
                  src={member?.avatar?.url}
                  style={{
                    objectFit: "cover",
                    height: "3rem",
                    width: "3rem",
                  }}
                  className="groupsettingsimage"
                  alt=""
                />
                {isOnline && <div className="groupsettingsonline"></div>}

                <div style={{ width: "70%" }}>
                  <p>
                    {member.name}{" "}
                    {member?._id.toString() === user._id.toString() &&
                      " ( You )"}
                  </p>
                  {creator.toString() === member?._id.toString() && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "green",
                        fontWeight: "600",
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>
                {isAdmin &&
                  !(creator.toString() === member?._id.toString()) && (
                    <button
                      value={member?._id}
                      className="gsremovebtn"
                      onClick={(e) => removeMemberHandler(e)}
                    >
                      remove
                    </button>
                  )}
              </li>
            );
          })}
        </ul>

        <div className="gsexit" onClick={(e) => exitGroupHandler(e)}>
          <button className="gsexitbtn">Exit Group</button>
        </div>
        <div className="clearchatdiv" onClick={(e) => deleteChatHandler(e)}>
          <button className="clearchat">Delete Chat</button>
        </div>
      </article>

      <AddMembers
        addMemberWindow={addMemberWindow}
        chatid={chatid}
        members={members}
      />
    </>
  );
};

export default GroupSettings;
