"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { fetchReports } from "@/app/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { getReportTypeName } from "@/utils/report-types";
import { Report } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { icon } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";

const customMarker = icon({
  iconUrl: "./markers/me.png",
  iconSize: [25, 25],
});

const customMarker2 = icon({
  iconUrl: "./markers/black-pin.png",
  iconSize: [25, 37],
});

type MapProps = {
  initialData: Report[];
};

const Map = ({ initialData }: MapProps) => {
  const [geolocationDisableAlertOpen, setGeolocationDisableAlertOpen] =
    useState(false);
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);

  const getReports = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
    initialData,
    enabled: !geolocationDisableAlertOpen,
  });

  function checkPermission(result: PermissionStatus) {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords(position.coords);
          setGeolocationDisableAlertOpen(false);
        },
        () => setGeolocationDisableAlertOpen(true),
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 20000,
        }
      );
    } else if (result.state === "denied") {
      toast({
        title: "Geolocation is disabled",
        description: "Please enable geolocation in your browser settings.",
      });
      setGeolocationDisableAlertOpen(true);
    }
  }

  const handlePermission = useCallback(() => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      checkPermission(result);

      result.addEventListener("change", () => {
        checkPermission(result);
      });
    });
  }, []);

  useEffect(() => {
    handlePermission();
  }, [handlePermission]);

  return (
    <>
      <Dialog open={geolocationDisableAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              To use this app you need to enable geolocation
            </DialogTitle>
            <DialogDescription>
              Without geolocation, we can&apos;t show you the last reports. Use
              the button below to enable geolocation.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={() => {
                handlePermission();
              }}
            >
              Enable geolocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {coords && (
        <MapContainer
          center={[coords.latitude, coords.longitude]}
          zoom={15}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[coords.latitude, coords.longitude]}
            draggable={false}
            icon={customMarker}
          />

          {getReports.data?.map((report) => {
            const location: [number, number] = JSON.parse(report.location);

            return (
              <Marker key={report.id} position={location} icon={customMarker2}>
                <Popup>
                  <div>
                    <span className="text-lg font-semibold">
                      {getReportTypeName(report.type)}
                    </span>
                    <p>{report.infos}</p>
                    <span className="text-sm">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </>
  );
};

export default Map;
