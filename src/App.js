




// App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/Admindashboard";

import OrdersPage from "./pages/OrderPage";
import CSVCreatorWithPreview from "./pages/Createcsv"; // <-- CSV component
import CsvPreviewPage from "./pages/CsvPreviewPage"; // <-- CSV Preview component
import AcceptedOrdersPage from "./pages/AcceptedOrderpage";
import UploadInvoicePage from "./pages/InvoiceGenerator";
import Notifications from "./pages/Notifications";
import TrackingDashboard from "./pages/TrackingDashboard";
import RouteMap  from "./Components/RouteMap";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<AdminDashboard />} />

      <Route path="/orders" element={<OrdersPage />} />
      <Route
        path="/create-csv"
        element={
          <CSVCreatorWithPreview
            open={true}
            onClose={() => {
              /* handled inside page or use a wrapper */
            }}
          />
        }
      />
      <Route path="/csv-preview" element={<CsvPreviewPage />} />
      <Route path="/accepted-orders" element={<AcceptedOrdersPage />} />
      <Route path="/upload-invoice" element={<UploadInvoicePage />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/tracking" element={<TrackingDashboard />} />
     
    </Routes>
  );
}
















