// import React, { useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   LinearProgress,
//   Snackbar,
//   Alert,
//   Divider,
// } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import axios from "axios";
// import Papa from "papaparse";

// // IMPORTANT: no /api here
// const BASE_URL =
//   process.env.REACT_APP_API_BASE || "http://122.169.40.118:8002";

// export default function UploadInvoicePage() {
//   const [file, setFile] = useState(null);
//   const [previewRows, setPreviewRows] = useState([]);
//   const [parsing, setParsing] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [reportBlobUrl, setReportBlobUrl] = useState(null);
//   const [snack, setSnack] = useState({
//     open: false,
//     severity: "info",
//     message: "",
//   });
//   const [selected, setSelected] = useState([]); // store indices of selected rows

//   const onFileChange = (e) => {
//     const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
//     setFile(f);
//     setReportBlobUrl(null);
//     setPreviewRows([]);
//     setSelected([]);
//     if (!f) return;

//     setParsing(true);
//     Papa.parse(f, {
//       header: true,
//       skipEmptyLines: true,
//       complete: function (results) {
//         const rows = Array.isArray(results.data) ? results.data : [];
//         setPreviewRows(rows.slice(0, 50)); // show first 50 rows
//         setParsing(false);
//       },
//       error: function (err) {
//         console.error("Parse error", err);
//         setSnack({
//           open: true,
//           severity: "error",
//           message: "Failed to parse CSV",
//         });
//         setParsing(false);
//       },
//     });
//   };

//   const onUpload = async () => {
//     if (!file) {
//       setSnack({
//         open: true,
//         severity: "warning",
//         message: "Please choose a CSV file first",
//       });
//       return;
//     }

//     setUploading(true);
//     setSnack({ open: true, severity: "info", message: "Uploading..." });

//     try {
//       const form = new FormData();
//       form.append("billsCsv", file); // MUST match upload.single('billsCsv') in backend

//       // FINAL URL: http://122.169.40.118:8002/api/erp/upload-bills
//       const res = await axios.post(`${BASE_URL}/api/erp/upload-bills`, form, {
//         headers: { "Content-Type": "multipart/form-data" },
//         timeout: 120000,
//       });

//       if (res.data && res.data.ok) {
//         setSnack({
//           open: true,
//           severity: "success",
//           message: "Uploaded and processed by server",
//         });

