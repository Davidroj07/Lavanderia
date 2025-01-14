import {Router} from "express";
import { methods as  indexRoutes} from "../entregas.js";

const router = Router();

router.get("/:ano", indexRoutes.getEntregas);
router.get("/:ano/:entrega", indexRoutes.getEntrega);
router.post("/", indexRoutes.addEntrega);
router.put("/:ano/:numero", indexRoutes.updateEntrega);
router.delete('/:ano/:numero', indexRoutes.deleteEntrega);

export default router;