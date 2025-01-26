import { Box, Typography } from "@mui/material";
import { User } from "../../../backend/types";
import Link from "next/link";

export default function UserCard({ user }: { user: User }) {
  return (
    <Link href={`/explore/${user.id}`} key={user.id}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid ",
          borderColor: "primary.light",
          borderRadius: 4,
          p: 4,
          gap: 1,
        }}
      >
        <Box
          sx={{
            aspectRatio: "1/1",
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

        <Typography>Follows: {user.followers}</Typography>
      </Box>
    </Link>
  );
}
