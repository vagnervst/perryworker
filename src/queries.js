export default {
  repositories: {
    findAll: `query findAllReposQuery($organization: String!) {
      organization(login: $organization) {
        name
        login
        repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC) {
          nodes {
            name
            url
            primaryLanguage {
              name
            }
            pullRequests(first: 10) {
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
                comments {
                  totalCount
                }
                commits {
                  totalCount
                }
              }
            }
            issues(first: 10) {
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
              }
            }
          }
        }
      }
    }`
  }
}
