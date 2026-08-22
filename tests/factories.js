const { faker } = require('@faker-js/faker');
const { Product, Category } = require('../src/models/product');
class ProductFactory {
 static build(overrides = {}) {
   return {
     id: faker.number.int({ min: 1, max: 10000 }),
     name: faker.commerce.productName(),
     description: faker.commerce.productDescription(),
     price: parseFloat(faker.commerce.price({ min: 1, max: 500, dec: 2 })),
     available: faker.datatype.boolean(),
     category: faker.helpers.arrayElement(Object.values(Category)),
     ...overrides
   };
 }
}
module.exports = { ProductFactory };