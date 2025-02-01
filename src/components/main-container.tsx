"use client";

import FloatingButton from "@/components/floating-button";
import { Report } from "@prisma/client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type MainContainerProps = {
  initialData: Report[];
};

const MainContainer = ({ initialData }: MainContainerProps) => {
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
      <FloatingButton />
      <Map initialData={initialData} />
    </div>
  );
};

export default MainContainer;
