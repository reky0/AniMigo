export interface TopMediaConfig {
  titlePrefix: string;           // 'Top 100', 'Top Popular', 'Top Movies'
  sortType: string[];            // ['SCORE_DESC'] or ['POPULARITY_DESC']
  format?: string;               // Optional: 'MOVIE', 'TV', etc.
  maxItems?: number;             // Optional: 100 for top-100
  typeSource: 'route' | 'fixed'; // Get type from route param or use fixed value
  fixedType?: string;            // If typeSource is 'fixed', use this (e.g., 'anime')
  defaultHref: string;           // Back button destination
}
