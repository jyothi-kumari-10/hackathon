module.exports = (sequelize, DataTypes) => {
    const LeaveBalance = sequelize.define("LeaveBalance", {
      balance_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      organization_id: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      user_id: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      leave_type: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      total_allotted: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      leaves_taken: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      leaves_pending_approval: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: "LeaveBalances",
      timestamps: false
    });
  
    return LeaveBalance;
  };
  