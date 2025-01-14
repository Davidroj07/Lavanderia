import {Router} from "express";
import { methods as  indexRoutes} from "../requisiciones.js";

const router = Router();

router.get("/", indexRoutes.getRequisicionesConSaldo);
router.get("/:ano", indexRoutes.getRequisiones);
router.get("/:ano/:requisicion", indexRoutes.getRequision);
router.post("/", indexRoutes.addRequisiones);
router.put("/:ano/:numero", indexRoutes.updateRequisiones);
router.delete('/:ano/:numero', indexRoutes.deleteRequisiones);

export default router;