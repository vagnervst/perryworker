import mongoose from 'mongoose';
let { Schema } = mongoose;

export default mongoose.model('PullRequest', {
  title: String,
  repository_id: Schema.Types.ObjectId,
  createdAt: String,
  url: String,
  bodyText: String,
  author: Schema.Types.ObjectId,
  commitsCount: Number
});
