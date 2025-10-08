import { Model, DataTypes, Sequelize } from '@flutry/sequelize';

export type TestModelType = {
  id: string;
  message: string;
};

export default class Test extends Model {
  static initialize(sequelize: Sequelize) {
    Test.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
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
