import {BaseModel, DataTypes, sequelize} from '../config/database'
import Comment from "./comment";

class Article extends BaseModel {
}

Article.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'article'
    }
)

Article.hasMany(Comment)
Comment.belongsTo(Article)

export default Article
