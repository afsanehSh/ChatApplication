import { sequelize, BaseModel, DataTypes } from '../config/database'
import User from './user'

class GroupMessage extends BaseModel {}

GroupMessage.init(
  {
    message: {
      type: DataTypes.TEXT,
      allowNull: null
    },
    from: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  { sequelize, modelName: 'GroupMessage' }
)

export default GroupMessage
