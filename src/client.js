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
    registrator: (response) => {

      let organization = response.data.organization;

      return Generators.organization(organization)
      .then( mongoOrganization => {

        let repositoriesGenerators = organization.repositories.nodes.map( repository => {

          let coroutine = Promise.coroutine( function* ( organization, repositorySpec ) {

            let mongoRepository = yield Generators.repository( organization, repositorySpec );

            let issuesGenerators = repositorySpec.issues.nodes.map( issue => {

              let issueCoroutine = Promise.coroutine(function* (repository, issueSpec) {

                let mongoIssue = yield Generators.issue( repository, issueSpec );

                return mongoIssue;
              });

              return issueCoroutine(mongoRepository, issue);

            });

            return mongoRepository;
          });

          return coroutine(mongoOrganization, repository);

        });

        return Promise.all(repositoriesGenerators);

      });
    }
  }
]).run().then( (values) => {
  Mongo.connection.close();
});
