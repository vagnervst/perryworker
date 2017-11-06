import Promise from 'bluebird';
import controllers from '../mongo/controllers';
import UserGenerators from './user';

const CommentGenerators = {
  /**
    TODO add javadoc
  */
  saveComment: Promise.coroutine(function* (model, githubComment) {
    const { id, bodyText } = githubComment;
    let author = yield UserGenerators.saveUser(githubComment.author);

    const commentPayload = {
      githubId: id,
      bodyText,
      author,
      model: model.name,
      modelId: model.id
    };

    let comment = yield controllers.comment.save(commentPayload);
    return comment;
  }),
  /**
    TODO add javadoc
  */
  saveComments: Promise.coroutine(function* (model, githubComments) {
    let commentsPromises = githubComments.map( githubComment =>
      this.saveComment(model, githubComment)
    );

    let comments = yield Promise.all(commentsPromises);
    return comments;
  })
};

export default CommentGenerators;
