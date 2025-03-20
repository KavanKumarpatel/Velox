import { AddCircle, RemoveCircle } from '@mui/icons-material';
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addOneSelectedFriend } from '../../redux/reducer/createGroupSlice';


const UsersList = ({ user, setSelectedMembers }) => {

    const dispatch = useDispatch()
    

  const { name, _id, avatar } = user;

  return (
    <li className="friendlistdivs">
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
            dispatch(addOneSelectedFriend(e.currentTarget.value))
        }}
      >
        {
          <AddCircle
            sx={{ color: "#2d99ff", width: "2rem", height: "2rem" }}
            onClick={(e) => (e.currentTarget.style.color = "white")}
          />

        //   <RemoveCircle sx={{ color: "red", width: "2rem", height: "2rem" }} />
        }
      </button>
    </li>
  );
};

export default memo(UsersList);