import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import { Container, Avatar, Stack, Skeleton } from "@mui/material";
import Table from "../../components/AdminLayout/Table";
import { useParams } from "react-router-dom";
import { dashboardData } from "../../assets/dashboarddata.js";
import { transformImage } from "../../lib/features.js";
import { useGetChatsDataQuery } from "../../redux/api/adminApi.js";
import { useErrors } from "../../hooks/hook.jsx";
import AvatarCard from "../../components/shared/AvatarCard.jsx";



const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard max={1} avatar={params.row.avatar} />,
  },

  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },

  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },

  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },

  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },

  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },

  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];



const ChatsManagement = () => {

    const { isError, error, data, refetch, isLoading } = useGetChatsDataQuery();
    useErrors([{ isError, error }]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    
  // if(data){
  //       setRows(
  //        data.chats.map((i) => {
  //           return {
  //             ...i,
  //             id: i._id,
  //             avatar: transformImage(i.avatar, 50),
  //           };
  //         })
  //       );
  // }
      if (data) {
        setRows(
          data.chats.map((i) => ({
            ...i,
            id: i._id,
            avatar: i.avatar.map((i) => transformImage(i, 50)),
            members: i.members.map((i) => transformImage(i.avatar, 50)),
            creator: {
              name: i.creator.name,
              avatar: transformImage(i.creator.avatar, 50),
            },
          }))
        );
      }
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default ChatsManagement;
