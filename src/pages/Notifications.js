

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
//   CircularProgress,
//   Chip,
//   Divider,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import axios from "axios";

// /* =========================
//    CONFIG
// ========================= */
// // const BASE_URL = "http://192.168.1.8:8002/api"; // change if needed
// const BASE_URL = "http://122.169.40.118:8002/api";
// const PAGE_SIZE = 100;

// export default function SendNotification() {
//   /* =========================
//      STATES
//   ========================= */
//   const [loading, setLoading] = useState(true);
//   const [allAgents, setAllAgents] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

//   const [searchText, setSearchText] = useState("");
//   const [selectedAgents, setSelectedAgents] = useState([]);
//   const [message, setMessage] = useState("");

//   /* =========================
//      FETCH AGENT MASTER
//   ========================= */
//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("authToken");
//         if (!token) throw new Error("Auth token missing");

//         const res = await axios.get(`${BASE_URL}/agent`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (res.data?.success && Array.isArray(res.data.data)) {
//           setAllAgents(res.data.data);
//         } else {
//           setAllAgents([]);
//         }
//       } catch (err) {
//         console.error("Fetch agents error:", err);
//         setAllAgents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgents();
//   }, []);

//   /* =========================
//      SEARCH (FULL MASTER)
//   ========================= */
//   const filteredAgents = useMemo(() => {
//     const text = searchText.toLowerCase();
//     return allAgents.filter(
//       (a) =>
//         a.AgentName?.toLowerCase().includes(text) ||
//         a.AgentCode?.toString().includes(text)
//     );
//   }, [searchText, allAgents]);

//   /* =========================
//      PAGINATION (UI ONLY)
//   ========================= */
//   const visibleAgents = filteredAgents.slice(0, visibleCount);

//   /* =========================
//      SELECT / UNSELECT SINGLE
//   ========================= */
//   const toggleAgentSelect = (agent) => {
//     setSelectedAgents((prev) => {
//       const exists = prev.find((a) => a._id === agent._id);
//       if (exists) {
//         // ❌ unselect single agent
//         return prev.filter((a) => a._id !== agent._id);
//       }
//       // ✅ select single agent
//       return [...prev, agent];
//     });
//   };

//   const isSelected = (id) =>
//     selectedAgents.some((a) => a._id === id);

//   /* =========================
//      SELECT ALL / UNSELECT ALL
//   ========================= */
//   const handleSelectAllAgents = () => {
//     if (selectedAgents.length === allAgents.length) {
//       // Unselect all
//       setSelectedAgents([]);
//     } else {
//       // Select ALL agents from master
//       setSelectedAgents(allAgents);
//     }
//   };

//   /* =========================
//      SEND MESSAGE
//   ========================= */
//   const handleSendMessage = async () => {
//     if (!message.trim() || selectedAgents.length === 0) {
//       alert("Please select agent(s) and type message");
//       return;
//     }

//     try {
//       const payload = {
//         agentCodes: selectedAgents.map((a) => a.AgentCode),
//         title: "Admin Notification",
//         message: message.trim(),
//       };

//       const res = await fetch(`${BASE_URL}/notifications/send`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         throw new Error(json.message || "Failed to send message");
//       }

//       alert(`✅ Message sent to ${selectedAgents.length} agents`);
//       setMessage("");
//       setSelectedAgents([]);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Something went wrong");
//     }
//   };

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
//       <Typography variant="h5" fontWeight={700} mb={2}>
//         🔔 Send Notification to Agents
//       </Typography>

//       {/* ===== SELECT AGENTS ===== */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Typography fontWeight={600} mb={1}>
//           Select Agents
//         </Typography>

//         {/* SELECT ALL BUTTON */}
//         <Button
//           fullWidth
//           variant="outlined"
//           onClick={handleSelectAllAgents}
//           sx={{ mb: 1 }}
//         >
//           {selectedAgents.length === allAgents.length
//             ? "UNSELECT ALL AGENTS"
//             : "SELECT ALL AGENTS"}
//         </Button>

