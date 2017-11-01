import chalk from 'chalk';
import Promise from 'bluebird';

import requests from './requests';
import Worker from './worker';
import controllers from './mongo/controllers';
import Mongo from './mongo/connection';
import Helpers from './mongo/helper';
import Generators from './generators';
import asciiPerry from '../ascii';
import Sieve from './sieve';

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
    promise: requests.issues.findFromOrganization('pagarme', ['OPEN']),
    callback: (response) => {
      let organization = response.data.organization;

      Generators.saveOrganization(organization);
    }
  },
  {
    promise: requests.issues.findFromOrganization('pagarme', ['CLOSED']),
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
  },
  {
    promise: requests.issues.findRelated('pagarme'),
    callback: (response) => {
      let foundIssues = response.data.search.nodes;

      let filteredIssues = Sieve({
        whitelist: ['Issue'],
        itemsToFilter: foundIssues
      }, issue => issue.__typename ).mitigate();

      filteredIssues = Sieve({
        blacklist: ['pagarme'],
        itemsToFilter: filteredIssues
      }, issue => issue.repository.owner.login ).mitigate();      
    }
  }
]).run();
