import { Close } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { useLazyGetChatProfileDataQuery } from '../../redux/api/api';
import { useErrors } from '../../hooks/hook';
import toast from 'react-hot-toast';
import moment from 'moment';

const ProfileWindow = ({ profilewindow, curChatId, allChats }) => {

    const [member, setCurMember] = useState({
      name: "...",
      avatar: {
        url: "https://res.cloudinary.com/dki615p7n/image/upload/v1715486888/default_avatar_tvgr8w.jpg",
      },
      username: "..."
    });
    const chatId = curChatId.toString()

    const [getChatProfile] = useLazyGetChatProfileDataQuery()

      useEffect(() => {
          getChatProfile(chatId)
            .then(({ data }) => setCurMember(data?.profileData))
            .catch((e) => console.log(e));

      }, [chatId]);


  return (
    <article className="profilewindow" ref={profilewindow}>
      <div
        className="profileclose"
        onClick={() => {
          profilewindow.current.classList.remove("active");
          allChats.current.classList.remove("lightblur");
          // setCurMember({
          //   name: "...",
          //   avatar: {
          //     url: "https://res.cloudinary.com/dki615p7n/image/upload/v1715486888/default_avatar_tvgr8w.jpg",
          //   },
          //   username: "...",
          // });
        }}
      >
        <Close
        className='closeBtn'
          sx={{
            color: "#f9fafb",
            fontSize: "2.4rem",
          }}
        />
      </div>

      <div className="profileimgdiv">
        <img src={member?.avatar?.url} alt="avatar" />
      </div>

      <div className="blackDiv"></div>
      <div className="nameUsernameprofile">
        <p className="name">{member?.name}</p>
        <p className="username">{member?.username}</p>
      </div>
      <p className="joined">Joined: {moment(member?.createdAt).fromNow()}</p>
    </article>
  );
};

export default ProfileWindow