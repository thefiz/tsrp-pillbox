import StaffDAO from "../dao/staffDAO.js";

export default class StaffController {
  static async apiGetStaff(req, res, next) {
    const staffPerPage = req.query.staffPerPage
      ? parseInt(req.query.staffPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name;
    }

    const { staffList, totalNumStaff } = await StaffDAO.getStaff({
      filters,
      page,
      staffPerPage,
    });

    let response = {
      staff: staffList,
      page: page,
      filters: filters,
      entries_per_page: staffPerPage,
      total_results: totalNumStaff,
    };
    res.json(response);
  }
  static async apiAddStaff(req, res, next) {
    try {
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const name = req.body.name;
      const rank = req.body.rank;
      const callsign = req.body.callsign;
      const discord = req.body.discord;
      const phone = req.body.phone;

      const staffResponse = await StaffDAO.addStaff(
        userInfo,
        name,
        rank,
        callsign,
        discord,
        phone
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiEditStaff(req, res, next) {
    try {
      const staffId = req.body.staff_id;
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const name = req.body.name;
      const rank = req.body.rank;
      const callsign = req.body.callsign;
      const discord = req.body.discord;
      const phone = req.body.phone;

      const staffResponse = await StaffDAO.editStaff(
        staffId,
        userInfo,
        name,
        rank,
        callsign,
        discord,
        phone
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiRemoveStaff(req, res, next) {
    try {
      const staffId = req.body.staff_id;
      const userId = req.body.user_id;
      const staffResponse = await StaffDAO.removeStaff(staffId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
