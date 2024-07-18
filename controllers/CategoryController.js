const CategoryModel = require('./CategoryModel');

// lấy danh sách danh mục
const getCategories = async () =>{
    try {
        const categories = await CategoryModel.find();
        return categories;
    } catch (error) {
        console.log('getCategories error: ', error.message);
        throw new Error('Lấy danh sách danh mục thất bại');
    }   
}

module.exports = { getCategories };