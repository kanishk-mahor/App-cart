const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;

mongoose.connect('mongodb://localhost:27017/qkart',
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    server: {
      socketOptions: {
        socketTimeoutMS: 0,
        connectionTimeout: 0
      }
    }
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");

  app.listen(config.port, () => {
    console.log(`App is running on port ${config.port}`);
  });
});
