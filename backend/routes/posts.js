const express = require ("express");
const PostController = require("../controllers/post")
const checkAuth = require ("../middleware/check-auth");
const fileManager = require("../middleware/file-manager");
const router = express.Router();

/**
 * Get API posts get
 */
router.get('', PostController.retrievePosts);

router.get('/:id', PostController.getSinglePost);

router.post('', checkAuth, fileManager, PostController.createPost);

router.put('/:id', checkAuth, fileManager, PostController.updatePost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
