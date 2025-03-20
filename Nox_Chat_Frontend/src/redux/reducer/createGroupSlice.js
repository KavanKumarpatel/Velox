import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allFriends: [],
  selectedFriends: [],
};

const createGroupSlice = createSlice({
  name: "create",
  initialState,
  reducers: {
    setAllFriends: (state, action) => {
      state.allFriends = action.payload;
    },

    removeAllFriends: (state) => {
      state.allFriends = [];
    },

    addOneSelectedFriend: (state, action) => {
      state.selectedFriends.push(action.payload);
    },
    
    setSelectedFriends: (state, action) => {
      state.selectedFriends = action.payload;
    },
    
    removeOneSelectedFriend: (state, action) => {
      state.selectedFriends = state.selectedFriends.filter(
        (friend) => friend.toString() !== action.payload.toString()
      );
    },
    removeAllSelectedFriends: (state) => {
        state.selectedFriends = []
    }
  },
});

export const {
  setAllFriends,
  removeAllFriends,
  addOneSelectedFriend,
  removeOneSelectedFriend,
  removeAllSelectedFriends,
  setSelectedFriends,
} = createGroupSlice.actions;

export default createGroupSlice;
