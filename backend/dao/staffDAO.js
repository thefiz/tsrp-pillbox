let staff;

export default class StaffDAO {
  static async injectDB(conn) {
    if (staff) {
      return;
    }
    try {
      staff = await conn
        .db(process.env.TSRPPILLBOX_NS)
        .collection("staff");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in staffDAO: ${e}`
      );
    }
  }

  static async getStaff({
    filters = null,
    page = 0,
    staffPerPage = 20,
  } = {}) {
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
        //This is where the error is occurring, it is saying the staff variable is "undefined"
      return { staffList: [], totalNumStaff: 0 };
    }

    const displayCursor = cursor
      .limit(staffPerPage)
      .skip(staffPerPage * page);

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
}
