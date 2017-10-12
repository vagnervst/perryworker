import mongoose from 'mongoose';

export default mongoose.model('User', {
  login: String,
  avatarUrl: String,
  url: String
});
