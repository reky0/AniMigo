import { gql } from "apollo-angular";

export const GET_TRENDING_ANIMES = gql`
          query TrendingAnime($page: Int = 1, $perPage: Int = 10, $isAdult: Boolean = false) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                currentPage
                hasNextPage
                total
                perPage
              }
              media(
                type: ANIME,
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
                trending
                description(asHtml: false)
                episodes
                averageScore
                genres
                season
                seasonYear
                type
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
              }
            }
          }
        `;

export const GET_TRENDING_MANGAS = gql`
          query TrendingManga($page: Int = 1, $perPage: Int = 20, $isAdult: Boolean = false) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                currentPage
                hasNextPage
                total
                perPage
              }
              media(
                type: MANGA,
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
                trending
                description(asHtml: false)
                chapters
                volumes
                averageScore
                genres
                status
                type
              }
            }
          }
        `;

export const GET_NEWLY_ADDED_ANIMES = gql`
          query NewlyAddedAnime($page: Int = 1, $perPage: Int = 20, $sort: [MediaSort] = [ID_DESC], $isAdult: Boolean = false) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                currentPage
                hasNextPage
                total
                perPage
              }
              media(
                type: ANIME,
                sort: $sort,
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
                startDate {
                  year
                  month
                  day
                }
                status
                type
              }
            }
          }
        `;

export const GET_NEWLY_ADDED_MANGAS = gql`
          query NewlyAddedManga($page: Int = 1, $perPage: Int = 20, $sort: [MediaSort] = [ID_DESC], $isAdult: Boolean = false) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                currentPage
                hasNextPage
                total
                perPage
              }
              media(
                type: MANGA,
                sort: $sort,
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
                chapters
                volumes
                averageScore
                genres
                startDate {
                  year
                  month
                  day
                }
                status
                type
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
      media(page: $page, perPage: $perPage, sort: POPULARITY_DESC) {
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
          }
        }
      }
    }
  }
`;
