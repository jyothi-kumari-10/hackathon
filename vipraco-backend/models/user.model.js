module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      user_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      organization_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      role: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      manager_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      date_of_joining: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(100),
      },
      location: {
        type: DataTypes.STRING(100),
      },
    }, {
      tableName: "Users",
      timestamps: false,
    });
  
    return User;
  };
  