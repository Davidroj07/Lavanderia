import express from "express";
import morgan from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/apiRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import apiTransaction from "./routes/apiTransaction.js";


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Settings
app.set("port", 3000);
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs');

//Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use(apiRoutes);  // Rutas de la API (use)
app.use(apiTransaction);  // Rutas de la API (use transaction)
app.use(viewRoutes); // Rutas de vistas (get)
app.use(express.static(join(__dirname,'css')));
app.use(express.static(join(__dirname,'img')));
app.use(express.static(join(__dirname,'js')));
app.use(express.static(join(__dirname,'database')));
app.use(express.static(join(__dirname,'icons')));
app.use(express.static(__dirname));

export default app;