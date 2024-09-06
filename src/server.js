import express from 'express';
import cors from 'cors';
import getRoutes from './routes/getRoutes.js';
import updateRoutes from './routes/updateRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(getRoutes);
app.use(updateRoutes);

app.listen(3000, () => {
    console.log('listening at 3000');
});