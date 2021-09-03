import express from "express";
import PrescriptionsCtrl from "./prescriptions.controller.js";

const router = express.Router();

router
  .route("/")
  .get(PrescriptionsCtrl.apiGetPrescriptions)
  .post(PrescriptionsCtrl.apiAddPrescriptions)
  .put(PrescriptionsCtrl.apiEditPrescriptions)
  .delete(PrescriptionsCtrl.apiRemovePrescriptions);

export default router;
