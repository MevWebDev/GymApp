import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function ButtonAppBar() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "space-between",
        mx: 12,
        my: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 5 }}>
        <Link href="/home">
          <Typography variant="h6" component="div">
            Home
          </Typography>
        </Link>

        <Link href="/exercises">
          <Typography variant="h6" component="div">
            Exercises
          </Typography>
        </Link>
        <Link href="/explore">
          <Typography variant="h6" component="div">
            Explore
          </Typography>
        </Link>
        <Link href="/library">
          <Typography variant="h6" component="div">
            Library
          </Typography>
        </Link>
      </Box>
      <Button color="inherit">Login</Button>
    </Box>
  );
}
