const express = require('express')
const cors = require("cors");
const formRoutes = require('./routes/formRoutes')

require("dotenv").config();

const app = express();
app.use(cors({
    origin: 'udyam-opal.vercel.app',

}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("server is running")
})

app.use('/api', formRoutes)

app.listen(5000)