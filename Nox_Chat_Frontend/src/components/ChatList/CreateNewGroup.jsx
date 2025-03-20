import {
  ArrowBack,
  CameraAlt,
  Cancel,
  NoteAddOutlined,
  Search,
  ArrowBackIosNew,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useCreateGroupMutation,
  useLazyFetchUserFriendsQuery,
} from "../../redux/api/api";
import {
  removeAllSelectedFriends,
  removeOneSelectedFriend,
  setAllFriends,
} from "../../redux/reducer/createGroupSlice";
import UsersList from "./UsersList";

const CreateNewGroup = () => {
  const dispatch = useDispatch();
  const { allFriends } = useSelector((state) => state.create);
  const { selectedFriends } = useSelector((state) => state.create);

  const creategroup = useRef();


  const [curimage, setImage] = useState();
  const [file, setFile] = useState("");
  const [name, setname] = useState("");

  const [check, setcheck] = useState(""); // for errors in inputs

  const [search, setSearch] = useState("");

  // fetch users except friends
  const [searchUserFriends] = useLazyFetchUserFriendsQuery("");

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUserFriends({name : search, })
        .then(({ data }) => dispatch(setAllFriends(data.allFriends)))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search]);

  // create group function ...
  const [createGroupMutation, isLoadingCreateGroup] = useAsyncMutation(
    useCreateGroupMutation
  );

  const handleCreateGroup = async () => {
    if (name.length === 0) return toast.error("please provide a name");
    if (name.length > 15)
      return toast.error("name must be less than 15 characters !");
    if (!file) return toast.error("Please upload a group image !");
    if (selectedFriends.length === 0)
      return toast.error("group must have atleast 2 member ...");

    const formdata = new FormData();

    formdata.append("name", name);
    selectedFriends.forEach((friend) => formdata.append("members", friend));
    formdata.append("avatar", file);

    await createGroupMutation(`creating ${name} ...`, formdata);

    creategroup.current.classList.remove("groupactive");
    dispatch(removeAllSelectedFriends());
    setname("");
    setFile(null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0].size > 3000000) {
      setcheck("Img size must be < 3mb");
    }
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  return (
    <>
      <div className="allchats-addgroup">
        <NoteAddOutlined
          onClick={() => {
            if (!creategroup.current.classList.contains("groupactive")) {
              creategroup.current.classList.add("groupactive");
              return;
            }
            creategroup.current.classList.remove("groupactive");

            dispatch(removeAllSelectedFriends());
            setname("");
            setFile(null);
            setImage(null);
          }}
        />

        <article className="creategroup" ref={creategroup}>
          <div className="groupheadingdiv">
            <button
              type="button"
              className="groupbackbtn"
              onClick={() => {
                dispatch(removeAllSelectedFriends());
                setname("");
                setFile(null);
                setImage(null);
                creategroup.current.classList.remove("groupactive");
              }}
            >
              <ArrowBackIosNew />
            </button>

            <h3>Group Details</h3>

            <button
              type="button"
              className="groupnextbtn"
              onClick={() => handleCreateGroup()}
            >
              create
            </button>
          </div>
          <hr
            style={{
              width: "100%",
              marginBottom: "1rem",
              marginTop: "1rem",
              color: "grey",
            }}
          />
          <div
            style={{
              height: "20%",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="avatar"
              style={{
                position: "relative",
              }}
            >
              <div className="image-border">
                <img src={curimage} className="image-border" />
              </div>

              <div
                className="photo"
                style={{
                  backgroundColor: "transparent",
                  position: "absolute",
                  right: "0",
                  bottom: "0",
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
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => handleImageChange(e)}
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
                  value={name}
                  onChange={(e) => {
                    setname(e.currentTarget.value);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: "#F9FAFB",
                    border: "none",
                    fontSize: "1.2rem",
                    outline: "none",
                    fontWeight: "600",
                  }}
                />
              </div>
            </div>
          </div>

          {check ? (
            <p
              style={{
                height: "1rem",
                fontSize: "0.8rem",
                color: "red",
              }}
            >
              {check}
            </p>
          ) : (
            <p
              style={{
                height: "1rem",
                fontSize: "0.8rem",
                color: "darkred",
                backgroundColor: "red",
              }}
            ></p>
          )}

          <ul className="nextselectedmembers">
            {selectedFriends.map((i, index) => {
              const person = allFriends.find(
                (friend) => friend._id.toString() === i.toString()
              );
              return (
                <li className="addedmembers" key={index}>
                  <img
                    src={person?.avatar}
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "50%",
                    }}
                    alt=""
                  />
                  <button
                    className="cancelbutton"
                    value={person?._id}
                    onClick={(e) => {
                      dispatch(removeOneSelectedFriend(e.currentTarget.value));
                    }}
                  >
                    <Cancel />
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            className="search-div"
            style={{ padding: "0rem", margin: "0rem" }}
          >
            <input
              type="text"
              placeholder="Search ..."
              style={{
                backgroundColor: "#ffffff1d",
                height: "2.5rem",
              }}
              className="search"
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <Search
              sx={{
                color: "#F9FAFB",
                position: "absolute",
                left: "9%",
              }}
            />
          </div>

          <ul className="friendlist">
            {allFriends.map((user) => {
              return <UsersList key={user._id} user={user} />;
            })}
          </ul>
        </article>
      </div>
    </>
  );
};

export default CreateNewGroup;
