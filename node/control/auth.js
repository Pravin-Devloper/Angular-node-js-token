var dB_con = require('../db');
var jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
var otpGenerator = require('otp-generator')
var nodemailer = require('nodemailer');

var secret = 'encx404key';
const salt = 15 

module.exports = {

    signup: function(req,res){
        console.log(req.body);
        var {phone, name, password} = req.body;

        var sql = `SELECT * FROM signup WHERE phone = '${phone}'`
            dB_con.query(sql,(err,result)=>{
                if(err) throw err;
                if (result.length>0) {
                    console.log('phonenumber already exists')
                    res.json({success:false, msg:'Phone Number already exists'})
                }else{
                    bcrypt.hash(password, salt, function (err,hash){
                        if(err){
                            console.log(err)
                        }else{
                            var sql = `INSERT INTO signup(phone,name,password) VALUES ('${phone}','${name}','${hash}')`
                            dB_con.query(sql, (err,result)=> {
                                if(err) throw err;
                                if (result.protocol41 == true) {
                                    console.log(result)
                                    // const tokan = jwt.sign({User_id:email,id:result.insertId,role:'User',approval:false},secret, {expiresIn:'12h'});
                                    // res.send(200).send('success..')
                                    res.json({success:true,msg:'register successfully & Contact you admin to approval',})
                                }
                            })
                        }
                    })                    
                }
            })
    },


    login: function(req,res){
        console.log(req.query);
        var {phone, password }= req.query;
       
        var sql = `SELECT * FROM signup WHERE phone = '${phone}'`
            dB_con.query(sql, async (err,result)=> {
                if(err) throw err;
                if (result.length>0) {
                    if(result[0].verify_code == 400){
                        res.json({success:false,msg:'Contact you admin to approval'})
                    }
                    else {
                        var hash_code = result[0].password;
                        const match = await bcrypt.compare(password, hash_code);
                        if (match == true) {
                            const tokan = jwt.sign({id:result[0].id,role:'User',approval:true},secret, {expiresIn:'12h'});
                            res.json({success:true,msg:'login successfully',tokan:tokan})
                        } else {
                            res.json({success:false,msg:'Incorrect Password'})                            
                        }
                    }
                }else{
                    res.json({success:false,msg:'Incorrect Username'})
                }
            })
    },


    getusers: function(req, res){
        var sql = `SELECT * FROM signup WHERE verify_code =200`
        
        dB_con.query(sql, (err, result)=> {
            if(err) throw err;
            if(result.length>0){
                // console.log(result)
                res.json(result)
            }
        })
    },

    apusers: function(req,res){
        var sql = `SELECT * FROM signup WHERE verify_code =400`
        dB_con.query(sql, (err, result)=> {
            if(err) throw err;
            if(result.length>0){
                // console.log(result)
                res.json(result)
            }
        })

    },
    

    // admin login
    adminLogin: function(req,res){
        var {username, password }= req.body;
        var sql = `SELECT * FROM admin WHERE username = '${username}'`
            dB_con.query(sql, async (err,result)=> {
                if(err) throw err;
                if (result.length>0) {
                        var hash_code = result[0].password;
                        const match = await bcrypt.compare(password, hash_code);
                        if (match == true) {
                            const token = jwt.sign({id:result[0].id,role:'admin',},secret, {expiresIn:'10h'});
                            res.json({success:true,msg:'login successfully',token:token})
                        } else {
                            res.json({success:false,msg:'Incorrect Password'})                            
                        }
                }else{
                    res.json({success:false,msg:'Incorrect Username'})
                }
            })
    },
    

    adminApproval: function(req,res){
        // console.log(req.body)
        var {id,code} = req.body;
       var sql = `UPDATE signup SET verify_code='${code}' WHERE id = ${id}`;
       dB_con.query(sql, (err, result)=> {
           if(err) return  res.status(400).send('Database Error..')
           if(result.protocol41 == true) {
            res.json({code:200,msg:'Aprovel Status 200 Ok..'})
           }
       })

    },



    testapi: async function(req,res){
        var pass = req.body.pass;

    //   bcrypt.hash(pass,salt, function(err,hash){
    //     if(err) return  res.status(400).send('bcrypt Error..')
    //     res.send(hash)
    //   })  
    // var h = '$2b$15$Ln5OJS.DFT.PD5A9PdumsOH9EXfY8ifRAA7ftcLquYBzKnDWi2utK'
    //  var match = await bcrypt.compare(pass, h)
    //  res.send(match)

    },

    
    testapiimg: function(req,res){
        console.log(req.file);
        // res.json(req.file)
        var img = req.file;
        const url = req.protocol + '://' + req.get("host");
        var avatar = `${url}/images/${img.filename}`
        res.json(avatar)


    },

    

    
    // otp: function(req,res){

    //     var email = req.body.email;
    //     var otp = otpGenerator.generate(8, { upperCase: false, specialChars: false })
    //     console.log(otp)

    //     async function main() {

    //         let transporter = nodemailer.createTransport({
    //             host: "smtp.gmail.com",
    //             port: 465,
    //             secure: true,
    //             auth: {
    //             user: '....', 
    //             pass: '....', 
    //             },
    //         });
    
    //         let info = await transporter.sendMail({
    //             from: '....', // sender address
    //             to: `${email}`, // list of receivers add comma onther mail id
    //             subject: "Forget Password OTP", 
    //             text: `<h1>${otp}</h1>`, 
    //             html: `<h1>${otp} is verification code</h1>`, 
    //         });
    
    //         console.log("Message sent: %s", info.messageId);
    //         res.json(info);
    //         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    //         }
    //         main().catch(console.error);        

    // },


}