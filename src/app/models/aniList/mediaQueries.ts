import { gql } from "apollo-angular";

export const GET_TRENDING_MEDIA = gql`
          query TrendingAnime($page: Int = 1, $perPage: Int = 10, $type: MediaType!, $isAdult: Boolean = false, $context: String!) {
            Page(page: $page, perPage: $perPage) @connection (key: "trendingMedia", filter: ["context"]) {
              pageInfo {
                currentPage
                hasNextPage
                total
                perPage
              }
              media(
                type: $type,
                sort: TRENDING_DESC,
                isAdult: $isAdult
              ) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  medium
                  large
                }
                averageScore
                type
                isFavourite
              }
            }
          }
        `;

export const GET_NEXT_SEASON_ANIMES = gql`
          query NextSeasonAnime($page: Int = 1, $perPage: Int = 20, $season: MediaSeason, $seasonYear: Int, $isAdult: Boolean = false) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                currentPage
                hasNextPage
                total
                perPage
              }
              media(
                type: ANIME,
                season: $season,
                seasonYear: $seasonYear,
                sort: POPULARITY_DESC,
                isAdult: $isAdult
              ) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  medium
                  large
                }
                description(asHtml: false)
                episodes
                averageScore
                genres
                season
                seasonYear
                type
                isFavourite
              }
            }
          }
        `;

export const GET_NEWLY_ADDED_MEDIA = gql`
          query ($page: Int = 1, $perPage: Int = 20, $type: MediaType!, $isAdult: Boolean = false, $context: String!) {
            Page(page: $page, perPage: $perPage) @connection (key: "newlyAddedMedia", filter: ["context"]) {
              pageInfo {
                currentPage
                hasNextPage
                total
                perPage
              }
              media(
                type: $type,
                sort: ID_DESC,
                isAdult: $isAdult
              ) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  medium
                  large
                }
                averageScore
                type
                isFavourite
              }
            }
          }
        `;

export const GET_MEDIA_BY_ID = gql`
          query MediaDetails($id: Int!, $type: MediaType!) {
            Media(id: $id, type: $type) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
                medium
              }
              isFavourite
              bannerImage
              description(asHtml: false)
              averageScore
              meanScore
              episodes
              chapters
              volumes
              status
              season
              seasonYear
              genres
              source
              format
              duration
              isAdult
              siteUrl
              type
              popularity
              favourites
              nextAiringEpisode {
                episode
                timeUntilAiring
                airingAt
              }
              studios {
                edges {
                  isMain
                  node {
                    id
                    name
                  }
                }
              }
              tags {
                id
                name
                description
                category
                isAdult
                isGeneralSpoiler
                isMediaSpoiler
                rank
              }
              staff(sort: [RELEVANCE, ID]) {
                edges {
                  role
                  node {
                    id
                    name {
                      full
                      native
                    }
                    image {
                      medium
                    }
                  }
                }
              }
              relations {
                edges {
                  relationType
                  node {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      medium
                      large
                    }
                    type
                    format
                    status
                    isFavourite
                  }
                }
              }
              recommendations(sort: RATING_DESC) {
                nodes {
                  mediaRecommendation {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      medium
                      large
                    }
                    siteUrl
                    type
                    isFavourite
                  }
                  rating
                }
              }
              synonyms
              trailer {
                id
                site
                thumbnail
              }
              streamingEpisodes {
                title
                url
                thumbnail
                site
              }
              externalLinks {
                color
                icon
                id
                isDisabled
                language
                notes
                site
                siteId
                type
                url
              }
              characters(sort: [ROLE, RELEVANCE, ID]) {
                edges {
                  role
                  node {
                    id
                    name {
                      full
                      native
                    }
                    image {
                      large
                      medium
                    }
                  }
                  voiceActors {
                    id
                    name {
                      full
                      native
                    }
                    language
                    image {
                      large
                      medium
                    }
                  }
                }
              }
              rankings {
                allTime
                context
                format
                id
                rank
                season
                type
                year
              }
              stats {
                statusDistribution {
                    amount
                    status
                }
                scoreDistribution {
                    amount
                    score
                }
              }
              startDate {
                day,
                month,
                year
              }
              endDate {
                day,
                month,
                year
              }
            }
          }
        `;

export const GET_CHARACTER_BY_ID = gql`
          query getCharacter($id: Int!) {
            Character(id: $id) {
              id
              name {
                full
                native
                alternative
                alternativeSpoiler
              }
              image {
                large
                medium
              }
              description(asHtml: false)
              dateOfBirth {
                  day
                  month
                  year
              }
              age
              gender
              bloodType
              isFavourite
              media(page: 1, perPage: 15) {
                pageInfo {
                  currentPage
                  hasNextPage
                  perPage
                  total
                }
                edges {
                  node {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      medium
                      large
                    }
                    type
                    format
                    seasonYear
                    averageScore
                  }
                }
              }
            }
          }
        `;

