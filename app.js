//require('@google-cloud/debug-agent').start()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const routes = require('./routes/routes')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(routes)

app.get("/", (req, res) => {
    res.send("Response Success!")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})