const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../../config/db'); // DB 연결 설정 불러오기

class Company extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            companyID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            establish: {
                type: DataTypes.DATE,
                allowNull: true
            },
            logo: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            pic1: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            pic2: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            pic3: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            pic4: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            pic5: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            track: {
                type: DataTypes.STRING,
                allowNull: true
            },
            stack: {
                type: DataTypes.STRING,
                allowNull: true
            },
            welfare: {
                type: DataTypes.STRING,
                allowNull: true
            },
            salary: {
                type: DataTypes.STRING,
                allowNull: true
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true
            },
            employee: {
                type: DataTypes.STRING,
                allowNull: true
            },
            link: {
                type: DataTypes.STRING(500), // 길이가 너무 길으므로 확장.
                allowNull: true
            },
            revenue: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Company',
            tableName: 'company',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    static associate(models) {
        this.hasMany(models.Scrap, { foreignKey: 'companyID' });
    }
}

Company.init(sequelize);

module.exports = Company;