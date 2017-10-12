import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  title: { type: String, required: true },
  state: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, required: true },
  assignees: { type: [ Schema.Types.ObjectId ] },
  repositoryId: { type: Schema.Types.ObjectId, required: true }
});

export default mongoose.model('Issue', IssueSchema);