export const GET_CHARACTER_MEDIA = gql`
  query CharacterMedia($id: Int!, $page: Int = 1, $perPage: Int = 20) {
    Character(id: $id) {
      id
      media(
        page: $page,
        perPage: $perPage,
        sort: POPULARITY_DESC,
      ) {
        pageInfo {
          currentPage
          hasNextPage
          perPage
          total
        }
        edges {
          node {
            id
            type
            title {
              romaji
              english
            }
            coverImage {
              medium
              large
            }
            isAdult
            format
            seasonYear
            averageScore
            isFavourite
            startDate {
              year
            }
          }
        }
      }
    }
  }
`;

export const GET_AIRING_SCHEDULES = gql`
  query ($from: Int, $to: Int) {
    Page(page: 1, perPage: 50) {
      airingSchedules(
        airingAt_greater: $from
        airingAt_lesser: $to
        sort: [TIME]
      ) {
        media {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
            large
          }
          type
          isAdult
        }
        episode
        airingAt
        timeUntilAiring
      }
    }
  }
`;

export const GET_TOP_MEDIA = gql`
  query ($page: Int = 1, $perPage: Int = 25, $type: MediaType!, $sort: [MediaSort], $isAdult: Boolean = false) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        total
        perPage
      }
      media(type: $type, sort: $sort, isAdult: $isAdult) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          medium
          large
        }
        averageScore
        seasonYear
        startDate {
          year
        }
        type
        isAdult
        format
        isFavourite
      }
    }
  }
`;

export const SEARCH_MEDIA = gql`
  query SearchMedia($page: Int!, $search: String!, $type: MediaType!) {
    Page(page: $page) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
        total
      }
      media(search: $search, type: $type) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        averageScore
        isFavourite
        type
        format
        startDate {
          year
        }
      }
    }
  }
`;

export const SEARCH_CHARACTER = gql`
  query SearchCharacter($page: Int!, $search: String!) {
    Page(page: $page) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
        total
      }
      characters(search: $search) {
        id
        name {
          full
          native
        }
        image {
          large
          medium
        }
        isFavourite
      }
    }
  }
`;


