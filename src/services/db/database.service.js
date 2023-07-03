const { ENV_DBCONSTANTS } = require("../../constants/env.dbConstants");
const { Op } = require('sequelize');
const { notFoundResponse, errorResponse } = require("../../utils/response");
const { ENV_CONSTANTS } = require("../../constants/env.constants");
const { getPagingData } = require("../../helper/index");
const Log = require("../../utils/logging");
const db = require("../../config/dbConnection");

const Users = db.user;
const State = db.state;
const City = db.city;
const ImageInfo = db.imageInfo;
const sequelize = db.sequelize;

exports.getuserProfileInfo = async (userId) => {
  try {
    const getProfileDataByUser = await Users.findOne({
      where: { user_id: userId },
      include: [
        {
          model: City,
          attributes: ['city_name'],
        },
      ],
    });
    Log.info("getProfileDataByUser:" + getProfileDataByUser.id);
    Log.info("length of getProfileDataByUser:" + getProfileDataByUser.length);
    if (getProfileDataByUser.length == 0) {
      return notFoundResponse(ENV_CONSTANTS.NOTFOUND, "User not found");
    }

    return getProfileDataByUser;
  
  } catch (err) {
    Log.error("error:" + err);
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err);
  }
};

exports.addUserMetaInTable = async (data) => {
  try {
    const addnewUser = await Users.create(data);
    Log.info("addnewUser:" + addnewUser);
    if (addnewUser.length == 0) {
      return errorResponse(
        ENV_CONSTANTS.BAD_REQUEST,
        "User Data is not Created"
      );
    }

    return {
      isCreated: true,
      addnewUser,
    };
  } catch (err) {
    Log.error("error:" + err);
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err);
  }
};

exports.getAllStates = async () => {
  try {
    const statesList = await State.findAll({});
    Log.info("statesList:" + statesList);
    if (statesList.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return statesList;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.getAllCities = async (id) => {
  try {
    const cityList = await City.findAll({ where: { state_id: id } });
    Log.info("cityList:" + cityList);
    if (cityList.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return cityList;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.getUsers = async (page, limit, offset,searchText) => {
  try {
    let whereClause = {
      is_admin: 0,
      is_deleted: 0
    };
    var search=searchText;
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const listUsers = await Users.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: City,
          attributes: ['city_name'],
        },
      ],
      limit: limit,
      offset: offset,
    });
    Log.info("ListUsers:" + listUsers);

    const Response = await getPagingData(listUsers, page, limit);

    if (listUsers.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return Response;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.addFileMetaInTable = async (data) => {
  try {
    const addObjectsByUser = await ImageInfo.create(data);

    Log.info("addObjectsByUser:" + addObjectsByUser);
    if (addObjectsByUser.length == 0) {
      return errorResponse(
        ENV_CONSTANTS.BAD_REQUEST,
        "Files data is not created"
      );
    }

    return addObjectsByUser;
  } catch (err) {
    Log.error("error" + err);
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err);
  }
};

exports.updateUserPostCount = async (userId) => {
  try {
    const requestBody = {
      num_posts: sequelize.literal("num_posts + 1"),
    };

    const updatePostCount = await Users.update(requestBody, {
      where: { id: userId },
    });

    Log.info("updatePostCount:" + updatePostCount);
    if (updatePostCount.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return updatePostCount;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.getUser = async (id) => {
  try {
    const getUser = await Users.findOne( { where: { id: id },
      include: [
        {
          model: City,
          attributes: ['city_name'],
        },
      ],
     });
    Log.info("getUser:" + getUser);

    if (getUser.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return getUser;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.getFilesbyuserLocation = async (locationId) => {
  try {
    const filesbyUserLocation = await ImageInfo.findAll({
      where: { is_deleted: 0, location: locationId },
    });
    Log.info("filesbyuserLocation:" + filesbyUserLocation);

    if (filesbyUserLocation.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return filesbyUserLocation;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.updateUserInUsers = async (reqBody, id) => {
  try {
    const updateUserProfile = await Users.update(reqBody, {
      where: { id: id },
    });
    Log.info("updateUserProfile:" + updateUserProfile);
    if (updateUserProfile.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return updateUserProfile;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.updateUserInImageData = async (id, locationId) => {
  try {
    const updateUserProfile = await ImageInfo.update(
      { location: locationId },
      { where: { owner: id } }
    );
    Log.info("updateUserProfile:" + updateUserProfile);
    if (updateUserProfile.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return updateUserProfile;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.deleteUserInUsers = async (id) => {
  try {
    const deleteUserInUsers = await Users.update(
      { is_deleted: 1 },
      {
        where: { id: id },
      }
    );

    Log.info("deleteUserInUsers:" + deleteUserInUsers);
    if (deleteUserInUsers.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return deleteUserInUsers;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};

exports.deleteUserInImageData = async (id) => {
  try {
    const deleteUserInImageData = await ImageInfo.update(
      { is_deleted: 1 },
      {
        where: { owner: id },
      }
    );

    Log.info("deleteUserInImageData:" + deleteUserInImageData);
    if (deleteUserInImageData.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

    return deleteUserInImageData;
  } catch (err) {
    Log.error("error:" + err);
    return err;
  }
};
