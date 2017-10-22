import Promise from 'bluebird';
import controllers from './mongo/controllers';
import helpers from './mongo/helper';
import { Schema } from 'mongoose'

const Generators = {
  organization: Promise.coroutine(function* (organizationSpec) {
    const { name, login } = organizationSpec;

    let organization = yield controllers.organization.save({ name, login });
    return organization;
  }),
  repository: Promise.coroutine(function* (organization, repositorySpec) {
    const primaryLanguage = repositorySpec.primaryLanguage ? repositorySpec.primaryLanguage.name : '';

    const payload = {
      name: repositorySpec.name,
      organizationId: organization._id,
      primaryLanguage,
      url: repositorySpec.url
    };

    let repository = yield controllers.repository.save(payload);
    return repository;
  }),
  issue: Promise.coroutine(function* (repository, issueSpec) {
    let authorSpec = issueSpec.author;
    let assigneesSpec = issueSpec.assignees.nodes;

    let author = yield controllers.user.save({
      login: authorSpec.login, avatarUrl: authorSpec.avatarUrl, url: authorSpec.url
    });

    let assigneesPromises = assigneesSpec.map( assignee => {
      return controllers.user.save({
        login: assignee.login, avatarUrl: assignee.avatarUrl, url: assignee.url
      });
    });

    let assignees = yield Promise.all( assigneesPromises );

    const payload = {
      title: issueSpec.title,
      state: issueSpec.state,
      url: issueSpec.url,
      createdAt: issueSpec.createdAt,
      authorId: author._id,
      assignees: assignees.map( assignee => assignee._id ),
      repositoryId: repository._id
    };
    console.log(payload);
    let issue = yield controllers.issue.save(payload);
    return issue;
  })
};

export default Generators;
