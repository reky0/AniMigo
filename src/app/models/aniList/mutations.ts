import { gql } from "apollo-angular";

// ============================================
// Favorite Toggle Mutations
// ============================================

/**
 * Toggle favorite status for anime or manga
 * @param animeId - ID of the anime to toggle (optional)
 * @param mangaId - ID of the manga to toggle (optional)
 * @returns Updated favorite status
 */
export const TOGGLE_FAVORITE_MEDIA = gql`
  mutation ToggleFavoriteMedia($animeId: Int, $mangaId: Int) {
    ToggleFavourite(animeId: $animeId, mangaId: $mangaId) {
      anime {
        nodes {
          id
        }
      }
      manga {
        nodes {
          id
        }
      }
    }
  }
`;

/**
 * Toggle favorite status for a character
 * @param characterId - ID of the character to toggle
 * @returns Updated favorite status
 */
export const TOGGLE_FAVORITE_CHARACTER = gql`
  mutation ToggleFavoriteCharacter($characterId: Int) {
    ToggleFavourite(characterId: $characterId) {
      characters {
        nodes {
          id
        }
      }
    }
  }
`;

/**
 * Toggle favorite status for a staff member
 * @param staffId - ID of the staff member to toggle
 * @returns Updated favorite status
 */
export const TOGGLE_FAVORITE_STAFF = gql`
  mutation ToggleFavoriteStaff($staffId: Int) {
    ToggleFavourite(staffId: $staffId) {
      staff {
        nodes {
          id
        }
      }
    }
  }
`;

/**
 * Toggle favorite status for a studio
 * @param studioId - ID of the studio to toggle
 * @returns Updated favorite status
 */
export const TOGGLE_FAVORITE_STUDIO = gql`
  mutation ToggleFavoriteStudio($studioId: Int) {
    ToggleFavourite(studioId: $studioId) {
      studios {
        nodes {
          id
        }
      }
    }
  }
`;

// ============================================
// User Settings Mutations
// ============================================

/**
 * Update user settings
 * @param titleLanguage - Preferred title language (ROMAJI, ENGLISH, NATIVE, ROMAJI_STYLISED, ENGLISH_STYLISED, NATIVE_STYLISED)
 * @param displayAdultContent - Whether to display adult content
 * @param airingNotifications - Whether to receive airing notifications
 * @param profileColor - Profile color (blue, purple, pink, orange, red, green, gray)
 * @returns Updated user data
 */
export const UPDATE_USER_SETTINGS = gql`
  mutation UpdateUser(
    $titleLanguage: UserTitleLanguage
    $displayAdultContent: Boolean
    $airingNotifications: Boolean
    $profileColor: String
  ) {
    UpdateUser(
      titleLanguage: $titleLanguage
      displayAdultContent: $displayAdultContent
      airingNotifications: $airingNotifications
      profileColor: $profileColor
    ) {
      id
      name
      options {
        titleLanguage
        displayAdultContent
        airingNotifications
        profileColor
      }
    }
  }
`;
