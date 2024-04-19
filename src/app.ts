import express from 'express';
import router from './routes';
var cors = require('cors')

const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

export default app;