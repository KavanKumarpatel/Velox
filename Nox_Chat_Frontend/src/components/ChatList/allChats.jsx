import { FilterList, Search, TripOrigin, Videocam } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import React, { Suspense, lazy, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SingleChats = lazy(() => import("../ChatList/SingleChats"));
const CreateNewGroup = lazy(() => import("./CreateNewGroup"));
const CurNotifications = lazy(() => import("./CurNotifications"));
const ProfileWindow = lazy(() => import("./ProfileWindow"));

const AllChats = ({
  curnav,
  allChats,
  navbarref,
  isLoading,
  data,
  setSearch,
  search,
}) => {
  const navigate = useNavigate();
  const { onlinemeMembers } = useSelector((state) => state.chat);
  const profilewindow = useRef();
  const [curChatId, setCurChatId] = useState("");

  const handleDeleteChatOpen = (e, userid, groupchat) => {
    e.preventDefault();
    console.log(`User with id = ${userid} deleted`);
  };

  const myChats = data?.mychats;

  return (
    <section className="allchats" ref={allChats}>
      <Suspense fallback={<Skeleton />}>
        <ProfileWindow
          profilewindow={profilewindow}
          curChatId={curChatId}
          allChats={allChats}
        />
      </Suspense>

      <div className="allchats-header">
        <div className="allchats-div">
          <h1>{curnav}</h1>

          <div className="headerAllChats"></div>

          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "white",
              marginRight: 5,
              marginBottom: 5,
            }}
            onClick={() => window.open("/meet", "_blank")}
          >
            <Videocam sx={{ cursor: "pointer" }} />
          </button>

          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "white",
              marginBottom: 5,
            }}
          >
            <TripOrigin
              onClick={() => navigate("/aibot")}
              sx={{ cursor: "pointer" }}
            />
          </button>

          <Suspense fallback={<Skeleton />}>
            <CurNotifications />
          </Suspense>

          <Suspense fallback={<Skeleton />}>
            <CreateNewGroup />
          </Suspense>
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

      {isLoading ? (
        <Skeleton className="allchats-users" />
      ) : (
        <article className="allchats-users">
          {curnav === "chats" &&
            myChats?.map((chat, index) => (
              <Suspense fallback={<Skeleton />} key={index}>
                <SingleChats
                  chat={chat}
                  handleDeleteChatOpen={handleDeleteChatOpen}
                  allChats={allChats}
                  navbarref={navbarref}
                  profilewindow={profilewindow}
                  setCurChatId={setCurChatId}
                  index={index}
                />
              </Suspense>
            ))}
        </article>
      )}
    </section>
  );
};

export default AllChats;
