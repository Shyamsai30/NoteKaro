
const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook"

// Create mongo connection
const connectToMongo = () => {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true
  })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
};

module.exports = connectToMongo;