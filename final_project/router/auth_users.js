const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	if (
		username.length >= 3 &&
		username.length < 20 &&
		username.match(/^[A-z]+$/g)
	) {
		return true;
	} else {
		return false;
	}
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let validUser = users.filter((user) => {
		return user.username == username && user.password == password;
	});
	if (validUser.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	//Write your code here
	let username = req.body.username;
	let password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({message: "Error logging in!"});
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign({data: password}, "privateKey", {
			expiresIn: 3600,
		});
		req.session.authorization = {accessToken, username};
		return res.status(200).json({message: "User succesfully logged in!"});
	} else {
		res.status(208).json({
			message: "Invalid Login. Check username and password",
		});
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	let isbn = req.params.isbn;
	let review = req.body.review;

	if (review.length <= 0) {
		res.status(400).json({message: "Review is required."});
	}

	if (books[isbn]) {
		books[isbn].reviews[req.session.authorization.username] = review;
		return res.status(200).json({message: "Review uploaded successfully!"});
	}
	return res.status(404).json({message: "Book not found."});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
	//Write your code here
	let isbn = req.params.isbn;

	if (books[isbn]) {
		delete books[isbn].reviews[req.session.authorization.username];
		return res.status(200).json({message: "Review deleted successfully!"});
	}
	return res.status(404).json({message: "Book not found."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
