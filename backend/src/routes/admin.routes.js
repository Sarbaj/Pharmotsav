import { Router } from "express";
import { verifyJwtAdmin,verifyJwtMember } from "../middlewares/auth.middleware";
import { memberRegisterController,
    adminLoginController,
    adminLogoutController,
    removeMemberController,
    getAllMembersController,
    memberLogoutController } from "../controllers/admin.controller";

const adminRouter = Router()

adminRouter.route("/login-admin").post(adminLoginController)
//secure only access by admin not even members

adminRouter.route("/add-member").post(verifyJwtAdmin,memberRegisterController)
adminRouter.route("/remove-member").post(verifyJwtAdmin,removeMemberController)
adminRouter.route("/logout-admin").post(verifyJwtAdmin,adminLogoutController)
adminRouter.route("/logout-member").post(verifyJwtMember,memberLogoutController)
adminRouter.route("/get-all-members").get(verifyJwtAdmin,getAllMembersController)

export default adminRouter
