const mongoose = require('mongoose');
//connection to mongoose
const DB = process.env.Database;
mongoose.connect(DB,{ useNewUrlParser: false,
    useUnifiedTopology: false }).then(() => {
    console.log("connection sucessfull")
}).catch((err) => {
    console.log("no connection",err)
});