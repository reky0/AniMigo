/**
 * Configuration for media list pages
 *
 * Example configs:
 *
 * Upcoming Anime:
 * {
 *   titlePrefix: 'Upcoming',
 *   sortType: ['START_DATE'],        // Sort by start date (oldest first)
 *   status: 'NOT_YET_RELEASED',
 *   typeSource: 'route',
 *   defaultHref: '/explore'
 * }
 *
 * Currently Airing/Publishing:
 * {
 *   titlePrefix: 'Airing',
 *   sortType: ['POPULARITY_DESC'],   // or ['TRENDING_DESC']
 *   status: 'RELEASING',
 *   typeSource: 'route',
 *   defaultHref: '/explore'
 * }
 */
export interface MediaListConfig {
  titlePrefix: string;           // 'Top 100', 'Top Popular', 'Upcoming', etc.
  sortType?: string[];           // Optional: ['SCORE_DESC'], ['POPULARITY_DESC'], ['START_DATE'], ['START_DATE_DESC'], etc.
  format?: string;               // Optional: 'MOVIE', 'TV', etc.
  status?: string;               // Optional: 'NOT_YET_RELEASED', 'RELEASING', 'FINISHED', etc.
  maxItems?: number;             // Optional: 100 for top-100
  typeSource: 'route' | 'fixed'; // Get type from route param or use fixed value
  fixedType?: string;            // If typeSource is 'fixed', use this (e.g., 'anime')
  defaultHref: string;           // Back button destination
}