//         const updated = res.data.updated || [];
//         if (updated.length) {
//           const csvHeader = "Invoice number,Status\n";
//           const csvBody = updated
//             .map((u) => `${u.invoice},${u.status}`)
//             .join("\n");
//           const blob = new Blob([csvHeader + csvBody], { type: "text/csv" });
//           const url = URL.createObjectURL(blob);
//           setReportBlobUrl(url);
//         }
//       } else {
//         const msg =
//           (res.data && res.data.error) ||
//           "Server returned an unexpected response";
//         setSnack({ open: true, severity: "error", message: msg });
//       }
//     } catch (err) {
//       console.error("Upload error", err);
//       const status = err?.response?.status;
//       const serverMsg =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         err.message ||
//         "Upload failed";
//       setSnack({
//         open: true,
//         severity: "error",
//         message: `Upload failed: ${serverMsg} ${
//           status ? `(status: ${status})` : ""
//         }`,
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const downloadSample = () => {
//     const sample =
//       "Invoice number,Invoice total amount,Agent Code,ERPInvoiceNumber,Status\nINV-123,1000,AG001,ERP-9876,Billed\n";
//     const blob = new Blob([sample], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "sample_billed_csv.csv";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   // Row selection by clicking (no checkboxes)
//   const handleToggleRow = (idx) => {
//     setSelected((prev) => {
//       if (prev.includes(idx)) return prev.filter((i) => i !== idx);
//       return [...prev, idx];
//     });
//   };

//   // Send message for selected rows (placeholder)
//   const handleSendMessage = () => {
//     if (selected.length === 0) {
//       setSnack({
//         open: true,
//         severity: "warning",
//         message: "No rows selected",
//       });
//       return;
//     }

//     const selectedRows = selected.map((i) => previewRows[i]);
//     // TODO: replace below with actual send logic (API call)
//     alert(
//       `Sending message for ${selected.length} row(s):\n` +
//         selected.map((i) => `Row ${i + 1}`).join(", ")
//     );
//     console.log("Selected rows payload:", selectedRows);

//     setSnack({
//       open: true,
//       severity: "success",
//       message: `Message sent for ${selected.length} row(s)`,
//     });
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Paper sx={{ p: 3 }} elevation={4}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography variant="h6">Upload ERP Billed CSV</Typography>
//           <Box>
//             <Button
//               startIcon={<GetAppIcon />}
//               onClick={downloadSample}
//               sx={{ mr: 1 }}
//             >
//               Download Sample
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={<CloudUploadIcon />}
//               onClick={() => document.getElementById("billsFileInput").click()}
//             >
//               Choose File
//             </Button>
//             <input
//               id="billsFileInput"
//               type="file"
//               accept=".csv,text/csv"
//               style={{ display: "none" }}
//               onChange={onFileChange}
//             />
//           </Box>
//         </Box>

//         <Divider sx={{ mb: 2 }} />

//         {parsing && (
//           <Box sx={{ width: "100%", mb: 2 }}>
//             <LinearProgress />
//           </Box>
//         )}

//         <Box sx={{ mb: 2 }}>
//           <Typography variant="body2">
//             Selected file: {file ? file.name : "None"}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Preview (first 50 rows):
//           </Typography>
//         </Box>

//         <Paper variant="outlined" sx={{ mb: 2 }}>
//           <TableContainer sx={{ maxHeight: 320 }}>
//             <Table size="small" stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   {previewRows.length > 0 ? (
//                     <>
//                       {Object.keys(previewRows[0])
//                         .slice(0, 6)
//                         .map((h) => (
//                           <TableCell key={h} sx={{ fontWeight: "bold" }}>
//                             {h}
//                           </TableCell>
//                         ))}
//                     </>
//                   ) : (
//                     <TableCell sx={{ fontStyle: "italic" }}>
//                       No preview available
//                     </TableCell>
//                   )}
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {previewRows.map((r, idx) => {
//                   const isSelected = selected.includes(idx);
//                   return (
//                     <TableRow
//                       key={idx}
//                       hover
//                       selected={isSelected}
//                       onClick={() => handleToggleRow(idx)}
//                       sx={{
//                         cursor: "pointer",
//                         userSelect: "none",
//                       }}
//                     >
//                       {Object.values(r)
//                         .slice(0, 6)
//                         .map((v, cidx) => (
//                           <TableCell
//                             key={cidx}
//                             sx={{
//                               maxWidth: 220,
//                               whiteSpace: "nowrap",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                             }}
//                           >
//                             {String(v)}
//                           </TableCell>
//                         ))}
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>

//         {/* Controls: Upload + Download report + Send Message (separate button) */}
//         <Box
//           sx={{
//             display: "flex",
//             gap: 2,
//             alignItems: "center",
//             flexWrap: "wrap",
//           }}
//         >
//           <Button
//             variant="contained"
//             disabled={uploading}
//             onClick={onUpload}
//             startIcon={<CloudUploadIcon />}
//           >
//             {uploading ? "Uploading..." : "Upload to Server"}
//           </Button>

//           {reportBlobUrl && (
//             <Button
//               startIcon={<GetAppIcon />}
//               onClick={() => {
//                 window.open(reportBlobUrl, "_blank");
//               }}
//             >
//               Download Report
//             </Button>
//           )}

//           <Button
//             variant="contained"
//             onClick={handleSendMessage}
//             disabled={selected.length === 0}
//             sx={{
//               ml: 2,
//               width: 200,
//               backgroundColor: selected.length === 0 ? "#b8f5b8" : "#32CD32", // Parrot green
//               color: "#fff",
//               fontWeight: "bold",
//               textTransform: "none",
//               boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
//               "&:hover": {
//                 backgroundColor: selected.length === 0 ? "#b8f5b8" : "#2ebe2e",
//               },
//               "&.Mui-disabled": {
//                 backgroundColor: "#5bd85bff",
//                 color: "#ffffff",
//                 opacity: 1,
//               },
//             }}
//           >
//             Send WhatsApp
//           </Button>

//           {uploading && (
//             <Typography variant="body2">
//               Please wait, processing on server...
//             </Typography>
//           )}
//         </Box>
//       </Paper>

//       <Snackbar
//         open={snack.open}
//         autoHideDuration={4000}
//         onClose={() => setSnack({ ...snack, open: false })}
//       >
//         <Alert severity={snack.severity}>{snack.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }

// src/pages/UploadInvoicePage.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import axios from "axios";
import Papa from "papaparse";

/**
 * BASE URL logic:
 * - If REACT_APP_API_BASE provided (recommended for prod), use it.
 * - If running locally (hostname is localhost / 127.0.0.1) use http://localhost:8002
 * - Else fallback to the external IP that you previously used.
 */
const envBase = process.env.REACT_APP_API_BASE;
const host = window?.location?.hostname || "localhost";
const isLocal = host === "localhost" || host === "127.0.0.1";
// const DEFAULT_EXTERNAL = "http://193.203.161.210:8002";

export const BASE_URL = process.env.REACT_APP_API_BASE;

if (!BASE_URL) {
  throw new Error("REACT_APP_API_BASE is missing in .env file");
}


export default function UploadInvoicePage() {
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reportBlobUrl, setReportBlobUrl] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    severity: "info",
    message: "",
  });
  const [selected, setSelected] = useState([]);

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFile(f);
    setReportBlobUrl(null);
    setPreviewRows([]);
    setSelected([]);
    if (!f) return;

    setParsing(true);
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const rows = Array.isArray(results.data) ? results.data : [];
        setPreviewRows(rows.slice(0, 50));
        setParsing(false);
      },
      error(err) {
        console.error("Parse error", err);
        setSnack({
          open: true,
          severity: "error",
          message: "Failed to parse CSV",
        });
        setParsing(false);
      },
    });
  };

  const onUpload = async () => {
    if (!file) {
      setSnack({
        open: true,
        severity: "warning",
        message: "Please choose a CSV file first",
      });
      return;
    }

    setUploading(true);
    setSnack({ open: true, severity: "info", message: "Uploading..." });

    try {
      const form = new FormData();
      form.append("billsCsv", file); // must match backend upload.single('billsCsv')

      const url = `${BASE_URL}/api/erp/upload-bills`;

      const res = await axios.post(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      if (res.data && res.data.ok) {
        setSnack({
          open: true,
          severity: "success",
          message: "Uploaded and processed by server",
        });

        const updated = res.data.updated || [];
        if (updated.length) {
          const csvHeader = "Invoice number,Status\n";
          const csvBody = updated
            .map((u) => `${u.invoice},${u.status}`)
            .join("\n");
          const blob = new Blob([csvHeader + csvBody], { type: "text/csv" });
          const urlBlob = URL.createObjectURL(blob);
          setReportBlobUrl(urlBlob);
        }
      } else {
        const msg =
          (res.data && (res.data.error || res.data.message)) ||
          "Server returned unexpected response";
        setSnack({ open: true, severity: "error", message: msg });
      }
    } catch (err) {
      console.error("Upload error", err);
      // Try to extract server response text if present
      const status = err?.response?.status;
      let serverMsg = "Upload failed";
      if (err?.response?.data) {
        // server may return HTML; attempt to get text or error message
        if (typeof err.response.data === "string") {
          // show short snippet of HTML/text
          serverMsg = err.response.data.replace(/\s+/g, " ").slice(0, 300);
        } else if (err.response.data.error) {
          serverMsg = err.response.data.error;
        } else if (err.response.data.message) {
          serverMsg = err.response.data.message;
        } else {
          serverMsg = JSON.stringify(err.response.data).slice(0, 300);
        }
      } else {
        serverMsg = err.message;
      }
      setSnack({
        open: true,
        severity: "error",
        message: `Upload failed: ${serverMsg}${
          status ? ` (status ${status})` : ""
        }`,
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadSample = () => {
    const sample =
      "Invoice number,Invoice total amount,Agent Code,ERPInvoiceNumber,Status\nINV-123,1000,AG001,ERP-9876,Billed\n";
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_billed_csv.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleToggleRow = (idx) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSendMessage = () => {
    if (selected.length === 0) {
      setSnack({
        open: true,
        severity: "warning",
        message: "No rows selected",
      });
      return;
    }
    const selectedRows = selected.map((i) => previewRows[i]);
    console.log("Selected rows payload:", selectedRows);
    setSnack({
      open: true,
      severity: "success",
      message: `Message sent for ${selected.length} row(s)`,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }} elevation={4}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Upload ERP Billed CSV</Typography>
          <Box>
            <Button
              startIcon={<GetAppIcon />}
              onClick={downloadSample}
              sx={{ mr: 1 }}
            >
              Download Sample
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => document.getElementById("billsFileInput").click()}
            >
              Choose File
            </Button>
            <input
              id="billsFileInput"
              type="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {parsing && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            Selected file: {file ? file.name : "None"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preview (first 50 rows):
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ mb: 2 }}>
          <TableContainer sx={{ maxHeight: 320 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {previewRows.length > 0 ? (
                    Object.keys(previewRows[0])
                      .slice(0, 6)
                      .map((h) => (
                        <TableCell key={h} sx={{ fontWeight: "bold" }}>
                          {h}
                        </TableCell>
                      ))
                  ) : (
                    <TableCell sx={{ fontStyle: "italic" }}>
                      No preview available
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {previewRows.map((r, idx) => {
                  const isSelected = selected.includes(idx);
                  return (
                    <TableRow
                      key={idx}
                      hover
                      selected={isSelected}
                      onClick={() => handleToggleRow(idx)}
                      sx={{ cursor: "pointer", userSelect: "none" }}
                    >
                      {Object.values(r)
                        .slice(0, 6)
                        .map((v, cidx) => (
                          <TableCell
                            key={cidx}
                            sx={{
                              maxWidth: 220,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {String(v)}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            disabled={uploading}
            onClick={onUpload}
            startIcon={<CloudUploadIcon />}
          >
            {uploading ? "Uploading..." : "Upload to Server"}
          </Button>

          {reportBlobUrl && (
            <Button
              startIcon={<GetAppIcon />}
              onClick={() => window.open(reportBlobUrl, "_blank")}
            >
              Download Report
            </Button>
          )}

          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={selected.length === 0}
            sx={{
              ml: 2,
              width: 200,
              backgroundColor: selected.length === 0 ? "#b8f5b8" : "#32CD32",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: selected.length === 0 ? "#b8f5b8" : "#2ebe2e",
              },
              "&.Mui-disabled": {
                backgroundColor: "#5bd85bff",
                color: "#ffffff",
                opacity: 1,
              },
            }}
          >
            Send WhatsApp
          </Button>

          {uploading && (
            <Typography variant="body2">
              Please wait, processing on server...
            </Typography>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
