import Promise from 'bluebird';
import controllers from './mongo/controllers';
import helpers from './mongo/helper';
import { Schema } from 'mongoose';

import blacklist from './blacklist.json';
import filter from './filter.js';

const Generators = {
  /**
    @param {Object} githubOrganization - Organization received from Github API
  */
  saveOrganization: Promise.coroutine(function* (githubOrganization) {
    const { name, login, repositories } = githubOrganization;

    let organization = yield controllers.organization.save({ name, login });

    yield this.saveRepositories(organization, repositories.nodes);

    return organization;
  }),
  /**
    @param {Object} organization - Organization stored on Mongo Database
    @param {Object} githubRepository - Repository received from Github API
  */
  saveRepository: Promise.coroutine(function* (organization, githubRepository) {
    const { name, url, issues, pullRequests } = githubRepository;

    if( filter(blacklist.repositories).has(name) ) {
      return;
    }

    const primaryLanguage = githubRepository.primaryLanguage ?
      githubRepository.primaryLanguage.name : '';

    const payload = {
      name,
      organizationId: organization._id,
      primaryLanguage,
      url
    };

    let repository = yield controllers.repository.save(payload);

    if( issues ) {
      yield this.saveIssues(repository, issues.nodes);
    }

    if( pullRequests ) {
      yield this.savePullRequests(repository, pullRequests.nodes);
    }

    return repository;
  }),
  /**
    @param {Object} organization - Organization stored on Mongo Database
    @param {Object[]} githubRepositories - Repositories received from Github API
  */
  saveRepositories: Promise.coroutine(function* (organization, githubRepositories) {
    let repositoriesPromises = githubRepositories.map(
      githubRepository => this.saveRepository(organization, githubRepository)
    );

    let repositories = yield Promise.all(repositoriesPromises);
    return repositories;
  }),
  /**
    @param {Object} repository - Repository stored on Mongo Database
    @param {Object} githubIssue - Issue received from Github API
  */
  saveIssue: Promise.coroutine(function* (repository, githubIssue) {
    const { title, state, url, createdAt, comments } = githubIssue;

    let author = yield this.saveUser(githubIssue.author);
    let assignees = yield this.saveUsers(githubIssue.assignees.nodes);

    const issuePayload = {
      title,
      state,
      url,
      createdAt,
      authorId: author._id,
      assignees: assignees.map( assignee => {
        if(assignee) {
          return assignee._id;
        }
      }),
      repositoryId: repository._id,
      commentsCount: comments.totalCount
    };

    let issue = yield controllers.issue.save(issuePayload);

    let commentsDocuments = yield this.saveComments({ model: 'issue', id: issue._id }, comments.nodes);

    return issue;
  }),
  /**
    @param {Object} repository - Repository stored on Mongo Database
    @param {Object[]} githubIssues - Issues received from Github API
  */
  saveIssues: Promise.coroutine(function* (repository, githubIssues) {
    let issuesPromises = githubIssues.map(
      issue => this.saveIssue(repository, issue)
    );

    let issues = yield Promise.all(issuesPromises);

    return issues;
  }),
  /**
    @param {Object} repository - Repository stored on Mongo Database
    @param {Object} githubPullRequest - PullRequest received from Github API
  */
  savePullRequest: Promise.coroutine(function* (repository, githubPullRequest) {
    const { title, createdAt, url, bodyText, comments, commits } = githubPullRequest;

    let author = yield this.saveUser(githubPullRequest.author);

    const pullRequestPayload = {
      title,
      createdAt,
      url,
      bodyText,
      author,
      commentsCount: comments.totalCount,
      commitsCount: commits.totalCount,
      repositoryId: repository._id
    };

    let pullRequest = yield controllers.pullrequest.save(pullRequestPayload);

    let commentsDocuments = yield this.saveComments({ name: 'pullrequest', id: pullRequest._id }, comments.nodes );

    return pullRequest;
  }),
  /**
    @param {Object} repository - Repository stored on Mongo Database
    @param {Object[]} githubPullRequests - PullRequests received from Github API
  */
  savePullRequests: Promise.coroutine(function* (repository, githubPullRequests) {
    let pullRequestsPromises = githubPullRequests.map(
      pullRequest => this.savePullRequest(repository, pullRequest)
    );

    let pullRequests = yield Promise.all(pullRequestsPromises);

    return pullRequests;
  }),
  saveComment: Promise.coroutine(function* (model, githubComment) {
    const { bodyText } = githubComment;
    let author = yield this.saveUser(githubComment.author);

    const commentPayload = {
      bodyText,
      author,
      model: model.name,
      modelId: model.id
    };

    let comment = yield controllers.comment.save(commentPayload);
    return comment;
  }),
  saveComments: Promise.coroutine(function* (model, githubComments) {
    let commentsPromises = githubComments.map( githubComment =>
      this.saveComment(model, githubComment)
    );

    let comments = yield Promise.all(commentsPromises);
    return comments;
  }),
  /**
    @param {Object} githubUser - User received from Github API
  */
  saveUser: Promise.coroutine(function* (githubUser) {
    const { login, avatarUrl, url } = githubUser;

    const payload = {
      login,
      avatarUrl,
      url
    };

    let user = yield controllers.user.save(payload);
    return user;
  }),
  /**
    @param {Object[]} - Users received from Github API
  */
  saveUsers: Promise.coroutine(function* (githubUsers) {
    let usersPromises = githubUsers.map( user =>
      this.saveUser(user)
    );

    let mongoUsers = yield Promise.all(usersPromises);
    return mongoUsers;
  })
};

export default Generators;
