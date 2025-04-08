
// 
const multer = require('multer');
const path = require('path');

// // set our multer storage
const storage = multer.diskStorage({

	// // Two functions as of now, destination function and filename function.

	// // 1. Destination folder
	destination: function( req, file, cb ) {
		cb(null, "uploads/")
	},

	// // 2. Create a name for the file (ie, image)
	filename: function( req, file, cb ) {
		cb(null, 
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		)
	}
})


/// /// file filter fuction
const checkFileFilter = ( req, file, cb )=> {

	if (file.mimetype.startsWith('image')) {
		cb(null, true)
	} else {
		cb( new Error('This is not an image! Please, upload only images'))
	}
}

module.exports = multer({
	storage: storage,
	fileFilter: checkFileFilter,
	limits: {
		fielSize: 5 * 1024 * 1024 // 5mb file size limit
	}
})
