import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";
import { FileOpen } from "@mui/icons-material";

const initialState = {
  onlineMembers: [],
  onlineChatMembers: {},  
  notificationCount: 0,
  allMessages: [],
  newMessageAlert: getOrSaveFromStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatid: "",
      count: 0,
      message: "",
    },
  ],
  isTyping: false,
  allChatsIsTyping: {
    isTyping: false,
    typingChatid: "",
    name: "",
  },
  newGroupAlert: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.notificationCount += 1;
    },

    resetNotification: (state) => {
      state.notificationCount = 0;
    },

    setAllMessages: (state, action) => {
      state.allMessages = action.payload
    },

    updateAMessage: (state, action) => {
       const tempId = action.payload.tempId;
       const messageData = action.payload.messageData;
       state.allMessages = state.allMessages.map((i) => {
        if (i.tempId.toString() === tempId.toString()) {
          i.options = messageData.options;
        }
        return i;
       })
    },

    setNewMessagesAlert: (state, action) => {
      const index = state.newMessageAlert.findIndex(
        (i) => i.chatid === action.payload.chatid
      );
      if (index !== -1) {
        state.newMessageAlert[index].count += 1;
        state.newMessageAlert[index].message = action?.payload?.message;
      } else {
        state.newMessageAlert.push({
          chatid: action.payload.chatid,
          count: 1,
          message: action.payload?.message,
        });
      }
    },

    removeNewMessagesAlert: (state, action) => {
      state.newMessageAlert = state.newMessageAlert.filter(
        (i) => i.chatid !== action.payload
      );
    },

    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },

    setAllChatsTyping: (state, action) => {
      state.allChatsIsTyping = action.payload;
    },

    setNewGroupAlert: (state, action) => {
      state.newGroupAlert = action.payload;
    },

    removeNewGroupAlert: (state) => {
      state.newGroupAlert = " ";
    },

    setOnlineMembers: (state, action) => {
      state.onlineMembers = action.payload;
    },

    setChatOnlineMembers: (state, action) => {
      state.onlineChatMembers = action.payload;
    }
  },
});

export const {
  incrementNotification,
  resetNotification,
  setNewMessagesAlert,
  removeNewMessagesAlert,
  setTyping,
  setAllChatsTyping,
  setNewGroupAlert,
  removeNewGroupAlert,
  setOnlineMembers,
  setChatOnlineMembers,
  setAllMessages,
  updateAMessage,
} = chatSlice.actions;

export default chatSlice;
