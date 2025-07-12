const express = require('express');
const { AuthCheck, RoleCheck } = require('../middleware/Auth');
const PostController = require('../controller/PostController');
const postImage = require('../helper/postsImage');
const router = express.Router();

/**
 * @swagger
 * /create-post:
 *   post:
 *     summary: Create a new blog post
 *     tags:
 *       - Blog
 *     security:
 *       - AuthHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the post
 *               content:
 *                 type: string
 *                 description: Content of the post
 *               category:
 *                 type: string
 *                 description: Category ID of the post
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags, e.g. "tag1, tag2, tag3"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file
 *     responses:
 *       '200':
 *         description: Post created successfully
 *       '400':
 *         description: Bad request (missing required fields or invalid category)
 */

router.post('/create-post', AuthCheck, RoleCheck('user'), postImage.single('image'), PostController.create);

/**
 * @swagger
 * /get-post:
 *   get:
 *     summary: Get all blog posts
 *     tags:
 *       - Blog
 *     security:
 *       - AuthHeader: []
 *     responses:
 *       '200':
 *         description: Posts fetched successfully
 *       '401':
 *         description: Unauthorized - missing or invalid token
 */
router.get('/get-post', AuthCheck, PostController.getPost);

/**
 * @swagger
 * /get-post-by-id/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     tags:
 *       - Blog
 *     security:
 *       - AuthHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Post fetched successfully
 *       '401':
 *         description: Unauthorized - missing or invalid token
 *       '404':
 *         description: Post not found
 */
router.get('/get-post-by-id/:id', AuthCheck, PostController.getPostById);

/**
 * @swagger
 * /update-post/{id}:
 *   post:
 *     summary: Update a blog post by ID
 *     tags:
 *       - Blog
 *     security:
 *       - AuthHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Post updated successfully
 *       '401':
 *         description: Unauthorized - missing or invalid token
 */
router.post('/update-post/:id', AuthCheck, RoleCheck('user'), postImage.single('image'), PostController.updatePost);

/**
 * @swagger
 * /delete-post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags:
 *       - Blog
 *     security:
 *       - AuthHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Post deleted successfully
 *       '401':
 *         description: Unauthorized - missing or invalid token
 */
router.delete('/delete-post/:id', AuthCheck, RoleCheck(['admin', 'user']), PostController.deletePost);
router.get('/filter-by-category/:categoryId', AuthCheck, PostController.filterPostByCategory);

module.exports = router;
