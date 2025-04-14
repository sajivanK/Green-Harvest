import express from 'express';
import { createProduct, updateProduct, deleteProduct, getMyProducts,getAllProducts , getCategoryDistribution, getSingleProduct} from '../controllers/productController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js'; // ✅ Import upload middleware

const productRouter = express.Router();

//Route to create a new product with image and QR code
productRouter.post('/create', authenticate, upload.single('image'), createProduct);

//Route to update an existing product with image and QR code
productRouter.patch('/update/:productId', authenticate, upload.single('image'), updateProduct);

//Route to delete a product
productRouter.delete('/delete/:productId', authenticate, deleteProduct);

//Route to get all products of the logged-in farmer
productRouter.get('/my-products', authenticate, getMyProducts);
//Route to get all products from the product collection
productRouter.get("/all", getAllProducts);

productRouter.get("/category-distribution", getCategoryDistribution);
// ✅ Get a specific product by ID
productRouter.get("/:id", getSingleProduct);
export default productRouter;
