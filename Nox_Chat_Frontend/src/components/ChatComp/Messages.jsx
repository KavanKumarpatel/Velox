import moment from "moment";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { Done, DoneAll } from "@mui/icons-material";
import Poll from "./Poll";

const Messages = ({
  chat,
  // allMessages,
  user,
  scrollElement,
  messages,
  groupChat,
  chatId,
}) => {
  const { newGroupAlert } = useSelector((state) => state.chat);
  const { allMessages } = useSelector((state) => state.chat);

  const autoScrollDiv = useRef();

  // const lastSeenTime = otherMember?.lastSeen;
  // let lastChatSeenTime;
  // for(let i = 0; i < lastChatOnlineArray?.length; i++){
  //   let memObj = lastChatOnlineArray[i];
  //   if(memObj?.memberId?.toString() !== user?._id?.toString()){
  //     console.log("here : ",memObj?.lastChatOnline)
  //     lastChatSeenTime = memObj?.lastChatOnline
  //   }
  // }

  useEffect(() => {
    if (autoScrollDiv.current)
      autoScrollDiv.current.scrollIntoView({ behaviour: "smooth" });
  }, []);

  return (
    <ul
      className="chat-texts"
      ref={scrollElement}
      onClick={() => {
        chat.current.classList.remove("active-files");
        chat.current.classList.remove("activesettings");
      }}
    >
      {newGroupAlert?.isNewAlert && <p>{newGroupAlert.message}</p>}

      {allMessages?.map((i) => {
        const {
          _id,
          content,
          isAlert,
          isPoll,
          options,
          attachments,
          sender,
          tempId,
          createdAt,
        } = i;

        const timeAgo = moment(i?.createdAt).fromNow();
        const samesender = user?._id?.toString() === sender?._id?.toString();

        // const isOnline = !samesender && onlineMembers.includes(sender._id.toString());
        // const isInChatOnline = !samesender && onlineChatMembers.includes(sender._id.toString());
        // console.log(isOnline, isInChatOnline);

        {
          // return <Poll question={content} options={options} />;

          if (isAlert) {
            return (
                <div key={_id} className="chatmessagesalert">
                  <div className="messagealertinnerdiv">
                    <p>{content}</p>
                  </div>
                </div>
            );
          }

        else if (isPoll) {
            return (
                <Poll
                  chatId={chatId}
                  user={user}
                  samesender={samesender}
                  question={content}
                  options={options}
                  tempId={tempId}
                />
            );
          }

          return !samesender ? (
            <>
              {content && (
                <li key={_id} className="textsinboxOuterDiv">
                  <div className="textsinboxdiv">
                    {groupChat && <p className="textsender">{sender.name}</p>}

                    <p className="textsinboxp">{content}</p>
                    <p className="textsinboxtimeStamps">{timeAgo}</p>
                  </div>
                </li>
              )}

              {attachments?.length > 0 &&
                attachments?.map((i, idx) => {
                  const url = i.url;
                  const file = fileFormat(url);

                  return (
                    <li key={_id} className="inboxAttachmentsOuterdiv">
                      <div className="inboxAttachments">
                        {groupChat && (
                          <p className="textsender">{sender.name}</p>
                        )}
                        <Box>
                          <a href={url} target="_blank" download>
                            {RenderAttachment(file, url)}
                          </a>
                          {file === "file" && (
                            <p className="textsinboxp">Attachment</p>
                          )}
                        </Box>
                        <p className="textsinboxtimeStamps">{timeAgo}</p>
                      </div>
                    </li>
                  );
                })}
            </>
          ) : (
            <>
              {content && (
                <li key={_id} className="textssentOuterDiv">
                  <div className="textssentdiv">
                    <p className="textssentp">{content}</p>
                    <div className="inboxtimetickdiv">
                      <p className="textssenttimeStamps">{timeAgo}</p>
                      {/* {(lastSeenTime < createdAt &&
                        lastChatSeenTime < createdAt &&
                        !isOnline &&
                        !isChatOnline && (
                          <Done
                            sx={{
                              height: "1rem",
                              width: "1rem",
                              color: "whitesmoke",
                            }}
                          />
                        )) ||
                        (lastSeenTime >= createdAt &&
                          lastChatSeenTime < createdAt) ||
                        (isOnline && !isChatOnline && (
                          <DoneAll
                            sx={{
                              height: "1rem",
                              width: "1rem",
                              color: "whitesmoke",
                            }}
                          />
                        )) ||
                        ((lastChatSeenTime >= createdAt || isChatOnline) && (
                          <DoneAll
                            sx={{
                              height: "1rem",
                              width: "1rem",
                              color: "yellow",
                            }}
                          />
                        ))} */}
                    </div>
                  </div>
                </li>
              )}
              {attachments?.length > 0 &&
                attachments?.map((i, idx) => {
                  const url = i.url;
                  const file = fileFormat(url);

                  return (
                    <li key={_id} className="sentAttachmentsOuterdiv">
                      <div className="sentAttachments">
                        <Box>
                          <a href={url} target="_blank" download>
                            {RenderAttachment(file, url)}
                          </a>
                        </Box>
                        <p className="textssenttimeStamps">{timeAgo}</p>
                      </div>
                    </li>
                  );
                })}
            </>
          );
        }
      })}

      <div ref={autoScrollDiv}></div>
    </ul>
  );
};

export default Messages;
