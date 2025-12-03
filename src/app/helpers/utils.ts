import { TitleLanguage } from "../models/aniList/mutationInterfaces";
import { FuzzyDate, Title } from "../models/aniList/responseInterfaces";

// ============================================
// Title Preference Helpers
// ============================================

/**
 * Get the preferred title based on user preference settings
 * Falls back to romaji if the preferred language is not available
 * @param title - The title object containing romaji, english, native, and userPreferred
 * @param userTitlePreference - The user's title language preference (ROMAJI, ENGLISH, NATIVE, etc.)
 * @returns The title in the preferred language, or romaji as fallback
 */
export function getPreferredTitle(
  title: Title | null | undefined,
  userTitlePreference?: TitleLanguage | string | null
): string {
  if (!title) return '';

  // If userPreferred is available and populated, use it (AniList's server-side preference handling)
  if (title.userPreferred) {
    return title.userPreferred;
  }

  // Otherwise, handle client-side based on preference
  const preference = userTitlePreference?.toUpperCase();

  switch (preference) {
    case 'ENGLISH':
    case 'ENGLISH_STYLISED':
      return title.english || title.romaji || title.native || '';

    case 'NATIVE':
    case 'NATIVE_STYLISED':
      return title.native || title.romaji || title.english || '';

    case 'ROMAJI':
    case 'ROMAJI_STYLISED':
    default:
      // Default to romaji, fallback to english, then native
      return title.romaji || title.english || title.native || '';
  }
}

/**
 * Get the preferred character name based on user preference
 * Falls back to full name if the preferred language is not available
 * @param name - The character/staff name object
 * @param userStaffNamePreference - The user's staff/character name language preference
 * @returns The name in the preferred format
 */
export function getPreferredCharacterName(
  name: { full?: string | null; native?: string | null; alternative?: string[] | null } | null | undefined,
  userStaffNamePreference?: TitleLanguage | string | null
): string {
  if (!name) return '';

  const preference = userStaffNamePreference?.toUpperCase();

  switch (preference) {
    case 'NATIVE':
    case 'NATIVE_STYLISED':
      return name.native || name.full || '';

    case 'ENGLISH':
    case 'ENGLISH_STYLISED':
    case 'ROMAJI':
    case 'ROMAJI_STYLISED':
    default:
      // Default to full name (which is typically in romaji/english)
      return name.full || name.native || '';
  }
}

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
 * If currently in Winter (Dec-Feb), next season is Spring of next year (accounting for year transition)
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

  // If we're in Winter (which spans Dec-Feb across two years)
  // The next season is Spring, and we need to use the appropriate year
  if (currentIndex === 0) {
    return {
      season: seasonOrder[1], // SPRING
      year: month === 12 ? year + 1 : year // If December, next spring is next year
    };
  }

  // For Spring and Summer, next season is in the same year
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

/**
 * Gets the appropriate year for a given season based on current date
 * If the season has already passed in the current year, returns next year
 *
 * Example: If we're in December 2025 (Winter):
 * - WINTER -> 2025 (current, Dec-Feb)
 * - SPRING -> 2026 (next year, not yet started)
 * - SUMMER -> 2026 (next year, not yet started)
 * - FALL -> 2026 (next year, not yet started)
 *
 * Example: If we're in Fall 2025:
 * - WINTER -> 2025 (upcoming, Dec-Feb)
 * - SPRING -> 2026 (already passed)
 * - SUMMER -> 2026 (already passed)
 * - FALL -> 2025 (current)
 */
export function getSeasonYear(targetSeason: AnimeSeason): number {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const currentSeason = getSeasonFromMonth(month);

  const seasonOrder: AnimeSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
  const currentIndex = seasonOrder.indexOf(currentSeason);
  const targetIndex = seasonOrder.indexOf(targetSeason);

  // If target is the current season, return current year
  if (targetSeason === currentSeason) {
    return year;
  }

  // Special handling for Winter since it spans two years (Dec-Feb)
  if (currentSeason === 'WINTER') {
    if (month === 12) {
      // We're in December 2025
      // Winter 2025 is current (Dec-Feb)
      // All other seasons (Spring, Summer, Fall) are next year (2026)
      return targetSeason === 'WINTER' ? year : year + 1;
    } else {
      // We're in Jan-Feb 2026
      // Winter 2026 is current
      // Spring/Summer are upcoming this year (2026)
      // Fall has passed, so it's next year (2027)
      if (targetSeason === 'WINTER') return year;
      if (targetSeason === 'FALL') return year + 1;
      return year; // Spring or Summer
    }
  }

  // For non-Winter current seasons:
  // If target comes after current in the season order, it's this year
  // If target comes before current in the season order, it has passed and is next year
  // Special case: Winter is always upcoming (same year) when current is Fall
  if (currentSeason === 'FALL' && targetSeason === 'WINTER') {
    return year; // Winter is upcoming (Dec-Feb)
  }

  // If target index is greater than current, it's upcoming this year
  if (targetIndex > currentIndex) {
    return year;
  }

  // If target index is less than current, it has already passed this year
  return year + 1;
}
