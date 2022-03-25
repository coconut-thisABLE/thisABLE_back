const mongoose = require('./loaders/mongoose');
const app = require('./loaders/express');
const logger = require('./loaders/logger');
const {port, env} = require('./config/vars');

require('dotenv').config();
mongoose.connect();

app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
