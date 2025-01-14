import {Router} from "express";
import { methods as  indexRoutes} from "../entregaDetalle.js";

const router = Router();

router.get("/:ano/:numero", indexRoutes.getEntregaDet);
router.post("/", indexRoutes.addEntregaDet);
router.put("/:ano/:numero/:consecutivo", indexRoutes.updateEntregaDet);
router.delete('/:ano/:numero/:consecutivo', indexRoutes.deleteEntregaDet);

export default router;