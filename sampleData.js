const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const data = require("./data.js");

// Connecting Database
const mongodbUrl =
  "mongodb+srv://asdf:asdf%40123@cluster0.fsymu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function main() {
  await mongoose
    .connect(mongodbUrl)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("Some Error Occured", err);
    });
}
main();

// Inserting Data
const sampleData = async () => {
  try {
    await Listing.deleteMany({});
    let insertData = data.map((obj) => ({
      ...obj,
      owner: "67092ecc1311154ee0e82ca2",
    }));
    await Listing.insertMany(insertData);
    console.log(insertData);
    console.log("Data Inserted Successfully");
    // Insert Many Can Automatically Save
  } catch (err) {
    console.log("Some Error Occured", err);
  } finally {
    mongoose.connection.close();
  }
};

// Calling Function
sampleData();
