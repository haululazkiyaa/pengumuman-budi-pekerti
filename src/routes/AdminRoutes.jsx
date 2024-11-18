import { Route, Routes } from "react-router-dom";

import AdminDashboard from "../components/AdminDashboard";
import InputDataKelulusan from "../components/InputDataKelulusan";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="" element={<AdminDashboard />} />
      <Route path="input" element={<InputDataKelulusan />} />
    </Routes>
  );
}

export default AdminRoutes;
