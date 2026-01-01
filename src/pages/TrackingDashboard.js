// import { useState } from "react";
// import RouteMap from "../Components/RouteMap";

// export default function TrackingDashboard() {
//   const [routeCode, setRouteCode] = useState("");
//   const [date, setDate] = useState("");
//   const [trip, setTrip] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchRoute = async () => {
//     if (!routeCode || !date) {
//       setError("Please select route code and date");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setTrip(null);

//     try {
//       // ✅ READ JWT TOKEN
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("JWT token missing. Please login again.");
//         return;
//       }

//       const res = await fetch(
//         `http://122.169.40.118:8002/api/tracking/route-wise?SalesRouteCode=${routeCode}&TripDate=${date}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`Server error ${res.status}`);
//       }

//       const json = await res.json();

//       // 🔴 NO DATA
//       if (!Array.isArray(json.data) || json.data.length === 0) {
//         setError("No tracking data found for this route and date");
//         return;
//       }

//       // ✅ FILTER ONLY VALID TRIPS (Path length >= 2)
//       const validTrips = json.data.filter(
//         (t) => Array.isArray(t.Path) && t.Path.length >= 2
//       );

//       if (validTrips.length === 0) {
//         setError("Tracking started but not enough GPS points yet");
//         return;
//       }

//       // ✅ PICK LATEST TRIP
//       const selectedTrip = validTrips.sort(
//         (a, b) => (b.StartTime || 0) - (a.StartTime || 0)
//       )[0];

//       setTrip(selectedTrip);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load tracking data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* LEFT PANEL */}
//       <div
//         style={{
//           width: 320,
//           padding: 16,
//           borderRight: "1px solid #ddd",
//           background: "#fafafa",
//         }}
//       >
//         <h3>Tracking Dashboard</h3>

//         <label>Sales Route Code</label>
//         <input
//           type="text"
//           value={routeCode}
//           onChange={(e) => {
//             setRouteCode(e.target.value);
//             setError("");
//           }}
//           style={{ width: "100%", marginBottom: 10 }}
//         />

//         <label>Date</label>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => {
//             setDate(e.target.value);
//             setError("");
//           }}
//           style={{ width: "100%", marginBottom: 10 }}
//         />

//         <button
//           onClick={fetchRoute}
//           disabled={loading}
//           style={{ width: "100%", padding: 8 }}
//         >
//           {loading ? "Loading..." : "View Route"}
//         </button>

//         {error && <p style={{ color: "red" }}>{error}</p>}

//         {trip && (
//           <div style={{ marginTop: 20 }}>
//             <p><b>Status:</b> {trip.TripStatus}</p>
//             <p><b>Supervisor:</b> {trip.SupervisorCode}</p>
//             <p>
//               <b>Start:</b>{" "}
//               {trip.StartTime
//                 ? new Date(trip.StartTime * 1000).toLocaleTimeString()
//                 : "-"}
//             </p>
//             <p><b>Events:</b> {trip.Path.length}</p>
//           </div>
//         )}
//       </div>

//       {/* MAP PANEL */}
//       <div style={{ flex: 1, height: "100vh" }}>
//         {trip && <RouteMap trip={trip} />}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import RouteMap from "../Components/RouteMap";

export default function TrackingDashboard() {
  const [routeCode, setRouteCode] = useState("");
  const [date, setDate] = useState("");
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRoute = async () => {
    if (!routeCode || !date) {
      setError("Please select route code and date");
      return;
    }

    setLoading(true);
    setError("");
    setTrip(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("JWT token missing. Please login again.");
        return;
      }

      const BASE_URL = process.env.REACT_APP_API_BASE;

      if (!BASE_URL) {
        throw new Error("REACT_APP_API_BASE is missing in .env");
      }

      const res = await fetch(
        `${BASE_URL}/api/tracking/route-wise?SalesRouteCode=${routeCode}&TripDate=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      const json = await res.json();

      if (!Array.isArray(json.data) || json.data.length === 0) {
        setError("No tracking data found");
        return;
      }

      const validTrips = json.data.filter(
        (t) => Array.isArray(t.Path) && t.Path.length >= 2
      );

      if (!validTrips.length) {
        setError("Tracking started but not enough GPS points yet");
        return;
      }

      const selectedTrip = validTrips.sort(
        (a, b) => (b.StartTime || 0) - (a.StartTime || 0)
      )[0];

      setTrip(selectedTrip);
    } catch {
      setError("Failed to load tracking data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* LEFT PANEL */}
      <div style={styles.sidebar}>
        <h2 style={styles.title}>📍 Route Tracking</h2>

        <div style={styles.card}>
          <label style={styles.label}>Sales Route Code</label>
          <input
            type="text"
            value={routeCode}
            onChange={(e) => {
              setRouteCode(e.target.value);
              setError("");
            }}
            style={styles.input}
            placeholder="Enter route code"
          />

          <label style={styles.label}>Trip Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setError("");
            }}
            style={styles.input}
          />

          <button
            onClick={fetchRoute}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading Route..." : "View Route"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </div>

        {trip && (
          <div style={styles.infoCard}>
            <h4 style={{ marginBottom: 10 }}>📊 Trip Details</h4>

            <InfoRow label="Status" value={trip.TripStatus} />
            <InfoRow label="Supervisor" value={trip.SupervisorCode} />
            <InfoRow
              label="Start Time"
              value={
                trip.StartTime
                  ? new Date(trip.StartTime * 1000).toLocaleTimeString()
                  : "-"
              }
            />
            <InfoRow label="GPS Points" value={trip.Path.length} />
          </div>
        )}
      </div>

      {/* MAP PANEL */}
      <div style={styles.mapPanel}>
        {trip ? (
          <RouteMap trip={trip} />
        ) : (
          <div style={styles.mapPlaceholder}>
            Select route & date to view map
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================
   SMALL REUSABLE COMPONENT
================================ */
function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={{ color: "#666" }}>{label}</span>
      <b>{value}</b>
    </div>
  );
}

/* ================================
   STYLES
================================ */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f4f6f8",
  },
  sidebar: {
    width: 340,
    padding: 20,
    background: "#ffffff",
    borderRight: "1px solid #ddd",
    boxSizing: "border-box",
  },
  title: {
    marginBottom: 20,
    color: "#1a73e8",
  },
  card: {
    background: "#fafafa",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
    display: "block",
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: 10,
    color: "red",
    fontSize: 13,
  },
  infoCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    background: "#f0f7ff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  mapPanel: {
    flex: 1,
    position: "relative",
  },
  mapPlaceholder: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontSize: 18,
  },
};
