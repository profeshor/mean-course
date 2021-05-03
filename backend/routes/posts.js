const express = require ("express");
const Post = require('../models/post')

const router = express.Router();

/**
 * Get API posts get
 */
router.get('', (req, res, next) => {
  Post.find().then( documents=> {
    return res.status(200).json({posts: documents});
  })
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      req.status(404).json({response: 'No posts exists'})
    }
  })
});

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(post => {
    res.status(201).json({
      postId: post._id
    });
  });
  console.log(post);
})

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
   })
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Update successful"})
  })
});


router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({
      message: 'Post successful deleted'
    });
  }).catch(err => {
    res.status(500).json({
      message: 'Error on request'
    });
  })
});

module.exports = router;