//         {/* SEARCH */}
//         <TextField
//           fullWidth
//           size="small"
//           placeholder="Search Agent Name or Code"
//           value={searchText}
//           onChange={(e) => {
//             setSearchText(e.target.value);
//             setVisibleCount(PAGE_SIZE);
//           }}
//           sx={{ mb: 1 }}
//         />

//         {/* SELECTED COUNT */}
//         {selectedAgents.length > 0 && (
//           <Chip
//             label={`${selectedAgents.length} agents selected`}
//             color="primary"
//             sx={{ mb: 1 }}
//           />
//         )}

//         {/* AGENT LIST */}
//         {loading ? (
//           <Box sx={{ textAlign: "center", py: 3 }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <List dense sx={{ maxHeight: 260, overflow: "auto" }}>
//             {visibleAgents.map((agent) => (
//               <ListItem
//                 key={agent._id}
//                 button
//                 divider
//                 selected={isSelected(agent._id)}
//                 onClick={() => toggleAgentSelect(agent)}
//               >
//                 <ListItemText
//                   primary={agent.AgentName}
//                   secondary={`Agent Code: ${agent.AgentCode}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         )}

//         {/* LOAD MORE */}
//         {visibleCount < filteredAgents.length && (
//           <Button
//             fullWidth
//             sx={{ mt: 1 }}
//             onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
//           >
//             Load More
//           </Button>
//         )}
//       </Paper>

//       {/* ===== MESSAGE ===== */}
//       <Paper sx={{ p: 2 }}>
//         <Typography fontWeight={600} mb={1}>
//           Message
//         </Typography>

//         <TextField
//           fullWidth
//           multiline
//           minRows={4}
//           placeholder="Type your message here..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           sx={{ mb: 2 }}
//         />

//         <Divider sx={{ mb: 2 }} />

//         <Button
//           fullWidth
//           variant="contained"
//           startIcon={<SendIcon />}
//           disabled={!message.trim() || selectedAgents.length === 0}
//           onClick={handleSendMessage}
//         >
//           Send Message to {selectedAgents.length} Agents
//         </Button>
//       </Paper>
//     </Box>
//   );
// }






































































// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
//   CircularProgress,
//   Chip,
//   Divider,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import axios from "axios";

// /* =========================
//    CONFIG
// ========================= */
// // const BASE_URL = "http://192.168.1.8:8002/api"; // change if needed
// const BASE_URL = "http://122.169.40.118:8002/api";
// const PAGE_SIZE = 100;

// export default function SendNotification() {
//   /* =========================
//      STATES
//   ========================= */
//   const [loading, setLoading] = useState(true);
//   const [allAgents, setAllAgents] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

//   const [searchText, setSearchText] = useState("");
//   const [selectedAgents, setSelectedAgents] = useState([]);
//   const [message, setMessage] = useState("");

//   /* =========================
//      FETCH AGENT MASTER
//   ========================= */
//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("authToken");
//         if (!token) throw new Error("Auth token missing");

//         const res = await axios.get(`${BASE_URL}/agent`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (res.data?.success && Array.isArray(res.data.data)) {
//           setAllAgents(res.data.data);
//         } else {
//           setAllAgents([]);
//         }
//       } catch (err) {
//         console.error("Fetch agents error:", err);
//         setAllAgents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgents();
//   }, []);

//   /* =========================
//      SEARCH (FULL MASTER)
//   ========================= */
//   const filteredAgents = useMemo(() => {
//     const text = searchText.toLowerCase();
//     return allAgents.filter(
//       (a) =>
//         a.AgentName?.toLowerCase().includes(text) ||
//         a.AgentCode?.toString().includes(text)
//     );
//   }, [searchText, allAgents]);

//   /* =========================
//      PAGINATION (UI ONLY)
//   ========================= */
//   const visibleAgents = filteredAgents.slice(0, visibleCount);

