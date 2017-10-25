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
    host: {
      doc: 'Host for mongo connection',
      format: '*',
      env: 'MONGO_HOST',
      default: 'Mongo Database'
    },
    user: {
      doc: 'Username for mongo connection',
      format: String,
      default: 'Username',
      env: 'MONGO_USER'
    },
    password: {
      doc: 'Password for mongo connection',
      format: String,
      default: 'Password',
      env: 'MONGO_PASSWORD'
    }
  }
});

export default config;
