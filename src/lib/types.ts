export interface Perfume {
  id: string;
  name: string;
  concentration?: string;
  releaseYear?: number;
  genderTarget?: string;
  imageUrl?: string;
  brand: Brand;
  notes: PerfumeNote[];
}

export interface Brand {
  id: string;
  name: string;
  country?: string;
}

export interface Note {
  id: string;
  name: string;
  family?: string;
}

export interface PerfumeNote {
  perfumeId: string;
  noteId: string;
  position: "top" | "heart" | "base";
  note: Note;
}

export interface List {
  id: string;
  userId: string;
  name: string;
  type: "tried" | "wishlist" | "collection" | "hitlist";
  isPublic: boolean;
  items: ListItem[];
}

export interface ListItem {
  id: string;
  listId: string;
  perfumeId: string;
  rank: number;
  addedAt: Date;
  perfume: Perfume;
}

export interface Ranking {
  id: string;
  userId: string;
  perfumeId: string;
  enjoyment: number;
  versatility: number;
  performance: number;
  value: number;
  reviewText?: string;
  photoUrl?: string;
  createdAt: Date;
  user: User;
  perfume: Perfume;
}

export interface User {
  id: string;
  handle: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  city?: string;
  joinedAt: Date;
  privacy: string;
  streak: number;
}

export interface Comment {
  id: string;
  userId: string;
  rankingId: string;
  text: string;
  createdAt: Date;
  user: User;
}
