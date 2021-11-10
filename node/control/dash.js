var dB_con = require('../db');


module.exports = {

    femaleUn : function(req,res){
        var sql = `SELECT COUNT(id) As total FROM individuals WHERE m_status='unmarried' AND gendar='Female'`;
        dB_con.query(sql, (err,result)=>{
         if(err) return res.status(401).send(err)
         if(result.length){
             console.log(result)
             res.json(result[0])
         }
        })
    },

    maleUn : function(req,res){
        var sql = `SELECT COUNT(id) As total FROM individuals WHERE m_status='unmarried' AND gendar='Male'`;
        dB_con.query(sql, (err,result)=>{
         if(err) return res.status(401).send(err)
         if(result.length){
             console.log(result)
             res.json(result[0])
         }
        })
    },

    marriedCount : function(req,res){
        var sql = `SELECT COUNT(id) As total FROM individuals WHERE m_status='married'`;
        dB_con.query(sql, (err,result)=>{
         if(err) return res.status(401).send(err)
         if(result.length){
             console.log(result)
             res.json(result[0])
         }
        })
    }




}