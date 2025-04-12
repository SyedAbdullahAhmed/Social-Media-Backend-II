const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

require('dotenv').config()
const UserRoutes = require('./routes/user.route');
const PostRoutes = require('./routes/post.route');
const BookmarkRoutes = require('./routes/bookmark.route');
const ChannelRoutes = require('./routes/channel.route');
const SearchRoutes = require('./routes/search.route');
const subscriberRoutes = require('./routes/subscriber.route');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));


app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/post', PostRoutes);
app.use('/api/v1/bookmark', BookmarkRoutes);
app.use('/api/v1/channel', ChannelRoutes);
app.use('/api/v1/search', SearchRoutes);
app.use('/api/v1/subscriber', subscriberRoutes);


app.get('/', (req, res) => {
    res.send('server is running');
});


// app.post('/acceptImage', upload.single("profile"), (req, res) => {

//     let profilePath;
//     if (req.file) {
//         profilePath = req.file.path;
//         console.log('Profile path:', profilePath);

//         const imageUrl = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
//         console.log('Image URL:', imageUrl);

//         res.status(200).json({
//             message: "Image uploaded",
//             url: imageUrl
//         });
//     } else {
//         res.status(400).json({ message: "No file uploaded" });
//     }
// });

// app.post('/acceptVideo', upload.single("video"), (req, res) => {

//     let videoPath;

//     // Since it's a single file, use req.file
//     if (req.file) {
//         videoPath = req.file.path;
//         console.log('Profile path:', videoPath);

//         const videoUrl = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
//         console.log('video URL:', videoUrl);

//         res.status(200).json({
//             message: "video uploaded",
//             url: videoUrl
//         });
//     } else {
//         res.status(400).json({ message: "No file uploaded" });
//     }
// });
// app.post('/acceptFile', upload.single("profile"), (req, res) => {

//     let profilePath;

//     // Since it's a single file, use req.file
//     if (req.file) {
//         profilePath = req.file.path;
//         console.log('Profile path:', profilePath);

//         const imageUrl = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
//         console.log('Image URL:', imageUrl);

//         res.status(200).json({
//             message: "Image uploaded",
//             url: imageUrl
//         });
//     } else {
//         res.status(400).json({ message: "No file uploaded" });
//     }
// });

app.listen(port, () => {
    console.log(`App listening on port ${port} ...`);
});

``