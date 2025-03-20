import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import { Container, Avatar, Skeleton } from "@mui/material";
import Table from "../../components/AdminLayout/Table";
import { useParams } from "react-router-dom";
import { dashboardData } from "../../assets/dashboarddata.js";
import { transformImage } from "../../lib/features.js";
import { useGetUsersDataQuery } from "../../redux/api/adminApi.js";
import { useErrors } from "../../hooks/hook.jsx";



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
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },

  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },

  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },

  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },

  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },

];


const UsersManagement = () => {

    const { isError, error, data, refetch, isLoading } = useGetUsersDataQuery();
    useErrors([{ isError, error }]);

const [rows, setRows] = useState([]);

useEffect(() => {

if(data){
   setRows(
     data?.users.map((i) => {
       return {
         ...i,
         id: i._id,
         avatar: transformImage(i.avatar, 50),
       };
     })
   );
}

}, [])

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Users"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default UsersManagement;
