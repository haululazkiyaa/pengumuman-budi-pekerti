import { useEffect, useState } from "react";

import supabase from "../services/supabaseClient";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [kelulusanData, setKelulusanData] = useState([]);

  // Fetch data dari Supabase
  useEffect(() => {
    const fetchKelulusanData = async () => {
      const { data, error } = await supabase.from("kelulusan").select("*");

      if (error) {
        toast.error("Error fetching data");
      } else {
        setKelulusanData(data);
      }
    };

    fetchKelulusanData();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Nama Lengkap</th>
            <th>NIM</th>
            <th>Fakultas</th>
            <th>Jurusan</th>
            <th>Tahun Angkatan</th>
            <th>Nama Beasiswa</th>
            <th>Jabatan Pilihan 1</th>
            <th>Jabatan Pilihan 2</th>
            <th>Bersedia Pindah Posisi</th>
            <th>Status Diterima</th>
            <th>Divisi Ditawarkan</th>
            <th>Konfirmasi Kesediaan</th>
          </tr>
        </thead>
        <tbody>
          {kelulusanData.map((item) => (
            <tr key={item.id}>
              <td>{item.nama}</td>
              <td>{item.nim}</td>
              <td>{item.fakultas}</td>
              <td>{item.jurusan}</td>
              <td>{item.angkatan}</td>
              <td>{item.beasiswa}</td>
              <td>{item.pilihan1}</td>
              <td>{item.pilihan2}</td>
              <td>{item.bersedia_pindah ? "Ya" : "Tidak"}</td>
              <td>{item.status_diterima || "-"}</td>
              <td>{item.divisi_ditawarkan || "-"}</td>
              <td>
                {item.konfirmasi_kesediaan ? "Bersedia" : "Tidak Bersedia"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
