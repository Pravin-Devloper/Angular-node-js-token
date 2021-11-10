var dB_con = require('../db');



module.exports = {

 joinRequest : function(req, res){
    console.log(req.body)
      var {fam_id, fam_name, uid, phone } = req.body;
    var sql = `INSERT INTO join_req(fam_id,fam_name,uid,phone) VALUES ('${fam_id}','${fam_name}','${uid}','${phone}')`
    dB_con.query(sql, (err, result)=> {
      if(err) return res.status(401).send(err);
      if(result.protocol41 == true){
         console.log(result)
         res.json({success:true,msg:'Join request sent'})                    
      }
   })
 },

 updateJoin : function(req,res){
   console.log(req.body)
   var { id, status } = req.body;
   var sql = `UPDATE join_req SET status='${status}' WHERE uid='${id}'`
   dB_con.query(sql, (err, result)=> {
      if(err) return res.status(401).send(err);
      console.log(err)
      if(result.protocol41 == true){
         console.log(result)
         res.json({success:true,msg:'Added successfully..'})                    
      }
   })
 },


 getJoinReq : function(req,res){
   var sql =  `SELECT * FROM join_req`
   dB_con.query(sql, (err, result)=> {
      if(err) return res.status(401).send(err)
      if(result.length>0)
       res.json(result)
   })
 },


 m_getFams : function(req, res){
   var sql = `SELECT fam.id,fam.avater,fam.name,fam.des,COUNT(fam.id) AS totalcount FROM fam,individuals WHERE fam.id=individuals.fam_id`;
      dB_con.query(sql, (err, result)=> {
         if(err) return res.status(401).send(err)
         if(result.length>0)
          res.json(result)
      })
 },

   m_addmember: function(req, res){
      console.log(req.body)
      const url = req.protocol + '://' + req.get("host");

      // var i = JSON.parse(req.body.data);
      var i = JSON.parse(req.body.data);
      var img = req.file
      var avatar = `${url}/images/${img.filename}`
      var fam_id = req.body.fam_id
      
      var sql = `INSERT INTO individuals(avater, name, gendar, dob, m_status, c_location, occupation, education, gothram, fam_id) VALUES ('${avatar}','${i.name}','${i.gendar}','${i.dob}','${i.mstatus}','${i.cl}','${i.occupation}','${i.education}','${i.gothram}','${fam_id}')`
      dB_con.query(sql, (err, result)=> {
         if(err) return res.status(401).send(err);
         // if(err) throw err;
         if(result.protocol41 == true){
            console.log(result)
            res.json({success:true,msg:'Member Added successfully..'})                    
         }
      })
   },


   m_select_child: function(req,res){
      var id = req.query.body;
      // console.log(id)
      var sql = `SELECT * FROM individuals WHERE child='unlink' AND id=${id}`
      dB_con.query(sql, (err,result)=> {
          if(err) return res.status(401).send(err)
          if(result.length>0){
              // console.log(result)
              res.json(result)
          }
      })
  },

  m_select_part: function(req,res){
   // var sql = `SELECT * FROM individuals WHERE m_status = 'unmarried' AND gender = 'Female'`;
   var sql = `SELECT * FROM individuals WHERE m_status='unmarried' AND gendar='Female' AND partner='unlink'`
   dB_con.query(sql, (err,result)=> {
       if(err) return res.status(401).send(err)
       if(result.length>0){
           // console.log(result)
           res.json(result)
       }
   })
},


}