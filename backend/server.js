const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));
const port = 3000;

app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Initialize Database Client
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


const Smart_search = require("./router/Smart_search")(client);
const RentRouter = require("./router/RENT")(client);
const AuthRouter = require("./router/auth")(client);
const WorkerRouter = require("./router/worker")(client);
const HistoryOrderRouter = require("./router/history_order")(client);
// const ConfermOrderRouter = require("./router/confirm_sell")(client);
const OrderRouter = require("./router/order")(client);
const Rentalpage = require("./router/rentalpage")(client);
const CartRouter = require("./router/add_cart")(client);
const getcart = require("./router/get_cart")(client);
const EquipmentReviewRouter = require("./router/equipmentReview")(client);
const user = require("./router/user")(client);





app.use("/Smart_search", Smart_search);
app.use("/RENT", RentRouter);
app.use("/auth", AuthRouter);
app.use("/worker", WorkerRouter);
app.use("/history", HistoryOrderRouter);
// app.use("/confirm", ConfermOrderRouter);
app.use("/order", OrderRouter);
app.use("/rental", Rentalpage);
app.use("/cart", CartRouter);
app.use("/getcart", getcart);
app.use("/review", EquipmentReviewRouter);
app.use("/user", user);


// Connect and Start
client.connect()
    .then(() => {
        console.log("✅ Connected to PostgreSQL");
        app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    })
    .catch(err => console.error("❌ Database connection error:", err));