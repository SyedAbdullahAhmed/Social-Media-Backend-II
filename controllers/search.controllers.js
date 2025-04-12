const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.model');
const Post = require('../models/post.model');

const searchAnything = asyncHandler(async (req, res) => {
    
    const { query } = req.params;
    if (!query) {
        throw new ApiError(400, 'Query is required');
    }
    const users = await User
        .find({ fullName: { $regex: query, $options: 'i' } })
        .limit(5)
        .select('fullName profilePath');

    const posts = await Post
        .find({ description: { $regex: query, $options: 'i' } })
        .limit(5)
        .populate('userId', 'fullName profilePath');

    res
        .status(200)
        .json(new ApiResponse(
            200, { users, posts }, 'Search results found successfully'
        ));
});

module.exports = {
    searchAnything,
};
