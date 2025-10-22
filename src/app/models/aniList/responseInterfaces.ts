export interface PageInfo {
  currentPage?: number,
  hasNextPage?: boolean,
  perPage?: number,
  pagecurrentPage?: number,
}

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
  type: 'ANIME' | 'MANGA',
  isAdult?: boolean | null;
  seasonYear?: number | null;
  startDate?: FuzzyDate;
  format?: string | null;
}

export interface BasicMediaResponse {
  Page: {
    pageInfo: PageInfo;
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

export interface VoiceActor {
  id: number;
  name: {
    full: string;
    native?: string | null;
  }
  language: string;
  image: {
    medium: string
    large?: string | null;
  }
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
        medium: string
        large?: string | null;
      };
    };
    voiceActors: Array<VoiceActor>;
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
        medium?: string | null;
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

export interface Ranking {
  allTime: boolean;
  context: string;
  format: string;
  id: number;
  rank: number;
  season: string | null;
  type: string;
  year: number | null;
}

export interface StatusStat {
  amount: number;
  status: string;
  color?: string;
  textColor?: string;
}

export interface ScoreStat {
  amount: number;
  score: number;
  color?: string;
  textColor?: string;
}

export interface Stats {
  statusDistribution: Array<StatusStat>;
  scoreDistribution: Array<ScoreStat>;
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

  characters?: CharacterConnection | null;
  staff?: StaffConnection | null;

  recommendations?: {
    nodes: Array<{
      id: number;
      rating: number;
      mediaRecommendation: DetailedMedia;
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

  rankings?: Array<Ranking> | null;

  stats?: Stats;
}

export interface DetailedMediaResponse {
  Media: DetailedMedia
}

export interface Character {
  id: number;
  name: {
    full: string;
    native: string;
    alternative: string[];
    alternativeSpoiler: string[];
  };
  image: {
    large?: string | null;
    medium: string;
  };
  description: string;
  dateOfBirth?: FuzzyDate;
  age?: string;
  gender?: string;
  bloodType?: string | null;
  media: {
    pageInfo: PageInfo,
    edges: Array<{
      node: {
        id: number;
        title: {
          romaji: string;
          english?: string | null;
        }
        coverImage: {
          medium: string;
          large?: string;
        }
        type: 'ANIME' | 'MANGA'
        format?: string | null;
        seasonYear?: number | null;
        averageScore?: string | null;
      }
    }>
  }
}

export interface CharacterResponse {
  Character: Character;
}

export interface AiringSchedule {
  episode: number;
  airingAt: number;
  timeUntilAiring: number;
  media: BasicMedia;
}

export interface AiringSchedulesResponse {
  Page: {
    airingSchedules: AiringSchedule[];
  }
}
