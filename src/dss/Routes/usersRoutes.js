import {Router} from "express";
import { methods as  indexRoutes} from "../users.js";

const router = Router();

router.get("/", indexRoutes.getUsers);
router.get("/:usuario", indexRoutes.getUser);
router.post("/", indexRoutes.addUser);
router.put("/:usuario", indexRoutes.updateUser);

export default router;