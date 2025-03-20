import { AddCircle, ArrowBack, Search } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    useAddMembersMutation,
    useLazyFetchUserFriendsQuery
} from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { addOneSelectedMember, removeAllSelectedMembers, setNonGroupFriends } from "../../redux/reducer/addMembersslice";
import { useAsyncMutation } from "../../hooks/hook";

const AddMembers = ({ addMemberWindow, chatid, members }) => {

    const dispatch = useDispatch()
    const { nonGroupFriends } = useSelector((state) => state.addmember);
   const { selectedMembers } = useSelector((state) => state.addmember);


  const [search, setSearch] = useState("");

  const [searchFriends] = useLazyFetchUserFriendsQuery("");
  

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchFriends({ name: search, chatid: chatid })
        .then(({ data }) => dispatch(setNonGroupFriends(data?.allFriends)))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search, chatid, members]);

  // close the addMembers window & add selected members
    const [addMembersMutation, isLoadingAddMembersMutation] = useAsyncMutation(
      useAddMembersMutation
    );


  const addMemberChanges = async () => {
    if(selectedMembers.length === 0){
        toast.error("Please select atleast one friend to add in group !")
        return;
    }
   
  const formdata = {
    chatId : chatid,
    new_members : selectedMembers,
  }

     await addMembersMutation(`adding new members ...` , formdata)
    
    addMemberWindow.current.classList.remove("active");
    dispatch(removeAllSelectedMembers())
  };

  return (
    <>
      <article
        className="addMembers-article"
        ref={addMemberWindow}
      >


        <div className="groupheadingdiv">
          <button
            type="button"
            className="groupbackbtn"
            onClick={() => {
                dispatch(removeAllSelectedMembers())
              addMemberWindow.current.classList.remove("active");
            }}
          >
            <ArrowBack />
          </button>

          <h3 style={{color: "white"}}>Add Members</h3>

          <button
            type="button"
            className="groupnextbtn"
            onClick={() => addMemberChanges()}
          >
            next
          </button>
        </div>

<hr style={{color: "white", width:"100%"}}/>

        <div className="search-div">
          <input
            type="text"
            placeholder="Search ..."
            style={{
              backgroundColor: "#ffffff1d",
              fontSize: "1rem",
              fontWeight: "700",
            }}
            className="search"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Search
            sx={{
              color: "#F9FAFB",
              position: "absolute",
              left: "9%",
            }}
          />
        </div>
        <ul className="friendlist">
          {nonGroupFriends?.map(({ name, _id, avatar }, index) => {
            return (
              <li className="friendlistdivs" key={index} value={_id}>
                <div
                  style={{
                    height: "2rem",
                    width: "4rem",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      avatar ||
                      "https://res.cloudinary.com/dki615p7n/image/upload/v1715486888/default_avatar_tvgr8w.jpg"
                    }
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt="img"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingLeft: "0",
                    margin: "0",
                    width: "70%",
                    height: "100%",
                  }}
                >
                  <h5>{name} </h5>
                </div>

                <button
                  style={{
                    width: "20%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "transparent",
                    border: "none",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  value={_id}
                  onClick={(e) => {
                    if(!selectedMembers.includes(e.currentTarget.value))
                    dispatch(addOneSelectedMember(e.currentTarget.value))
                }}
                >
                    <AddCircle
                      sx={{ color: "#2d99ff", width: "2rem", height: "2rem" }}
                      onClick={(e) => e.currentTarget.style.color="white"}
                    /> 
                </button>
              </li>
            );
          })}
        </ul>
      </article>
    </>
  );
};

export default AddMembers;
