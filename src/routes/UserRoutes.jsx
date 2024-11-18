import { Route, Routes } from "react-router-dom";

import CheckKelulusan from "../components/CheckKelulusan";
import KonfirmasiKesediaan from "../components/KonfirmasiKesediaan";
import Login from "../components/Login";

function UserRoutes() {
  return (
    <Routes>
      <Route path="" element={<CheckKelulusan />} />
      <Route path="confirm" element={<KonfirmasiKesediaan />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default UserRoutes;
