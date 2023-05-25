const express = require("express");
const AWS = require("aws-sdk");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ENV_BUCKETCONSTANTS } = require("./src/constants/env.bucketConstants");
const { ENV_CONSTANTS } = require("./src/constants/env.constants");
const Log= require("./src/utils/logging")


AWS.config.update({ region: ENV_BUCKETCONSTANTS.AWS_REGION });

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.listen(ENV_CONSTANTS.PORT, () => {
 Log.info(`Server listening on port ${ENV_CONSTANTS.PORT}`);
});
