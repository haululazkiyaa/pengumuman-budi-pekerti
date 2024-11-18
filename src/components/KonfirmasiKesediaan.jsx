import supabase from "../services/supabaseClient";
import { toast } from "react-toastify";
import { useState } from "react";

const KonfirmasiKesediaan = () => {
  const [nim, setNim] = useState("");
  const [konfirmasi, setKonfirmasi] = useState(null);

  const handleKonfirmasi = async (status) => {
    const { error } = await supabase
      .from("kelulusan")
      .update({ konfirmasi_kesediaan: status })
      .eq("nim", nim);

    if (error) {
      toast.error("Error updating data");
    } else {
      toast.success("Konfirmasi berhasil");
      setKonfirmasi(status);
    }
  };

  return (
    <div>
      <h2>Konfirmasi Kesediaan</h2>
      <input
        type="text"
        placeholder="Masukkan NIM"
        value={nim}
        onChange={(e) => setNim(e.target.value)}
      />
      <button onClick={() => handleKonfirmasi(1)}>Bersedia</button>
      <button onClick={() => handleKonfirmasi(0)}>Tidak Bersedia</button>

      {konfirmasi !== null && (
        <p>
          Anda telah{" "}
          {konfirmasi === 1
            ? "menyatakan bersedia"
            : "menyatakan tidak bersedia"}
          .
        </p>
      )}
    </div>
  );
};

export default KonfirmasiKesediaan;
