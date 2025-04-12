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



app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/post', PostRoutes);
app.use('/api/v1/bookmark', BookmarkRoutes);
app.use('/api/v1/channel', ChannelRoutes);
app.use('/api/v1/search', SearchRoutes);
app.use('/api/v1/subscriber', subscriberRoutes);


app.get('/', (req, res) => {
    res.send('server is running');
});
const multer = require('multer')
const upload = multer()

app.post('/acceptImage', upload.fields([
    {
        name: "profile", maxCount: 1
    },
]), (req, res) => {

    let profilePath;
    if (req.files && Array.isArray(req.files.profile) && req.files.profile.length > 0) {
        profilePath = req.files.profile[0].path;
        console.log('Profile path:', profilePath);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port} ...`);
});

``