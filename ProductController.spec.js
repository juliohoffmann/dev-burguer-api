import ProductController from './ProductController';
import Product from '../models/Product';

// Mock the Product model
jest.mock('../models/Product');

describe('ProductController', () => {
  // Mock Express request and response objects for each test
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    req = {
      body: {},
      file: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Clear all previous mock calls
    Product.create.mockClear();
    Product.findAll.mockClear();
  });

  describe('store', () => {
    it('should create a new product successfully', async () => {
      // Arrange: Set up the request body and file
      req.body = {
        name: 'Hambúrguer Duplo Delicioso',
        price: 65.00,
        category: 'Burgers',
      };
      req.file = {
        filename: 'burger.jpg',
      };

      const newProduct = { id: 1, ...req.body, path: req.file.filename };
      Product.create.mockResolvedValue(newProduct);

      // Act: Call the controller method
      await ProductController.store(req, res);

      // Assert: Check if the response is correct
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newProduct);
      expect(Product.create).toHaveBeenCalledWith({
        name: 'Hambúrguer Duplo Delicioso',
        price: 65.00,
        category: 'Burgers',
        path: 'burger.jpg',
      });
    });

    it('should return 400 if validation fails (e.g., name is missing)', async () => {
      // Arrange: Set up an invalid request body
      req.body = {
        price: 65.00,
        category: 'Burgers',
      };
      req.file = {
        filename: 'burger.jpg',
      };

      // Act: Call the controller method
      await ProductController.store(req, res);

      // Assert: Check for validation error response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: ['name is a required field'],
      });
      expect(Product.create).not.toHaveBeenCalled();
    });
  });

  describe('index', () => {
    it('should return a list of all products', async () => {
      // Arrange: Set up mock data to be returned by the model
      const mockProducts = [
        {
          id: 1,
          name: 'Hambúrguer Clássico',
          price: 30.00,
          category: { id: 1, name: 'Burgers' },
          path: 'classic.jpg',
        },
        {
          id: 2,
          name: 'Batata Frita',
          price: 15.00,
          category: { id: 2, name: 'Acompanhamentos' },
          path: 'fries.jpg',
        },
      ];
      Product.findAll.mockResolvedValue(mockProducts);

      // Act: Call the controller method
      await ProductController.index(req, res);

      // Assert: Check if the response contains the list of products
      expect(res.json).toHaveBeenCalledWith(mockProducts);
      expect(Product.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no products exist', async () => {
      // Arrange: Mock an empty array response from the model
      Product.findAll.mockResolvedValue([]);

      // Act: Call the controller method
      await ProductController.index(req, res);

      // Assert: Check for an empty array response
      expect(res.json).toHaveBeenCalledWith([]);
      expect(Product.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
