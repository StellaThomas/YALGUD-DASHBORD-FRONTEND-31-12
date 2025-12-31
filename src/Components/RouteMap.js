


// import { useEffect, useRef } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";

// /* =========================================
//    Reduce GPS noise
// ========================================= */
// const smoothCoords = (coords, step = 2) =>
//   coords.filter((_, i) => i % step === 0);

// /* =========================================
//    Get road-snapped route from OSRM
//    (Google-like routing)
// ========================================= */
// async function getRoadRoute(coords) {
//   if (coords.length < 2) return null;

//   const coordString = coords.map(c => c.join(",")).join(";");

//   const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

//   const res = await fetch(url);
//   const data = await res.json();

//   if (!data.routes || !data.routes[0]) return null;

//   return data.routes[0].geometry.coordinates;
// }

// /* =========================================
//    MAIN COMPONENT
// ========================================= */
// export default function RouteMap({ trip }) {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);

//   useEffect(() => {
//     if (!trip?.Path || trip.Path.length < 2) return;

//     let coords = trip.Path
//       .filter(p => p.lat && p.lng)
//       .map(p => [p.lng, p.lat]);

//     if (coords.length < 2) return;

//     coords = smoothCoords(coords, 2);

//     /* 🧹 Cleanup old map */
//     if (mapInstanceRef.current) {
//       try {
//         mapInstanceRef.current.remove();
//       } catch {}
//       mapInstanceRef.current = null;
//     }

//     /* 🗺️ Create Map (OpenStreetMap) */
//     const map = new maplibregl.Map({
//       container: mapRef.current,
//       center: coords[0],
//       zoom: 13,
//       style: {
//         version: 8,
//         sources: {
//           osm: {
//             type: "raster",
//             tiles: [
//               "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
//               "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
//               "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             ],
//             tileSize: 256,
//             attribution:
//               '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//           }
//         },
//         layers: [
//           {
//             id: "osm",
//             type: "raster",
//             source: "osm"
//           }
//         ]
//       }
//     });

//     mapInstanceRef.current = map;

//     map.on("load", async () => {
//       /* 🔵 Fit bounds */
//       const bounds = coords.reduce(
//         (b, c) => b.extend(c),
//         new maplibregl.LngLatBounds(coords[0], coords[0])
//       );
//       map.fitBounds(bounds, { padding: 60 });

//       /* 🚗 Get road-snapped route */
//       const roadCoords = await getRoadRoute(coords);
//       if (!roadCoords) return;

//       /* 🧭 Add route */
//       map.addSource("route", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: {
//             type: "LineString",
//             coordinates: roadCoords
//           }
//         }
//       });

//       map.addLayer({
//         id: "route-line",
//         type: "line",
//         source: "route",
//         layout: {
//           "line-join": "round",
//           "line-cap": "round"
//         },
//         paint: {
//           "line-color": "#1a73e8", // Google Maps blue
//           "line-width": 6,
//           "line-opacity": 0.9
//         }
//       });

//       /* 📍 Markers */
//       trip.Path.forEach(p => {
//         if (!p.lat || !p.lng) return;

//         let color = "#1a73e8";
//         if (p.type === "START") color = "green";
//         if (p.type === "STOP") color = "orange";
//         if (p.type === "END") color = "red";

//         new maplibregl.Marker({ color })
//           .setLngLat([p.lng, p.lat])
//           .addTo(map);
//       });
//     });

//     /* 🧹 Final cleanup */
//     return () => {
//       if (mapInstanceRef.current) {
//         try {
//           mapInstanceRef.current.remove();
//         } catch {}
//         mapInstanceRef.current = null;
//       }
//     };
//   }, [trip]);

//   return (
//     <div
//       ref={mapRef}
//       style={{
//         width: "100%",
//         height: "100vh",
//         minHeight: "500px"
//       }}
//     />
//   );
// }




























































































































// import { useEffect, useRef } from "react";
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";

// /* =========================================
//    UTILITIES
// ========================================= */

// // Reduce GPS noise
// const smoothCoords = (coords, step = 2) =>
//   coords.filter((_, i) => i % step === 0);

// // Get road-snapped route from OSRM (Google-like)
// async function getRoadRoute(coords) {
//   if (coords.length < 2) return null;

//   const coordString = coords.map(c => c.join(",")).join(";");
//   const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

//   const res = await fetch(url);
//   const data = await res.json();

//   return data?.routes?.[0]?.geometry?.coordinates || null;
// }

// // Snap marker to nearest route point
// function snapToRoute(point, route) {
//   let minDist = Infinity;
//   let snapped = route[0];

//   for (const r of route) {
//     const dx = r[0] - point[0];
//     const dy = r[1] - point[1];
//     const d = dx * dx + dy * dy;

//     if (d < minDist) {
//       minDist = d;
//       snapped = r;
//     }
//   }
//   return snapped;
// }

// /* =========================================
//    MAIN COMPONENT
// ========================================= */

// export default function RouteMap({ trip }) {
//   const mapRef = useRef(null);
//   const mapRefInstance = useRef(null);

//   useEffect(() => {
//     if (!trip?.Path || trip.Path.length < 2) return;

//     let rawCoords = trip.Path
//       .filter(p => p.lat && p.lng)
//       .map(p => [p.lng, p.lat]);

//     if (rawCoords.length < 2) return;

