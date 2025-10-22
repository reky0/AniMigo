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
            format
            seasonYear
            averageScore
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
      }
    }
  }
`;
