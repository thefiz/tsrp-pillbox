import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let visits;

export default class VisitsDAO {
  static async injectDB(conn) {
    if (visits) {
      return;
    }
    try {
      visits = await conn.db(process.env.TSRPPILLBOX_NS).collection("visits");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in visitsDAO: ${e}`
      );
    }
  }

  static async getVisits({
    filters = null,
    page = 0,
    visitsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
    }

    let cursor;

    try {
      cursor = await visits.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { visitsList: [], totalNumVisits: 0 };
    }

    const displayCursor = cursor
      .limit(visitsPerPage)
      .skip(visitsPerPage * page);

    try {
      const visitsList = await displayCursor.toArray();
      const totalNumVisits = await visits.countDocuments(query);

      return { visitsList, totalNumVisits };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { visitsList: [], totalNumVisits: 0 };
    }
  }

  static async addVisits(
    user,
    patientId,
    staffId,
    date,
    name,
    reason,
    diagnosis,
    treatment,
    followUp
  ) {
    try {
      const visitsDoc = {
        name: name,
        patients_id: ObjectId(patientId),
        staff_id: ObjectId(staffId),
        date: date,
        reason: reason,
        diagnosis: diagnosis,
        treatment: treatment,
        follow_up: followUp,
        last_edit_by_id: user._id,
        last_edit_by_name: user.userName,
        last_edit_date: new Date(),
      };

      return await vitits.insertOne(visitsDoc);
    } catch (e) {
      console.error(`Unable to add visits: ${e}`);
      return { error: e };
    }
  }

  static async editVisits(
    visitsId,
    user,
    patientId,
    staffId,
    date,
    name,
    reason,
    diagnosis,
    treatment,
    followUp
  ) {
    try {
      const updateResponse = await visits.updateOne(
        { _id: ObjectId(visitsId) },
        {
          $set: {
            name: name,
            patients_id: ObjectId(patientId),
            staff_id: ObjectId(staffId),
            date: date,
            reason: reason,
            diagnosis: diagnosis,
            treatment: treatment,
            follow_up: followUp,
            last_edit_by_id: user._id,
            last_edit_by_name: user.userName,
            last_edit_date: new Date(),
          },
        }
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update staff: ${e}`);
      return { error: e };
    }
  }

  static async removeVisits(visitsId, userId) {
    try {
      const deleteResponse = await visits.deleteOne({
        _id: ObjectId(visitsId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete visits: ${e}`);
      return { error: e };
    }
  }
}
