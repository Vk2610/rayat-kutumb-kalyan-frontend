import * as React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import { handleLogout } from "../utils/Links";

export default function Sidebar({ open = false, toggleDrawer, links = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const formType = localStorage.getItem('formType');

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        backgroundColor: "#fff",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Navigation Links */}
      <List sx={{ pt: 1 }}>
        {links.map((item) => {
          const Icon = item.icon;
          if (item.formType === 'common' || item.formType === formType) {
            return (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.Path);
                    toggleDrawer();
                  }}
                  selected={location.pathname === item.Path}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(7, 170, 23, 0.08)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(7, 170, 23, 0.12)",
                      "&:hover": {
                        backgroundColor: "rgba(7, 170, 23, 0.16)",
                      },
                    },
                    borderRadius: 1,
                    mx: 1,
                    width: "calc(100% - 16px)",
                  }}
                >
                  <ListItemIcon>
                    <Icon
                      style={{
                        color:
                          location.pathname === item.Path
                            ? "rgb(7, 170, 23)"
                            : "rgba(7, 170, 23, 0.7)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: location.pathname === item.Path ? 600 : 500,
                        color:
                          location.pathname === item.Path
                            ? "rgb(7, 170, 23)"
                            : "rgb(51, 51, 51)",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>

      {/* Logout Button at Bottom */}
      <List
        sx={{ mt: "auto", borderTop: 1, borderColor: "rgba(0, 0, 0, 0.12)" }}
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: "red",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.08)",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: 500,
                  color: "red",
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          top: "64px", // Height of AppBar
          height: "calc(100% - 64px)",
          boxSizing: "border-box",
          border: "none",
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
}

