const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.json({ Message: 'Well Hello World!' });
});

server.get('/api/accounts', async (req, res) => {
  const accounts = await db('accounts');
  try {
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({
      Message: 'There was an error retrieving the accounts',
      Error: error.message
    });
  }
});

server.get('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [account] = await db('accounts').where({ id });
    res.status(200).json({ ...account });
  } catch (error) {
    res.status(500).json({
      Message: `There was an error retrieving the account #${id}`,
      Error: error.message
    });
  }
});

server.post('/api/accounts', async (req, res) => {
  const newAccount = req.body;
  try {
    const account = await db('accounts').insert(newAccount);
    res.status(200).json({ account });
  } catch (error) {
    res.status(500).json({
      Message: 'There was an error retrieving the accounts',
      Error: error.message
    });
  }
});

server.put('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const count = await db('accounts')
      .where('id', '=', id)
      .update(updatedData);
    if (count) {
      res.status(200).json({ updated: count });
    } else {
      res.status(404).json({ Message: `could not find account #${id}` });
    }
  } catch (error) {
    res.status(500).json({
      Message: 'There was an error retrieving the accounts',
      Error: error.message
    });
  }
});

server.delete('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const count = await db('accounts')
      .where({ id })
      .del();
    if (count) {
      res.status(200).json({ Deleted: count });
    } else {
      res.status(404).json({ message: `Could not delete account #${id}` });
    }
  } catch (error) {
    res.status(500).json({
      Message: 'There was an error deleting the account',
      Error: error.message
    });
  }
});

module.exports = server;
