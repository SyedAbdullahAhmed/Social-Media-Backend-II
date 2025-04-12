const Bookmark = require('../models/bookmark.model.js');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');


const createBookmark = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.body;

  if (!postId) {
    throw new ApiError(400, 'Post ID is required');
  }

  let bookmark = await Bookmark.findOne({ userId });

  if (!bookmark) {

    bookmark = new Bookmark({ userId, posts: [postId] });
  }

  await bookmark.save();

  res.status(200).json(new ApiResponse(200, bookmark, 'Bookmark created successfully'));
});


const getBookmark = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.body;

  if (!postId) {
    throw new ApiError(400, 'Post ID is required');
  }

  const bookmark = await Bookmark.findOne({ userId });

  if (!bookmark) {
    throw new ApiError(404, 'Bookmark not found');
  }

  res.status(200).json(new ApiResponse(200, bookmark, 'Bookmark fetched successfully'));
});

const getAllBookmark = asyncHandler(async (req, res) => {

  const { userId } = req.user;
  
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;


  const bookmarks = await Bookmark
    .find({ userId })
    .skip(skip)
    .limit(limitNumber)
    .populate('posts', 'description imagePath videoPath');

  if (!bookmarks) {
    throw new ApiError(404, 'No bookmarks found');
  }
  res.status(200).json(new ApiResponse(200, bookmarks, 'Bookmarks fetched successfully'));
});

const deleteBookmark = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.body;
  if (!postId) {
    throw new ApiError(400, 'Post ID is required');
  }
  const bookmark = await Bookmark.findOne({ userId });
  if (!bookmark) {
    throw new ApiError(404, 'Bookmark not found');
  }
  bookmark.posts = bookmark.posts.filter((id) => id.toString() !== postId.toString());
  await bookmark.save();
  res.status(200).json(new ApiResponse(200, bookmark, 'Bookmark deleted successfully'));
});

module.exports = {
  createBookmark,
  getBookmark,
  getAllBookmark,
  deleteBookmark,
}