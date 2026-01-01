// // import React, { useState, useContext } from "react";
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   TextField,
// //   Button,
// //   Typography,
// //   Container,
// //   InputAdornment,
// //   CircularProgress,
// //   Snackbar,
// //   Alert,
// // } from "@mui/material";
// // import LockIcon from "@mui/icons-material/Lock";
// // import PersonIcon from "@mui/icons-material/Person";
// // import { useNavigate } from "react-router-dom";
// // import { AuthContext } from "../context/AuthContext"; // optional but recommended

// // export default function LoginPage() {
// //   const navigate = useNavigate();
// //   const { setAccessToken } = useContext(AuthContext) || {}; // optional
// //   const [creds, setCreds] = useState({ username: "", password: "" });
// //   const [loading, setLoading] = useState(false);
// //   const [snack, setSnack] = useState({
// //     open: false,
// //     message: "",
// //     severity: "error",
// //   });

// //   const showError = (message) => {
// //     setSnack({ open: true, message, severity: "error" });
// //   };

// //   const handleLogin = async () => {
// //     if (!creds.username || !creds.password) {
// //       showError("Please enter username and password");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const resp = await fetch("http://localhost:4000/api/auth/login", {
// //         method: "POST",
// //         credentials: "include", // important — accepts httpOnly refresh cookie
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ username: creds.username, password: creds.password }),
// //       });

// //       const data = await resp.json();
// //       setLoading(false);

// //       if (!resp.ok) {
// //         // server returns structured error messages (e.g., { error: '...' })
// //         const msg = data?.error || "Login failed";
// //         showError(msg);
// //         return;
// //       }

// //       // store access token (short-lived). Prefer in-memory via context for better security.
// //       if (data?.accessToken) {
// //         try {
// //           // if you use AuthContext, set there; otherwise fallback to sessionStorage
// //           if (setAccessToken) {
// //             setAccessToken(data.accessToken);
// //           } else {
// //             sessionStorage.setItem("accessToken", data.accessToken);
// //           }
// //         } catch (e) {
// //           // fallback
// //           sessionStorage.setItem("accessToken", data.accessToken);
// //         }
// //       }

// //       // success — navigate to dashboard
// //       navigate("/dashboard?agentCode=1515");
// //     } catch (err) {
// //       console.error("Login network error:", err);
// //       setLoading(false);
// //       showError("Network error. Please try again.");
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         minHeight: "100vh",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         backgroundImage: "url('/bg.jpg')",
// //         backgroundSize: "cover",
// //         backgroundPosition: "center",
// //         backgroundRepeat: "no-repeat",
// //         p: 2,
// //       }}
// //     >
// //       <Container maxWidth="xs">
// //         <Card
// //           elevation={10}
// //           sx={{
// //             borderRadius: 4,
// //             backgroundColor: "rgba(255,255,255,0.95)",
// //             boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
// //             transition: "transform 0.3s ease, box-shadow 0.3s ease",
// //             "&:hover": {
// //               transform: "scale(1.02)",
// //               boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
// //             },
// //           }}
// //         >
// //           <CardContent sx={{ p: 4 }}>
// //             <Box
// //               sx={{
// //                 display: "flex",
// //                 flexDirection: "column",
// //                 alignItems: "center",
// //                 mb: 3,
// //               }}
// //             >
// //               <Typography
// //                 variant="h4"
// //                 sx={{
// //                   fontWeight: "bold",
// //                   color: "#0b5394",
// //                   letterSpacing: 1,
// //                   textAlign: "center",
// //                 }}
// //               >
// //                 YALGUD DAIRY
// //               </Typography>
// //               <Typography
// //                 variant="subtitle2"
// //                 sx={{
// //                   color: "#555",
// //                   fontWeight: 500,
// //                   textAlign: "center",
// //                 }}
// //               >
// //                 Admin Portal
// //               </Typography>
// //             </Box>

// //             <TextField
// //               label="Username"
// //               variant="outlined"
// //               fullWidth
// //               value={creds.username}
// //               onChange={(e) => setCreds({ ...creds, username: e.target.value })}
// //               sx={{
// //                 mb: 2,
// //                 "& .MuiInputBase-root": { color: "#000" },
// //                 "& .MuiInputLabel-root": { color: "#000" },
// //                 "& .MuiOutlinedInput-root": {
// //                   backgroundColor: "#fff",
// //                   "& fieldset": { borderColor: "#ccc" },
// //                   "&:hover fieldset": { borderColor: "#0b5394" },
// //                   "&.Mui-focused fieldset": { borderColor: "#0b5394" },
// //                 },
// //               }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <PersonIcon sx={{ color: "#0b5394" }} />
// //                   </InputAdornment>
// //                 ),
// //               }}
// //             />

