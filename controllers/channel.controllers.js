const asyncHandler = require("../utils/asyncHandler")
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Channel = require('../models/channel.model');



const createChannel = asyncHandler(async (req, res) => {

    const { userId } = req.user;
    const { channelName, channelDescription, socialLinks } = req.body;

    if (!channelName || !channelDescription) {
        throw new ApiError(400, 'Channel name and description are required');
    }
    if (channelName.length > 10 || channelDescription.length > 100) {
        throw new ApiError(400, 'Channel name and description are too long');
    }
    if (socialLinks && socialLinks.length > 5) {
        throw new ApiError(400, 'Too many social links provided');
    }


    const existingChannel = await Channel.findOne({ userId });
    if (existingChannel) {
        throw new ApiError(400, 'Channel already exists for this user');
    }

    let localChannelImagePath;
    if (req.files && Array.isArray(req.files.channelImage) && req.files.channelImage.length > 0) {
        localChannelImagePath = req.files.channelImage[0].path
    }

    const channel = new Channel({
        userId,
        channelName,
        channelDescription,
        socialLinks,
        channelImage: localChannelImagePath ? localChannelImagePath : null,
        posts: [],
    });

    await channel.save();

    res.status(200).json(new ApiResponse(200, channel, 'Channel created successfully'));

})


const updateChannel = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const data = req.body;


    if (data?.channelName.length > 10 || data?.channelDescription.length > 100) {    
        throw new ApiError(400, 'Channel name and description are too long');
    }
    if (data?.socialLinks && data?.socialLinks.length > 5) {
        throw new ApiError(400, 'Too many social links provided');
    }

    const channel = await Channel.findOne({ userId });
    if (!channel) {
        throw new ApiError(404, 'Channel not found');
    }

    channel.channelName = data?.channelName;
    channel.channelDescription = data?.channelDescription;
    channel.socialLinks = data?.socialLinks;

    if (req.files && Array.isArray(req.files.channelImage) && req.files.channelImage.length > 0) {
        channel.channelImage = req.files.channelImage[0].path;
    }

    await channel.save();

    res.status(200).json(new ApiResponse(200, channel, 'Channel updated successfully'));
})


const getChannel = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const channel = await Channel.findOne({ userId }).populate('posts', 'description imagePath videoPath');
    if (!channel) {
        throw new ApiError(404, 'Channel not found');
    }
    res.status(200).json(new ApiResponse(200, channel, 'Channel fetched successfully'));
})


const deleteChannel = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const channel = await Channel.findOne({ userId });
    if (!channel) {
        throw new ApiError(404, 'Channel not found');
    }
    await Channel.findOneAndDelete({ userId });
    res.status(200).json(new ApiResponse(200, channel, 'Channel deleted successfully'));
})

module.exports = {
    createChannel,
    updateChannel,
    getChannel,
    deleteChannel
}