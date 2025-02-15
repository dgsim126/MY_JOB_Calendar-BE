const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../../config/db"); // DB 연결 설정 불러오기

class Freeboard extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            key: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            body: {
                // type: DataTypes.STRING,
                type: DataTypes.TEXT,
                allowNull: false
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            pic1: {
                type: DataTypes.BLOB('medium'), // MEDIUMBLOB으로 변경
                allowNull: true // 사진이 필수가 아니라면 true로 설정
            },
            pic2: {
                type: DataTypes.BLOB('medium'), // MEDIUMBLOB으로 변경
                allowNull: true // 사진이 필수가 아니라면 true로 설정
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Freeboard',
            tableName: 'freeboard',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    // ----- 추가한 부분 ------
    static associate(models) {
        this.hasMany(models.FreeboardComment, {
            foreignKey: 'freeboardkey',
            as: 'FreeboardComments', // alias 추가
            onDelete: 'CASCADE'
        });
    }
    // ----- 추가한 부분 ------
}

Freeboard.init(sequelize); // 모델 초기화

module.exports = Freeboard;
