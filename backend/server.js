const express = require('express')
const cors = require("cors");
const formRoutes = require('./routes/formRoutes')
require("dotenv").config();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://udyam-opal.vercel.app'],
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send("server is running")
})

app.use('/api', formRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
