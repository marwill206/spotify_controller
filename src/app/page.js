"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { debounce } from "lodash";

export default function Home() {
  const [pause, setPause] = useState(0);
  const [accessToken, setAccessToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const cookies = Object.fromEntries(
      document.cookie.split("; ").map((cookie) => cookie.split("="))
    );

    setAccessToken(cookies["access_token"]);
  });

  const emitCheckPlaybackState = debounce(() => {
    if (socketRef.current && accessToken) {
      socketRef.current.emit("check playback state", accessToken);
    }
  }, 5000);

  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current && accessToken) {
        socketRef.current.emit("check playback state", accessToken);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, [accessToken]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("playback state", (data) => {
        if (data.error) {
        } else {
          console.log("playing state", data.isPlaying);
          setPause(data.isPlaying ? 0 : 1);
        }
      });
    }
  });

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login");
    const { url } = await res.json();
    window.location.href = url;
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3002");

      socketRef.current.on("connect", () => {
        console.log("connect");
      });

      socketRef.current.on("disconnect", () => {
        console.log("disconnect");
      });
    }
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
    const token = accessToken;

    if (!token) {
      console.error("Access token is missing");
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      console.error("Socket is not initialized or connected");
      return;
    }

    socketRef.current.emit("pause", token);
  };

  const handleStart = () => {
    const token = accessToken;
    console.log("Access Token:", token);

    if (!token) {
      console.error("Access token is missing");
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      console.error("Socket is not initialized or connected");
      return;
    }

    socketRef.current.emit("play", token);
  };

  const handleNext = () => {
    const token = accessToken;
    console.log("Access Token:", token);

    if (!token) {
      console.error("Access token is missing");
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      console.error("Socket is not initialized or connected");
      return;
    }

    socketRef.current.emit("next track", token);
  };

  const handlePrevious = () => {
    const token = accessToken;
    console.log("Access Token:", token);

    if (!token) {
      console.error("Access token is missing");
      return;
    }

    if (!socketRef || !socketRef.current.connected) {
      console.error("Socket is not initialized or connected");
      return;
    }

    socketRef.current.emit("previous track", token);
  };

  const handleLogout = () => {
    setAccessToken(null);
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    fetch("/api/auth/logout", { method: "POST" })
      .then((res) => {
        if (res.ok) {
          console.log("Logged out successfully");
        } else {
          console.error("Failed to log out");
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });

    // Redirect to the login page or show a logged-out state
    window.location.href = "/";
  };

  const handleSearch = async () => {
    if (!accessToken) {
      console.error("not token");
      return;
    }

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (data.tracks && data.tracks.items) {
        setSearchResults(data.tracks.items);
      } else {
        console.error("no tracks");
      }
    } catch (error) {
      console.error("error tracks", error);
    }
  };

  const handlePlaySong = (uri) => {
    if (!accessToken) {
      console.error("not token");
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      console.error("Socket is not initialized or connected");
      return;
    }

    socketRef.current.emit("play song", { token: accessToken, uri });
  };

  return (
    <main className=" flex justify-center h-screen p-10">
      <div className="gap-3 flex flex-col bg-gray-500 w-70 rounded-4xl ">
        <button className="cursor-pointer" onClick={handleLogin}>
          Log-out
        </button>
        <div className="flex gap-5 justify-center">
          <button className=" cursor-pointer" onClick={handlePrevious}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 rotate-180 transition-all duration-300 hover:-translate-x-1"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M3 6.804v10.392c0 1.54 1.667 2.502 3 1.732l3-1.732V6.804L6 5.072c-1.333-.77-3 .192-3 1.732Zm18 3.464c1.333.77 1.333 2.694 0 3.464l-9 5.196c-1.333.77-3-.192-3-1.732V6.804c0-1.54 1.667-2.502 3-1.732z"
              />
            </svg>
          </button>
          {pause === 0 ? (
            <button
              className=" cursor-pointer"
              onClick={() => {
                handlePause();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-11"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2m6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2"
                />
              </svg>
            </button>
          ) : (
            <button
              className="  cursor-pointer"
              onClick={() => {
                handleStart();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-11"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M18.89 12.846c-.353 1.343-2.023 2.292-5.364 4.19c-3.23 1.835-4.845 2.752-6.146 2.384a3.25 3.25 0 0 1-1.424-.841C5 17.614 5 15.743 5 12s0-5.614.956-6.579a3.25 3.25 0 0 1 1.424-.84c1.301-.37 2.916.548 6.146 2.383c3.34 1.898 5.011 2.847 5.365 4.19a3.3 3.3 0 0 1 0 1.692"
                  color="currentColor"
                />
              </svg>
            </button>
          )}
          <button className=" cursor-pointer" onClick={handleNext}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 transition-all duration-300 hover:translate-x-1"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M3 6.804v10.392c0 1.54 1.667 2.502 3 1.732l3-1.732V6.804L6 5.072c-1.333-.77-3 .192-3 1.732Zm18 3.464c1.333.77 1.333 2.694 0 3.464l-9 5.196c-1.333.77-3-.192-3-1.732V6.804c0-1.54 1.667-2.502 3-1.732z"
              />
            </svg>
          </button>
        </div>
        <div>
          <div>
            <input
              className="p-2 flex-grow"
              placeholder="search songs"
              value={searchQuery}
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-2 rounded" onClick={handleSearch}>
              search
            </button>
          </div>
          <div>
            <ul className="m-4 overflow-auto h-96 flex flex-col gap-3 ">
              {Array.isArray(searchResults) && searchResults.length > 0 ? (
                searchResults.map((track) => (
                  <li
                    className="bg-amber-100 rounded-2xl p-3 flex flex-row justify-between "
                    key={track.id}
                  >
                    <div>
                      <p className="text-black font-bold">{track.name}</p>
                      <p className="text-black">
                        {track.artists
                          ? track.artists
                              .map((artist) => artist.name)
                              .join(", ")
                          : "Unknown Artist"}
                      </p>
                    </div>
                    <button
                      className="text-black"
                      onClick={() => handlePlaySong(track.uri)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16.211 11.106L9.737 7.868A1.2 1.2 0 0 0 8 8.942v6.116a1.2 1.2 0 0 0 1.737 1.074l6.474-3.238a1 1 0 0 0 0-1.788"
                        />
                      </svg>
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No results found</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
