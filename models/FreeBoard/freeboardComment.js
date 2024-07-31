// models/FreeboardComment.js
const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../../config/db'); // DB 연결 설정 불러오기
const Freeboard = require('./freeboard'); // Freeboard 모델 불러오기

class FreeboardComment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            commentKey: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            freeboardkey: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { // 외래키 관계 설정(일대다)
                    model: Freeboard,
                    key: 'key'
                }
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            id: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'FreeboardComment',
            tableName: 'freeboardComment',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    // ----- 추가한 부분 ------
    static associate(models) {
        this.belongsTo(models.Freeboard, {
            foreignKey: 'freeboardkey',
            as: 'Freeboard', // alias 추가
            onDelete: 'CASCADE'
        });
    }
    // ----- 추가한 부분 끝 ------
}

FreeboardComment.init(sequelize);

module.exports = FreeboardComment;