//   /* =========================
//      SELECT / UNSELECT SINGLE
//   ========================= */
//   const toggleAgentSelect = (agent) => {
//     setSelectedAgents((prev) => {
//       const exists = prev.find((a) => a._id === agent._id);
//       if (exists) {
//         // ❌ unselect single agent
//         return prev.filter((a) => a._id !== agent._id);
//       }
//       // ✅ select single agent
//       return [...prev, agent];
//     });
//   };

//   const isSelected = (id) =>
//     selectedAgents.some((a) => a._id === id);

//   /* =========================
//      SELECT ALL / UNSELECT ALL
//   ========================= */
//   const handleSelectAllAgents = () => {
//     if (selectedAgents.length === allAgents.length) {
//       // Unselect all
//       setSelectedAgents([]);
//     } else {
//       // Select ALL agents from master
//       setSelectedAgents(allAgents);
//     }
//   };

//   /* =========================
//      SEND MESSAGE
//   ========================= */
//   const handleSendMessage = async () => {
//     if (!message.trim() || selectedAgents.length === 0) {
//       alert("Please select agent(s) and type message");
//       return;
//     }

//     try {
//       const payload = {
//         agentCodes: selectedAgents.map((a) => a.AgentCode),
//         title: "Admin Notification",
//         message: message.trim(),
//       };

//       const res = await fetch(`${BASE_URL}/notifications/send`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         throw new Error(json.message || "Failed to send message");
//       }

//       alert(`✅ Message sent to ${selectedAgents.length} agents`);
//       setMessage("");
//       setSelectedAgents([]);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Something went wrong");
//     }
//   };

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
//       <Typography variant="h5" fontWeight={700} mb={2}>
//         🔔 Send Notification to Agents
//       </Typography>

//       {/* ===== SELECT AGENTS ===== */}
//       <Paper sx={{ p: 2, mb: 2 }}>
//         <Typography fontWeight={600} mb={1}>
//           Select Agents
//         </Typography>

//         {/* SELECT ALL BUTTON */}
//         <Button
//           fullWidth
//           variant="outlined"
//           onClick={handleSelectAllAgents}
//           sx={{ mb: 1 }}
//         >
//           {selectedAgents.length === allAgents.length
//             ? "UNSELECT ALL AGENTS"
//             : "SELECT ALL AGENTS"}
//         </Button>

//         {/* SEARCH */}
//         <TextField
//           fullWidth
//           size="small"
//           placeholder="Search Agent Name or Code"
//           value={searchText}
//           onChange={(e) => {
//             setSearchText(e.target.value);
//             setVisibleCount(PAGE_SIZE);
//           }}
//           sx={{ mb: 1 }}
//         />

//         {/* SELECTED COUNT */}
//         {selectedAgents.length > 0 && (
//           <Chip
//             label={`${selectedAgents.length} agents selected`}
//             color="primary"
//             sx={{ mb: 1 }}
//           />
//         )}

//         {/* AGENT LIST */}
//         {loading ? (
//           <Box sx={{ textAlign: "center", py: 3 }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <List dense sx={{ maxHeight: 260, overflow: "auto" }}>
//             {visibleAgents.map((agent) => (
//               <ListItem
//                 key={agent._id}
//                 button
//                 divider
//                 selected={isSelected(agent._id)}
//                 onClick={() => toggleAgentSelect(agent)}
//               >
//                 <ListItemText
//                   primary={agent.AgentName}
//                   secondary={`Agent Code: ${agent.AgentCode}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         )}

//         {/* LOAD MORE */}
//         {visibleCount < filteredAgents.length && (
//           <Button
//             fullWidth
//             sx={{ mt: 1 }}
//             onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
//           >
//             Load More
//           </Button>
//         )}
//       </Paper>

//       {/* ===== MESSAGE ===== */}
//       <Paper sx={{ p: 2 }}>
//         <Typography fontWeight={600} mb={1}>
//           Message
//         </Typography>

