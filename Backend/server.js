const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
connectDB();

// Enable CORS and explicitly allow the Authorization header for Bearer tokens
app.use(cors({
	origin: true,
	allowedHeaders: ['Content-Type', 'Authorization'],
	exposedHeaders: ['Authorization']
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
