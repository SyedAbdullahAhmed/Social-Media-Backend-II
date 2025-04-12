const Post = require('../models/post.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');


const createPost = asyncHandler(async (req, res) => {

    const { description } = req.body;
    if (!description) {
        throw new ApiError(400, 'Description is required');
    }
    if(description.length > 100) {
        throw new ApiError(400, 'Description is too long');
    }
    const { userId } = req.user;
    if (!userId) {
        throw new ApiError(400, 'User ID is required');
    }


    let localImagePath;
    if (req.files && Array.isArray(req.files.image) && req.files.image.length > 0) {
        localImagePath = req.files.image[0].path
    }

    let localVideoPath;
    if (req.files && Array.isArray(req.files.video) && req.files.video.length > 0) {
        localVideoPath = req.files.video[0].path
    }

    const post = new Post({
        userId,
        description,
        videoPath: localVideoPath || '',
        imagePath: localImagePath || ''
    });

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.role = 'creator';

    await user.save();
    await post.save();

    // send response
    res
        .status(201)
        .json(new ApiResponse(201, post, 'User post created successfully'));
});



const getAllPosts = asyncHandler(async (req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;


    const posts = await Post
        .find({})
        .skip(skip)
        .limit(limitNumber)
        .populate('userId', 'fullName profilePath');
        
    if (!posts) {
        throw new ApiError(404, 'Posts not found');
    }
    res.status(200).json(new ApiResponse(200, posts, 'Posts found successfully'));
});

const getMyPosts = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const posts = await Post
        .find({ userId })
        .skip(skip)
        .limit(limitNumber)
        .populate('userId', 'fullName profilePath');

    if (!posts) {
        throw new ApiError(404, 'Posts not found');
    }
    res.status(200).json(new ApiResponse(200, posts, 'Posts found successfully'));
});

const getPost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, 'ID is required');
    }
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid ID format');
    }

    const post = await Post.findById(id).populate('userId', 'fullName profilePath');
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }
    res.status(200).json(new ApiResponse(200, post, 'Post found successfully'));
});

const updatePost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const { userId } = req.user;
    const { id } = req.params;

    // Validate inputs
    if (!description) {
        throw new ApiError(400, 'Description is required');
    }
    if(description.length > 100) {
        throw new ApiError(400, 'Description is too long');
    }
    if (!userId) {
        throw new ApiError(400, 'User ID is required');
    }
    if (!id) {
        throw new ApiError(400, 'Post ID is required');
    }
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid Post ID format');
    }

    // Find the post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
        throw new ApiError(404, 'Post not found');
    }

    // Make sure the user owns the post
    if (existingPost.userId.toString() !== userId.toString()) {
        throw new ApiError(403, 'You are not authorized to update this post');
    }

    // Handle new media (optional)
    if (req.files && Array.isArray(req.files.image) && req.files.image.length > 0) {
        existingPost.imagePath = req.files.image[0].path;
    }

    if (req.files && Array.isArray(req.files.video) && req.files.video.length > 0) {
        existingPost.videoPath = req.files.video[0].path;
    }

    // Update description
    existingPost.description = description;

    // Save updates
    await existingPost.save();

    res.status(200).json(
        new ApiResponse(200, existingPost, 'Post updated successfully')
    );
});


const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, 'ID is required');
    }
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid ID format');
    }

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }
    res.status(200).json(new ApiResponse(200, post, 'Post deleted successfully'));
});

const handleLikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const Post = await Post.findById(postId);
    if (!Post) {
        throw new ApiError(404, 'Post not found');
    }
    const isLiked = Post.likes.includes(userId);
    if (isLiked) {
        Post.likes = Post.likes.filter((id) => id.toString() !== userId.toString());
    }
    else {
        Post.likes.push(userId);
    }
    const updatedPost = await Post.save();
    res.status(200).json(new ApiResponse(200, updatedPost, 'Post updated successfully'));
});

const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const { comment } = req.body;

    if (!comment) {
        throw new ApiError(400, 'Comment text is required');
    }
    if(comment.length > 100) {
        throw new ApiError(400, 'Comment is too long');
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    const newComment = {
        comment, 
        userId,        
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json(
        new ApiResponse(200, post, 'Comment created successfully')
    );
});

const incrementViews = asyncHandler(async (req, res) => {
    const { postId } = req.params;


    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    post.views += 1; 
    await post.save();

    res.status(200).json(
        new ApiResponse(200, post, 'View added successfully')
    );
});


module.exports = {
    createPost,
    getMyPosts,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    handleLikePost,
    createComment,
    incrementViews
}