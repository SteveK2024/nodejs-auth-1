// 
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


// //register controller
const registerUser = async (req, res)=> {
	try {
		//// extract user information from our request body
		const { username, email, password, role } = req.body;

		//// check if user already exists in our database
		const checkExisting = await User.findOne({
			$or: [{username}, {email}]
		})

		if (checkExisting) {
			return res.status(400).json({
				success: false,
				message: "User already exists either with same username or email. Please, try with a different username or email"

			})
		}

		//// hash user password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);


		///// create a new user and save in our database
		const newlyCreatedUser = new User({
			username, 
			email, 
			password: hashedPassword,
			role: role || 'user'
		})

		await newlyCreatedUser.save();

		if (newlyCreatedUser) {
			res.status(201).json({
				success: true,
				message: "User registered successfully!"

			})
		} else {
			res.status(400).json({
				success: false,
				message: "Unable to register user! Please try again."

			})
		}

	} catch(e) {
		console.log(e)
		res.status(500).json({
			success: false,
			message: "Some error occured, please try again"
		})
	}
}



const registerUser2 = async (req, res)=> {
	try {
		// obtain from front end user credentials
		const {username, email, password, role} = req.body;

		const checkUserExists = await User.findOne({
			$or : [{username}, {password}]
		});

		if (checkUserExists) {
			return res.status(400).json({
				success: false,
				message: "Username or password already exists, please try with a different username or password"
			});
		}

		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedpassword = await bcrypt.hash(password, salt);

		// create new user
		const newlyCreatedUser = new User({
			username,
			email,
			password: hashedpassword,
			role: role || 'user'
		})

		await newlyCreatedUser.save();

		if (newlyCreatedUser) {
			res.status(201).json({
				success: true,
				message: "User registerd successfully",
				data: newlyCreatedUser
			})
		} else {
			res.status(400).json({
				success: true,
				message: "User registration failed, Please try again"
			})
		}


	} catch(e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occured, Please try again"
		})
	}
}


// login controller
const loginUser = async (req, res)=> {
	try {
		//// get credencials from frontend
		const { username, password } = req.body;

		//// check if current user exists in our database.
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid Credentials!"
			})
		}

		//// check if the password is correct or not
		const isPasswordMatch = await bcrypt.compare(password, user.password)

		if (!isPasswordMatch) {
			return res.status(400).json({
				success: false,
				message: "Invalid Credentials!"
			})
		}

		//// create user token
		const accessToken = jwt.sign({
			userId: user._id,
			username: user.username,
			role: user.role
		}, process.env.JWT_SECRET_KEY, {expiresIn: "15m"})

		//// return status 200 with access token
		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			accessToken
		})

	} catch(e) {
		console.log(e)
		return res.status(500).json({
			success: false,
			message: "Some error occured, please try again"
		})
	}
}

const loginUser2 = async (req, res)=> {
	try {
		// get credentials from front end
		const {username, password} = req.body;
		
		// check if currrent user exist in our database
		const user = await User.findOne({username});
		
		if (!user) {
			res.status(400).json({
				success: false,
				message: "Invalid user credentials"
			})
		}

		//check if password from front end matches with the database
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			res.status(400).json({
				success: false,
				message: "Invalid user credentials"
			})
		}

		const accessToken = jwt.sign({
			userId: user._id,
			username: user.username,
			role: user.role
		}, process.env.JWT_SECRET_KEY, {expiresIn: "15m"})

		res.status(200).json({
			success: true,
			message: "User logged in successfully",
			accessToken
		})


	} catch(e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Something went wrong, please try again later"
		})
	}
}

const changePassword = async (req, res)=> {
	try {
		const userId = req.userInfo.userId;

		// extract old password, enter new password
		const { oldPassword, newPassword } = req.body;

		// // find the current logged in user
		const user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'User not found!'
			})
		}

		//// check if the old password is correct
		const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

		if (!isPasswordMatch) {
			return res.status(400).json({
				success: false,
				message: 'Old password is incorrect! Please, try again'
			})
		}

		//// hash the new password
		const salt = await bcrypt.genSalt(10);
		const newHashedPassword = await bcrypt.hash(newPassword, salt);

		//// update user password
		user.password = newHashedPassword;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Password updated successfully",
		})


	} catch(e) {
		console.log(e)
		return res.status(500).json({
			success: false,
			message: "Some error occured, please try again"
		})
	}
}

module.exports = { registerUser, loginUser, changePassword }