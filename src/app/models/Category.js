import Sequelize, { Model } from "sequelize";

class Category extends Model {
    static init (sequelize) {
        super.init(
        {
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `http://localhost:3001/category-file/${this.path}`
                    }
            }
        }, 
        { //Configurações do model
            sequelize,
            tableName: 'categories'
        }
    );
    return this
    }
}

export default Category
