const express = require('express');

const app = express();
app.use(express.json());

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDBConnectionUrI = process.env.DATABASE_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDBConnectionUrI);
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
