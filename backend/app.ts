import express from 'express';
import itemRoutes from './routes/example.routes'
import { errorHandler } from './middlewares/error.handler';

const app = express();

app.use(express.json());

//routes
app.use('/api/items');

//global error handler
app.use(errorHandler);

export default app;