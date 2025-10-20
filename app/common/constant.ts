import Search from "@/app/components/Search";
import Ai from "@/app/components/Ai";
import Direction from "@/app/components/Direction";
import Favorites from "@/app/components/Favorites";
import { ComponentType } from "react";

export type LatLng = { lat: number; lng: number };

export const CONTENTS: { label: string; Component: ComponentType }[] = [
  { label: "검색", Component: Search },
  { label: "AI", Component: Ai },
  { label: "길찾", Component: Direction },
  { label: "즐찾", Component: Favorites },
];
