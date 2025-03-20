import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../Css/allChats.css";
import bgImage from "../../Images/classicbg.jpg";
import { ArrowBackIos } from "@mui/icons-material";

const Homepage = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault(); // Prevents page reload
    if (input.trim() !== "") {
      navigate(`/meetjoin/${input}`);
    } else {
      alert("Please enter your name!");
    }
  };

  return (
    <div>
      <div
        className="homepagecss"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div className="backbutton"><ArrowBackIos className="backbuttoncss" onClick={() => navigate("/")}/></div>
        <div className="logofieldcss">
          <img src="NoxChatLogo.png" alt="" className="logocss" />
          <div className="headtextcss2">Velox</div>
        </div>
        <div className="headtextcss1">Velox Meet</div>
        <div className="headtextcss">Enter Your Name To Create Meeting</div>
        <div className="innerbottomcss">
          <input
            className="inputfieldcss"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Enter your name..."
          />

          <button className="buttoncss" onClick={submitHandler}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
