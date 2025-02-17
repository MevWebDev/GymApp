import { Box, Typography } from "@mui/material";
import type { User } from "../../../shared/shared_types";
import Link from "next/link";

export default function UserCard({ user }: { user: User }) {
  return (
    <Link href={`/explore/users/${user.id}`} key={user.id}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",

          p: 4,
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            aspectRatio: "1/1",
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={user.avatar}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="user avatar"
          ></img>
        </Box>
        <Typography variant="h3">{user.nick}</Typography>
      </Box>
    </Link>
  );
}
