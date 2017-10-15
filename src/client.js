import chalk from 'chalk';

import requests from './requests';
import Worker from './worker.js';
import controllers from './mongo/controllers';
import Mongo from './mongo/connection.js';
import Helpers from './mongo/helper';

Worker([
  {
    promise: requests.repositories.find({ organization: 'pagarme' }),
    registrator: (response) => {

      let organization = response.data.organization;
      controllers.organization.save({ name: organization.name, login: organization.login })
      .then( mongoOrganization => {

        organization.repositories.nodes.forEach( repository => {

          let primaryLanguage = repository.primaryLanguage ? repository.primaryLanguage.name : '';

          controllers.repository.save({
            name: repository.name,
            organizationId: mongoOrganization._id,
            primaryLanguage,
            url: repository.url
          }).then( mongoRepository => {

            let helpersPromises = [];

            repository.issues.nodes.forEach( issue => {

              let assigneesPromises = [];
              issue.assignees.nodes.forEach( assignee => {

                assigneesPromises.push(controllers.user.save({
                  login: assignee.login,
                  avatarUrl: assignee.avatarUrl,
                  url: assignee.url
                }));

              });

              const promisifiedIssue = {
                title: issue.title,
                state: issue.state,
                url: issue.url,
                createdAt: issue.createdAt,
                repositoryId: mongoRepository._id,
                authorId: controllers.user.save({
                  login: issue.author.login,
                  avatarUrl: issue.author.avatarUrl,
                  url: issue.author.url
                }),
                assignees: assigneesPromises
              };

              let helperPromise = Helpers().resolve({ obj: promisifiedIssue, controller: controllers.issue });
              helpersPromises.push( helperPromise );

            });

            repository.pullRequests.nodes.forEach( pullRequest => {

              const promisifiedPullRequest = {
                title: pullRequest.title,
                repositoryId: mongoRepository._id,
                createdAt: pullRequest.createdAt,
                url: pullRequest.url,
                bodyText: pullRequest.bodyText,
                author: controllers.user.save({
                  login: pullRequest.author.login,
                  avatarUrl: pullRequest.author.avatarUrl,
                  url: pullRequest.author.url
                }),
                commitsCount: pullRequest.commits.totalCount
              };

              let helperPromise = Helpers().resolve({ obj: promisifiedPullRequest, controller: controllers.pullrequest })
              helpersPromises.push( helperPromise );

            });

            Promise.all(helpersPromises)
            .then( values => {
              console.log('Finished working');
              Mongo.connection.close();
            });

          });


        });

      });
    }
  }
]).run();
