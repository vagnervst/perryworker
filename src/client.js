import chalk from 'chalk';
import Promise from 'bluebird';

import requests from './requests';
import Worker from './worker';
import controllers from './mongo/controllers';
import Mongo from './mongo/connection';
import Helpers from './mongo/helper';
import Generators from './generators';
import asciiPerry from '../ascii';

console.log(asciiPerry);
console.log(chalk.green('PerryWorker started running...'));
Worker([
  {
    promise: requests.repositories.find({ organization: 'pagarme' }),
    callback: (response) => {

      let organization = response.data.organization;

      Generators.saveOrganization(organization);
    }
  },
  {
    promise: requests.issues.findFromOrganization('pagarme'),
    callback: (response) => {

      let organization = response.data.organization;

      Generators.saveOrganization(organization);
    }
  },
  {
    promise: requests.pullrequests.fromOrganization('pagarme'),
    callback: (response) => {

      let organization = response.data.organization;

      Generators.saveOrganization(organization);
    }
  }
]).run();
