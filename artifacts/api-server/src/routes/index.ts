import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import trainerRouter from "./trainer";
import exercisesRouter from "./exercises";
import plansRouter from "./plans";
import studentRouter from "./student";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(trainerRouter);
router.use(exercisesRouter);
router.use(plansRouter);
router.use(studentRouter);
router.use(chatRouter);

export default router;
