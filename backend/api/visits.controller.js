import VisitsDAO from "../dao/visitsDAO.js";

export default class VisitsController {
  static async apiGetVisits(req, res, next) {
    const visitsPerPage = req.query.visitsPerPage
      ? parseInt(req.query.visitsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name;
    }

    const { visitsList, totalNumVisits } = await VisitsDAO.getVisits({
      filters,
      page,
      visitsPerPage,
    });

    let response = {
      visits: visitsList,
      page: page,
      filters: filters,
      entries_per_page: visitsPerPage,
      total_results: totalNumVisits,
    };
    res.json(response);
  }
  static async apiAddVisits(req, res, next) {
    try {
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const patientsId = req.body.patients_id;
      const staffId = req.body.staff_id;
      const date = new Date();
      const name = req.body.name;
      const reason = req.body.reason;
      const diagnosis = req.body.diagnosis;
      const treatment = req.body.treatment;
      const followUp = req.body.follow_up_required;

      const visitsResponse = await VisitsDAO.addVisits(
        userInfo,
        patientsId,
        staffId,
        date,
        name,
        reason,
        diagnosis,
        treatment,
        followUp
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiEditVisits(req, res, next) {
      try {
          const visitsId = req.body.visits_id
          const userInfo = {
              userName: req.body.userName,
              _id: req.body.user_id
          }
          const patientsId = req.body.patients_id;
          const staffId = req.body.staff_id;
          const date = new Date(req.body.date);
          const name = req.body.name;
          const reason = req.body.reason;
          const diagnosis = req.body.diagnosis;
          const treatment = req.body.treatment;
          const followUp = req.body.follow_up_required;

          const visitsResponse = await VisitsDAO.editVisits(
              visitsId,
              userInfo,
              patientsId,
              staffId,
              date,
              name,
              reason,
              diagnosis,
              treatment,
              followUp
          );
          res.json({ status: "success" })
      } catch (e) {
          res.status(500).json({ error: e.message })
      }
  }

  static async apiRemoveVisits(req, res, next) {
    try {
      const visitsId = req.body.visits_id;
      const userId = req.body.user_id;
      const visitsResponse = await VisitsDAO.removeVisits(visitsId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
