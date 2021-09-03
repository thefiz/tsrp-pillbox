import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import StaffDAO from "./dao/staffDAO.js";
import PatientsDAO from "./dao/patientsDAO.js";
import VisitsDAO from "./dao/visitsDAO.js";
import VehiclesDAO from "./dao/vehiclesDAO.js";
import PrescriptionsDAO from "./dao/prescriptionsDAO.js";
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.TSRPPILLBOX_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await StaffDAO.injectDB(client);
    await PatientsDAO.injectDB(client);
    await VisitsDAO.injectDB(client);
    await VehiclesDAO.injectDB(client);
    await PrescriptionsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
