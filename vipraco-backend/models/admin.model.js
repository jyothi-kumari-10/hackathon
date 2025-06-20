module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    admin_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
    },
  }, {
    tableName: "Admins",
    timestamps: false,
  });

  return Admin;
}; 