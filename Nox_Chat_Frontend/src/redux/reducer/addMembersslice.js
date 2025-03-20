import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nonGroupFriends: [],
  selectedMembers: [],
};

const addMembersSlice = createSlice({
  name: "addmember",
  initialState,
  reducers: {
    addOneSelectedMember: (state, action) => {
      state.selectedMembers.push(action.payload);
    },

    setSelectedMembers: (state, action) => {
      state.selectedMembers = action.payload;
    },

    removeOneSelectedMember: (state, action) => {
      state.selectedMembers = state.selectedMembers.filter(
        (friend) => friend.toString() !== action.payload.toString()
      );
    },
    removeAllSelectedMembers: (state) => {
      state.selectedFriends = [];
    },
    setNonGroupFriends: (state, action) => {
      state.nonGroupFriends = action.payload;
    },
  },
});

export const {
  addOneSelectedMember,
  removeOneSelectedMember,
  setSelectedMembers,
  removeAllSelectedMembers,
  setNonGroupFriends,
} = addMembersSlice.actions;

export default addMembersSlice;
