const express = require("express");
const AWS = require("aws-sdk");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  ENV_COGNITOCONSTANTS,
} = require("./src/constants/env.cognitoConstants");
const { ENV_BUCKETCONSTANTS } = require("./src/constants/env.bucketConstants");
const { ENV_CONSTANTS } = require("./src/constants/env.constants");

const authRouter = require("./src/api/router/authRoute");
const fileServiceRouter = require("./src/api/router/fileRoute");

AWS.config.update({ region: ENV_BUCKETCONSTANTS.AWS_REGION });

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(fileServiceRouter);

app.listen(ENV_CONSTANTS.PORT, () => {
  console.log(ENV_BUCKETCONSTANTS.AWS_REGION);
  console.log(`Server listening on port ${ENV_CONSTANTS.PORT}`);
});
