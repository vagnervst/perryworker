import chalk from 'chalk';
import Promise from 'bluebird';
import { CronJob } from 'cron';

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

  function deliverPromisesResponsesToCallbacks( responses ) {

    for( let i = 0; i < responses.length; i += 1 ) {
      let callback = requests[i].callback;
      callback( responses[i] );
    }

  }

  function runPromises() {
    return Promise.all(getPromises())
    .then( responses => {

      deliverPromisesResponsesToCallbacks( responses );

    })
    .catch( error => {
      console.log( error );
    });
  }

  return {
    schedule: function() {

      new CronJob('0 0 */1 * * *', () => {
        console.log('CronJob running...');
        return runPromises();
      }, () => console.log('stoped'), true, 'America/Sao_Paulo');

    },
    run: function() {
      console.log(chalk.yellow('Worker started executing...'));

      runPromises();
      this.schedule();
    }
  }
}

export default Worker;
