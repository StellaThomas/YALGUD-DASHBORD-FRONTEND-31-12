

// src/pages/OrdersPage.js
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

/* 🔐 JWT TOKEN (AS IS) */
const token = localStorage.getItem("authToken");

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const orderIdFromQuery = query.get("orderId");
  const statusFromQuery = query.get("status");
  const agentCodeFromQuery = query.get("agentCode");

  const [orders, setOrders] = useState([]);
  const [orderMeta, setOrderMeta] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(
    orderIdFromQuery || null
  );
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  // const BASE_URL = "http://122.169.40.118:8002/api";
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  /* ===================== HELPERS (UNCHANGED) ===================== */
  const makeStableUid = (orderId, idx, item) =>
    `${orderId ?? "noorder"}_${item.itemCode ?? idx}_${idx}`;

  const computeTotalFromItems = (itemInfo) =>
    Array.isArray(itemInfo)
      ? itemInfo.reduce((s, it) => s + Number(it.totalPrice ?? 0), 0)
      : 0;

  const formatDateTime = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return isNaN(dt) ? "" : dt.toLocaleString("en-IN", { hour12: false });
  };

  /* ===================== selectOrder (UNCHANGED) ===================== */
  const selectOrder = (orderObj) => {
    if (!orderObj) return;

    const mappedItems = (orderObj.itemInfo || []).map((item, idx) => {
      const qty = Number(item.quantity ?? 0);
      const price = Number(item.price ?? 0);
      const accepted = item.acceptedQuantity ?? qty;

      return {
        _uid: makeStableUid(orderObj._id, idx, item),
        itemCode: item.itemCode ?? "",
        itemName: item.itemName ?? "",
        quantity: qty,
        price,
        acceptedQuantity: String(accepted),
        status: item.status ?? "Pending",
        totalPrice: price * accepted,
      };
    });

    setOrderMeta(orderObj);
    setOrders(mappedItems);
    setSelectedOrderId(orderObj._id);
  };

  /* ===================== FETCH LIST (JWT AS IS) ===================== */
  const fetchOrdersByStatus = async (status = "Pending") => {
    try {
      setLoading(true);
      let endpoint = `${BASE_URL}/orders/status-details/${status}`;
      if (agentCodeFromQuery) {
        endpoint = `${BASE_URL}/orders/agent/${agentCodeFromQuery}/status/Pending`;
      }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = res.data?.data ?? [];
      setOrderList(list);

      if (!list.length || orderIdFromQuery) return;
      selectOrder(list[0]);
    } catch {
      setSnack({
        open: true,
        message: "Failed to fetch orders",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      selectOrder(res.data?.data ?? res.data);
    } catch {
      setSnack({
        open: true,
        message: "Failed to fetch order",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdFromQuery) {
      fetchOrderById(orderIdFromQuery);
      fetchOrdersByStatus(statusFromQuery || "Pending");
    } else {
      fetchOrdersByStatus(statusFromQuery || "Pending");
    }
    // eslint-disable-next-line
  }, [orderIdFromQuery, statusFromQuery, agentCodeFromQuery]);

  /* ===================== ACCEPT ORDER (UNCHANGED) ===================== */
  const handleAcceptOrder = async () => {
    if (!selectedOrderId) return;

    await fetch(`${BASE_URL}/orders/${selectedOrderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId: selectedOrderId,
        items: orders.map((it) => ({
          itemCode: it.itemCode,
          acceptedQuantity: Number(it.acceptedQuantity),
          price: it.price,
          status: it.status,
        })),
        status: "Accepted",
      }),
    });

    setConfirmOpen(true);
  };

  /* ============================================================
     🔴 ONLY MISSING PART WAS HERE – NOW ADDED
  ============================================================ */

  const columns = useMemo(
    () => [
      { header: "Item Code", accessorKey: "itemCode" },
      { header: "Item Name", accessorKey: "itemName" },
      { header: "Required Qty", accessorKey: "quantity" },
      {
        header: "Accepted Qty",
        accessorKey: "acceptedQuantity",
        cell: ({ row }) => (
          <TextField
            size="small"
            value={row.original.acceptedQuantity}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              setOrders((prev) =>
                prev.map((p) =>
                  p._uid === row.original._uid
                    ? { ...p, acceptedQuantity: v, totalPrice: v * p.price }
                    : p
                )
              );
            }}
            sx={{ width: 80 }}
          />
        ),
      },
      { header: "Rate", accessorKey: "price" },
      { header: "Total", accessorKey: "totalPrice" },
    ],
    []
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const grandTotal = computeTotalFromItems(orders);
  const handleDialogOk = () => {
    setConfirmOpen(false);
    navigate("/dashboard");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "white",
          color: "#0b5394",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <IconButton
            edge="start"
            onClick={() => navigate(-1)}
            aria-label="back"
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon sx={{ color: "#0b5394" }} />
          </IconButton>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ height: { xs: 40, sm: 64, md: 80 }, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#0b5394",
                fontWeight: "bold",
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
              }}
            >
              श्री हनुमान सहकारी दूध व्यावसायिक व कृषिपुरक सेवा संस्था मर्यादित,
              यळगुड. जि. कोल्हापुर
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#0b5394",
                fontSize: { xs: "0.65rem", sm: "0.8rem" },
              }}
            >
              Tal: Hatkangale, Dist. Kolhapur (Maharastra-27) 416236 (FSSC 22000
              Certified Society)
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Left: order list */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ p: 1, height: "100%" }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Pending Orders
              </Typography>
              <Divider />
              <List dense sx={{ maxHeight: "70vh", overflowY: "auto" }}>
                {orderList.map((o) => (
                  <ListItem key={o._id} disablePadding>
                    <ListItemButton
                      selected={String(o._id) === String(selectedOrderId)}
                      onClick={() => {
                        console.log("📌 User clicked order:", o._id);
                        setSelectedOrderId(o._id);
                        console.log(
                          "🔄 Fetching full details for selected order"
                        );
                        fetchOrderById(o._id);
                      }}
                    >
                      <ListItemText
                        primary={`Order: ${o._id}`}
                        secondary={
                          <span>
                            Agent: {o.agentDetails?.AgentName || "N/A"} • Total:
                            ₹
                            {(
                              o.TotalOrder ??
                              o.totalPrice ??
                              computeTotalFromItems(o.itemInfo || [])
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Right: details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, p: { xs: 1, sm: 2 } }}>
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #0b5394 0%, #1e88e5 100%)",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <Typography
                  sx={{ color: "white", fontWeight: 700, textAlign: "center" }}
                >
                  📋 Details of Receiver (Billed To & Shipped To)
                </Typography>
              </Box>

              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        p: 1.5,
                        background: "#fafbfc",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#0b5394",
                          fontSize: "0.9rem",
                        }}
                      >
                        🧑 Agent Details
                      </Typography>

                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Agent Code
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        {orderMeta?.agentCode || "N/A"}
                      </Typography>

                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Agent Name
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        {orderMeta?.agentDetails?.AgentName || "N/A"}
                      </Typography>

                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Mobile
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        {orderMeta?.agentDetails?.Mobile || "N/A"}
                      </Typography>
{/* 
                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Address
                      </Typography> */}
                      {/* <Typography sx={{ fontSize: "0.95rem" }}>{orderMeta?.agentDetails?.Address || "N/A"}</Typography> */}
                      {/* <Typography>
                        Address:{" "}
                        {orderMeta?.agentDetails?.Address ||
                          orderMeta?.Address ||
                          orderMeta?.address ||
                          "N/A"}
                      </Typography> */}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        p: 1.5,
                        background: "#fafbfc",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#0b5394",
                          fontSize: "0.9rem",
                        }}
                      >
                        🛣️ Route & Supervisor
                      </Typography>

                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Route Code
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        {orderMeta?.route || "N/A"}
                      </Typography>

                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Route Name
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        {orderMeta?.routeDetails?.RouteName || "N/A"}
                      </Typography>
{/* 
                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Vehicle No
                      </Typography> */}
                      {/* <Typography sx={{ fontSize: "0.95rem" }}>
                        {orderMeta?.routeDetails?.VehicleNo || "N/A"}
                      </Typography> */}
                      {/* <Typography>
                        Vehicle No:{" "}
                        {orderMeta?.routeDetails?.VehicleNo ||
                          orderMeta?.VehicleNo ||
                          orderMeta?.vehicleNo ||
                          "N/A"}
                      </Typography> */}

                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Supervisor
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        {orderMeta?.supervisorDetails?.SupervisorName || "N/A"}
                      </Typography>

                      <Typography
                        sx={{ fontWeight: 600, mt: 1, fontSize: "0.85rem" }}
                      >
                        Supervisor Phone
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        {orderMeta?.supervisorDetails?.PhoneNo || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Typography
                variant="h6"
                sx={{ color: "#0b5394", fontWeight: "bold", mb: 1 }}
              >
                Order Items
              </Typography>

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                          <TableCell
                            key={header.id}
                            sx={{ fontWeight: "bold", background: "#f5f5f5" }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>

                  <TableBody>
                    {table.getRowModel().rows.map((row, rowIdx) => (
                      <TableRow key={`${row.original._uid}-${rowIdx}`}>
                        {row.getVisibleCells().map((cell, cellIdx) => (
                          <TableCell
                            key={`${row.original._uid}-cell-${cellIdx}`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell ??
                                cell.column.columnDef.accessorKey,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                    <TableRow key="grand-total-row">
                      {table.getHeaderGroups()[0].headers.map((header, idx) => (
                        <TableCell key={idx}>
                          {header.column.columnDef.accessorKey ===
                          "totalPrice" ? (
                            <Typography
                              sx={{ fontWeight: "bold", color: "#0b5394" }}
                            >
                              ₹{" "}
                              {grandTotal.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </Typography>
                          ) : idx === 0 ? (
                            <Typography sx={{ fontWeight: "bold" }}>
                              Grand Total:
                            </Typography>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2">
                    Order ID: {orderMeta?._id ?? "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    Created: {formatDateTime(orderMeta?.createdAt)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAcceptOrder}
                  sx={{
                    background:
                      "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                    fontWeight: 600,
                    px: 3,
                  }}
                >
                  ✅ Accept Order
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box
          sx={{
            background: "linear-gradient(90deg,#4caf50,#2e7d32)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
            py: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 40 }} />
          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
            Your order is successfully accepted
          </Typography>
        </Box>

        <DialogContent sx={{ pt: 3, pb: 2 }} />

        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={handleDialogOk}
            variant="contained"
            autoFocus
            sx={{
              background: "linear-gradient(90deg,#4caf50,#2e7d32)",
              color: "white",
              px: 4,
              py: 1,
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{
            fontSize: "1rem",
            fontWeight: "700",
            padding: "10px 18px",
            borderRadius: "10px",
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
