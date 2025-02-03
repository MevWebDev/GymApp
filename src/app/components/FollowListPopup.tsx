"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { User } from "../../../backend/types";
import Link from "next/link";

interface FollowListPopupProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  title?: string;
}

const FollowListPopup: React.FC<FollowListPopupProps> = ({
  open,
  onClose,
  users,
  title = "Followers",
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {users.length === 0 ? (
          <Typography>No {title.toLowerCase()} found.</Typography>
        ) : (
          <List>
            {users.map((user) => (
              <Link key={user.id} href={`/explore/users/${user.id}`}>
                <ListItem divider>
                  <ListItemAvatar>
                    <Avatar src={user.avatar} alt={user.nick} />
                  </ListItemAvatar>
                  <ListItemText primary={user.nick} />
                </ListItem>
              </Link>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowListPopup;
