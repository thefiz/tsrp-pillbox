import PatientsDAO from "../dao/patientsDAO.js";

export default class PatientsController {
  static async apiGetPatients(req, res, next) {
    const patientsPerPage = req.query.patientsPerPage
      ? parseInt(req.query.patientsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.name) {
      filters.name = req.query.name;
    }

    const { patientsList, totalNumPatients } = await PatientsDAO.getPatients({
      filters,
      page,
      patientsPerPage,
    });

    let response = {
      patients: patientsList,
      page: page,
      filters: filters,
      entries_per_page: patientsPerPage,
      total_results: totalNumPatients,
    };
    res.json(response);
  }
  static async apiAddPatients(req, res, next) {
    try {
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const date = new Date();
      const name = req.body.name;
      const phone = req.body.phone;
      const dob = Date(req.body.dob)
      const blood = req.body.blood_type
      const emergencyName = req.body.emergency_contact_name
      const emergencyPhone = req.body.emergency_contact_phone

      const patientsResponse = await PatientsDAO.addPatients(
        userInfo,
        date,
        name,
        phone,
        dob,
        blood,
        emergencyName,
        emergencyPhone
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiEditPatients(req, res, next) {
    try {
      const patientsId = req.body.patients_id;
      const userInfo = {
        userName: req.body.userName,
        _id: req.body.user_id,
      };
      const date = new Date();
      const name = req.body.name;
      const phone = req.body.phone;
      const dob = Date(req.body.dob)
      const blood = req.body.blood
      const emergencyName = req.body.emergency_name
      const emergencyPhone = req.body.emergency_phone

      const patientsResponse = await PatientsDAO.editPatients(
        patientsId,
        userInfo,
        date,
        name,
        phone,
        dob,
        blood,
        emergencyName,
        emergencyPhone
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiRemovePatients(req, res, next) {
    try {
      const patientsId = req.body.patients_id;
      const userId = req.body.user_id;
      const patientsResponse = await PatientsDAO.removePatients(patientsId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

