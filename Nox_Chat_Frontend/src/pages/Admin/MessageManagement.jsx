import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import Table from "../../components/AdminLayout/Table";
import RenderAttachment from "../../components/ChatComp/RenderAttachment";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";
import { useGetMessagesDataQuery } from "../../redux/api/adminApi";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0
        ? attachments.map((i, index) => {
            const url = i.avatar;
            const file = fileFormat(url);

            return (
              <Box key={index}>
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{ color: "black" }}
                >
                  {<RenderAttachment file={file} url={url}/>}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },

  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },

  {
    field: "sender",
    headerName: "Send By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack sx={{ display: "flex", flexDirection: "row" }}>
        <div style={{ height: "3rem", width: "3rem" }}>
          <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        </div>
        <div>{params.row.sender.name}</div>
      </Stack>
    ),
  },

  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },

  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },

  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const Messages = () => {
  const [rows, setRows] = useState([]);


    const { isError, error, data, refetch, isLoading } = useGetMessagesDataQuery();
    useErrors([{ isError, error }]);

  useEffect(() => {
    setRows(
      data.messages.map((i) => {
        return {
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h.mm:ss a"),
        };
      })
    );
  }, []);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table
          heading={"All Messages"}
          rows={rows}
          columns={columns}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default Messages;