// ============================================
// User Queries
// ============================================

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    Viewer {
      id
      name
      about
      avatar {
        large
        medium
      }
      bannerImage
      options {
        titleLanguage
        displayAdultContent
        airingNotifications
        profileColor
      }
      mediaListOptions {
        scoreFormat
        rowOrder
        animeList {
          sectionOrder
          splitCompletedSectionByFormat
          customLists
          advancedScoring
          advancedScoringEnabled
        }
        mangaList {
          sectionOrder
          splitCompletedSectionByFormat
          customLists
          advancedScoring
          advancedScoringEnabled
        }
      }
      statistics {
        anime {
          count
          episodesWatched
          minutesWatched
          meanScore
          standardDeviation
        }
        manga {
          count
          chaptersRead
          volumesRead
          meanScore
          standardDeviation
        }
      }
      unreadNotificationCount
      siteUrl
      donatorTier
      donatorBadge
      moderatorRoles
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    User(id: $id) {
      id
      name
      about
      avatar {
        large
        medium
      }
      bannerImage
      isFollowing
      isFollower
      isBlocked
      options {
        titleLanguage
        displayAdultContent
        profileColor
      }
      statistics {
        anime {
          count
          episodesWatched
          minutesWatched
          meanScore
          standardDeviation
        }
        manga {
          count
          chaptersRead
          volumesRead
          meanScore
          standardDeviation
        }
      }
      siteUrl
      donatorTier
      donatorBadge
      moderatorRoles
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_STATISTICS = gql`
  query GetUserStatistics($userId: Int!) {
    User(id: $userId) {
      id
      name
      statistics {
        anime {
          count
          episodesWatched
          minutesWatched
          meanScore
          standardDeviation
          statuses {
            status
            count
            minutesWatched
            meanScore
          }
          scores {
            score
            count
            minutesWatched
            meanScore
          }
          formats {
            format
            count
            minutesWatched
            meanScore
          }
          genres {
            genre
            count
            minutesWatched
            meanScore
          }
          tags(limit: 10, sort: COUNT_DESC) {
            tag {
              id
              name
            }
            count
            minutesWatched
            meanScore
          }
          releaseYears {
            releaseYear
            count
            minutesWatched
            meanScore
          }
          startYears {
            startYear
            count
            minutesWatched
            meanScore
          }
        }
        manga {
          count
          chaptersRead
          volumesRead
          meanScore
          standardDeviation
          statuses {
            status
            count
            chaptersRead
            meanScore
          }
          scores {
            score
            count
            chaptersRead
            meanScore
          }
          formats {
            format
            count
            chaptersRead
            meanScore
          }
          genres {
            genre
            count
            chaptersRead
            meanScore
          }
          tags(limit: 10, sort: COUNT_DESC) {
            tag {
              id
              name
            }
            count
            chaptersRead
            meanScore
          }
          releaseYears {
            releaseYear
            count
            chaptersRead
            meanScore
          }
          startYears {
            startYear
            count
            chaptersRead
            meanScore
          }
        }
      }
    }
  }
`;

export const GET_USER_FAVOURITES = gql`
  query GetUserFavourites($userId: Int!) {
    User(id: $userId) {
      id
      name
      favourites {
        anime {
          nodes {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            type
            format
            seasonYear
            averageScore
          }
        }
        manga {
          nodes {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            type
            format
            seasonYear
            averageScore
          }
        }
        characters {
          nodes {
            id
            name {
              full
              native
            }
            image {
              large
              medium
            }
          }
        }
        staff {
          nodes {
            id
            name {
              full
              native
            }
            image {
              large
              medium
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_MEDIA_LIST = gql`
  query GetUserMediaList($userId: Int!, $type: MediaType!, $status: MediaListStatus) {
    MediaListCollection(userId: $userId, type: $type, status: $status) {
      lists {
        name
        isCustomList
        isSplitCompletedList
        status
        entries {
          id
          mediaId
          status
          score
          progress
          progressVolumes
          repeat
          priority
          private
          notes
          hiddenFromStatusLists
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
          media {
            id
            title {
              romaji
              english
              native
              userPreferred
            }
            coverImage {
              extraLarge
              large
              medium
              color
            }
            type
            format
            status
            episodes
            chapters
            volumes
            season
            seasonYear
            averageScore
            popularity
            genres
            nextAiringEpisode {
              episode
              timeUntilAiring
              airingAt
            }
          }
        }
      }
      user {
        id
        name
        avatar {
          large
          medium
        }
      }
    }
  }
`;

export const GET_USER_PROFILE_DATA = gql`
  query GetUserProfileData($userId: Int!) {
    User(id: $userId) {
      id
      name
      about
      avatar {
        large
        medium
      }
      bannerImage
      isFollowing
      isFollower
      isBlocked
      options {
        titleLanguage
        displayAdultContent
        profileColor
      }
      mediaListOptions {
        scoreFormat
        rowOrder
      }
      statistics {
        anime {
          count
          episodesWatched
          minutesWatched
          meanScore
          standardDeviation
          statuses {
            status
            count
            minutesWatched
            meanScore
          }
          scores(limit: 5, sort: COUNT_DESC) {
            score
            count
            minutesWatched
            meanScore
          }
          formats {
            format
            count
            minutesWatched
            meanScore
          }
          genres(limit: 10, sort: COUNT_DESC) {
            genre
            count
            minutesWatched
            meanScore
          }
        }
        manga {
          count
          chaptersRead
          volumesRead
          meanScore
          standardDeviation
          statuses {
            status
            count
            chaptersRead
            meanScore
          }
          scores(limit: 5, sort: COUNT_DESC) {
            score
            count
            chaptersRead
            meanScore
          }
          formats {
            format
            count
            chaptersRead
            meanScore
          }
          genres(limit: 10, sort: COUNT_DESC) {
            genre
            count
            chaptersRead
            meanScore
          }
        }
      }
      favourites {
        anime(page: 1, perPage: 9) {
          nodes {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            type
            format
            seasonYear
            averageScore
            isAdult
          }
        }
        manga(page: 1, perPage: 9) {
          nodes {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            type
            format
            seasonYear
            averageScore
            isAdult
          }
        }
        characters(page: 1, perPage: 9) {
          nodes {
            id
            name {
              full
              native
            }
            image {
              large
              medium
            }
          }
        }
      }
      siteUrl
      donatorTier
      donatorBadge
      createdAt
      updatedAt
    }
  }
`;

// Query to get accurate status counts for both anime and manga in a single request
export const GET_USER_STATUS_COUNTS = gql`
  query GetUserStatusCounts($userId: Int!) {
    animeCurrent: MediaListCollection(userId: $userId, type: ANIME, status: CURRENT) {
      lists {
        entries {
          id
        }
      }
    }
    animeCompleted: MediaListCollection(userId: $userId, type: ANIME, status: COMPLETED) {
      lists {
        entries {
          id
        }
      }
    }
    animePaused: MediaListCollection(userId: $userId, type: ANIME, status: PAUSED) {
      lists {
        entries {
          id
        }
      }
    }
    animeDropped: MediaListCollection(userId: $userId, type: ANIME, status: DROPPED) {
      lists {
        entries {
          id
        }
      }
    }
    animePlanning: MediaListCollection(userId: $userId, type: ANIME, status: PLANNING) {
      lists {
        entries {
          id
        }
      }
    }
    mangaCurrent: MediaListCollection(userId: $userId, type: MANGA, status: CURRENT) {
      lists {
        entries {
          id
        }
      }
    }
    mangaCompleted: MediaListCollection(userId: $userId, type: MANGA, status: COMPLETED) {
      lists {
        entries {
          id
        }
      }
    }
    mangaPaused: MediaListCollection(userId: $userId, type: MANGA, status: PAUSED) {
      lists {
        entries {
          id
        }
      }
    }
    mangaDropped: MediaListCollection(userId: $userId, type: MANGA, status: DROPPED) {
      lists {
        entries {
          id
        }
      }
    }
    mangaPlanning: MediaListCollection(userId: $userId, type: MANGA, status: PLANNING) {
      lists {
        entries {
          id
        }
      }
    }
  }
`;
