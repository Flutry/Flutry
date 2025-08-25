import { Model, DataTypes, Sequelize } from '@flutry/sequelize';

export type TestModelType = {
  id: number;
  message: string;
};

export default class Test extends Model {
  static initialize(sequelize: Sequelize) {
    Test.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        message: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'test',
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['message'],
          },
        ],
      },
    );
  }
}
