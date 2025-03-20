import {
  Call,
  Chat,
  Close,
  Group,
  Logout,
  CameraAlt,
  SwitchAccessShortcutAddSharp,
} from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducer/authslice";
import {
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
} from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hook";

const Navbar = ({ setnav, curnav, navbarref }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { avatar, bio, createdAt, name, username } = user;
  const joinDate = new Date(createdAt);

  const [curImage, setImage] = useState(avatar?.url);
  const [file, setFile] = useState("");
  const [curbio, setbio] = useState(bio);
  const [curname, setname] = useState(name);
  const [curusername, setusername] = useState(username);
  const [ischange, setchange] = useState(false); // will update profile only if any value changes
  const maintag = useRef();

  // profile picture update
  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  const [sendDpRequest, isLoadingDpRequest] = useAsyncMutation(
    useUpdateProfilePictureMutation
  );

  const handleDpUpdate = async () => {
    const formdata = new FormData();
    formdata.append("avatar", file);
    await sendDpRequest("Updating profile picture !", formdata);
  };

  // profile update
  const [sendRequest, isLoadingSendRequest] = useAsyncMutation(
    useUpdateProfileMutation
  );

  const handleProfileUpdate = async () => {
    const arg = {
      bio: curbio,
      name: curname,
      username: curusername,
    };
    await sendRequest("Updating user profile !", arg);
  };

  useEffect(() => {
    const allicons = document.querySelectorAll(".NavIcons");
    allicons[0].classList.add("active");
  }, []);

  const handleNav = (e) => {
    const curIcon = e.currentTarget;
    const allicons = document.querySelectorAll(".NavIcons");
    for (let i = 0; i < allicons.length; i++) {
      allicons[i].classList.remove("active");
    }
    curIcon.classList.add("active");
  };

  // logout User
  const logoutHandler = async (e) => {
    handleNav(e);
    setnav("settings");
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(data?.message);
      dispatch(userNotExists());
    } catch (err) {
      toast.error(err?.response?.data?.message || "something went wrong !");
    }
  };

  return (
    <nav className="navbar" ref={navbarref}>
      <div
        className="Icondiv"
        onClick={() => {
          maintag.current.classList.add("active");
        }}
      >
        <img src={curImage} alt="avatar" className="NavIcon" />
      </div>
      <article className="profile" ref={maintag}>
        <div
          className="profileclose"
          onClick={() => {
            maintag.current.classList.remove("active");
            if (ischange) {
              handleProfileUpdate();
            }
            if (file) {
              handleDpUpdate();
            }
            setchange(false);
          }}
        >
          <Close
            sx={{
              color: "#f9fafb",
              fontSize: "2.4rem",
            }}
          />
        </div>

        <div className="profileimgdiv">
          <img src={curImage} alt="avatar" />
        </div>
        <div
          className="photo imageInput"
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            right: "2rem",
            bottom: "2rem",
            zIndex: "11",
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

        <div className="blackDiv"></div>
        <div className="nameUsername">
          <textarea
            className="textarea1"
            name="name"
            value={curname}
            onChange={(e) => {
              setname(e.currentTarget.value);
              setchange(true);
            }}
          ></textarea>
          <textarea
            className="textarea2"
            name="username"
            value={curusername}
            onChange={(e) => {
              setusername(e.currentTarget.value);
              setchange(true);
            }}
          ></textarea>
        </div>
        <p className="profilepara">Joined: {moment(joinDate).fromNow()}</p>
        <div className="profiledata">
          <textarea
            type="text"
            value={curbio}
            onChange={(e) => {
              setbio(e.currentTarget.value);
              setchange(true);
            }}
          />
        </div>
      </article>

      <ul className="iconsdiv">
        <li
          className="NavIcons divchat"
          value="chats"
          onClick={(e) => {
            handleNav(e);
            setnav("chats");
          }}
        >
          <Chat />
        </li>

        <li
          className="NavIcons divgroup"
          value="Nox Verse"
          onClick={(e) => {
            handleNav(e);
            setnav("Nox Verse");
          }}
        >
          <Group />
        </li>

        <li
          className="NavIcons divcall"
          value="calls"
          onClick={(e) => {
            handleNav(e);
            setnav("calls");
          }}
        >
          <SwitchAccessShortcutAddSharp />
        </li>

        <li
          className="NavIcons divsettings"
          value="settings"
          onClick={logoutHandler}
        >
          <Logout />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
