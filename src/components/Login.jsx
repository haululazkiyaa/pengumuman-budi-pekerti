import sha256 from "crypto-js/sha256";
import supabase from "../services/supabaseClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const hashedPassword = sha256(password).toString();
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .single(); // Mengambil satu baris data dengan syarat username

      if (error && error.details === "The result contains 0 rows") {
        toast.error("Username tidak ditemukan.");
        return;
      }

      if (data && data.password_hash === hashedPassword) {
        localStorage.setItem("admin", JSON.stringify(data));
        toast.success("Login berhasil!");
        navigate("/admin");
      } else {
        toast.error("Password salah. Silakan coba lagi.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada sistem. Silakan coba lagi.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
