import React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import Newspaper from "@mui/icons-material/Newspaper";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1a237e" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Newspaper sx={{ display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            NEWS AGGREGATOR
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
