import {Router} from "express";
import { methods as  indexRoutes} from "../transaction.js";

const router = Router();

router.post("/", indexRoutes.addTransaction);
router.get("/:phone", indexRoutes.getTransaction);


export default router;