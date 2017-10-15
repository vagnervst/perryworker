import convict from 'convict';

const config = convict({
  github: {
    doc: "Github V4 API",
    url: "https://api.github.com/graphql",
    token: {
      default: 'Github',
      doc: 'The github API token.',
      format: String,
      env: 'GITHUB_API_TOKEN',
    }
  },
  mongo: {
    host: 'mongodb://localhost/perryworker'
  }
});

export default config;
