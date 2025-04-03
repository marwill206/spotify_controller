"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const handleLogin = async () => {
    const res = await fetch("/api/auth/login");
    const { url } = await res.json();
    window.location.href = url;
  };

  useEffect(() => {
   


    const checkAuth = async () => {
      const res = await fetch("/api/auth/status");
      const { authenticated } = await res.json();
      console.log("statur auth:", authenticated);

      if (!authenticated) {
        handleLogin();
      }
    };
    checkAuth();
  }, []);

  const handlePause = () => {
    const accessToken = localStorage.getItem("access_token");
    socket.emit("pause", accessToken);
  };

  const handleNext = () => {
    socket.emit("next");
  };

  const handlePrevious = () => {
    socket.emit("previous");
  };

  return (
    <main className="p-5 flex gap-3">
      <button className=" cursor-pointer" onClick={handleLogin}>
        Login-out
      </button>
      <button className=" cursor-pointer"  onClick={handlePrevious}>Back</button>
      <button className=" cursor-pointer" onClick={handlePause}>Pause</button>
      <button className=" cursor-pointer" onClick={handleNext}>Forward</button>
    </main>
  );
}
