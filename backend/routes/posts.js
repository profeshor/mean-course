const express = require ("express");
const multer = require('multer');
const Post = require('../models/post');

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error ("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback (null, name + '-' + Date.now() + '.' + extension);
  }
});

const router = express.Router();

/**
 * Get API posts get
 */
router.get('', (req, res, next) => {
  const pageSize = + req.query.pageSize;
  const currentPage = + req.query.page;
  const postQuery = Post.find();
  let fetechedPosts;
  if (currentPage && pageSize) {
    postQuery.skip(pageSize * currentPage - 1).limit(pageSize);
  }
  postQuery
  .then( documents => {
    fetechedPosts = documents;
    return Post.count();
  })
  .then(count => {
    return res.status(200).json({posts: fetechedPosts, maxPosts: count});
  });
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

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host"); // Base Url
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(post => {
    res.status(201).json({
      post: {
        ...post,
        id: post._id,
      }
    });
  });
  console.log(post);
})

router.put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host"); // Base Url
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
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
