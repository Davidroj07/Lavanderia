import {Router} from "express";
import { methods as  indexRoutes} from "../catalogos.js";

const router = Router();

router.get("/", indexRoutes.getCatalogo);
router.post("/", indexRoutes.addcatalogo);
router.put("/:id", indexRoutes.updateCatalogo);
router.delete('/:id', indexRoutes.deleteCatalogo);

export default router;