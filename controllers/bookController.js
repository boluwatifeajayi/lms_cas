const Book = require('../models/Book');
const cloudinary = require('cloudinary').v2;
const { multerUploads, dataUri } = require('../middlewares/multer');
const mongoose = require('mongoose');

// Add a new book
exports.addBook = async (req, res) => {
  const { title, description, author } = req.body;
  try {
    if (!title || !description || !author) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let imageUrl = '';

    if (req.file) {
      const file = dataUri(req).content;
      const result = await cloudinary.uploader.upload(file);
      imageUrl = result.url;
    }

    const book = new Book({ title, description, author, image: imageUrl });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.log(error)
  }
};

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single book
exports.getBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Book not found' });
  }

  try {
    const book = await Book.findById(id).populate('author');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  const { title, description, author } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Book not found' });
  }

  try {
    let book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (req.file) {
      const file = dataUri(req).content;
      const result = await cloudinary.uploader.upload(file);
      book.image = result.url;
    }

    book.title = title || book.title;
    book.description = description || book.description;
    book.author = author || book.author;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Book not found' });
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.remove();
    res.status(200).json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to a book
exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Book not found' });
  }

  try {
    let book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const newComment = {
      name,
      comment,
      date: new Date(),
    };

    book.comments.push(newComment);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
