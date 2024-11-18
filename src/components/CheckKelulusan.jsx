import { useEffect, useState } from "react";

import Confetti from "react-confetti";
import ReCAPTCHA from "react-google-recaptcha";
// import Swal from "sweetalert2";
import supabase from "../services/supabaseClient";
import { toast } from "react-toastify";
import { useWindowSize } from "@uidotdev/usehooks";

const CheckKelulusan = () => {
  const [nim, setNim] = useState("");
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [linkWA, setlinkWA] = useState("");
  const { width, height } = useWindowSize();

  // Fetch waktu mulai dari database
  useEffect(() => {
    const fetchStartTime = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("start_time")
        .single();

      if (error) {
        toast.error("Gagal memuat waktu mulai");
      } else {
        setStartTime(new Date(data.start_time));
      }
    };

    const fetchLinkWA = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("link_wa")
        .single();

      if (error) {
        toast.error("Gagal memuat link grup WA");
      } else {
        setlinkWA(data.link_wa);
      }
    };

    fetchStartTime();
    fetchLinkWA();
  }, []);

  // Hitung countdown
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const difference = startTime - now;
        setTimeLeft(difference);

        if (difference <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime]);

  const handleCheck = async () => {
    if (!captchaValid) {
      toast.error("Harap selesaikan CAPTCHA!");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await supabase
        .from("kelulusan")
        .select("*")
        .eq("nim", nim)
        .single();

      if (data) {
        setResult(data);
        if (data.status_diterima) {
          setShowConfetti(true);
        } else {
          setShowConfetti(false);
        }
      } else {
        setResult(null);
        toast.error("Data tidak ditemukan");
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan: ${error}, silakan coba lagi.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValid(!!value);
  };

  // Render countdown timer
  const renderCountdown = () => {
    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      return (
        <div>
          <div className="flex items-center justify-center space-x-5">
            <div className="bg-gray-200 p-5 rounded-lg">
              <h1 className="text-2xl">{days}</h1>
              <p className="text-lg">hari</p>
            </div>

            <div className="bg-gray-200 p-5 rounded-lg">
              <h1 className="text-2xl">{hours}</h1>
              <p className="text-lg">jam</p>
            </div>

            <div className="bg-gray-200 p-5 rounded-lg">
              <h1 className="text-2xl">{minutes}</h1>
              <p className="text-lg">menit</p>
            </div>

            <div className="bg-gray-200 p-5 rounded-lg">
              <h1 className="text-2xl">{seconds}</h1>
              <p className="text-lg">detik</p>
            </div>
          </div>
          <div className="flex justify-center items-center mt-5">
            <img
              src="https://masulyablog.sirv.com/5c.jpg"
              alt="pesan ketua"
              className="h-72"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const handleConfirmation = async (confirm) => {
    // Swal.fire({
    //   title: confirm ? "Terima?" : "Undur Diri?",
    //   text: "Kesempatan anda hanya satu kali, apakah anda yakin?",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: confirm ? "Ya Terima!" : "Ya, Undur Diri!",
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     const { error } = await supabase
    //       .from("kelulusan")
    //       .update({ konfirmasi_kesediaan: confirm })
    //       .match({ nim: nim });

    //     if (!error) {
    //       Swal.fire({
    //         title: "Konfirmasi Berhasil!",
    //         text: "Terima kasih telah melakukan konfirmasi, kami akan segera menyebarkan surat resmi yang lolos sebagai pengurus!.",
    //         icon: "success",
    //       });
    //     } else {
    //       toast.error("Terjadi kesalahan saat melakukan konfirmasi");
    //     }
    //   }
    // });
    const { error } = await supabase
      .from("kelulusan")
      .update({ konfirmasi_kesediaan: confirm })
      .match({ nim: nim });

    if (!error) {
      // Swal.fire({
      //   title: "Konfirmasi Berhasil!",
      //   text: "Terima kasih telah melakukan konfirmasi, kami akan segera menyebarkan surat resmi yang lolos sebagai pengurus!.",
      //   icon: "success",
      // });
      toast.loading("Membuka link whatsapp...");
      setTimeout(() => {
        window.location.href = linkWA;
      }, 2000);
    } else {
      toast.error("Terjadi kesalahan saat melakukan konfirmasi");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  }, [showConfetti]);

  return (
    <div className="font-sans p-5 text-center">
      <header className="mb-3">
        <div className="flex justify-center my-3">
          <img
            src="https://budipekerti.vercel.app/images/logo.png"
            alt="Logo Budi Pekerti x TelU"
            className="h-12"
          />
        </div>
        <h1 className="text-lg font-bold mb-3">
          PENGUMUMAN KELULUSAN <br />
          PENGURUS TIM BUDI PEKERTI 2025
        </h1>
        {timeLeft < 0 ? (
          !result && (
            <h2 className="text-gray-600 font-normal">
              Selamat datang! Silakan cek kelulusan Anda di bawah ini.
            </h2>
          )
        ) : (
          <h2 className="text-gray-600 font-normal">
            Pengumuman kelulusan akan dibuka pada:
          </h2>
        )}
      </header>

      {timeLeft > 0 && <div className="mt-5">{renderCountdown()}</div>}
      {timeLeft < 0 ? (
        !result ? (
          <div className="mb-8 p-5 border border-gray-300 rounded-lg inline-block">
            <h3 className="text-lg font-semibold">Masukkan NIM Anda</h3>
            <input
              type="text"
              placeholder="Masukkan NIM"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="p-2 w-72 border border-gray-300 rounded-md mt-2 mb-4"
            />
            <br />
            {/* reCAPTCHA */}
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECHAPTCHA}
              onChange={handleCaptchaChange}
              className="mb-4"
            />
            <br />
            <button
              onClick={handleCheck}
              disabled={isLoading} // Disable tombol saat loading
              className={`py-2 px-4 rounded-md text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading ? "Memproses..." : "Cek Kelulusan"}
            </button>
          </div>
        ) : null
      ) : null}

      {result && (
        <div className="mt-5 text-left inline-block bg-gray-50 p-5 rounded-lg shadow-md space-y-1">
          <h3 className="text-lg font-bold text-center mb-2">
            HASIL KELULUSAN
          </h3>

          <p>
            <strong>Nama:</strong> {result.nama}
          </p>
          <p>
            <strong>NIM:</strong> {result.nim}
          </p>
          <p>
            <strong>Fakultas:</strong> {result.fakultas}
          </p>
          <p>
            <strong>Jurusan:</strong> {result.jurusan}
          </p>
          <p>
            <strong>Angkatan:</strong> {result.angkatan}
          </p>
          <p>
            <strong>Awardee Beasiswa:</strong> {result.beasiswa || "-"}
          </p>
          <p>
            <strong>Pilihan 1:</strong> {result.pilihan1}
          </p>
          <p>
            <strong>Pilihan 2:</strong> {result.pilihan2}
          </p>
          <p>
            <strong>Bersedia Pindah Posisi:</strong>{" "}
            {result.bersedia_pindah ? "Ya" : "Tidak"}
          </p>
          <div>
            <div className="my-5">
              {result.status_diterima ? (
                <p className="font-bold text-lg text-green-600 text-center">
                  Selamat! Kamu diterima di posisi:
                  <br />
                  {result.status_diterima}
                </p>
              ) : (
                <>
                  <p className="font-bold text-red-500">
                    Mohon maaf, pilihan Anda penuh.
                  </p>
                  <p>Divisi ditawarkan: {result.divisi_ditawarkan || "-"}</p>
                </>
              )}
            </div>

            <div className="text-center">
              <p className="mb-2">Silahkan Join ke Grup Pengurus 2025:</p>
              <button
                onClick={() => {
                  handleConfirmation(true);
                }}
                className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
              >
                Masuk Grup Whatsapp
              </button>
              {/* <button
            onClick={() => handleConfirmation(false)}
            className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            MUNDUR
          </button> */}
            </div>
          </div>
        </div>
      )}

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          recycle={false}
        />
      )}
    </div>
  );
};

export default CheckKelulusan;
