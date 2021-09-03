import express from "express";
import VisitsCtrl from "./visits.controller.js";

const router = express.Router();

router
  .route("/")
  .get(VisitsCtrl.apiGetVisits)
  .post(VisitsCtrl.apiAddVisits)
  .put(VisitsCtrl.apiEditVisits)
  .delete(VisitsCtrl.apiRemoveVisits);

export default router;
