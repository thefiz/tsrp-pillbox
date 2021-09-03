import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let patients;

export default class PatientsDAO {
  static async injectDB(conn) {
    if (patients) {
      return;
    }
    try {
      patients = await conn
        .db(process.env.TSRPPILLBOX_NS)
        .collection("patients");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in patientsDAO: ${e}`
      );
    }
  }

  static async getPatients({
    filters = null,
    page = 0,
    patientsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
    }

    let cursor;

    try {
      cursor = await patients.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { patientsList: [], totalNumPatients: 0 };
    }

    const displayCursor = cursor
      .limit(patientsPerPage)
      .skip(patientsPerPage * page);

    try {
      const patientsList = await displayCursor.toArray();
      const totalNumPatients = await patients.countDocuments(query);

      return { patientsList, totalNumPatients };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { patientsList: [], totalNumPatients: 0 };
    }
  }

  static async addPatients(
    user,
    name,
    phone,
    dob,
    blood,
    emergencyName,
    emergencyPhone
  ) {
    try {
      const patientsDoc = {
        name: name,
        phone: phone,
        dob: new Date(dob),
        blood_type: blood,
        last_edit_by_id: user._id,
        last_edit_by_name: user.userName,
        last_edit_date: new Date(),
        emergency_contact: {
          name: emergencyName,
          phone: emergencyPhone,
        },
      };

      return await patients.insertOne(patientsDoc);
    } catch (e) {
      console.error(`Unable to add patient: ${e}`);
      return { error: e };
    }
  }

  static async editPatients(
    patientsId,
    user,
    name,
    phone,
    dob,
    blood,
    emergencyName,
    emergencyPhone
  ) {
    try {
      const updateResponse = await patients.updateOne(
        { _id: ObjectId(patientsId) },
        {
          $set: {
            name: name,
            phone: phone,
            dob: new Date(dob),
            blood_type: blood,
            last_edit_by_id: user._id,
            last_edit_by_name: user.userName,
            last_edit_date: new Date(),
            emergency_contact: {
              name: emergencyName,
              phone: emergencyPhone,
            },
          },
        }
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update patients: ${e}`);
      return { error: e };
    }
  }

  static async removePatients(patientsId, userId) {
    try {
      const deleteResponse = await patients.deleteOne({
        _id: ObjectId(patientsId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete patients: ${e}`);
      return { error: e };
    }
  }

  static async getPatientsByID(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "visits",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$patients_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "visits",
          },
        },
        {
          $lookup: {
            from: "prescriptions",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$patients_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "prescriptions",
          },
        },
        {
          $lookup: {
            from: "appointments",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$patients_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "appointments",
          },
        },
        {
          $addFields: {
            visits: "$visits",
            prescriptions: "$prescriptions",
            appointments: "$appointments",
          },
        },
      ];
      return await patients.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getPatientsByID: ${e}`);
      throw e;
    }
  }
}
