"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Home() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="w-screen h-screen">
      <Map posix={[4.79029, -75.69003]} />
    </div>
  );
}
