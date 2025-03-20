import {
  AddCircle,
  FilterList,
  Search
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendRequestMutation,
} from "../../redux/api/api";

const AddFriends = () => {
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

  // open and close the addUsers window
  const handleAddUsers = () => {
    if (!addUserWindow.current.classList.contains("active")) {
      addUserWindow.current.classList.add("active");
      return;
    }
    addUserWindow.current.classList.remove("active");
  };

  return (
    <>
      {/* <div className="allchats-addusers">
        <Add
          sx={{ height: "1.8rem", width: "1.8rem" }}
          onClick={() => handleAddUsers()}
        /> */}

      {/* <article className="addusers-article" ref={addUserWindow}> */}
      {/* <div className="search-div">
            <input
              type="text"
              placeholder="Search ..."
              style={{
                backgroundColor: "#ffffff1d",
                fontSize: "1rem",
                fontWeight: "700",
              }}
              className="search"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <Search
              sx={{
                color: "#F9FAFB",
                position: "absolute",
                left: "9%",
              }}
            />
          </div> */}
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
      <ul className="friendlist">
        {users.map(({ name, _id, avatar }, index) => {
          return (
            <li className="friendlistdivs" key={index} value={_id}>
              <div
                style={{
                  height: "2rem",
                  width: "4rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={
                    avatar ||
                    "https://res.cloudinary.com/dki615p7n/image/upload/v1715486888/default_avatar_tvgr8w.jpg"
                  }
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt="img"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingLeft: "0",
                  margin: "0",
                  width: "70%",
                  height: "100%",
                }}
              >
                <h5>{name} </h5>
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
      </ul>
      {/* </article> */}
      {/* </div> */}
    </>
  );
};

export default AddFriends;
