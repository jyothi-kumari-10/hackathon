module.exports = (sequelize, DataTypes) => {
    const Organization = sequelize.define("Organization", {
      organization_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      org_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      subscription_plan: {
        type: DataTypes.STRING(50),
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: "Organizations",
      timestamps: false,
    });
  
    return Organization;
  };
  