// //             <TextField
// //               label="Password"
// //               type="password"
// //               fullWidth
// //               value={creds.password}
// //               onChange={(e) => setCreds({ ...creds, password: e.target.value })}
// //               sx={{
// //                 mb: 3,
// //                 "& .MuiInputBase-root": { color: "#000" },
// //                 "& .MuiInputLabel-root": { color: "#000" },
// //                 "& .MuiOutlinedInput-root": {
// //                   backgroundColor: "#fff",
// //                   "& fieldset": { borderColor: "#ccc" },
// //                   "&:hover fieldset": { borderColor: "#0b5394" },
// //                   "&.Mui-focused fieldset": { borderColor: "#0b5394" },
// //                 },
// //               }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <LockIcon sx={{ color: "#0b5394" }} />
// //                   </InputAdornment>
// //                 ),
// //               }}
// //             />

// //             <Button
// //               variant="contained"
// //               fullWidth
// //               size="large"
// //               onClick={handleLogin}
// //               disabled={loading}
// //               sx={{
// //                 borderRadius: 3,
// //                 py: 1.3,
// //                 fontWeight: "bold",
// //                 fontSize: "1rem",
// //                 letterSpacing: 0.5,
// //                 background: "linear-gradient(135deg, #0b5394, #1976d2)",
// //                 boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
// //                 transition: "all 0.3s ease",
// //                 "&:hover": {
// //                   transform: "scale(1.03)",
// //                   boxShadow: "0 6px 18px rgba(25,118,210,0.5)",
// //                 },
// //               }}
// //             >
// //               {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Login"}
// //             </Button>
// //           </CardContent>
// //         </Card>

// //         <Snackbar
// //           open={snack.open}
// //           autoHideDuration={3000}
// //           onClose={() => setSnack({ ...snack, open: false })}
// //           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
// //         >
// //           <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} variant="filled">
// //             {snack.message}
// //           </Alert>
// //         </Snackbar>
// //       </Container>
// //     </Box>
// //   );
// // }

// // src/pages/LoginPage.js
// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   InputAdornment,
//   CircularProgress,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import LockIcon from "@mui/icons-material/Lock";
// import PersonIcon from "@mui/icons-material/Person";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function LoginPage() {
//   const navigate = useNavigate();

//   const [creds, setCreds] = useState({
//     username: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [snack, setSnack] = useState({
//     open: false,
//     message: "",
//     severity: "error",
//   });

//   const handleLogin = async () => {
//     if (!creds.username || !creds.password) {
//       setSnack({
//         open: true,
//         message: "Username and password required",
//         severity: "error",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post(
//         "http://122.169.40.118:8002/api/agent/admin/login",
//         {
//           username: creds.username,
//           password: creds.password,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (!res.data?.token) {
//         throw new Error("Invalid server response");
//       }
//       console.log(res.data);

//       // ✅ STORE TOKEN
//       localStorage.setItem("authToken", res.data.token);
//       localStorage.setItem("userRole", "admin");

//       console.log("✅ Admin logged in");
//       console.log("🔐 JWT:", res.data.token);

//       navigate("/dashboard");
//     } catch (err) {
//       setSnack({
//         open: true,
//         message:
//           err.response?.data?.message ||
//           err.message ||
//           "Login failed",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundImage: "url('/bg.jpg')",
//         backgroundSize: "cover",
//         p: 2,
//       }}
//     >
//       <Container maxWidth="xs">
//         <Card elevation={10} sx={{ borderRadius: 4 }}>
//           <CardContent sx={{ p: 4 }}>
//             <Typography
//               variant="h4"
//               fontWeight="bold"
//               textAlign="center"
//               color="#0b5394"
//               mb={1}
//             >
//               YALGUD DAIRY
//             </Typography>

//             <Typography
//               variant="subtitle2"
//               textAlign="center"
//               color="text.secondary"
//               mb={3}
//             >
//               Admin Portal
//             </Typography>

