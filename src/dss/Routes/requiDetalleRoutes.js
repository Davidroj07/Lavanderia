import {Router} from "express";
import { methods as  indexRoutes} from "../requiDetalle.js";

const router = Router();

router.get("/", indexRoutes.getReqDetalleConSaldo);
router.get("/:ano/:numero", indexRoutes.getRequisionDet);
router.post("/", indexRoutes.addRequisionesDet);
router.put("/:ano/:numero/:consecutivo", indexRoutes.updateRequisionesDet);
router.delete('/:ano/:numero/:consecutivo', indexRoutes.deleteRequisionesDet);

export default router;