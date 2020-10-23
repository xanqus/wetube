import express from "express";
import routes from "../routes";
import {
    postAddComment,
    postRegisterView,
    postDeleteComment
} from "../controllers/videoController";
import { onlyPrivate, uploadAvatar } from "../middlewares";

const apiRouter = express.Router();


apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.deleteComment, postDeleteComment);




export default apiRouter;
