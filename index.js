const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

require('dotenv').config()
const UserRoutes = require('./routes/user.route');
const PostRoutes = require('./routes/post.route');
const BookmarkRoutes = require('./routes/bookmark.route');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const aj = arcjet({
    // Get your site key from https://app.arcjet.com and set it as an environment
    // variable rather than hard coding.
    key: process.env.ARCJET_KEY,
    rules: [
        validateEmail({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            // block disposable, invalid, and email addresses with no MX records
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
    ],
})


app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/post', PostRoutes);
app.use('/api/v1/bookmark', BookmarkRoutes);


app.get('/', (req, res) => {
    res.send('server is running');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


module.exports = aj;