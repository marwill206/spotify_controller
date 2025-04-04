"use client";
import Image from "next/image";
import { useEffect } from "react";
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const handleLogin = async () => {
    const res = await fetch("/api/auth/login");
    const { url } = await res.json();
    window.location.href = url;
  };

  useEffect(() => {
    socket = io("http://localhost:3002");

    socket.on("connect", () => {
      console.log("connected");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

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
    
    const cookies = Object.fromEntries(
      document.cookie.split("; ").map((cookie) => cookie.split("="))
    );

    const token = cookies["access_token"]; 
    console.log("Access Token:", token);

    if (!token) {
      console.error("Access token is missing");
      return;
    }

    if (!socket || !socket.connected) {
      console.error("Socket is not initialized or connected");
      return;
    }

    socket.emit("pause", token); 
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
      <button className=" cursor-pointer" onClick={handlePrevious}>
        Back
      </button>
      <button className=" cursor-pointer" onClick={handlePause}>
        Pause
      </button>
      <button className=" cursor-pointer" onClick={handleNext}>
        Forward
      </button>
    </main>
  );
}