//         <TextField
//           fullWidth
//           multiline
//           minRows={4}
//           placeholder="Type your message here..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           sx={{ mb: 2 }}
//         />

//         <Divider sx={{ mb: 2 }} />

//         <Button
//           fullWidth
//           variant="contained"
//           startIcon={<SendIcon />}
//           disabled={!message.trim() || selectedAgents.length === 0}
//           onClick={handleSendMessage}
//         >
//           Send Message to {selectedAgents.length} Agents
//         </Button>
//       </Paper>
//     </Box>
//   );
// }


























































































































































import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Toolbar,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Tabs,
  Tab,
  Checkbox,
  Badge,
  Paper,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  Tooltip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Added Back Icon
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import BoltIcon from "@mui/icons-material/Bolt";
import DevicesIcon from "@mui/icons-material/Devices";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import axios from "axios";

/* =========================
   CONFIG
========================= */
// const BASE_URL = "http://122.169.40.118:8002/api";
const BASE_URL = process.env.REACT_APP_BASE_URL;
const DRAWER_WIDTH = 360;
const PAGE_SIZE = 50;

const TEMPLATES = [
  { label: "Maintenance", title: "⚠️ System Maintenance", body: "The system will be undergoing scheduled maintenance tonight from 00:00 to 02:00." },
  { label: "New Leads", title: "🚀 New Leads Assigned", body: "You have received new leads. Please check your dashboard immediately." },
  { label: "Policy Update", title: "📄 Policy Update", body: "A new company policy has been uploaded. Please review it in the documents section." },
];

