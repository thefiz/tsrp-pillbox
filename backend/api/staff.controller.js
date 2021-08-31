import StaffDAO from "../dao/StaffDAO.js";

export default class StaffController {
  static async apiGetStaff(req, res, next) {
    const staffPerPage = req.query.staffPerPage
      ? parseInt(req.query.staffPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.department) {
      filters.department = req.query.department;
    } else if (req.query.rank) {
      filters.rank = req.query.rank;
    } else if (req.query.name) {
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
}
