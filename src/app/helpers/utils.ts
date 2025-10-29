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
