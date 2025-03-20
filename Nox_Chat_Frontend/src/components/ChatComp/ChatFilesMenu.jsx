import {
  AudioFile,
  DocumentScannerRounded as DocumentIcon,
  PhotoAlbumRounded as PhotoIcon,
  VideoCameraBackRounded as VideoIcon,
  PollRounded,
} from "@mui/icons-material";
import React from "react";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const ChatFilesMenu = ({ chat, chatid, pollWindow }) => {
  const [sendAttachments] = useSendAttachmentsMutation();

  const fileChangeHandler = async (e, key) => {
    if (key.toString() === "Poll") {
      console.log("open poll window !");
      return;
    }

    const files = Array.from(e.target.files);

    if (files.length <= 0) return;
    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    const toastId = toast.loading(`Sending ${key}...`);
    chat.current.classList.remove("active-files");

    try {
      const formdata = new FormData();
      formdata.append("chatId", chatid);
      files.forEach((file) => formdata.append("files", file));

      const res = await sendAttachments(formdata);

      if (res?.data) {
        toast.success(`${key} send successfully !`, { id: toastId });
      } else {
        console.log(res?.error);
        toast.error(`failed while sending ${key}`, { id: toastId });
      }
    } catch (err) {
      toast.error(err?.data?.message, { id: toastId });
    }
  };

  return (
    <>
      <article className="chat-files"></article>
      <div className="chat-file poll" onClick={() => {
        if(!pollWindow.current.classList.contains("active")){
                        pollWindow.current.classList.add("active");
                        return;

        }
        pollWindow.current.classList.remove("active");

        }}>
        <PollRounded
          sx={{
            color: "#f9fafb",
            fontSize: "2.3rem",
          }}
        />
        <span>Poll</span>
        {/* <input
          type="none"
          id="image"
          onChange={(e) => fileChangeHandler(e, "Poll")}
          className="chatFileInput"
        /> */}
      </div>

      <div className="chat-file photos">
        <PhotoIcon
          sx={{
            color: "#f9fafb",
            fontSize: "2.3rem",
          }}
        />
        <span>Photos</span>
        <input
          type="file"
          id="image"
          multiple
          accept="image/png, image/jpeg, image/gif"
          onChange={(e) => fileChangeHandler(e, "Images")}
          className="chatFileInput"
        />
      </div>

      <div className="chat-file videos">
        <VideoIcon
          sx={{
            color: "#f9fafb",
            fontSize: "2.3rem",
          }}
        />
        <span>Videos</span>
        <input
          type="file"
          id="image"
          multiple
          accept="video/mp4, video/webm, video/ogg"
          onChange={(e) => fileChangeHandler(e, "Videos")}
          className="chatFileInput"
        />
      </div>

      <div className="chat-file documents">
        <DocumentIcon
          sx={{
            color: "#f9fafb",
            fontSize: "2.3rem",
          }}
        />
        <span>File</span>
        <input
          type="file"
          id="image"
          multiple
          accept="*"
          onChange={(e) => fileChangeHandler(e, "Files")}
          className="chatFileInput"
        />
      </div>

      <div className="chat-file audio">
        <AudioFile
          sx={{
            color: "#f9fafb",
            fontSize: "2.3rem",
          }}
        />
        <span>Audio</span>
        <input
          type="file"
          id="image"
          multiple
          accept="audio/mpeg, audio/wav"
          onChange={(e) => fileChangeHandler(e, "Audios")}
          className="chatFileInput"
        />
      </div>
    </>
  );
};

export default ChatFilesMenu;
