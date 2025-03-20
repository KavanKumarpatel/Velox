import { FilterList, Search, AddCircle } from "@mui/icons-material";
import React, { memo, useEffect, useRef, useState } from "react";
import CurNotifications from "../ChatList/CurNotifications";
import AddFriends from "../ChatList/addFriend";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendRequestMutation,
} from "../../redux/api/api";
import { useSelector } from "react-redux";
import { transformImage } from "../../lib/features";

const NoxVerse = ({ curnav, allChats }) => {
  const { onlineMembers } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  // send Friend Request
  const [sendRequest, isLoadingSendRequest] = useAsyncMutation(
    useSendRequestMutation
  );

  const handleSendRequest = async (_id) => {
    await sendRequest("Sending friend request !", _id);
  };

  // fetch users except friends
  const [searchUser] = useLazySearchUserQuery("");

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search, isLoadingSendRequest]);

  const addUserWindow = useRef(); // open close window

  // // open and close the addUsers window
  // const handleAddUsers = () => {

  //   if (!addUserWindow.current.classList.contains("active")) {
  //     addUserWindow.current.classList.add("active");
  //     return;
  //   }
  //   addUserWindow.current.classList.remove("active");
  // };

  return (
    <section className="allchats" ref={allChats}>
      <div className="allchats-header">
        <div className="allchats-div">
          {curnav === "chats" && <h1>Chats</h1>}
          {curnav === "Nox Verse" && <h1>Velox Verse</h1>}
          {curnav === "calls" && <h1>Calls</h1>}
          {curnav === "settings" && <h1>Settings</h1>}

          <div className="headerAllChats"></div>

          <CurNotifications />
        </div>

        <div className="search-div">
          <input
            type="search"
            name="search"
            id="search"
            className="search"
            placeholder="Search . . ."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Search
            sx={{
              color: "#637381",
              position: "absolute",
              left: "2.8rem",
            }}
          />
          <FilterList
            sx={{
              color: "#2D99FF",
              position: "absolute",
              right: "9%",
            }}
          />
        </div>

        <hr />
      </div>

      <article className="noxverse-users">
        {users.map(({ name, _id, avatar, bio, username }) => {
          if (user._id.toString() === _id.toString()) return;

          let isOnline = false;
          if (onlineMembers.includes(_id.toString())) isOnline = true;

          return (
            <li className="user-div" key={_id} value={_id}>
              <div
                className="user-dp"
                onClick={() => (allChats.current.style.zIndex = "0")}
              >
                <img
                  src={
                    transformImage(avatar, 400) ||
                    "https://res.cloudinary.com/dki615p7n/image/upload/v1715486888/default_avatar_tvgr8w.jpg"
                  }
                  alt=""
                  style={{ height: "100px", width: "100px" }}
                  className="user-image"
                />
                {isOnline && <div className="noxverseonline"></div>}
              </div>

              <div className="userinfo">
                <p className="noxVerseName">{name.slice(0, 18)} </p>
                <p className="noxVerseUsername">{username.slice(0, 18)} </p>
                <p className="noxVerseBio">Bio : {bio} </p>
              </div>

              <button
                style={{
                  width: "20%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "transparent",
                  border: "none",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                value={_id}
                onClick={(e) => handleSendRequest(e.currentTarget.value)}
              >
                {
                  <AddCircle
                    sx={{ color: "#2d99ff", width: "2rem", height: "2rem" }}
                    onClick={(e) => (e.currentTarget.style.color = "white")}
                  />
                }
              </button>
            </li>
          );
        })}
      </article>
    </section>
  );
};

export default memo(NoxVerse);
