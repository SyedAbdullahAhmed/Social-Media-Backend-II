const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendMail = require('../utils/sendMail');
const bcrypt = require('bcryptjs');
const { codeGenerator } = require('../utils/codeGenerator');
const generateTokens = require('../utils/generateTokens');
const validateUserEmailUsingArcjet = require('../utils/validateEmailUsingArcjet')




const createUser = asyncHandler(async (req, res) => {

    // manually validation
    const { fullName, age, address, phone, email, password } = req.body;

    if (!fullName || !age || !address || !phone || !email || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    // zod validation
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            errors: result.error.format()
        });
    }

    const validatedData = result.data;


    // arcjet validation
    const isValidEmail = await validateUserEmailUsingArcjet(req, email);
    if (!isValidEmail) {
        throw new ApiError(400, 'Email is disposable or invalid');
    }


    // profile image handling
    let localPath;
    if (req.files && Array.isArray(req.files.profile) && req.files.profile.length > 0) {
        localPath = req.files.profile[0].path
    }

    // user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const otpCode = codeGenerator()


    const user = new User({
        fullName,
        age,
        address,
        phone,
        email,
        password: hashPassword,
        profilePath: localPath,
        otp: otpCode,
    });
    await user.save();


    // send mail
    await sendMail({
        to: email,
        subject: 'Welcome to our app',
        html: `
        <h1>Welcome to our app</h1>
        <p>Thank you for signing up!</p>
        <p>Your otp code is ${otpCode} and expiry is 5 minutes!</p>
        `,
    });


    res
        .status(201)
        .json(new ApiResponse(201, user, 'User created successfully'));
})

const getUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new ApiError(400, 'ID is required');
    }
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid ID format');
    }

    if (!req.user) {
        throw new ApiError(401, 'Unauthorized');
    }

    if (!req.user._id.equals(id)) {
        throw new ApiError(403, 'Forbidden');
    }
    res.status(200).json(new ApiResponse(200, user, "User found successfully"));
})


const getUsers = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const users = await User.find({}).skip(skip).limit(limitNumber);
    if (!users) {
        throw new ApiError(404, 'Users not found');
    }
    res.status(200).json(new ApiResponse(200, users, "User found successfully"));
})


const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fullName, age, address, phone, email, password } = req.body;

    if (!id) throw new ApiError(400, 'ID is required');
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid ID format');

    if (!fullName && !age && !address && !phone && !email && !password && !req.files?.profile) {
        throw new ApiError(400, 'At least one field must be provided for update');
    }

    if (email) {
        // arcjet validation
        const isValidEmail = await validateUserEmailUsingArcjet(req, email);
        if (!isValidEmail) {
            throw new ApiError(400, 'Email is disposable or invalid');
        }
    }

    let profilePath;
    if (req.files && Array.isArray(req.files.profile) && req.files.profile.length > 0) {
        profilePath = req.files.profile[0].path;
    }

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, 'User not found');

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new ApiError(400, 'Email already in use by another account');
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (age) updateFields.age = age;
    if (address) updateFields.address = address;
    if (phone) updateFields.phone = phone;
    if (email) updateFields.email = email;
    if (password) updateFields.password = hashPassword // hash before saving
    if (profilePath) updateFields.profilePath = profilePath;

    await User.findByIdAndUpdate(id, updateFields, { new: true });

    res.status(200).json(new ApiResponse(200, null, 'User updated successfully'));
});


const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new ApiError(400, 'ID is required');
    }
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid ID format');
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    res.status(200).json(new ApiResponse(200, user, 'User deleted successfully'));
})


const verifyUser = asyncHandler(async (req, res) => {
    const code = req.body.code;
    const email = req.body.email;

    if (!code || !email) {
        throw new ApiError(400, 'Code and email are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (user.otp !== code) {
        throw new ApiError(400, 'Invalid code');
    }
    if (user.isVerified) {
        throw new ApiError(400, 'User already verified');
    }

    const now = new Date();
    const fiveMinutesInMs = 5 * 60 * 1000;

    const timeDiff = now - new Date(user.updatedAt); // returns milliseconds

    if (timeDiff > fiveMinutesInMs) {
        throw new ApiError(400, "Code expired. Please request a new one.");
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    res.status(200).json(new ApiResponse(200, user, 'User verified successfully'));

})

const forgotPassword = asyncHandler(async (req, res) => {
    const email = req.body.email;
    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (!user.isVerified) {
        throw new ApiError(400, 'User not verified');
    }
    const otpCode = codeGenerator()
    user.otp = otpCode;

    await user.save();

    await sendMail({
        to: email,
        subject: 'Password reset code',
        html: `
        <h1>Password reset code</h1>
        <p>Your password reset code is ${otpCode} and expiry is 5 minutes!</p>
        `,
    });
    res.status(200).json(new ApiResponse(200, user, 'Password reset code sent successfully'));
})

const loginUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (!user.isVerified) {
        throw new ApiError(400, 'User not verified');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Invalid password');
    }
    const { accessToken, refreshToken } = generateTokens(user._id, user.role, user.email);
    res.status(200).json(new ApiResponse(200, { accessToken, refreshToken }, 'User logged in successfully'));
})


const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, 'Unauthorized');
    }
    user.accessToken = undefined;
    res.status(200).json(new ApiResponse(200, null, 'User logged out successfully'));
})

const newRefreshToken = asyncHandler(async (req, res) => {
    const { token } = req.params;
    if (!token) {
        throw new ApiError(400, 'Refresh token is required');
    }
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (!user.isVerified) {
        throw new ApiError(400, 'User not verified');
    }
    const { accessToken, refreshToken } = generateTokens(user._id, user.role, user.email);

    res.status(200).json(new ApiResponse(200, { accessToken, refreshToken }, 'New refresh token generated successfully'));
})

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    verifyUser,
    forgotPassword,
    loginUser,
    logoutUser,
    newRefreshToken
}