//             <TextField
//               label="Username"
//               fullWidth
//               value={creds.username}
//               onChange={(e) =>
//                 setCreds({ ...creds, username: e.target.value })
//               }
//               sx={{ mb: 2 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <TextField
//               label="Password"
//               type="password"
//               fullWidth
//               value={creds.password}
//               onChange={(e) =>
//                 setCreds({ ...creds, password: e.target.value })
//               }
//               sx={{ mb: 3 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Button
//               fullWidth
//               size="large"
//               variant="contained"
//               onClick={handleLogin}
//               disabled={loading}
//             >
//               {loading ? (
//                 <CircularProgress size={22} sx={{ color: "#fff" }} />
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         <Snackbar
//           open={snack.open}
//           autoHideDuration={3000}
//           onClose={() => setSnack({ ...snack, open: false })}
//         >
//           <Alert severity={snack.severity} variant="filled">
//             {snack.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </Box>
//   );
// }
































































































// // src/pages/LoginPage.js
// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   InputAdornment,
//   CircularProgress,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import LockIcon from "@mui/icons-material/Lock";
// import PersonIcon from "@mui/icons-material/Person";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
// import axios from "axios";

// export default function LoginPage() {
//   const navigate = useNavigate();

//   const [creds, setCreds] = useState({
//     username: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [snack, setSnack] = useState({
//     open: false,
//     message: "",
//     severity: "error",
//   });

//   const handleLogin = async () => {
//     if (!creds.username || !creds.password) {
//       setSnack({
//         open: true,
//         message: "Username and password are required",
//         severity: "error",
//       });
//       return;
//     }

//     setLoading(true);
// try {
//   const res = await axios.post(
//     "http://193.203.161.210:8002/api/agent/admin/login",
//     creds,
//     { headers: { "Content-Type": "application/json" } }
//   );

//   console.log("LOGIN RESPONSE FULL =", res.data);

//   const token =
//     res.data?.token ||
//     res.data?.accessToken ||
//     res.data?.data?.token;

//   if (!token) {
//     throw new Error("JWT token not received from server");
//   }

//   localStorage.setItem("authToken", token);
//   localStorage.setItem("userRole", "admin");

//   navigate("/dashboard");
// } catch (err) {
//   setSnack({
//     open: true,
//     message:
//       err.response?.data?.message ||
//       err.message ||
//       "Login failed",
//     severity: "error",
//   });
// } finally {
//   setLoading(false);
// }
//   };
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundImage: "url('/bg.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         p: 2,
//       }}
//     >
//       <Container maxWidth="xs">
//         <Card elevation={16} sx={{ borderRadius: 4 }}>
//           <CardContent sx={{ p: 4 }}>
//             {/* LOGO + TITLE */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 mb: 3,
//               }}
//             >
//               <Box
//                 component="img"
//                 src={logo}
//                 alt="Yalgud Dairy Logo"
//                 sx={{
//                   width: 55,
//                   height: 55,
//                   objectFit: "contain",
//                 }}
//               />

//               <Box>
//                 <Typography
//                   variant="h5"
//                   fontWeight="bold"
//                   color="#0b5394"
//                   lineHeight={1.2}
//                 >
//                   YALGUD DAIRY
//                 </Typography>

//                 <Typography variant="subtitle2" color="text.secondary">
//                   Admin Portal
//                 </Typography>
//               </Box>
//             </Box>

//             {/* USERNAME */}
//             <TextField
//               label="Username"
//               fullWidth
//               value={creds.username}
//               onChange={(e) => setCreds({ ...creds, username: e.target.value })}
//               sx={{ mb: 2 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* PASSWORD */}
//             <TextField
//               label="Password"
//               type="password"
//               fullWidth
//               value={creds.password}
//               onChange={(e) => setCreds({ ...creds, password: e.target.value })}
//               sx={{ mb: 4 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* CENTERED LOGIN BUTTON */}
//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//               <Button
//                 variant="contained"
//                 size="large"
//                 onClick={handleLogin}
//                 disabled={loading}
//                 sx={{
//                   px: 6,
//                   py: 1.4,
//                   fontWeight: "bold",
//                   borderRadius: 2,
//                   textTransform: "none",
//                   minWidth: 220,
//                 }}
//               >
//                 {loading ? (
//                   <CircularProgress size={22} sx={{ color: "#fff" }} />
//                 ) : (
//                   "Login"
//                 )}
//               </Button>
//             </Box>

//             {/* FOOTER */}
//             <Typography
//               variant="caption"
//               display="block"
//               textAlign="center"
//               color="text.secondary"
//               mt={3}
//             >
//               {/* © {new Date().getFullYear()} Yalgud Dairy */}
//             </Typography>
//           </CardContent>
//         </Card>

//         <Snackbar
//           open={snack.open}
//           autoHideDuration={3000}
//           onClose={() => setSnack({ ...snack, open: false })}
//         >
//           <Alert severity={snack.severity} variant="filled">
//             {snack.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </Box>
//   );
// }











