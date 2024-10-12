const mongoose = require('mongoose');

// Replace 'your_database_url' with your MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/your_database_name';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  /// mongodb+srv://dorrachakroun13:<password>@cluster0.lepnzz5.mongodb.net/
