/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - _id
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the person
 *         age:
 *           type: number
 *           description: The age of the person
 *         name:
 *           type: string
 *           description: The name of the person
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         age: 23
 *         name: Alexander K. Dewdney
 *     Success:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: A success message
 *       example:
 *         message: Successful🍻
 *     CreatePersonDto:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         age:
 *           type: number
 *           description: The age of the person
 *         name:
 *           type: string
 *           description: The name of the person
 *       example:
 *         age: 23
 *         name: Alexander K. Dewdney
 *     Error:
 *       type: object
 *       required:
 *         - error
 *       properties:
 *         error:
 *           type: string
 *           description: The error message
 *       example:
 *         error: Error message
 * tags:
 *   name: Persons
 *   description: The persons managing API
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Person = require('../models/index');

/**
 * @swagger
 * /api:
 *   post:
 *     summary: Add a new person
 *     tags: [Persons]
 *     requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/CreatePersonDto'
 *     responses:
 *       201:
 *         description: The created person response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       500:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post('/', async (req, res) => {
  const { age, name } = req.body;

  try {
    const person = await Person.create({ name, age });
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/{idOrName}:
 *   get:
 *     summary: Get the person by id or name
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: idOrName
 *         schema:
 *           type: string
 *         required: true
 *         description: The person id or name
 *     responses:
 *       200:
 *         description: The person response by id or name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       404:
 *         description: The person was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/:idOrName', async (req, res) => {
  const idOrName = req.params.idOrName;

  try {
    let person;
    if (mongoose.Types.ObjectId.isValid(idOrName)) {
      person = await Person.findById(idOrName);
    } else {
      person = await Person.findOne({ name: idOrName });
    }

    if (!person) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/{idOrName}:
 *   patch:
 *     summary: Update a  person
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: idOrName
 *         schema:
 *           type: string
 *         required: true
 *         description: The person id or name
 *     requestBody:
 *         required: false
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/CreatePersonDto'
 *     responses:
 *       200:
 *         description: The updated person response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       404:
 *         description: The person was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.patch('/:idOrName', async (req, res) => {
  const idOrName = req.params.idOrName;
  const { age, name } = req.body;

  try {
    let updatedPerson;
    if (mongoose.Types.ObjectId.isValid(idOrName)) {
      updatedPerson = await Person.findByIdAndUpdate(
        idOrName,
        { age, name },
        { new: true }
      );
    } else {
      updatedPerson = await Person.findOneAndUpdate(
        { name: idOrName },
        { age, name },
        { new: true }
      );
    }

    if (!updatedPerson) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    res.json(updatedPerson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/{idOrName}:
 *   delete:
 *     summary: Delete a  person
 *     tags: [Persons]
 *     parameters:
 *       - in: path
 *         name: idOrName
 *         schema:
 *           type: string
 *         required: true
 *         description: The person id or name
 *     responses:
 *       200:
 *         description: The deleted person response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: The person was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.delete('/:idOrName', async (req, res) => {
  const idOrName = req.params.idOrName;

  try {
    let deletedPerson;
    if (mongoose.Types.ObjectId.isValid(idOrName)) {
      deletedPerson = await Person.findByIdAndDelete(idOrName);
    } else {
      deletedPerson = await Person.findOneAndDelete({ name: idOrName });
    }

    if (!deletedPerson) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
