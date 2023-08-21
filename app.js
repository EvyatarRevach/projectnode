
import express from 'express';
import morgan from 'morgan';
import productRouter from './routing/router.js';
// import jsonfile  from 'jsonfile';


const port = 3000

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(productRouter);



app.listen(port, () => {
    console.log(`Server is up and running on port:${port}`);
    })


