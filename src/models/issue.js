import mongoose from 'mongoose';
let { Schema } = mongoose;

export default mongoose.model('Issue', {
  title: String,
  state: String,
  url: String,
  createdAt: String,
  author: Schema.Types.ObjectId,
  assignees: [Schema.Types.ObjectId],
  repository_id: Schema.Types.ObjectId
});
