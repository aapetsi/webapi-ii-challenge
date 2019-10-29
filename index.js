const express = require('express');

const comments = require('./routes/api/comments');
const posts = require('./routes/api/posts');

const app = express();

app.use(express.json());

app.use('/api/comments', comments);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
