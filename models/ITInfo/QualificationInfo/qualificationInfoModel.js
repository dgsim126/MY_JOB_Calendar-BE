// QualificationInfo 모델
const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../../../config/db'); // DB 연결 설정 불러오기

class QualificationInfoModel extends Sequelize.Model {
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
            exam_startdate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            exam_enddate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            resultdate: {
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
                type: DataTypes.STRING(500), // 길이가 너무 길으므로 확장.
                allowNull: false
            },
            pass_standard: {
                type: DataTypes.STRING,
                allowNull: true
            },
            workview: {
                type: DataTypes.STRING,
                allowNull: true
            },
            qualification: {
                type: DataTypes.STRING,
                allowNull: true
            },
            testinfo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            problems: {
                type: DataTypes.STRING,
                allowNull: true
            },
            qualification_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            relate_department: {
                type: DataTypes.STRING,
                allowNull: true
            },
            agency: {
                type: DataTypes.STRING,
                allowNull: true
            },
            link: {
                type: DataTypes.STRING(500), // 길이가 너무 길으므로 확장.
                allowNull: true
            },
            fee: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'QualificationInfoModel',
            tableName: 'qualificationInfo',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(models) {
        this.hasMany(models.Scrap, { foreignKey: 'qualificationInfoKey', onDelete: 'CASCADE' });
    }
}

QualificationInfoModel.init(sequelize); // 데이터베이스에 적용

module.exports = QualificationInfoModel;