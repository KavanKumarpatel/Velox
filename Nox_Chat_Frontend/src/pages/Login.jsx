import React, { useRef, useState } from "react";
import "../Css/login.css";
import { CameraAlt } from "@mui/icons-material";
import {
  useBio,
  useName,
  usePassword,
  useUserName,
} from "../hooks/InputValidator";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "../redux/reducer/authslice"; // alt + shift + o
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const contain = useRef(); // for container's singnin & singup animation
  const currentImage = useRef();
  const [check, setcheck] = useState(""); // for errors in inputs
  const { curname, setname, nameFlag, nameErr } = useName("");
  const { user, setuser, userFlag, userErr } = useUserName("");
  const { bio, setbio, bioFlag, bioErr } = useBio("");
  const { pass, setpass, passFlag, passErr } = usePassword("");
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");

  // SIGN UP
  const signUpSubmitHandler = async (e) => {
    e.preventDefault();

    if (!nameFlag) {
      setcheck(nameErr);
      return;
    } else if (!userFlag) {
      setcheck(userErr);
      return;
    } else if (!bioFlag) {
      setcheck(bioErr);
      return;
    } else if (!passFlag) {
      setcheck(passErr);
      return;
    } else if (!file) {
      setcheck("avatar ???");
      return;
    } else setcheck("");

    const toastId = toast.loading("Signing Up...");

    setIsLoading(true);

    const formdata = new FormData();

    formdata.append("name", curname);
    formdata.append("username", user);
    formdata.append("password", pass);
    formdata.append("bio", bio);
    formdata.append("avatar", file);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/signup`,
        formdata,
        config
      );
      dispatch(userExists(data?.user));
      toast.success(data?.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIN
  const signInSubmitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing In...");

    setIsLoading(true);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username: user, password: pass },
        config
      );
      dispatch(userExists(data?.user));
      toast.success(data?.message, { id: toastId });
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "something went wrong !", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // IMG
  const handleImageChange = (e) => {
    if (e.target.files[0].size > 3000000) {
      setcheck("Img size must be upto 3mb");
      return;
    }
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  return (
    <div className="container" id="container" ref={contain}>
      <div className="form-container sign-up">
        <form onSubmit={signUpSubmitHandler}>
          <h1>Create Account</h1>
          {/* <div className="social-icons">
            <a href="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
          <span>or use a username for registeration</span> */}

          <div
            className="avatar"
            style={{
              position: "relative",
              marginBottom: "0.4rem",
              marginTop: "1rem",
            }}
          >
            <div className="image-border">
              <img src={image} className="image-border" />
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
                onChange={handleImageChange}
                ref={currentImage}
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

          <input
            type="text"
            placeholder="name"
            value={curname}
            onChange={(e) => setname(e.currentTarget.value)}
          />
          <input
            type="text"
            placeholder="bio"
            value={bio}
            onChange={(e) => setbio(e.currentTarget.value)}
          />
          <input
            type="username"
            placeholder="username"
            value={user}
            onChange={(e) => setuser(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={pass}
            onChange={(e) => setpass(e.currentTarget.value)}
          />
          {check && (
            <span
              className="validationWarning"
              style={{ color: "red", fontWeight: "800" }}
            >
              {check}
            </span>
          )}
          <button disabled={isLoading} type="submit">
            Sign Up
          </button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form onSubmit={signInSubmitHandler}>
          <h1>Sign In</h1>
          {/* <div className="social-icons">
            <a href="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div> */}
          <span>or use your username & password</span>
          <input
            type="username"
            placeholder="username"
            value={user}
            onChange={(e) => setuser(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={pass}
            onChange={(e) => setpass(e.currentTarget.value)}
          />
          {/* {check && (
            <span
              className="validationWarning"
              style={{ color: "red", fontWeight: "800" }}
            >
              {check}
            </span>
          )} */}
          <a href="#">Forget Your Password?</a>
          <button disabled={isLoading}>Sign In</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button
              className="hidden"
              id="login"
              type="button"
              onClick={(e) => {
                contain.current.classList.remove("active");
              }}
            >
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of chat features
            </p>
            <button
              className="hidden"
              id="register"
              type="button"
              onClick={(e) => {
                contain.current.classList.add("active");
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
