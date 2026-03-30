import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Breadcrumbs,
} from "@mui/material";

const drawerWidth = 260;

export default function MainLayout() {
  const location = useLocation();

  const navItems = [
    { label: "Leaderboards", path: "/" },
    { label: "Raffles", path: "/raffles" },
    { label: "Wheels", path: "/wheels" },
  ];

  // breadcrumbs path
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getLabel = (segment: string) => {
    const item = navItems.find((n) => n.path.replace("/", "") === segment);
    return item ? item.label : segment;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: "100vh", // full height
            boxSizing: "border-box",
            borderRight: "none",
            boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
          },
        }}
        open
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            OnAim Task
          </Typography>

          <List>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "#06ed6e",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Admin Panel
            </Typography>

            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}
            >
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Home
              </Link>

              {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                  <Typography key={to} color="white">
                    {getLabel(value)}
                  </Typography>
                ) : (
                  <Link
                    key={to}
                    to={to}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {getLabel(value)}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Toolbar>
        </AppBar>

        {/* main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            backgroundColor: "#f4f6f8",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
