// ============================================
// Favorite Toggle Response Interfaces
// ============================================

export interface FavoriteNode {
  id: number;
}

export interface FavoriteMediaResponse {
  ToggleFavourite: {
    anime?: {
      nodes: FavoriteNode[];
    };
    manga?: {
      nodes: FavoriteNode[];
    };
  };
}

export interface FavoriteCharacterResponse {
  ToggleFavourite: {
    characters: {
      nodes: FavoriteNode[];
    };
  };
}

export interface FavoriteStaffResponse {
  ToggleFavourite: {
    staff: {
      nodes: FavoriteNode[];
    };
  };
}

export interface FavoriteStudioResponse {
  ToggleFavourite: {
    studios: {
      nodes: FavoriteNode[];
    };
  };
}

// Union type for all favorite responses
export type FavoriteToggleResponse =
  | FavoriteMediaResponse
  | FavoriteCharacterResponse
  | FavoriteStaffResponse
  | FavoriteStudioResponse;

// ============================================
// Favorite Toggle Types
// ============================================

export type FavoriteType = 'ANIME' | 'MANGA' | 'CHARACTER' | 'STAFF' | 'STUDIO';

// ============================================
// Favorite Toggle Result
// ============================================

export interface FavoriteToggleResult {
  success: boolean;
  isFavorite: boolean;
  favoriteIds: number[];
  error?: string;
}
