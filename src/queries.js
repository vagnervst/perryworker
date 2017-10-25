export default {
  repositories: {
    findAll: `query findAllReposQuery($organization: String!) {
      organization(login: $organization) {
        name
        login
        repositories(first: 30, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC) {
          nodes {
            name
            url
            primaryLanguage {
              name
            }
            pullRequests(first: 20) {
              totalCount
              nodes {
                title
                createdAt
                url
                bodyText
                repository {
                  name
                  url
                  primaryLanguage {
                    name
                  }
                }
                author {
                  login
                  url
                  avatarUrl
                }
                comments(last: 1) {
                  totalCount
                  nodes {
                    bodyText
                    author {
                      login
                      avatarUrl
                      url
                    }
                  }
                }
                commits {
                  totalCount
                }
              }
            }
            issues(first: 20 orderBy: {field: CREATED_AT, direction: DESC}) {
              totalCount,
              nodes {
                title
                state
                author {
                  login
                  url
                  avatarUrl
                }
                createdAt
                url
                bodyText
                assignees(first: 3) {
                  nodes {
                    login
                    avatarUrl
                    url
                  }
                }
                comments(last: 1) {
                  totalCount
                  nodes {
                    bodyText
                    author {
                      login
                      avatarUrl
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`
  },
  issues: {
    related: `query pagarmeqlRelatedIssuesQuery($term: String!){
      search(query: $term, type: ISSUE, first: 50) {
        nodes {
          ... on Issue {
            __typename
            title
            state
            createdAt
            url
            author {
              login
              avatarUrl
              url
            }
            assignees(first: 3) {
              nodes {
                avatarUrl
                login
                url
              }
            }
            comments(last: 1) {
              totalCount
              nodes {
                bodyText
                author {
                  login
                  url
                }
              }
            }
            repository {
              name
              url
              isPrivate
              owner {
                login
              }
            }
          }
        }
      }
    }`
  }
}
