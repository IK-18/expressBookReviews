const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  for (let book in books) {
    if (books[book].isbn == req.params.isbn) {
        return res.status(200).send(books[book]);
    }
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let filtered = []
  for (let book in books) {
    if (books[book].author == req.params.author.replace(/_/g, " ")) {
        filtered.push(books[book])
    }
  }
  return res.status(200).send(filtered);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  for (let book in books) {
    if (books[book].title == req.params.title.replace(/_/g, " ")) {
        return res.status(200).send(books[book]);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  for (let book in books) {
    if (books[book].isbn == req.params.isbn) {
        return res.status(200).send(books[book].reviews);
    }
  }
});

module.exports.general = public_users;
