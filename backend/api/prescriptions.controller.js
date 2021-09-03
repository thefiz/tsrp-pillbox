import PrescriptionsDAO from "../dao/prescriptionsDAO.js";

export default class PrescriptionsController {
  static async apiGetPrescriptions(req, res, next) {
    const prescriptionsPerPage = req.query.prescriptionsPerPage
      ? parseInt(req.query.prescriptionsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name;
    }

    const { prescriptionsList, totalNumPrescriptions } =
      await PrescriptionsDAO.getPrescriptions({
        filters,
        page,
        prescriptionsPerPage,
      });

    let response = {
      prescriptions: prescriptionsList,
      page: page,
      filters: filters,
      entries_per_page: prescriptionsPerPage,
      total_results: totalNumPrescriptions,
    };
    res.json(response);
  }
  static async apiAddPrescriptions(req, res, next) {
    try {
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const prescription = req.body.prescription;

      const prescriptionsResponse = await PrescriptionsDAO.addPrescriptions(
        userInfo,
        prescription
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiEditPrescriptions(req, res, next) {
    try {
      const prescrptionsId = req.body.prescriptions_id;
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const prescription = req.body.prescription;

      const prescriptionsResponse = await PrescriptionsDAO.editPrescriptions(
        prescriptionsId,
        userInfo,
        prescription
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiRemovePrescriptions(req, res, next) {
    try {
      const prescriptionsId = req.body.prescriptions_id;
      const userId = req.body.user_id;
      const prescriptionsResponse = await PrescriptionsDAO.removePrescriptions(
        prescriptionsId,
        userId
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
