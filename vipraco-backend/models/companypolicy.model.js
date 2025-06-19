module.exports = (sequelize, DataTypes) => {
    const CompanyPolicy = sequelize.define("CompanyPolicy", {
      policy_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      organization_id: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      policy_title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      policy_category: {
        type: DataTypes.STRING(100)
      },
      policy_content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      last_reviewed: {
        type: DataTypes.DATE
      },
      keywords: {
        type: DataTypes.TEXT
      }
    }, {
      tableName: "CompanyPolicies",
      timestamps: false
    });
  
    return CompanyPolicy;
  };
  