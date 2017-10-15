import chalk from 'chalk';

/**
  @param {Object[]} requests
  @param {Promise} requests.promise
  @param {Function} requests.registrator
*/
function Worker(requests) {

  function getPromises() {
    let promises = [];

    requests.forEach( (requestBundle) => {
      promises.push( requestBundle.promise );
    });

    return promises;
  }

  return {
    run: function() {

      Promise.all(getPromises())
      .then( responses => {

        let processedResponses = [];
        for( let i = 0; i < responses.length; ++i ) {
          requests[i].registrator( responses[i] );
        }

      })
      .catch( error => {
        console.log( error )
      });

    }
  }
}

export default Worker;
