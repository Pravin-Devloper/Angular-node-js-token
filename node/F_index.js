const express = require('express');
const app = express()
// const https = require('https');
const routers = require('./Router/router')
var bodyParser = require('body-parser');
const cors = require('cors');


const hostname = '192.168.1.9'
// const hostname = 'localhost';
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static('images'));



// Router Api...!
app.use('/v1/api', routers);


// const sslServer = https.createServer({
//     key: fs.readFileSync(path.join(__dirname, 'ssl', '')),
//     cert: fs.readFileSync(path.join(__dirname, 'ssl', '')),
// },app)




app.listen(PORT,hostname,()=>{
console.log(`Server Running is ${hostname} : ${PORT}`)
});


module.exports = app;