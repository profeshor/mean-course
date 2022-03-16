const Post = require('../models/post');

/**
 * Creates a post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host"); // Base Url
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(post => {
    res.status(201).json({
      post: {
        ...post,
        id: post._id,
      }
    });
  }).catch( error => {
    res.status(500).json({
      message: "Post creation failed"
    })
  });
  console.log(post);
};

/**
 * Updates a post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host"); // Base Url
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
   })
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: "Update successful"})
    } else {
      res.status(401).json({message: "User not authorized"})
    }
  }).catch(error => {
    res.status(500).json({message: "Post edition failed!"})
  });
};

/**
 * Deletes a post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: "Deletion successful"})
    } else {
      res.status(401).json({message: "User not authorized"})
    }
  }).catch(err => {
    res.status(500).json({
      message: 'Error on post deletion'
    });
  })
};

/**
 * Retrieves all Posts
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
exports.retrievePosts = (req, res, next) => {
  const pageSize = + req.query.pageSize;
  const currentPage = + req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (currentPage && pageSize) {
    postQuery.skip(pageSize * currentPage - 1).limit(pageSize);
  }
  postQuery
  .then( documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({posts: fetchedPosts, maxPosts: count});
  }).catch(error => {
    req.status(500).json({response: "Error retrieving posts!"})
  })
};

/**
 * Retrieves a single post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next
 */
exports.getSinglePost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      req.status(404).json({response: 'No posts exists'})
    }
  }).catch(error => {
    req.status(500).json({response: "Error retrieving post!"})
  });
};
