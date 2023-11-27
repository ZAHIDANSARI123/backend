const express = require('express');
const app = express();
const authRouter = require('./router/authRoute');
const databaseconnect = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');


databaseconnect();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
              origin: [process.env.CLIENT_URL],
              credentials: true,
}))

app.get('./api/auth/', authRouter)

app.get('/', (req, res) => {
              res.status(200).json({ data: 'JWTauth server'})
});

module.exports = app;