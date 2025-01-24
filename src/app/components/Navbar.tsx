import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ExploreIcon from "@mui/icons-material/Explore";
import BackupTableIcon from "@mui/icons-material/BackupTable";

export default function ButtonAppBar() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 2, md: 5 },
        my: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 5 },
          alignItems: "center",
          justifySelf: "flex-end",
        }}
      >
        <Link href="/home">
          <Typography
            sx={{ display: { xs: "none", md: "block" } }}
            variant="h6"
            component="div"
          >
            Home
          </Typography>
          <HomeIcon sx={{ display: { xs: "block", md: "none" } }} />
        </Link>

        <Link href="/exercises">
          <Typography
            sx={{ display: { xs: "none", md: "block" } }}
            variant="h6"
            component="div"
          >
            Exercises
          </Typography>
          <FitnessCenterIcon sx={{ display: { xs: "block", md: "none" } }} />
        </Link>
        <Link href="/explore">
          <Typography
            sx={{ display: { xs: "none", md: "block" } }}
            variant="h6"
            component="div"
          >
            Explore
          </Typography>
          <ExploreIcon sx={{ display: { xs: "block", md: "none" } }} />
        </Link>
        <Link href="/library">
          <Typography
            sx={{ display: { xs: "none", md: "block" } }}
            variant="h6"
            component="div"
          >
            Library
          </Typography>
          <BackupTableIcon sx={{ display: { xs: "block", md: "none" } }} />
        </Link>
      </Box>
      <Button color="inherit">Login</Button>
    </Box>
  );
}
