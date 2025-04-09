"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const [pause, setPause] = useState(0);

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

  const switchPause = () => {
    setPause((prevPause) => (prevPause === 0 ? 1 : 0));
  };

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

  const handleStart = () => {
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

    socket.emit("play", token);
  };

  const handleNext = () => {
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

    socket.emit("next track", token);
  };

  const handlePrevious = () => {
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

    socket.emit("previous track", token);
  };

  return (
    <main className="p-5 flex gap-3">
      <button className=" cursor-pointer" onClick={handleLogin}>
        Login-out
      </button>
      <button className=" cursor-pointer" onClick={handlePrevious}>
        Back
      </button>
      {pause === 0 ? (
        <button
          className="  cursor-pointer"
          onClick={() => {
            handlePause();
            switchPause();
          }}
        >
          Pause
        </button>
      ) : (
        <button
          className="  cursor-pointer"
          onClick={() => {
            handleStart();
            switchPause();
          }}
        >
          play
        </button>
      )}
      <button className=" cursor-pointer" onClick={handleNext}>
        Forward
      </button>
    </main>
  );
}
