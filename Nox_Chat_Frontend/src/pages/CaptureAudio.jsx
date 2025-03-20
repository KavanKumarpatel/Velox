import React, { useEffect, useRef, useState } from "react";
import {
  Delete,
  Mic,
  Pause,
  PauseCircle,
  PlayArrow,
  Send,
} from "@mui/icons-material";
import { useStateProvider } from "../constants/StateContext";
import AppLayout from "../components/AppLayout/AppLayout";
import { useErrors, useSocketEvents } from "../hooks/hook.jsx";
import { getSocket } from "../socket";
import { useDispatch } from "react-redux";
import { useGetChatDetailsQuery } from "../redux/api/api.js";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ hide, chatid }) {
  const dispatch = useDispatch();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  const chatDetails = useGetChatDetailsQuery({ chatid, populate: true });

  //let avatar = curChat?.avatar?.url;
  const curChat = chatDetails?.data?.curchat;
  const members = curChat?.members;

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      width: 250,
      responsive: true,
    });
    setWaveform(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) handleStartRecording();
  }, [waveform]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveform.load(audioURL);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.log("Error accessing microphone:", error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveform.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    if (!renderedAudio) return;
  
    const formData = new FormData();
    formData.append("audio", renderedAudio);
    formData.append("chatId", chatid);
  
    try {
      const response = await fetch("https://your-api-url.com/send-audio", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to send audio");
  
      const data = await response.json();
      console.log("Audio sent successfully", data);
  
      hide(); // Hide the recording UI after sending
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };
  

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="chat-message-div1">
      <div className="addspan1">
        <Delete
          sx={{
            fontSize: "1.8rem",
          }}
          onClick={() => hide()}
        />
      </div>
      <div className="custom-button1">
        {isRecording ? (
          <div className="custom-text1">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <PlayArrow className="fontsize" onClick={handlePlayRecording} />
                ) : (
                  <Pause className="fontsize" onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="custom-width1" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="custom-class">
        {!isRecording ? (
          <Mic
            sx={{
              color: "#ef4444",
              marginRight: "5rem",
              fontSize: "1.9rem",
              position: "absolute",
              right: "-0.8rem",
              bottom: "1.5rem",
            }}
            onClick={handleStartRecording}
          />
        ) : (
          <PauseCircle
            sx={{
              color: "#ef4444",
              marginRight: "5rem",
              fontSize: "2rem",
              position: "absolute",
              right: "-0.8rem",
              bottom: "1.5rem",
            }}
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div className="addspan2">
        <Send className="custom-class" title="Send" onClick={sendRecording} />
      </div>
    </div>
  );
}

export default CaptureAudio;
