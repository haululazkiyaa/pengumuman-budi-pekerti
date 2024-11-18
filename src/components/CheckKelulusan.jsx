import { useEffect, useState } from "react";

import Confetti from "react-confetti";
import ReCAPTCHA from "react-google-recaptcha";
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

    fetchStartTime();
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
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      return (
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
      );
    }
    return null;
  };

  return (
    <div className="font-sans p-5 text-center">
      <header className="mb-3">
        <div className="flex justify-center my-3">
          <img
            src="https://budipekerti.vercel.app/images/logo.png"
            alt="Logo Budi Pekerti x TelU"
          />
        </div>
        <h1 className="text-2xl font-bold mb-3">
          PENGUMUMAN KELULUSAN <br /> CALON PENGURUS TIM BUDI PEKERTI 2025
        </h1>
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
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECHAPTCHA}
              onChange={handleCaptchaChange}
              className="mb-4"
            />
            <button
              onClick={handleCheck}
              disabled={isLoading}
              className={`py-2 px-4 rounded-md text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading ? "Memproses..." : "Cek Kelulusan"}
            </button>
          </div>
        ) : (
          <div>{/* Hasil kelulusan */}</div>
        )
      ) : null}

      {showConfetti && <Confetti width={width} height={height} />}
    </div>
  );
};

export default CheckKelulusan;
