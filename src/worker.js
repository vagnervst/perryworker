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
      console.log(chalk.yellow('Worker started executing...'));

      return Promise.all(getPromises())
      .then( responses => {

        let registratorPromises = [];
        for( let i = 0; i < responses.length; ++i ) {
          let registratorPromise = requests[i].registrator( responses[i] );
          registratorPromises.push( registratorPromise );
        }

        return Promise
        .all(registratorPromises)
        .then( () => console.log(chalk.yellow('Worker finished execution')));

      })
      .catch( error => {
        console.log( error );
      });

    }
  }
}

export default Worker;
