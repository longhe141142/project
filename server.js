const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const logger = require("./_utils/logger");
const config = require("./_config/config");
const InitialService = require("./_services/index");
const { responseEnhancer } = require("express-response-formatter");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(responseEnhancer());

app.get("/", (req, res) => res.send("App is working"));

const initService = (app) => {
  const service = new InitialService(app);
  service.registerService();
  logger.info("Initializing service...");
};

const initSequelize = () => {
  const db = require("./_models/db.connect");
  db.connect()
    .then(() => {
      logger.info(`Establish connection successfully:--->`);
      // require("./_seeder/index")();
      return true;
    })
    .catch((err) => {
      logger.error("Connection crashed!--->");
      logger.error(err);
    });
};

const startServer = async () => {
  app.listen(config.port, config.host);
  logger.info(
    `Listening on host ${config.host} on port ${config.port} http://${config.host}:${config.port}`
  );
};

initService(app);
initSequelize();
startServer();

module.exports = app;
