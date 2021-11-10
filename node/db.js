const mysql = require('mysql');

var dB_con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'new_fam',
   
});



dB_con.connect((err) => {
    if (!err)
        console.log('DB connection succeded...!');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

module.exports = dB_con;
