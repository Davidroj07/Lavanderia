import {Router} from "express";
import { methods as  indexRoutes} from "../sucursales.js";

const router = Router();

router.get("/", indexRoutes.getSucursales);
router.post("/", indexRoutes.addSucursales);
router.put("/:id", indexRoutes.updateSucursal);
router.delete('/:id', indexRoutes.deleteSucursal);

export default router;