export default function WebAppNotification() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /* =========================
     STATES
  ========================= */
  // UI State
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 = All, 1 = Selected
  
  // Data State
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [allAgents, setAllAgents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Composer State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Feedback State
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "info" });
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* =========================
     DATA FETCHING
  ========================= */
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${BASE_URL}/agent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setAllAgents(res.data.data);
        }
      } catch (err) {
        console.error(err);
        showSnackbar("Could not load agents.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  /* =========================
     LOGIC
  ========================= */
  const filteredAgents = useMemo(() => {
    const text = searchText.toLowerCase();
    return allAgents.filter(
      (a) =>
        (a.AgentName?.toLowerCase() || "").includes(text) ||
        (a.AgentCode?.toString() || "").includes(text)
    );
  }, [searchText, allAgents]);

  const listToRender = tabValue === 0 ? filteredAgents : selectedAgents;
  const visibleAgents = listToRender.slice(0, visibleCount);

  const toggleSelect = (agent) => {
    setSelectedAgents((prev) =>
      prev.some((a) => a._id === agent._id)
        ? prev.filter((a) => a._id !== agent._id)
        : [...prev, agent]
    );
  };

  const handleSend = async () => {
    setConfirmOpen(false);
    setSending(true);
    try {
      const payload = {
        agentCodes: selectedAgents.map((a) => a.AgentCode),
        title: title || "Notification",
        message,
      };
      const res = await fetch(`${BASE_URL}/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      
      showSnackbar(`Sent to ${selectedAgents.length} agents!`, "success");
      setMessage("");
      setTitle("");
      setSelectedAgents([]);
    } catch (err) {
      showSnackbar(err.message || "Failed to send", "error");
    } finally {
      setSending(false);
    }
  };

  const showSnackbar = (msg, severity) => setSnackbar({ open: true, msg, severity });

  // Handle Back Button
  const handleBack = () => {
    // If using React Router, use: navigate(-1)
    // For standard browser history:
    window.history.back();
  };

  /* =========================
     UI SUB-COMPONENTS
  ========================= */
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Drawer Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">Agents Directory</Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {allAgents.length} Total • {selectedAgents.length} Selected
        </Typography>
      </Box>

      {/* Search & Filter */}
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
        />
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)} 
          variant="fullWidth" 
          sx={{ mt: 1, minHeight: 40 }}
          indicatorColor="primary"
        >
          <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="All" sx={{ minHeight: 40, fontSize: '0.8rem' }} />
          <Tab 
            icon={<Badge badgeContent={selectedAgents.length} color="error" variant="dot"><GroupIcon fontSize="small" /></Badge>} 
            iconPosition="start" 
            label="Selected" 
            sx={{ minHeight: 40, fontSize: '0.8rem' }} 
          />
        </Tabs>
      </Box>

      {/* List */}
      <List dense sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
        {visibleAgents.map((agent) => {
            const isChecked = selectedAgents.some(a => a._id === agent._id);
            return (
                <ListItem key={agent._id} disablePadding divider>
                <ListItemButton onClick={() => toggleSelect(agent)} selected={isChecked}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox checked={isChecked} edge="start" size="small" tabIndex={-1} disableRipple />
                    </ListItemIcon>
                    <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: isChecked ? 'primary.light' : 'grey.300' }}>
                            {agent.AgentName?.[0]}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={<Typography variant="body2" fontWeight={500}>{agent.AgentName}</Typography>}
                        secondary={<Typography variant="caption">{agent.AgentCode}</Typography>}
                    />
                </ListItemButton>
                </ListItem>
            );
        })}
        {visibleAgents.length < listToRender.length && (
            <Button fullWidth onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>Load More</Button>
        )}
      </List>
      
      {/* Drawer Footer Actions */}
      <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            fullWidth 
            variant="outlined" 
            size="small" 
            disabled={selectedAgents.length === allAgents.length}
            onClick={() => setSelectedAgents([...allAgents])}
          >
              Select All ({allAgents.length})
          </Button>
      </Box>
    </Box>
  );

  /* =========================
     MAIN RENDER
  ========================= */
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fa" }}>
      <CssBaseline />
      
      {/* APP BAR */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
          borderBottom: '1px solid #e0e0e0'
        }}
        elevation={0}
      >
        <Toolbar>
            {/* Mobile Menu Button */}
            <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ mr: 1, display: { md: "none" } }}
            >
                <MenuIcon />
            </IconButton>

            {/* Back Button */}
            <IconButton 
                color="inherit" 
                edge="start"
                onClick={handleBack}
                sx={{ mr: 2 }}
            >
                <ArrowBackIcon />
            </IconButton>
          
            <NotificationsActiveIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                Notify<span style={{color:'#1976d2'}}>Center</span>
            </Typography>

            <Chip label="Admin" size="small" variant="outlined" />
        </Toolbar>
      </AppBar>

      {/* NAVIGATION DRAWER */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{ maxWidth: 900, width: '100%' }}>
            
            {/* Header Area */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography variant="h5" fontWeight={700}>Compose Notification</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Targeting <b>{selectedAgents.length}</b> recipients
                    </Typography>
                </div>
                <Button 
                    variant="text" 
                    color="secondary" 
                    onClick={() => { setSelectedAgents([]); setMessage(""); setTitle(""); }}
                >
                    Reset Form
                </Button>
            </Box>

            {/* Composer Card */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e0e0e0', mb: 3 }}>
              

                <TextField
                    label="Subject / Title"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{ sx: { borderRadius: 2 } }}
                />

                <TextField
                    label="Message Content"
                    fullWidth
                    multiline
                    minRows={6}
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your alert here..."
                    sx={{ mb: 3 }}
                    InputProps={{ sx: { borderRadius: 2 } }}
                />

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>


                    <Button
                        variant="contained"
                        size="large"
                        startIcon={sending ? null : <SendIcon />}
                        disabled={!message.trim() || selectedAgents.length === 0 || sending}
                        onClick={() => setConfirmOpen(true)}
                        sx={{ px: 4, borderRadius: 2, height: 48 }}
                    >
                        {sending ? "Transmitting..." : "Send Notification"}
                    </Button>
                </Box>
            </Paper>
        </Box>
      </Box>

      {/* MODALS & FEEDBACK */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Transmission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to send this push notification to <b>{selectedAgents.length} devices</b>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleSend} variant="contained" autoFocus>Confirm Send</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}