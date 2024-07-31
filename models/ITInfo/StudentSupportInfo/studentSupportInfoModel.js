// StudentSupportInfo 모델
const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../../../config/db'); // DB 연결 설정 불러오기

class StudentSupportInfoModel extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            key: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            startdate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            enddate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            resultdate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            logo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pic1: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pic2: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pic3: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pic4: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pic5: {
                type: DataTypes.STRING,
                allowNull: true
            },
            body: {
                type: DataTypes.STRING(500), // 길이가 너무 길으므로 확장.
                allowNull: false
            },
            support_target: {
                type: DataTypes.STRING,
                allowNull: true
            },
            application_method: {
                type: DataTypes.STRING,
                allowNull: true
            },
            qualification: {
                type: DataTypes.STRING,
                allowNull: true
            },
            support_detail: {
                type: DataTypes.STRING,
                allowNull: true
            },
            link: {
                type: DataTypes.STRING(500), // 길이가 너무 길으므로 확장.
                allowNull: true
            },
            agency: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'StudentSupportInfoModel',
            tableName: 'studentSupportInfo',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(models) {
        this.hasMany(models.Scrap, { foreignKey: 'studentSupportInfoKey', onDelete: 'CASCADE' });
    }
}

StudentSupportInfoModel.init(sequelize); // 데이터베이스에 적용

module.exports = StudentSupportInfoModel;