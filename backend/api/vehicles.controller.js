import VehiclesDAO from "../dao/vehiclesDAO.js";

export default class VehiclesController {
  static async apiGetVehicles
(req, res, next) {
    const vehiclesPerPage = req.query.vehiclesPerPage
      ? parseInt(req.query.vehiclesPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.plate) {
      filters.plate = req.query.plate;
    }

    const { vehiclesList, totalNumVehicles
 } = await VehiclesDAO.getVehicles
({
      filters,
      page,
      vehiclesPerPage,
    });

    let response = {
      vehicles: vehiclesList,
      page: page,
      filters: filters,
      entries_per_page: vehiclesPerPage,
      total_results: totalNumVehicles
    ,
    };
    res.json(response);
  }
  static async apiAddVehicles
(req, res, next) {
    try {
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const plate = req.body.plate
      const upgrades = req.body.upgrades
      const type = req.body.type
      const staffId = req.body.staff_id

      const vehiclesResponse = await VehiclesDAO.addVehicles
    (
        userInfo,
        plate,
        type,
        staffId,
        upgrades
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiEditVehicles
(req, res, next) {
    try {
      const vehiclesId = req.body.vehicles_id;
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const plate = req.body.plate
      const upgrades = req.body.upgrades
      const type = req.body.type
      const staffId = req.body.staff_id

      const vehiclesResponse = await VehiclesDAO.editVehicles
    (
        vehiclesId,
        userInfo,
        plate,
        type,
        staffId,
        upgrades
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiRemoveVehicles
(req, res, next) {
    try {
      const vehiclesId = req.body.vehicles_id;
      const userId = req.body.user_id;
      const vehiclesResponse = await VehiclesDAO.removeVehicles
    (vehiclesId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

