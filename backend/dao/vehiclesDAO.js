import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let vehicles;

export default class VehiclesDAO {
  static async injectDB(conn) {
    if (vehicles) {
      return;
    }
    try {
      vehicles = await conn.db(process.env.TSRPPILLBOX_NS).collection("vehicles");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in vehiclesDAO: ${e}`
      );
    }
  }

  static async getVehicles
({ filters = null, page = 0, vehiclesPerPage = 20 } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
    }

    let cursor;

    try {
      cursor = await vehicles.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { vehiclesList: [], totalNumVehicles
    : 0 };
    }

    const displayCursor = cursor.limit(vehiclesPerPage).skip(vehiclesPerPage * page);

    try {
      const vehiclesList = await displayCursor.toArray();
      const totalNumVehicles
     = await vehicles.countDocuments(query);

      return { vehiclesList, totalNumVehicles
 };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { vehiclesList: [], totalNumVehicles
    : 0 };
    }
  }

  static async addVehicles(user, plate, type, staffId, upgrades) {
      try {
          const vehiclesDoc = {
              plate: plate,
              type: type,
              staff_id: ObjectId(staffId),
              upgrades: upgrades,
              last_edit_by_id: user._id,
              last_edit_by_name: user.userName,
              last_edit_date: new Date(),
          };

          return await vehicles.insertOne(vehiclesDoc)
      } catch (e) {
          console.error(`Unable to add vehicle: ${e}`)
          return { error: e }
      }
  }

  static async editVehicles(vehiclesId, user, plate, type, staffId, upgrades) {
    try {
        const updateResponse = await vehicles.updateOne(
            {_id: ObjectId(vehiclesId)},
            {
                $set: {
                    plate: plate,
                    type: type,
                    staff_id: ObjectId(staffId),
                    upgrades: upgrades,
                    last_edit_by_id: user._id,
                    last_edit_by_name: user.userName,
                    last_edit_date: new Date(),
                }
            }
        );
        return updateResponse
    } catch (e) {
        console.error(`Unable to update vehicle: ${e}`)
        return { error: e }
    }
  }

  static async removeVehicles
(vehiclesId, userId) {
    try {
      const deleteResponse = await vehicles.deleteOne({
        _id: ObjectId(vehiclesId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete vehicles: ${e}`);
      return { error: e };
    }
  }
}
