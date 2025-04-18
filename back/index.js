require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const stripeRoutes = require('./routes/stripe');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/stripe', stripeRoutes);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Serveur backend sur http://localhost:${PORT}`));
