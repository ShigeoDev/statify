"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { JWT } from "next-auth/jwt";

async function topArtists(token: JWT) {
  return await fetch("https://api.spotify.com/v1/me/top/artists?limit=10", { method: "GET", headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
}

export default function tracks() {
  const { data: session } = useSession();
  const token = session?.accessToken

  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    topArtists(token).then(data => setArtists(data.items))
  }, [])

  if (!session) {
    redirect("/login");
  }
  else {
    return (
      <div className="grid grid-cols-1 justify-items-center justify-center items-center h-screen overflow-auto">
        <div className="my-20 mx-5">
          <h1 className="lg:text-5xl text-4xl font-bold tracking-widest text-center mx-[20px]">Your Top Artists</h1>
          <hr className="mt-5"/>
          <ul className="mt-10 mx:[10px]">
            {artists && artists.map((artists: any) => {
              return (
                <li key={artists.name} className="flex items-center gap-4 mt-4 mx-[25px]">
                  <img src={artists.images[0].url} alt="track cover" className="w-[60px] h-[60px] rounded-md" />
                  <div>
                    <h2 className="font-bold lg:text-xl text-sm">{artists.name}</h2>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}
