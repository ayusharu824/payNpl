const express = require('express')
const connectDB = require('./config/db')
const app = express();

//connect DB
connectDB()

//Init Middleware

// this below line is used to get data from req.body
app.use(express.json({extended: false}))

const PORT = process.env.PORT || 5000

app.get(`/`, (req, res) => {
    res.send(`API running`)
})

// DEFINE ROUTES
app.use('/api/users', require('./routes/api/users'))

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})