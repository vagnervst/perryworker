import mongoose from 'mongoose';
let { Schema } = mongoose;

export default mongoose.model('Repository', {
  name: String,
  organization_id: Schema.Types.ObjectId,
  primaryLanguage: String,
  url: String
});
