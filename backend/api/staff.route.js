import express from "express";
import StaffCtrl from "./staff.controller.js";

const router = express.Router();

router
  .route("/")
  .get(StaffCtrl.apiGetStaff)
  .post(StaffCtrl.apiAddStaff)
  .put(StaffCtrl.apiEditStaff)
  .delete(StaffCtrl.apiRemoveStaff);

  router.route("/id/:id").get(StaffCtrl.apiGetStaffById)

export default router;
