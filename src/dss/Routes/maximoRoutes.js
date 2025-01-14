import {Router} from "express";
import { methods as  indexRoutes} from "../maximo.js";

const router = Router();

router.get("/id", indexRoutes.getNextID);
router.get("/numero", indexRoutes.getNextNumero);
router.get("/consecutivo", indexRoutes.getNextConsecutivo);

export default router;