import {Router} from "express";
import { methods as  indexRoutes} from "../generales.js";

const router = Router();

router.get("/entragasxrequisicion", indexRoutes.entragasxrequisicion);

export default router;