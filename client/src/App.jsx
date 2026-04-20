import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.jsx";
import { AdminDashboard } from "@/pages/AdminDashboard.jsx";
import { CampaignDetail } from "@/pages/CampaignDetail.jsx";
import { Campaigns } from "@/pages/Campaigns.jsx";
import { Cart } from "@/pages/Cart.jsx";
import { Checkout } from "@/pages/Checkout.jsx";
import { Home } from "@/pages/Home.jsx";
import { Login } from "@/pages/Login.jsx";
import { Orders } from "@/pages/Orders.jsx";
import { OrganizationDashboard } from "@/pages/OrganizationDashboard.jsx";
import { Profile } from "@/pages/Profile.jsx";
import { SupplierDashboard } from "@/pages/SupplierDashboard.jsx";
import { Transparency } from "@/pages/Transparency.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:slug" element={<CampaignDetail />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute roles={["DONOR"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute roles={["DONOR"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={["DONOR", "CHARITY", "SUPPLIER", "ADMIN"]}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["DONOR", "CHARITY", "SUPPLIER", "ADMIN"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization"
          element={
            <ProtectedRoute roles={["CHARITY"]}>
              <OrganizationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier"
          element={
            <ProtectedRoute roles={["SUPPLIER"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
