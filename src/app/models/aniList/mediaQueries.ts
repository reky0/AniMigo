import { gql } from "apollo-angular";

export const GET_GENRES_AND_TAGS = gql`
  query {
    genres: GenreCollection
    tags: MediaTagCollection {
      name
      description
      category
      isAdult
    }
  }
`;

export const GET_MEDIA_LIST = gql`
  query MediaList(
    $page: Int = 1,
    $perPage: Int = 20,
    $type: MediaType!,
    $sort: [MediaSort],
    $season: MediaSeason,
    $seasonYear: Int,
    $format: MediaFormat,
    $status: MediaStatus,
    $context: String,
    $isAdult: Boolean
  ) {
    Page(page: $page, perPage: $perPage) @connection (key: "mediaList", filter: ["context", "sort"]) {
      pageInfo {
        currentPage
        hasNextPage
        total
        perPage
      }
      media(
        type: $type,
        sort: $sort,
        season: $season,
        seasonYear: $seasonYear,
        format: $format,
        status: $status,
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
        seasonYear
        startDate {
          year
        }
        type
        format
        isFavourite
        isAdult
        mediaListEntry {
          status
        }
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
      mediaListEntry {
        id
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
      }
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
            isFavourite
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
            isFavourite
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
            isFavourite
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
      }
      age
      gender
      bloodType
      isFavourite
      media {
        edges {
          characterRole
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
            isFavourite
          }
        }
      }
    }
  }
`;

export const GET_STAFF_BY_ID = gql`
  query GetStaff($id: Int!) {
    Staff(id: $id)  {
      id
      name {
        full
        native
        alternative
      }
      image {
        large
        medium
      }
      isFavourite
      description(asHtml: false)
      dateOfBirth {
        day
        month
        year
      }
      age
      gender
      bloodType
      yearsActive
      homeTown
      primaryOccupations
      characterMedia(sort: POPULARITY_DESC) {
        edges {
          staffRole
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
      staffMedia(sort: ID_DESC) {
        edges {
          staffRole
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

export const GET_CHARACTER_MEDIA = gql`
  query CharacterMedia($id: Int!, $page: Int = 1, $perPage: Int = 25) {
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
          characterRole
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

export const GET_STAFF_MEDIA_STAFF = gql`
  query StaffMedia($id: Int!, $page: Int = 1, $perPage: Int = 25) {
    Staff(id: $id) {
      id
      staffMedia(
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
          staffRole
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

export const GET_STAFF_VA_CHARACTERS = gql`
  query StaffMedia($id: Int!, $page: Int = 1, $perPage: Int = 25) {
    Staff(id: $id) {
      id
      characters(
        page: $page,
        perPage: $perPage,
        sort: [RELEVANCE, ID],
      ) {
        pageInfo {
          currentPage
          hasNextPage
          perPage
          total
        }
        edges {
          role
          node {
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
            isFavourite
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
          mediaListEntry {
            status
          }
        }
        episode
        airingAt
        timeUntilAiring
      }
    }
  }
`;

export const SEARCH_MEDIA = gql`
  query SearchMedia(
    $page: Int!,
    $search: String,
    $type: MediaType!,
    $format_in: [MediaFormat],
    $status_in: [MediaStatus],
    $startDate_greater: FuzzyDateInt,
    $startDate_lesser: FuzzyDateInt,
    $genre_in: [String],
    $sort: [MediaSort]
  ) {
    Page(page: $page) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
        total
      }
      media(
        search: $search,
        type: $type,
        format_in: $format_in,
        status_in: $status_in,
        startDate_greater: $startDate_greater,
        startDate_lesser: $startDate_lesser,
        genre_in: $genre_in,
        sort: $sort
      ) {
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
        mediaListEntry {
          status
        }
      }
    }
  }
`;

export const SEARCH_CHARACTER = gql`
  query SearchCharacter(
    $page: Int!,
    $search: String,
    $isBirthday: Boolean,
    $sort: [CharacterSort]
  ) {
    Page(page: $page) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
        total
      }
      characters(
        search: $search,
        isBirthday: $isBirthday,
        sort: $sort
      ) {
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
        media {
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
  }
`;

export const SEARCH_STAFF = gql`
  query SearchStaff(
    $page: Int!,
    $search: String,
    $isBirthday: Boolean,
    $sort: [StaffSort]
  ) {
    Page(page: $page) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
        total
      }
      staff(
        search: $search,
        isBirthday: $isBirthday,
        sort: $sort
      ) {
        id
        name {
          full
          native
          alternative
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
        yearsActive
        homeTown
        primaryOccupations
        isFavourite
        characters(page: 1, perPage: 25) {
          pageInfo {
            currentPage
            hasNextPage
            perPage
            total
          }
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
                medium
              }
            }
          }
        }
        staffMedia(page: 1, perPage: 25) {
          pageInfo {
            currentPage
            hasNextPage
            perPage
            total
          }
          edges {
            staffRole
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
  query GetUserFavourites($userId: Int!, $animePage: Int, $mangaPage: Int, $charactersPage: Int, $staffPage: Int, $perPage: Int) {
    User(id: $userId) {
      id
      name
      favourites {
        anime(page: $animePage, perPage: $perPage) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
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
            isFavourite
            mediaListEntry {
              status
            }
          }
        }
        manga(page: $mangaPage, perPage: $perPage) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
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
            isFavourite
            mediaListEntry {
              status
            }
          }
        }
        characters(page: $charactersPage, perPage: $perPage) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
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
            isFavourite
          }
        }
        staff(page: $staffPage, perPage: $perPage) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
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
            isFavourite
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
            mediaListEntry {
              status
            }
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
            mediaListEntry {
              status
            }
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
    animeRepeating: MediaListCollection(userId: $userId, type: ANIME, status: REPEATING) {
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
    mangaRepeating: MediaListCollection(userId: $userId, type: MANGA, status: REPEATING) {
      lists {
        entries {
          id
        }
      }
    }
  }
`;

export const GET_USER_FOLLOWERS = gql`
  query($id:Int!,$page:Int) {
    Page(page:$page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      followers(userId:$id,sort:USERNAME) {
        id
        name
        avatar {
          large
        }
      }
    }
  }
`;

export const GET_USER_FOLLOWING = gql`
  query($id:Int!,$page:Int) {
    Page(page:$page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      following(userId:$id,sort:USERNAME) {
        id
        name
        avatar {
          large
        }
      }
    }
  }
`;
