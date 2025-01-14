import express from "express";
const router = express.Router();
import users from "../dss/Routes/usersRoutes.js";
import transactions from "../dss/Routes/transactionRoutes.js";
import menus from "../dss/Routes/menuRoutes.js";
import sucursales from "../dss/Routes/sucursalesRoutes.js";
import catalogo from "../dss/Routes/catalogosRoutes.js";
import maximo from "../dss/Routes/maximoRoutes.js";
import requisicion from "../dss/Routes/requisicionesRoutes.js";
import requisicionDet from "../dss/Routes/requiDetalleRoutes.js";
import reportes from "../dss/Routes/reportesRoutes.js";
import entrega from "../dss/Routes/entregasRoutes.js";
import entregaDet from "../dss/Routes/entregaDetalleRoutes.js";
import generales from "../dss/Routes/generalesRoutes.js";

// Rutas de la API
router.use("/api/Users", users);
router.use("/api/transactions", transactions);
router.use("/api/menu", menus);
router.use("/api/sucursales", sucursales);
router.use("/api/catalogos", catalogo);
router.use("/api/maximos", maximo);
router.use("/api/requisiciones", requisicion);
router.use("/api/requisicionDet", requisicionDet);
router.use("/api/reportes", reportes);
router.use("/api/entregas", entrega);
router.use("/api/entregaDet", entregaDet);
router.use("/api/generales", generales);


export default router;
