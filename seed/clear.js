const mongoose = require('mongoose');
const { User } = require('../models');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/addies', {
  // useNewUrlParser: true,
  // useFindAndModify: false,
});

User.deleteMany({}).then(console.log('Cleared all users'));
