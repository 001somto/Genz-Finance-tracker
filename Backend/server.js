const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
connectDB();

// Enable CORS and explicitly allow the Authorization header for Bearer tokens
const allowedOrigins = [
	'http://localhost:5173',
	'http://127.0.0.1:5173',
	'https://spendsave.obs.af-south-1.myhuaweicloud.com', // Huawei Cloud OBS (HTTPS)
	'http://spendsave.obs.af-south-1.myhuaweicloud.com', // Huawei Cloud OBS (HTTP)
	'http://spendsave.ralf.com.ng' // Custom Domain (No SSL)
];

app.use(cors({
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1 || origin === 'null') {
			return callback(null, true);
		} else {
			return callback(new Error('Not allowed by CORS'));
		}
	},
	allowedHeaders: ['Content-Type', 'Authorization'],
	exposedHeaders: ['Authorization'],
	credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

// Global Error Handler
app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
	res.send('SpendSave API is running');
});
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
