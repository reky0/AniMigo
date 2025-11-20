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

// ============================================
// User Settings Update Interfaces
// ============================================

export type TitleLanguage = 'ROMAJI' | 'ENGLISH' | 'NATIVE' | 'ROMAJI_STYLISED' | 'ENGLISH_STYLISED' | 'NATIVE_STYLISED';
export type StaffNameLanguage = 'ROMAJI_WESTERN' | 'ROMAJI' | 'NATIVE';
export type ProfileColor = 'blue' | 'purple' | 'pink' | 'orange' | 'red' | 'green' | 'gray';

export interface UserSettingsInput {
  titleLanguage?: TitleLanguage;
  staffNameLanguage?: StaffNameLanguage;
  displayAdultContent?: boolean;
  airingNotifications?: boolean;
  profileColor?: ProfileColor;
}

export interface UpdateUserResponse {
  UpdateUser: {
    id: number;
    name: string;
    options: {
      titleLanguage?: string | null;
      staffNameLanguage?: string | null;
      displayAdultContent?: boolean;
      airingNotifications?: boolean;
      profileColor?: string | null;
    };
  };
}

export interface UpdateUserSettingsResult {
  success: boolean;
  userData?: UpdateUserResponse['UpdateUser'];
  error?: string;
}
