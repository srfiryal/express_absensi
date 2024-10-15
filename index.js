const express = require('express');
const dotenv = require('dotenv');
const router = require('./lib/routes/routes');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', router);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})