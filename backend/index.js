const connectToMongo = require("./db");
const express = require("express");
const cors = require('cors');
connectToMongo();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));



app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})