//     rawCoords = smoothCoords(rawCoords, 2);

//     // Cleanup old map
//     if (mapRefInstance.current) {
//       try {
//         mapRefInstance.current.remove();
//       } catch {}
//       mapRefInstance.current = null;
//     }

//     // Create map
//     const map = new maplibregl.Map({
//       container: mapRef.current,
//       center: rawCoords[0],
//       zoom: 13,
//       style: {
//         version: 8,
//         sources: {
//           osm: {
//             type: "raster",
//             tiles: [
//               "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
//               "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
//               "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             ],
//             tileSize: 256,
//             attribution:
//               '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//           }
//         },
//         layers: [
//           {
//             id: "osm",
//             type: "raster",
//             source: "osm"
//           }
//         ]
//       }
//     });

//     mapRefInstance.current = map;

//     map.on("load", async () => {
//       const roadCoords = await getRoadRoute(rawCoords);
//       if (!roadCoords) return;

//       // Fit bounds
//       const bounds = roadCoords.reduce(
//         (b, c) => b.extend(c),
//         new maplibregl.LngLatBounds(roadCoords[0], roadCoords[0])
//       );
//       map.fitBounds(bounds, { padding: 60 });

//       // Route source
//       map.addSource("route", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: {
//             type: "LineString",
//             coordinates: roadCoords
//           }
//         }
//       });

//       // Route layer
//       map.addLayer({
//         id: "route-line",
//         type: "line",
//         source: "route",
//         layout: {
//           "line-join": "round",
//           "line-cap": "round"
//         },
//         paint: {
//           "line-color": "#1a73e8",
//           "line-width": 6,
//           "line-opacity": 0.9
//         }
//       });

//       /* ===============================
//          MARKERS (ALL BLUE)
//       =============================== */

//       // START (BLUE)
//       new maplibregl.Marker({ color: "#1a73e8" })
//         .setLngLat(roadCoords[0])
//         .addTo(map);

//       // END (BLUE)
//       new maplibregl.Marker({ color: "#1a73e8" })
//         .setLngLat(roadCoords[roadCoords.length - 1])
//         .addTo(map);

//       // STOP points (BLUE)
//       trip.Path.forEach(p => {
//         if (p.type === "STOP" && p.lat && p.lng) {
//           const snapped = snapToRoute([p.lng, p.lat], roadCoords);

//           new maplibregl.Marker({ color: "#1a73e8" })
//             .setLngLat(snapped)
//             .addTo(map);
//         }
//       });
//     });

//     return () => {
//       if (mapRefInstance.current) {
//         try {
//           mapRefInstance.current.remove();
//         } catch {}
//         mapRefInstance.current = null;
//       }
//     };
//   }, [trip]);

//   return (
//     <div
//       ref={mapRef}
//       style={{
//         width: "100%",
//         height: "100vh",
//         minHeight: "500px"
//       }}
//     />
//   );
// }





























































































import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { io } from "socket.io-client";
import "maplibre-gl/dist/maplibre-gl.css";

const socket = io("http://122.169.40.118:8002", {
  transports: ["websocket"]
});

/* UTIL */
const smoothCoords = (coords, step = 2) =>
  coords.filter((_, i) => i % step === 0);

const getLatLng = p => [
  p.lng ?? p.Lng ?? p.longitude ?? p.Longitude,
  p.lat ?? p.Lat ?? p.latitude ?? p.Latitude
];

async function getRoadRoute(coords) {
  const coordString = coords.map(c => c.join(",")).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.routes?.[0]?.geometry?.coordinates || [];
}

export default function RouteMap({ trip }) {
  const mapRef = useRef(null);
  const map = useRef(null);

  const roadRoute = useRef([]);
  const gpsRoute = useRef([]);
  const liveMarker = useRef(null);

  /* INITIAL LOAD */
  useEffect(() => {
    if (!trip?.Path?.length) return;

    let gps = trip.Path
      .map(getLatLng)
      .filter(c => c[0] && c[1]);

    if (gps.length < 2) return;

    gps = smoothCoords(gps, 2);
    gpsRoute.current = gps;

    map.current = new maplibregl.Map({
      container: mapRef.current,
      center: gps[0],
      zoom: 14,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            tileSize: 256
          }
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }]
      }
    });

    map.current.on("load", async () => {
      roadRoute.current = await getRoadRoute(gps);

      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: roadRoute.current
          }
        }
      });

      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#1a73e8",
          "line-width": 6
        }
      });

      new maplibregl.Marker({ color: "#1a73e8" })
        .setLngLat(roadRoute.current[0])
        .addTo(map.current);

      liveMarker.current = new maplibregl.Marker({ color: "red" })
        .setLngLat(roadRoute.current.at(-1))
        .addTo(map.current);
    });

    return () => {
      socket.off("location-update");
      map.current?.remove();
    };
  }, [trip]);

  /* LIVE SOCKET */
  useEffect(() => {
    socket.on("location-update", ({ lat, lng }) => {
      if (!map.current || !lat || !lng) return;

      const point = [lng, lat];
      gpsRoute.current.push(point);

      liveMarker.current?.setLngLat(point);

      if (!map.current.getSource("route")) return;

      map.current.easeTo({ center: point });
    });

    return () => socket.off("location-update");
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100vh", minHeight: 500 }}
    />
  );
}
