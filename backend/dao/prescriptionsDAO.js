import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let prescriptions;

export default class PrescriptionsDAO {
  static async injectDB(conn) {
    if (prescriptions) {
      return;
    }
    try {
      prescriptions = await conn
        .db(process.env.TSRPPILLBOX_NS)
        .collection("prescriptions");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in prescriptionsDAO: ${e}`
      );
    }
  }

  static async getPrescriptions({
    filters = null,
    page = 0,
    prescriptionsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
    }

    let cursor;

    try {
      cursor = await prescriptions.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { prescriptionsList: [], totalNumPrescriptions: 0 };
    }

    const displayCursor = cursor
      .limit(prescriptionsPerPage)
      .skip(prescriptionsPerPage * page);

    try {
      const prescriptionsList = await displayCursor.toArray();
      const totalNumPrescriptions = await prescriptions.countDocuments(query);

      return { prescriptionsList, totalNumPrescriptions };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { prescriptionsList: [], totalNumPrescriptions: 0 };
    }
  }

  static async addPrescriptions(user, prescription) {
    try {
      const prescriptionsDoc = {
        prescription: prescription,
        last_edit_by_id: user._id,
        last_edit_by_name: user.userName,
        last_edit_date: new Date(),
      };

      return await prescriptions.insertOne(prescriptionsDoc);
    } catch (e) {
      console.error(`Unable to add patient: ${e}`);
      return { error: e };
    }
  }

  static async editPrescriptions(prescriptionsId, user, prescription) {
    try {
      const updateResponse = await prescriptions.updateOne(
        { _id: ObjectId(prescriptionsId) },
        {
          $set: {
            prescription: prescription,
            last_edit_by_id: user._id,
            last_edit_by_name: user.userName,
            last_edit_date: new Date(),
          },
        }
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update prescriptions: ${e}`);
      return { error: e };
    }
  }

  static async removePrescriptions(prescriptionsId, userId) {
    try {
      const deleteResponse = await prescriptions.deleteOne({
        _id: ObjectId(prescriptionsId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete prescriptions: ${e}`);
      return { error: e };
    }
  }
}
