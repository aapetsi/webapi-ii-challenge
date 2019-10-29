const express = require('express');
const router = express.Router();
const db = require('../../data/db');

router.get('/test', (req, res) => {
  res.status(200).json({ msg: 'Posts route works' });
});

// get all posts
router.get('/', (req, res) => {
  db.find()
    .then(posts => {
      if (!posts) {
        return res.status(404).json({ error: 'No posts found' });
      }
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved' });
    });
});

// get post by id
router.get('/:id', (req, res) => {
  let { id } = req.params;
  db.findById(id)
    .then(post => {
      if (!post || post.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(404).json({ error: 'Post not found' });
    });
});

// get comments associated with a given post
router.get('/:id/comments', (req, res) => {
  let { id } = req.params;
  console.log(id);
  db.findPostComments(id)
    .then(comments => {
      res.json(comments);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' });
    });
});

// add post to database
router.post('/', (req, res) => {
  const blogPost = { title: req.body.title, contents: req.body.contents };
  if (!blogPost.title || !blogPost.contents) {
    return res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }
  db.insert(blogPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({
        error: 'There was an error while saving the post to the database.'
      });
    });
});

router.post('/:id/comments', (req, res) => {
  let postComment = { text: req.body.text, post_id: req.params.id };
  if (!postComment.text) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' });
  }

  db.insertComment(postComment)
    .then(comment => {
      res.status(201).json(comment);
    })
    .catch(err => {
      res.status(500).json({
        errorMessage:
          'There was an error while saving the comment to the database.'
      });
    });
});

router.delete('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: 'The post could not be removed' });
    });
});

router.put('/:id', (req, res) => {
  let { title, contents } = req.body;
  db.update(req.params.id, { title, contents })
    .then(updatedPost => {
      if (updatedPost === 0) {
        return res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
      res.status(200).json(updatedPost);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The post information could not be modified' });
    });
});

module.exports = router;
