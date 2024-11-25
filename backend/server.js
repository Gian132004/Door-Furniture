require('dotenv').config()

const express = require ('express')
const mongoose = require ('mongoose')
const sysroute = require('./routes/route')

//app express
const app = express()

app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/route', sysroute)

//connect to db
mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    //listen for req port
app.listen(process.env.PORT, () => {
    console.log('listening on port!!', process.env.PORT) 
})
})
.catch((error) =>{
    console.log(error)
})




