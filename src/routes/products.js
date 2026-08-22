const express = require('express');
const { Product, Category, sequelize } = require('../models/product');
const { Op } = require('sequelize');
const { validateProduct, checkContentType } = require('../middleware/validation');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 200, message: 'OK' });
});

/**
 * CREATE A NEW PRODUCT
 */
router.post('/', checkContentType('application/json'), validateProduct, async (req, res) => {
  try {

    
    const product = await Product.create(req.body);

    
    const location = `/api/products/${product.id}`;
    res.status(201)
       .location(location)
       .json(product.serialize());
       
  } catch (error) {

    res.status(400).json({ 
      error: 'Bad Request', 
      message: error.message 
    });
  }
});
/**

* READ A PRODUCT

*/

router.get('/:id', async (req, res) => {

    try {
  
      const product = await Product.findByPk(req.params.id);
  
      if (!product) {
  
        return res.status(404).json({
  
          error: 'Not Found',
  
          message: `Product with id ${req.params.id} was not found`
  
        });
  
      }
  
      res.status(200).json(product.serialize());
  
    } catch (error) {
  
      res.status(400).json({
  
        error: 'Bad Request',
  
        message: error.message
  
      });
  
    }
  
  });
  
  /**
  
  * UPDATE A PRODUCT
  
  */
  
  router.put('/:id', checkContentType('application/json'), validateProduct, async (req, res) => {
  
    try {
  
      const product = await Product.findByPk(req.params.id);
  
      if (!product) {
  
        return res.status(404).json({
  
          error: 'Not Found',
  
          message: `Product with id ${req.params.id} was not found`
  
        });
  
      }
  
      await product.update(req.body);
  
      res.status(200).json(product.serialize());
  
    } catch (error) {
  
      res.status(400).json({
  
        error: 'Bad Request',
  
        message: error.message
  
      });
  
    }
  
  });
  
  /**
  
  * DELETE A PRODUCT
  
  */
  
  router.delete('/:id', async (req, res) => {
  
    try {
  
      const product = await Product.findByPk(req.params.id);
  
      if (product) {
  
        await product.destroy();
  
      }
  
      res.status(204).send();
  
    } catch (error) {
  
      res.status(400).json({
  
        error: 'Bad Request',
  
        message: error.message
  
      });
  
    }
  
  });
  
  /**
  
  * LIST ALL PRODUCTS (with optional filters)
  
  */
  
  router.get('/', async (req, res) => {
  
    try {
  
      const { name, category, available } = req.query;
  
      const where = {};
  
      if (name) where.name = name;
  
      if (category) where.category = category;
  
      if (available !== undefined) where.available = (available === 'true');
  
      const products = await Product.findAll({ where });
  
      res.status(200).json(products.map(p => p.serialize()));
  
    } catch (error) {
  
      res.status(400).json({
  
        error: 'Bad Request',
  
        message: error.message
  
      });
  
    }
  
  });
   

module.exports = router;