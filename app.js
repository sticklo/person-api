const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDBConnectionUrI = process.env.DATABASE_URI;
console.log(process.env.DATABASE_URI)

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDBConnectionUrI);
  // await mongoose.connect("mongodb+srv://sticklo:mwd4vWyFaDpUSyqw@cluster0.vs6lt.mongodb.net/person_api?retryWrites=true&w=majority");
}

const personRoutes = require('./server/routes/index');

app.use('/api', personRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { swaggerConfig } = require('./server/configs/swagger');

const specs = swaggerJSDoc(swaggerConfig);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.send('Successful response.');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(
    `person api app is listening on port ${PORT}.`,
    `http://localhost:${PORT}`
  )
);

module.exports = app;
