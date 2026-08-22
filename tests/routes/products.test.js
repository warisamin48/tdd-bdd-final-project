const request = require('supertest');
const app = require('../../src/app');
const { Product } = require('../../src/models/product');
const { ProductFactory } = require('../factories');
const BASE_URL = '/api/products';

describe('Product Routes', () => {

  
  /**
   * Utility function to bulk create products
   */
  async function createProducts(count = 1) {
    const products = [];
    for (let i = 0; i < count; i++) {
      const productData = ProductFactory.build();
      const product = await Product.create(productData);
      products.push(product);
    }
    return products;
  }
  
  /**
   * Utility function to get product count
   */
  async function getProductCount() {
    const response = await request(app)
      .get(BASE_URL)
      .expect(200);
    return response.body.length;
  }
  
  describe('Basic Endpoints', () => {
    test('should return the index page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('Product Catalog Administration');
    });
    
    test('should be healthy', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/health`)
        .expect(200);
      
      expect(response.body.message).toBe('OK');
    });
  });

  
  
  describe('CREATE Product', () => {
    test('should create a new product', async () => {
      const testProduct = ProductFactory.build();

      
      const response = await request(app)
        .post(BASE_URL)
        .send(testProduct)
        .expect(201);
      
      // Make sure location header is set
      expect(response.headers.location).toBeDefined();
      
      // Check the data is correct
      const newProduct = response.body;
      expect(newProduct.name).toBe(testProduct.name);
      expect(newProduct.description).toBe(testProduct.description);
      expect(newProduct.price).toBe(testProduct.price);
      expect(newProduct.available).toBe(testProduct.available);
      expect(newProduct.category).toBe(testProduct.category);
      
      
      
      
    });
    
    test('should not create a product without a name', async () => {
      const productData = ProductFactory.build();
      delete productData.name;
      

      
      const response = await request(app)
        .post(BASE_URL)
        .send(productData)
        .expect(400);
      
      expect(response.body.error).toBe('Validation Error');
    });
    
    test('should not create a product with no Content-Type', async () => {
      await request(app)
        .post(BASE_URL)
        .send('bad data')
        .expect(415);
    });
    
    test('should not create a product with wrong Content-Type', async () => {
      await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'text/plain')
        .send('some plain text data')
        .expect(415);
    });

    test('should proceed if content type is correct but has extra parameters', async () => {
      const productData = ProductFactory.build();
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(productData);

      // We expect a 201, not a 415, because the base type is correct.
      expect(response.status).toBe(201);
    });
  });
describe('READ Product', () => {

    test('should get a single product', async () => {

      const products = await createProducts(1);

      const testProduct = products[0];

      const response = await request(app)

        .get(`${BASE_URL}/${testProduct.id}`)

        .expect(200);

      expect(response.body.name).toBe(testProduct.name);

      expect(response.body.description).toBe(testProduct.description);

      expect(response.body.available).toBe(testProduct.available);

      expect(response.body.category).toBe(testProduct.category);

    });

    test('should not get a product that is not found', async () => {

      const response = await request(app)

        .get(`${BASE_URL}/99999`)

        .expect(404);

      expect(response.body.error).toBe('Not Found');

    });

  });

  describe('UPDATE Product', () => {

    test('should update an existing product', async () => {

      const products = await createProducts(1);

      const testProduct = products[0];

      const updatedData = ProductFactory.build();

      const response = await request(app)

        .put(`${BASE_URL}/${testProduct.id}`)

        .send(updatedData)

        .expect(200);

      expect(response.body.id).toBe(testProduct.id);

      expect(response.body.name).toBe(updatedData.name);

      expect(response.body.description).toBe(updatedData.description);

    });

    test('should not update a product that is not found', async () => {

      const updatedData = ProductFactory.build();

      const response = await request(app)

        .put(`${BASE_URL}/99999`)

        .send(updatedData)

        .expect(404);

      expect(response.body.error).toBe('Not Found');

    });
    test('should return 400 when update data is invalid', async () => {
        const products = await createProducts(1);
        const testProduct = products[0];
        const badData = { name: '' };
        const response = await request(app)
          .put(`${BASE_URL}/${testProduct.id}`)
          .send(badData)
          .expect(400);
        expect(response.body.error).toBe('Validation Error');
      });
  });

  describe('DELETE Product', () => {

    test('should delete an existing product', async () => {

      const products = await createProducts(1);

      const testProduct = products[0];

      await request(app)

        .delete(`${BASE_URL}/${testProduct.id}`)

        .expect(204);

      const count = await getProductCount();

      expect(count).toBe(0);

    });

  });

  describe('LIST Products', () => {

    test('should list all products', async () => {

      await createProducts(5);

      const response = await request(app)

        .get(BASE_URL)

        .expect(200);

      expect(response.body.length).toBe(5);

    });

    test('should list products by name', async () => {

      const products = await createProducts(5);

      const testName = products[0].name;

      const expectedCount = products.filter(p => p.name === testName).length;

      const response = await request(app)

        .get(`${BASE_URL}?name=${encodeURIComponent(testName)}`)

        .expect(200);

      expect(response.body.length).toBe(expectedCount);

      response.body.forEach(p => expect(p.name).toBe(testName));

    });

    test('should list products by category', async () => {

      const products = await createProducts(10);

      const testCategory = products[0].category;

      const expectedCount = products.filter(p => p.category === testCategory).length;

      const response = await request(app)

        .get(`${BASE_URL}?category=${testCategory}`)

        .expect(200);

      expect(response.body.length).toBe(expectedCount);

      response.body.forEach(p => expect(p.category).toBe(testCategory));

    });

    test('should list products by availability', async () => {

      const products = await createProducts(10);

      const testAvailability = products[0].available;

      const expectedCount = products.filter(p => p.available === testAvailability).length;

      const response = await request(app)

        .get(`${BASE_URL}?available=${testAvailability}`)

        .expect(200);

      expect(response.body.length).toBe(expectedCount);

      response.body.forEach(p => expect(p.available).toBe(testAvailability));

    });

  });
 
  
  
});