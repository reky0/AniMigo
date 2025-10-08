export interface BasicMedia {
  id: number;
  title: {
    romaji: string;
    english?: string | null;
    native?: string | null;
  };
  averageScore?: number | null; // Rating as a percentage (0-100)
  coverImage?: {
    medium: string;
    large?: string | null;
  } | null;
}

export interface BasicMediaResponse {
  Page: {
    media: BasicMedia[];
  };
}

export interface Title {
  romaji: string;
  english?: string | null;
  native?: string | null;
  userPreferred?: string | null;
}

export interface CoverImage {
  extraLarge?: string | null;
  large?: string | null;
  medium?: string | null;
  color?: string | null;
}

export interface FuzzyDate {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}

export interface Studio {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

export interface GenreConnection {
  genres: string[];
}
export interface CharacterConnection {
  edges: Array<{
    id: number;
    role: string;
    node: {
      id: number;
      name: {
        full: string;
        native?: string | null;
      };
      image: {
        large?: string | null;
      };
    };
  }>;
}

export interface StaffConnection {
  edges: Array<{
    id: number;
    role: string;
    node: {
      id: number;
      name: {
        full: string;
        native?: string | null;
      };
      image: {
        large?: string | null;
      };
    };
  }>;
}

export interface Trailer {
  id?: string | null;
  site?: string | null;
  thumbnail?: string | null;
}

export interface NextAiringEpisode {
  episode: number | null;
  timeUntilAiring: number | null;
  airingAt: number | null;
}

export interface DetailedMedia {
  id: number;
  idMal?: number | null;                        // MyAnimeList ID
  title: Title;
  type: 'ANIME' | 'MANGA';
  format?: string | null;                       // e.g., TV, Movie, Manga, Novel
  status?: string | null;                       // e.g., FINISHED, RELEASING
  description?: string | null;
  startDate?: FuzzyDate | null;
  endDate?: FuzzyDate | null;
  season?: string | null;                       // e.g., SPRING, SUMMER
  seasonYear?: number | null;
  episodes?: number | null;                     // For anime
  duration?: number | null;                     // Minutes per episode
  chapters?: number | null;                     // For manga
  volumes?: number | null;                      // For manga
  source?: string | null;                       // e.g., MANGA, LIGHT_NOVEL
  hashtag?: string | null;
  trailer?: Trailer | null;
  updatedAt?: number | null;                    // Timestamp
  coverImage?: CoverImage | null;
  bannerImage?: string | null;
  genres?: string[] | null;
  isAdult?: boolean | null;

  averageScore?: number | null;                 // Average score in percentage
  meanScore?: number | null;                 // Average score in percentage
  popularity?: number | null;                    // Popularity count
  favourites?: number | null;

  siteUrl: string | null;
  nextAiringEpisode?: NextAiringEpisode | null;

  synonyms: string[] | null;

  studios?: {
    edges: Array<{
      isMain: boolean;
      node: Studio;
    }>;
  } | null;

  tags?: Array<{
    id: number;
    name: string;
    description?: string | null;
    isMediaSpoiler: boolean;
    isGeneralSpoiler: boolean;
    rank: number;
  }> | null;

  characterConnection?: CharacterConnection | null;
  staff?: StaffConnection | null;

  recommendations?: {
    edges: Array<{
      node: {
        id: number;
        rating: number;
        mediaRecommendation: DetailedMedia;
      };
    }>;
  } | null;

  relations?: {
    edges: Array<{
      relationType: string;
      node: DetailedMedia;
    }>;
  } | null;

  externalLinks?: Array<{
    id: number;
    url: string;
    site: string;
    type?: string | null;
    language?: string | null;
    color?: string | null;
    icon?: string | null;
    isDisabled?: boolean | null;
    notes?: string | null;
    siteId?: string | null;
  }> | null;

  streamingEpisodes?: Array<{
    title: string;
    thumbnail: string;
    url: string;
    site: string;
  }> | null;
}

export interface DetailedMediaResponse {
  Media: DetailedMedia
}

export interface AnimeThemesResponse {
  anime: Anime[];
}

export interface Anime {
  id: number;
  name: string;
  slug: string;
  year?: number;
  season?: string;
  animethemes?: AnimeTheme[];
  resources?: Resource[];
}

export interface AnimeTheme {
  id: number;
  type: 'OP' | 'ED';
  sequence: number;
  slug: string;
  group?: string;
  song?: Song;
  animethemeentries?: ThemeEntry[];
}

export interface Song {
  id: number;
  title: string;
  artists?: Artist[];
}

export interface Artist {
  id: number;
  name: string;
  slug: string;
}

export interface ThemeEntry {
  id: number;
  version?: number;
  videos?: Video[];
}

export interface Video {
  id: number;
  basename: string;
  filename: string;
  path: string;
  size: number;
  link: string;
}

export interface Resource {
  id: number;
  link: string;
  external_id: number;
  site: string; // 'AniList', 'MyAnimeList', etc.
}

export interface ResourceWithAnime extends Resource {
  anime?: Anime;
}

// Simplified DTO for your app
export interface ThemeData {
  type: 'OP' | 'ED';
  sequence: number;
  fullName: string; // e.g., "OP1", "ED2"
  songTitle: string;
  artists: string[];
  videoLink?: string;
}
