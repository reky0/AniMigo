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
 * Save or update a media list entry
 * @param mediaId - ID of the media
 * @param status - Media list status (CURRENT, PLANNING, COMPLETED, DROPPED, PAUSED, REPEATING)
 * @param score - Score rating (0-10 or based on user's scoring system)
 * @param progress - Episode/chapter progress
 * @param progressVolumes - Volume progress (manga only)
 * @param repeat - Number of times rewatched/reread
 * @param private - Whether the entry is private
 * @param hiddenFromStatusLists - Hide from status lists
 * @param notes - Personal notes
 * @param startedAt - Start date (FuzzyDateInput with year, month, day)
 * @param completedAt - Completion date (FuzzyDateInput with year, month, day)
 * @returns Updated media list entry
 */
export const SAVE_MEDIA_LIST_ENTRY = gql`
  mutation SaveMediaListEntry(
    $mediaId: Int
    $status: MediaListStatus
    $score: Float
    $progress: Int
    $progressVolumes: Int
    $repeat: Int
    $private: Boolean
    $hiddenFromStatusLists: Boolean
    $notes: String
    $startedAt: FuzzyDateInput
    $completedAt: FuzzyDateInput
  ) {
    SaveMediaListEntry(
      mediaId: $mediaId
      status: $status
      score: $score
      progress: $progress
      progressVolumes: $progressVolumes
      repeat: $repeat
      private: $private
      hiddenFromStatusLists: $hiddenFromStatusLists
      notes: $notes
      startedAt: $startedAt
      completedAt: $completedAt
    ) {
      id
      mediaId
      status
      score
      progress
      progressVolumes
      repeat
      private
      hiddenFromStatusLists
      notes
      startedAt {
        year
        month
        day
      }
      completedAt {
        year
        month
        day
      }
      updatedAt
      createdAt
    }
  }
`;

/**
 * Delete a media list entry
 * @param id - ID of the media list entry to delete
 * @returns Deleted entry data
 */
export const DELETE_MEDIA_LIST_ENTRY = gql`
  mutation DeleteMediaListEntry($id: Int) {
    DeleteMediaListEntry(id: $id) {
      deleted
    }
  }
`;

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
