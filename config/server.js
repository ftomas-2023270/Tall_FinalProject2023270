'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {dbConnection} from './mongo.js';
import limiter from '../src/middleware/validar-cant-peticiones.js';
import authRoute from '../src/auth/auth.routes.js';
import userRoutes from '../src/user/user.routes.js';
import catRoutes from '../src/cat/cat.routes.js';

const middlewares = (app)=>{
    app.use(express.urlencoded({extended:false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use('/SuperMarket/v1/auth',authRoute),
    app.use('/SuperMarket/v1/user',userRoutes),
    app.use('/SuperMarket/v1/cat',catRoutes)
}

const conectarDB = async()=>{
    try {
        await dbConnection();
        console.log('Conexion a la base de datos exitosa');
    } catch (error) {
        console.error('Error conectando a la base de datos',error);
        process.exit(1);
    }
}

export const initServer= async()=>{
    const app = express();
    const port = process.env.port || 3333;

    try {
        middlewares(app);
        conectarDB();
        app.listen(port);
        console.log(`Server running on port ${port}`)
    } catch (e) {
        console.log(`Server init failed: ${e}`)
    }
}