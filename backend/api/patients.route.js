import express from "express";
import PatientsCtrl from "./patients.controller.js";

const router = express.Router();

router
  .route("/")
  .get(PatientsCtrl.apiGetPatients)
  .post(PatientsCtrl.apiAddPatients)
  .put(PatientsCtrl.apiEditPatients)
  .delete(PatientsCtrl.apiRemovePatients);

export default router;
