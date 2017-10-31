import promise from 'request-promise';
import config from '../config.js';
import queries from '../queries.js';

function Issues() {

  return {
    findFromOrganization: (organizationLogin, states) => {

      const options = {
        method: 'POST',
        uri: config.get('github.url'),
        headers: {
          'User-Agent': 'perryworker',
          'Authorization': `bearer ${config.get('github.token')}`
        },
        body: {
          query: queries.issues.company,
          variables: { "organization": organizationLogin, "status": states }
        },
        json: true
      }

      return promise(options);

    },
    findRelated: function(term) {

      const options = {
        method: 'POST',
        uri: config.get('github.url'),
        headers: {
          'User-Agent': 'perryworker',
          'Authorization': `bearer ${config.get('github.token')}`
        },
        body: {
          query: queries.issues.related,
          variables: { "term": term }
        },
        json: true
      }

      return promise(options);
    }
  }
}

export default Issues;
