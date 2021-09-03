import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let staff;

export default class StaffDAO {
  static async injectDB(conn) {
    if (staff) {
      return;
    }
    try {
      staff = await conn.db(process.env.TSRPPILLBOX_NS).collection("staff");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in staffDAO: ${e}`
      );
    }
  }

  static async getStaff({ filters = null, page = 0, staffPerPage = 20 } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
    }

    let cursor;

    try {
      cursor = await staff.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { staffList: [], totalNumStaff: 0 };
    }

    const displayCursor = cursor.limit(staffPerPage).skip(staffPerPage * page);

    try {
      const staffList = await displayCursor.toArray();
      const totalNumStaff = await staff.countDocuments(query);

      return { staffList, totalNumStaff };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { staffList: [], totalNumStaff: 0 };
    }
  }

  static async addStaff(user, name, rank, callsign, discord, phone) {
    try {
      const staffDoc = {
        name: name,
        rank: rank,
        callsign: callsign,
        discord: discord,
        phone: phone,
        last_edit_by_id: user._id,
        last_edit_by_name: user.userName,
        last_edit_date: new Date()
      };

      return await staff.insertOne(staffDoc);
    } catch (e) {
      console.error(`Unable to add staff: ${e}`);
      return { error: e };
    }
  }

  static async editStaff(
    staffId,
    user,
    name,
    rank,
    callsign,
    discord,
    phone
  ) {
    try {
      const updateResponse = await staff.updateOne(
        { _id: ObjectId(staffId) },
        {
          $set: {
            name: name,
            rank: rank,
            callsign: callsign,
            discord: discord,
            phone: phone,
            last_edit_by_name: user.userName,
            last_edit_by_id: user._id,
            last_edit_date: new Date()
          },
        }
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update staff: ${e}`);
      return { error: e };
    }
  }

  static async removeStaff(staffId, userId) {
    try {
      const deleteResponse = await staff.deleteOne({
        _id: ObjectId(staffId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete staff: ${e}`);
      return { error: e };
    }
  }

  static async getStaffByID(id) {
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
                    $eq: ["$staff_id", "$$id"],
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
                    $eq: ["$staff_id", "$$id"],
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
                    $eq: ["$staff_id", "$$id"],
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
          $lookup: {
            from: "vehicles",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$staff_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "vehicles",
          },
        },
        {
          $addFields: {
            visits: "$visits",
            prescriptions: "$prescriptions",
            appointments: "$appointments",
            vehicles: "$vehicles",
          },
        },
      ];
      return await staff.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getStaffByID: ${e}`);
      throw e;
    }
  }
}
