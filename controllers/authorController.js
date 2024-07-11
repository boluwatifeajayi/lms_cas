const Author = require('../models/Author');
const mongoose = require('mongoose');

// Add a new author
exports.addAuthor = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const author = new Author({ name });
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an author
exports.updateAuthor = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Author not found' });
  }

  try {
    let author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    author.name = name || author.name;

    await author.save();
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Author not found' });
  }

  try {
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    await author.remove();
    res.status(200).json({ message: 'Author removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
