import { FuzzyDate } from "../models/aniList/responseInterfaces";

export function openUrl(url: string | undefined): void {
  if (url) {
    window.open(url, '_system')
  }
}

export function getLangCode(lang: string | null | undefined): string | null | undefined {
  switch (lang) {
    case 'English': return 'EN';
    case 'Japanese': return 'JP';
    case 'Korean': return 'KR';
    case 'Chinese': return 'CN';
    case 'German': return 'DE';
    case 'Spanish': return 'ES';
    case 'French': return 'FR';
    case 'Italian': return 'IT';
    case 'Russian': return 'RU';
    case 'Portuguese': return 'PT';
    default:
      return lang;
  }
}

export function toSentenceCase(str: string | null | undefined, separator: string = " "): string {
  if (!str) return '';
  if (str==='TV' || str==='OVA' || str==='ONA') return str;

  let lower = str.slice(1).toLowerCase();

  return str.charAt(0).toUpperCase() + lower.replace(/_/g, ' ').split(' ').join(separator);
}

export function formatDate(date: FuzzyDate | null | undefined): string {
  if (!date) {
    return "Unknown"
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let day = String(date?.day) ?? '1';
  let monthNum = date?.month ?? 1;
  let monthName = monthNames[monthNum - 1] || String(monthNum);
  let year = String(date?.year) ?? '1';

  return `${day} ${monthName}, ${year}`
}

export function slugify(str: string): string {
  return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Remove duplicate hyphens
      .trim();
}

// ============================================
// Anime Season Helpers
// ============================================

export type AnimeSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

export interface SeasonInfo {
  season: AnimeSeason;
  year: number;
}

/**
 * Determines the anime season based on a given month (1-12)
 * Winter: December, January, February
 * Spring: March, April, May
 * Summer: June, July, August
 * Fall: September, October, November
 */
export function getSeasonFromMonth(month: number): AnimeSeason {
  if (month === 12 || month === 1 || month === 2) return 'WINTER';
  if (month >= 3 && month <= 5) return 'SPRING';
  if (month >= 6 && month <= 8) return 'SUMMER';
  return 'FALL';
}

/**
 * Gets the current anime season and year
 */
export function getCurrentSeason(): SeasonInfo {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  const year = now.getFullYear();
  
  return {
    season: getSeasonFromMonth(month),
    year: year
  };
}

/**
 * Gets the next anime season and year
 * If currently in Fall, next season is Winter of next year
 */
export function getNextSeason(): SeasonInfo {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const currentSeason = getSeasonFromMonth(month);
  
  const seasonOrder: AnimeSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
  const currentIndex = seasonOrder.indexOf(currentSeason);
  
  // If we're in Fall, next season is Winter of next year
  if (currentIndex === 3) {
    return {
      season: 'WINTER',
      year: year + 1
    };
  }
  
  // Otherwise, next season is in the same year
  return {
    season: seasonOrder[currentIndex + 1],
    year: year
  };
}

/**
 * Gets the upcoming season (current season if we're at the beginning, otherwise next season)
 * This is useful for showing "upcoming" anime that might still be airing in the current season
 */
export function getUpcomingSeason(): SeasonInfo {
  const now = new Date();
  const month = now.getMonth() + 1;
  const dayOfMonth = now.getDate();
  
  // If we're in the first half of the first month of a season, show current season
  // Otherwise show next season
  const currentSeason = getCurrentSeason();
  const isFirstMonthOfSeason = 
    (currentSeason.season === 'WINTER' && (month === 1 || month === 12)) ||
    (currentSeason.season === 'SPRING' && month === 3) ||
    (currentSeason.season === 'SUMMER' && month === 6) ||
    (currentSeason.season === 'FALL' && month === 9);
  
  if (isFirstMonthOfSeason && dayOfMonth <= 15) {
    return currentSeason;
  }
  
  return getNextSeason();
}
