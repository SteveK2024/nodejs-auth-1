// 

const express = require('express');

const authMiddleware = require('../middleware/auth-middleware');
const isAdminUser = require('../middleware/admin-middleware');

const uploadMiddleware = require('../middleware/upload-middleware')

const { uploadImageController, fetchImagesController, deleteImageController } = require('../controllers/image-controller')

const router = express.Router();

///// upload the image
router.post(
	'/upload', 
	authMiddleware, 
	isAdminUser, 

	//// check for single image
	uploadMiddleware.single('image'), 
	
	//// storing in database
	uploadImageController
)


///// get all the images
router.get('/get', authMiddleware, fetchImagesController);

//// delete an image
//// 67d733f3ee6697df91c59f40
router.delete('/:id', authMiddleware, isAdminUser, deleteImageController)


module.exports = router;