// // src/pages/LoginPage.js
// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   InputAdornment,
//   CircularProgress,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import LockIcon from "@mui/icons-material/Lock";
// import PersonIcon from "@mui/icons-material/Person";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
// import axios from "axios";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   // const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const BASE_URL = process.env.REACT_APP_BASE_URL;


//   const [creds, setCreds] = useState({
//     username: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [snack, setSnack] = useState({
//     open: false,
//     message: "",
//     severity: "error",
//   });

//   const handleLogin = async () => {
//     if (!creds.username || !creds.password) {
//       setSnack({
//         open: true,
//         message: "Username and password are required",
//         severity: "error",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${BASE_URL}/agent/admin/login`,
//         creds,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("LOGIN RESPONSE FULL =", res.data);

//       const token =
//         res.data?.token ||
//         res.data?.accessToken ||
//         res.data?.data?.token;

//       if (!token) {
//         throw new Error("JWT token not received from server");
//       }

//       localStorage.setItem("authToken", token);
//       localStorage.setItem("userRole", "admin");

//       navigate("/dashboard");
//     } catch (err) {
//       setSnack({
//         open: true,
//         message:
//           err.response?.data?.message ||
//           err.message ||
//           "Login failed",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundImage: "url('/bg.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         p: 2,
//       }}
//     >
//       <Container maxWidth="xs">
//         <Card elevation={16} sx={{ borderRadius: 4 }}>
//           <CardContent sx={{ p: 4 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
//               <Box
//                 component="img"
//                 src={logo}
//                 alt="Yalgud Dairy Logo"
//                 sx={{ width: 55, height: 55 }}
//               />
//               <Box>
//                 <Typography variant="h5" fontWeight="bold" color="#0b5394">
//                   YALGUD DAIRY
//                 </Typography>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   Admin Portal
//                 </Typography>
//               </Box>
//             </Box>

//             <TextField
//               label="Username"
//               fullWidth
//               value={creds.username}
//               onChange={(e) =>
//                 setCreds({ ...creds, username: e.target.value })
//               }
//               sx={{ mb: 2 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <TextField
//               label="Password"
//               type="password"
//               fullWidth
//               value={creds.password}
//               onChange={(e) =>
//                 setCreds({ ...creds, password: e.target.value })
//               }
//               sx={{ mb: 4 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockIcon color="primary" />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//               <Button
//                 variant="contained"
//                 size="large"
//                 onClick={handleLogin}
//                 disabled={loading}
//                 sx={{ px: 6, py: 1.4, minWidth: 220 }}
//               >
//                 {loading ? (
//                   <CircularProgress size={22} sx={{ color: "#fff" }} />
//                 ) : (
//                   "Login"
//                 )}
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>

//         <Snackbar
//           open={snack.open}
//           autoHideDuration={3000}
//           onClose={() => setSnack({ ...snack, open: false })}
//         >
//           <Alert severity={snack.severity} variant="filled">
//             {snack.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </Box>
//   );
// }



















































































// src/pages/LoginPage.js
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  // ✅ BASE URL FROM .env
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleLogin = async () => {
    if (!creds.username || !creds.password) {
      setSnack({
        open: true,
        message: "Username and password are required",
        severity: "error",
      });
      return;
    }

    if (!BASE_URL) {
      setSnack({
        open: true,
        message: "BASE_URL is undefined. Check .env file",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ SAME STYLE AS YOUR NODE AXIOS FUNCTION
      const config = {
        method: "post",
        url: `${BASE_URL}/agent/admin/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: creds.username,
          password: creds.password,
        }),
      };

      const response = await axios.request(config);

      console.log("LOGIN RESPONSE FULL =", response.data);

      const token = response.data?.token;

      if (!token) {
        throw new Error("JWT token not received from server");
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", "admin");

      // ✅ GO TO DASHBOARD
      navigate("/dashboard");
    } catch (error) {
      setSnack({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Login failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card elevation={16} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box component="img" src={logo} sx={{ width: 55, height: 55 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#0b5394">
                  YALGUD DAIRY
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Admin Portal
                </Typography>
              </Box>
            </Box>

            <TextField
              label="Username"
              fullWidth
              value={creds.username}
              onChange={(e) =>
                setCreds({ ...creds, username: e.target.value })
              }
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={creds.password}
              onChange={(e) =>
                setCreds({ ...creds, password: e.target.value })
              }
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={loading}
                sx={{ px: 6, py: 1.4, minWidth: 220 }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.severity} variant="filled">
            {snack.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
