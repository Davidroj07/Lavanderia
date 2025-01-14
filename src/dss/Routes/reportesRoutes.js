import {Router} from "express";
import { methods as  indexRoutes} from "../reportes.js";

const router = Router();

router.get("/consulta", indexRoutes.getConsulta);
router.get("/data", indexRoutes.getData);

export default router;