import {Router} from "express";
import { methods as  indexRoutes} from "../menus.js";

const router = Router();

router.get("/", indexRoutes.getMenus);


export default router;