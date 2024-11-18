import supabase from "../services/supabaseClient";
import { toast } from "react-toastify";
import { useState } from "react";

const InputDataKelulusan = () => {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [statusDiterima, setStatusDiterima] = useState(0);
  const [divisiDitawarkan, setDivisiDitawarkan] = useState([]);
  const [bersediaPindah, setBersediaPindah] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("kelulusan").insert([
      {
        nim,
        nama,
        status_diterima: statusDiterima,
        divisi_ditawarkan: divisiDitawarkan,
        bersedia_pindah: bersediaPindah,
        konfirmasi_kesediaan: 0,
      },
    ]);

    if (error) {
      toast.error("Error inserting data");
    } else {
      toast.success("Data successfully inserted");
      setNim("");
      setNama("");
      setStatusDiterima(0);
      setDivisiDitawarkan([]);
      setBersediaPindah(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Input Data Kelulusan</h2>
      <input
        type="text"
        placeholder="NIM"
        value={nim}
        onChange={(e) => setNim(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
      <select
        value={statusDiterima}
        onChange={(e) => setStatusDiterima(parseInt(e.target.value))}
      >
        <option value={0}>Ditolak</option>
        <option value={1}>Diterima</option>
        <option value={3}>Ditawarkan</option>
      </select>
      <input
        type="text"
        placeholder="Divisi Ditawarkan (pisahkan dengan koma)"
        value={divisiDitawarkan}
        onChange={(e) => setDivisiDitawarkan(e.target.value.split(","))}
      />
      <label>
        <input
          type="checkbox"
          checked={bersediaPindah}
          onChange={(e) => setBersediaPindah(e.target.checked)}
        />
        Bersedia Pindah
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default InputDataKelulusan;
