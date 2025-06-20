const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// We'll add model imports here next
db.Organizations = require("./organization.model")(sequelize, DataTypes);
db.Users = require("./user.model")(sequelize, DataTypes);
db.LeaveBalances = require("./leavebalance.model")(sequelize, DataTypes);
db.CompanyPolicies = require("./companypolicy.model")(sequelize, DataTypes);
db.PayrollData = require("./payrolldata.model")(sequelize, DataTypes);
db.Admins = require("./admin.model")(sequelize, DataTypes);
db.LeaveRequests = require("./leaveRequest.model")(sequelize, DataTypes);

// Define associations
db.Organizations.hasMany(db.Users, {
  foreignKey: 'organization_id',
  sourceKey: 'organization_id',
  as: 'users'
});

db.Users.belongsTo(db.Organizations, {
  foreignKey: 'organization_id',
  targetKey: 'organization_id',
  as: 'organization'
});

module.exports = db;

