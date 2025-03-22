    const express = require("express");
    const connectDB = require("./db");
    const cors = require("cors");
    require("dotenv").config();

    const app = express();
    app.use(express.json());
    app.use(cors());

    connectDB();


    app.use("/",require("./routes/auth"))
    app.use("/api",require("./routes/jobs"))
    app.use("/reach-out",require("./routes/ContactUs"))

    app.listen(5000,()=>console.log("server listening on port 5000" ));


