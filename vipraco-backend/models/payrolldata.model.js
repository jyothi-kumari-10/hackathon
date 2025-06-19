module.exports = (sequelize, DataTypes) => {
    const PayrollData = sequelize.define("PayrollData", {
      payroll_id: {
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
      base_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      HRA: DataTypes.DECIMAL(10, 2),
      conveyance_allowance: DataTypes.DECIMAL(10, 2),
      medical_allowance: DataTypes.DECIMAL(10, 2),
      pf_deduction: DataTypes.DECIMAL(10, 2),
      esi_deduction: DataTypes.DECIMAL(10, 2),
      professional_tax: DataTypes.DECIMAL(10, 2),
      ctc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      tableName: "PayrollData",
      timestamps: false
    });
  
    return PayrollData;
  };
  