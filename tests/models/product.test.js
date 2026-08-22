const { Product, Category } = require('../../src/models/product');
const { sequelize } = require('../../src/database/connection');
const { ProductFactory } = require('../factories');

describe('Product Model', () => {


  
  describe('Product Creation', () => {
    test('should create a product and assert that it exists', () => {
      const productData = {
        name: 'Fedora',
        description: 'A red hat',
        price: 12.50,
        available: true,
        category: Category.CLOTHS
      };
      
      const product = new Product(productData);
      
      expect(product).toBeDefined();
      expect(product.id).toBeNull(); // Not saved yet
      expect(product.name).toBe('Fedora');
      expect(product.description).toBe('A red hat');
      expect(product.available).toBe(true);
      expect(product.price).toBe(12.50);
      expect(product.category).toBe(Category.CLOTHS);
    });
    
    test('should add a product to the database', async () => {
      // Check database is empty
      const products = await Product.findAll();
      expect(products).toEqual([]);
      
      // Create product using factory
      const productData = ProductFactory.build();
      delete productData.id; // Remove ID so database assigns one
      
      const product = await Product.create(productData);
      
      // Assert that it was assigned an id and shows up in the database
      expect(product.id).toBeDefined();
      
      const allProducts = await Product.findAll();
      expect(allProducts.length).toBe(1);
      
      // Check that it matches the original product
      const newProduct = allProducts[0];
      expect(newProduct.name).toBe(productData.name);
      expect(newProduct.description).toBe(productData.description);
      expect(parseFloat(newProduct.price)).toBe(productData.price);
      expect(newProduct.available).toBe(productData.available);
      expect(newProduct.category).toBe(productData.category);
    });
  });
  describe('Read a Product', () => {
   test('should read a product and ensure it passes', async () => {
     const productData = ProductFactory.build();
     console.log('Product to create:', productData);
     const product = await Product.create(productData);
     expect(product.id).not.toBeNull();
     const foundProduct = await Product.findByPk(product.id);
     expect(foundProduct.id).toBe(product.id);
     expect(foundProduct.name).toBe(productData.name);
     expect(foundProduct.description).toBe(productData.description);
     expect(parseFloat(foundProduct.price)).toBe(productData.price);
     expect(foundProduct.available).toBe(productData.available);
     expect(foundProduct.category).toBe(productData.category);
   });
 });
 describe('Update a Product', () => {
   test('should update a product and ensure it passes', async () => {
     const productData = ProductFactory.build();
     const product = await Product.create(productData);
     expect(product.id).not.toBeNull();
     console.log('Created product:', product.toJSON());
     product.description = 'Updated description';
     await product.save();
     expect(product.id).toBe(product.id);
     expect(product.description).toBe('Updated description');
     const allProducts = await Product.findAll();
     expect(allProducts.length).toBe(1);
     const updatedProduct = allProducts[0];
     expect(updatedProduct.id).toBe(product.id);
     expect(updatedProduct.description).toBe('Updated description');
   });
 });
 describe('Delete a Product', () => {
   test('should delete a product and ensure it passes', async () => {
     const productData = ProductFactory.build();
     const product = await Product.create(productData);
     let allProducts = await Product.findAll();
     expect(allProducts.length).toBe(1);
     await product.destroy();
     allProducts = await Product.findAll();
     expect(allProducts.length).toBe(0);
   });
 });
 describe('List all Products', () => {
   test('should list all products', async () => {
     let products = await Product.findAll();
     expect(products.length).toBe(0);
     for (let i = 0; i < 5; i++) {
       const productData = ProductFactory.build();
       await Product.create(productData);
     }
     products = await Product.findAll();
     expect(products.length).toBe(5);
   });
 });
 describe('Find a Product by Name', () => {
   test('should find a product by name and ensure it passes', async () => {
     const productsData = [];
     for (let i = 0; i < 5; i++) {
       productsData.push(ProductFactory.build());
     }
     for (const data of productsData) {
       await Product.create(data);
     }
     const firstName = productsData[0].name;
     const expectedCount = productsData.filter(p => p.name === firstName).length;
     const foundProducts = await Product.findByName(firstName);
     expect(foundProducts.length).toBe(expectedCount);
     foundProducts.forEach(p => {
       expect(p.name).toBe(firstName);
     });
   });
 });
 describe('Find a Product by Availability', () => {
   test('should find a product by availability and ensure it passes', async () => {
     const productsData = [];
     for (let i = 0; i < 10; i++) {
       productsData.push(ProductFactory.build());
     }
     for (const data of productsData) {
       await Product.create(data);
     }
     const firstAvailability = productsData[0].available;
     const expectedCount = productsData.filter(p => p.available === firstAvailability).length;
     const foundProducts = await Product.findByAvailability(firstAvailability);
     expect(foundProducts.length).toBe(expectedCount);
     foundProducts.forEach(p => {
       expect(p.available).toBe(firstAvailability);
     });
   });
 });
 describe('Find a Product by Category', () => {
   test('should find a product by category and ensure it passes', async () => {
     const productsData = [];
     for (let i = 0; i < 10; i++) {
       productsData.push(ProductFactory.build());
     }
     for (const data of productsData) {
       await Product.create(data);
     }
     const firstCategory = productsData[0].category;
     const expectedCount = productsData.filter(p => p.category === firstCategory).length;
     const foundProducts = await Product.findByCategory(firstCategory);
     expect(foundProducts.length).toBe(expectedCount);
     foundProducts.forEach(p => {
       expect(p.category).toBe(firstCategory);
     });
   });
 });
 
  
  
});