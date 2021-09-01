import express from "express";
import StaffCtrl from "./staff.controller.js";

const router = express.Router();

router
  .route("/")
  .get(StaffCtrl.apiGetStaff)
  .post(StaffCtrl.apiAddStaff)
  .put(StaffCtrl.apiEditStaff)
  .delete(StaffCtrl.apiRemoveStaff);

export default router;
