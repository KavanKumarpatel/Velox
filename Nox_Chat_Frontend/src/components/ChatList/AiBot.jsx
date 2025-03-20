import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { marked } from "marked";
import { Divider, styled } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StyleDivider = styled(Divider)`
  border-color: black; /* Set border color */
  border-width: 1px; /* Set border width */
  border-style: solid; /* Ensure a solid border */
  opacity: 0.7; /* Can be changed to 'hidden' if needed */
`;

const AiBot = () => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState(
    sessionStorage.getItem("chatResponse") || ""
  );

  const navigate = useNavigate();

  // Save response to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("chatResponse", response);
  }, [response]);

  const sendMessage = async () => {
    if (!userInput) {
      setResponse("Please enter a message.");
      return;
    }
    setResponse("Loading...");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "HTTP-Referer": "https://www.sitename.com",
          "X-Title": "SiteName",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [{ role: "user", content: userInput }],
        }),
      });

      const data = await res.json();
      const markdownText =
        data.choices?.[0]?.message?.content || "No response received.";
      const parsedMarkdown = marked.parse(markdownText);

      setResponse(parsedMarkdown);
    } catch (error) {
      setResponse("Error: " + error.message);
    }
  };

  return (
    <div className="backgrounddetails">
      <div className="backbutton"><ArrowBackIos className="backbuttoncss" onClick={() => navigate("/")}/></div>
      <div className="containerbox">
        <h2 className="responseanswer">VeloxGPT</h2>
        <StyleDivider />
        <div id="response" dangerouslySetInnerHTML={{ __html: response }}></div>
        <div className="bottomcss">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your question"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
          <button className="btn-success1" onClick={sendMessage}>
            Ask!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiBot;
