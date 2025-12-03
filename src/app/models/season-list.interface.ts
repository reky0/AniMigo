import { AnimeSeason } from '../helpers/utils';

/**
 * Configuration for season list pages
 *
 * Used to display anime for a specific season and year,
 * with filtering for adult content and pagination support
 */
export interface SeasonListConfig {
  /** The anime season (WINTER, SPRING, SUMMER, FALL) */
  season: AnimeSeason;

  /** The year for the season */
  year: number;

  /** Sort order for results, defaults to ['POPULARITY_DESC'] */
  sortType?: string[];

  /** Back button destination */
  defaultHref?: string;
}

/**
 * Parameters received from route for season list
 */
export interface SeasonListParams {
  season?: string;
  year?: string;
}

/**
 * Represents a media item in the season list
 * Extends the basic media structure with season-specific fields
 */
export interface SeasonalMedia {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  coverImage: {
    medium: string;
    large: string;
  };
  averageScore: number | null;
  seasonYear: number;
  season: AnimeSeason;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  type: 'ANIME' | 'MANGA';
  format: string;
  isFavourite: boolean;
  isAdult: boolean;
  popularity: number;
  episodes?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  mediaListEntry?: {
    id?: number;
    status?: string;
    score?: number | null;
    progress?: number | null;
    progressVolumes?: number | null;
    repeat?: number | null;
    private?: boolean | null;
    hiddenFromStatusLists?: boolean | null;
    notes?: string | null;
    startedAt?: { year?: number | null; month?: number | null; day?: number | null } | null;
    completedAt?: { year?: number | null; month?: number | null; day?: number | null } | null;
  } | null;
}

/**
 * Response structure for seasonal anime query
 */
export interface SeasonalMediaResponse {
  Page: {
    pageInfo: {
      currentPage: number;
      hasNextPage: boolean;
      total: number;
      perPage: number;
    };
    media: SeasonalMedia[];
  };
}
