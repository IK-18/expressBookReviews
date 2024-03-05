const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let doesExist = (username) => {
	let filtered = users.filter((user) => {
		return user.username == username;
	});
	if (filtered.length > 0) {
		return true;
	} else {
		return false;
	}
};

public_users.post("/register", (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;

	if (username && password && isValid(username)) {
		if (!doesExist(username)) {
			users.push({username: username, password: password});
			return res.status(200).json({
				message: "User successfully registred. Now you can login",
			});
		} else {
			return res.status(409).json({message: "User already exists!"});
		}
	}
	return res.status(400).json({
		message: "Unable to register user. Check username and password.",
	});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	//Write your code here
	return res.status(200).send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	let isbn = req.params.isbn;
	if (books[isbn]) {
		return res.status(200).send(books[isbn]);
	} else {
		return res.status(404).json({message: "Book not found."});
	}
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	let filtered = [];
	for (let book of Object.values(books)) {
		if (
			book.author.toLowerCase() ==
			req.params.author.replace(/_/g, " ").toLowerCase()
		) {
			filtered.push(book);
		}
	}
	if (filtered.length > 0) {
		return res.status(200).send(filtered);
	} else {
		return res.status(404).json({message: "Books not found."});
	}
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	//Write your code here
	for (let book of Object.values(books)) {
		if (
			book.title.toLowerCase() ==
			req.params.title.replace(/_/g, " ").toLowerCase()
		) {
			return res.status(200).send(book);
		}
	}
	return res.status(404).json({message: "Book not found."});
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	let isbn = req.params.isbn;
	if (books[isbn]) {
		return res.status(200).send(books[isbn].reviews);
	} else {
		return res.status(404).json({message: "Book not found."});
	}
});

module.exports.general = public_users;
