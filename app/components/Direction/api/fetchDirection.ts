"use client";

import mainClient from "@/app/common/apis/Client/mainClient";
import { pathGenerator } from "@/app/common/apis/constants/routes";
import { LatLng } from "@/app/common/types/constants";

export const fetchDirection = async (origin: LatLng, destination: LatLng) => {
  const res = await mainClient.get(
    pathGenerator.direction(origin, destination)
  );

  return res.routes[0];
};
