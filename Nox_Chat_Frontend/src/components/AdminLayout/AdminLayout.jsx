import {
  Close,
  Dashboard as DashboardIcon,
  ExitToApp,
  Groups,
  ManageAccounts,
  Menu,
  Message,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { adminLogout } from "../../redux/thunks/admin";




const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: #454f5b;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccounts />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <Groups />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <Message />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();

  const dispatch = useDispatch()

  const logoutHandler = () => {
  dispatch(adminLogout())
  };

  return (
    <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      <Typography
        variant="h5"
        textTransform={"uppercase"}
        sx={{ color: "#dfe3e8", fontWeight: "1000" }}
      >
        Velox Chat
      </Typography>

      <Stack spacing={"2rem"} sx={{ color: "#dfe3e8" }}>
        {adminTabs.map((tab) => {
          return (
            <Link
              key={tab.path}
              to={tab.path}
              sx={[
                location.pathname === tab.path && {
                  textDecoration: "none",
                  bgcolor: "#dfe3e8",
                  color: "#161C24",
                  ":hover": {
                    color: "#454F5B",
                  },
                },
                location.pathname !== tab.path && {
                  textDecoration: "none",
                  color: "#dfe3e8",
                  ":hover": {
                    color: "#C4CDD5",
                  },
                },
              ]}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                {tab.icon}
                <Typography>{tab.name}</Typography>
              </Stack>
            </Link>
          );
        })}

        <Link onClick={logoutHandler}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            sx={{ color: "#dfe3e8" }}
          >
            <ExitToApp />
            <Typography>LogOut</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};


const AdminLayout = ({ children }) => {
      const { isAdmin } = useSelector((state) => state.auth); 

  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };

  const handleClose = () => {
    setIsMobile(false);
  };

  if (!isAdmin) return <Navigate to={"/admin"} />;

  return (
    <Grid container minHeight={"100vh"} bgcolor={"#212b36"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
          color: '#dfe3e8'
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <Close /> : <Menu />}
        </IconButton>
      </Box>

      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Grid>

      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: "#161c24",
        }}
      >
        {children}
      </Grid>

      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
