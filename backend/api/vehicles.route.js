import express from "express";
import VehiclesCtrl from "./vehicles.controller.js";

const router = express.Router();

router
  .route("/")
  .get(VehiclesCtrl.apiGetVehicles)
  .post(VehiclesCtrl.apiAddVehicles)
  .put(VehiclesCtrl.apiEditVehicles)
  .delete(VehiclesCtrl.apiRemoveVehicles);

export default router;
