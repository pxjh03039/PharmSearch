export type LatLng = { lat: number; lng: number };

export type User = { name: string; email: string };

export type Role = "user" | "model";
export type Msg = { id: string; role: Role; content: string };

export type KakaoPlace = {
  address_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
};

export type KakaoPlaceResponse = {
  documents: KakaoPlace[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
};

export type FavoritePlace = {
  placeId: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  placeUrl?: string | null;
  phone?: string | null;
};

export type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

export type MessageInput = {
  content: string;
  role: "user" | "model";
};
