// RecruitmentNoticeInfo 모델
const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../../../config/db'); // DB 연결 설정 불러오기

class RecruitmentNoticeInfoModel extends Sequelize.Model {
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
            experience: {
                type: DataTypes.STRING,
                allowNull: true
            },
            education: {
                type: DataTypes.STRING,
                allowNull: true
            },
            stack: {
                type: DataTypes.STRING,
                allowNull: true
            },
            qualification: {
                type: DataTypes.STRING(500), // 길이가 너무 길으므로 확장.
                allowNull: true
            },
            preferences: {
                type: DataTypes.STRING(500), // 길이가 너무 길으므로 확장.
                allowNull: true
            },
            work_type: {
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
            work_time: {
                type: DataTypes.STRING,
                allowNull: true
            },
            recruit_part: {
                type: DataTypes.STRING,
                allowNull: true
            },
            duties: {
                type: DataTypes.STRING,
                allowNull: true
            },
            key_skills: {
                type: DataTypes.STRING,
                allowNull: true
            },
            recruit_num: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            link: {
                type: DataTypes.STRING(500), // 길이가 너무 길으므로 확장.
                allowNull: true
            },
            companyname: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'RecruitmentNoticeInfoModel',
            tableName: 'recruitmentNoticeInfo',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(models) {
        this.hasMany(models.Scrap, { foreignKey: 'recruitmentNoticeInfoKey', onDelete: 'CASCADE' });
    }
}

RecruitmentNoticeInfoModel.init(sequelize); // 데이터베이스에 적용

module.exports = RecruitmentNoticeInfoModel;