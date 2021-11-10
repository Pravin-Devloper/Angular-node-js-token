
const async = require('async')
var dB_con = require('../db');


module.exports = {

    addFamily: function(req,res){
        var data = req.body;
        console.log(req.body)
        // var sql = `INSERT INTO fam(name,gothram,des) VALUES ('${data.famname}','${data.gothram}','${data.dis}')`;
        // dB_con.query(sql, (err, result)=> {
        //     if(err) return res.status(401).send(err.message);
        //     if(result.protocol41 == true){
        //         console.log(result)
        //         res.json({success:true,msg:'datas inserted successfully'})                    
        //     }
        // })
    },

    get_familys: function(req,res){
        var sql = `SELECT * FROM fam`;
        dB_con.query(sql, (err,result)=> {
            if(err) return res.status(401).send(err)
            if(result.length>0){
                // console.log(result)
                res.json(result)
            }
        })
    },


    addMember: function(req, res){
        console.log(req.file, 'File Array...')
        const url = req.protocol + '://' + req.get("host");

        var i = JSON.parse(req.body.data);
        var img = req.file
        var avatar = `${url}/images/${img.filename}`
        var fam_id = req.body.fam_id;

        console.log(avatar, 'Img Url...');
        
        var sql = `INSERT INTO individuals(avater, name, gendar, dob, m_status, c_location, occupation, education, gothram, fam_id) VALUES ('${avatar}','${i.name}','${i.gendar}','${i.dob}','${i.mstatus}','${i.cl}','${i.occupation}','${i.education}','${i.gothram}','${fam_id}')`
        // dB_con.query(sql, (err, result)=> {
        //     if(err) return res.status(401).send(err);
        //     if(result.protocol41 == true){
        //         console.log(result)
        //         res.json({success:true,msg:'Member Added successfully..'})                    
        //     }
        // })
    },

    getmembers : function(req,res){
        var sql = `SELECT * FROM individuals`;
        dB_con.query(sql, (err,result)=> {
            if(err) return res.status(401).send(err);
            if(result.length>0){
                // console.log(result)
                res.json(result)
            }
        })
    },

    getMemberDetails: function(req,res){
        var id = req.query.body;
        // console.log(id)
        var sql = `SELECT * FROM individuals WHERE id = ${id}`;
        dB_con.query(sql, (err,result)=> {
            if(err) return res.status(401).send(err)
            if(result.length>0){
                res.json(result)
            }
        })
    },


    select_part: function(req,res){
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

    select_child: function(req,res){
        var id = req.query.body;
        // console.log(id)
        var sql = `SELECT * FROM individuals WHERE child='unlink' AND id!=${id}`
        dB_con.query(sql, (err,result)=> {
            if(err) return res.status(401).send(err)
            if(result.length>0){
                // console.log(result)
                res.json(result)
            }
        })
    },

    addPartner : function(req,res){
        // console.log(req.body)
        var i = req.body;
        var sql = `UPDATE individuals SET partner='link',m_status='married' WHERE id='${i.wife_id}'`
        dB_con.query(sql, (err,result)=> {
            if(err) return res.status(401).send(err);
            if(result.protocol41 == true){

                var sql = `UPDATE individuals SET partner='link',m_status='married' WHERE id='${i.husb_id}'`
                dB_con.query(sql, (err, result)=> {
                    if(err) return res.status(401).send(err);
                    if(result.protocol41 == true){
                    var sql = `INSERT INTO partner(hus_id, part_id, fam_id) VALUES ('${i.husb_id}','${i.wife_id}','${i.fam_id}')`
                    dB_con.query(sql, (err, result)=> {
                        if(err) return res.status(401).send(err)
                        if(result.protocol41 == true){
                            console.log('Partner Added..')
                            res.json({success:true,msg:'Partner Added..'})
                        }
                    })                
                    }
                })

            }
        })

    },


    addChild : function(req,res){
        // console.log(req.body)
        var i = req.body;
        var sql = `SELECT * FROM children WHERE child_id=${i.c_id}`
        dB_con.query(sql, (err,result)=> {
            if(err) return res.status(401).send(err);
            if(result.length>0){
                res.json({success:true,msg:'this children already selected pleace check'})
            }
            else{

                var sql = `UPDATE individuals SET child='link' WHERE id=${i.c_id}`
                dB_con.query(sql, (err, result)=> {
                    if(err) return res.status(401).send(err);
                    if(result.protocol41 == true){
                    var sql = `INSERT INTO children(parant_id,child_id,fam_id) VALUES ('${i.p_id}','${i.c_id}','${i.fam_id}')`
                    dB_con.query(sql, (err, result)=> {
                        if(err) return res.status(401).send(err)
                        if(result.protocol41 == true){
                            console.log('child Added..')
                            res.json({success:true,msg:'Child Added..'})
                        }
                    })                
                    }
                })

            }
        })


    },


    get_unmarried_count: function(req,res){
        var sql = `SELECT * FROM individuals WHERE m_status = 'unmarried'`;
        dB_con.query(sql, (err,result)=> {
            if(err) return res.status(401).send(err)
            if(result.length>0){
                // console.log(result)
                res.json(result)
            }
        })
    },


    update_m : function(req, res){
        var i = JSON.parse(req.body.data)
        var id = req.body.id;

        if(req.file){
            const url = req.protocol + '://' + req.get("host");
            var img = req.file
            var avatar = `${url}/images/${img.filename}`
            console.log(avatar)
            var id = req.body.id;
            
            var sql = `UPDATE individuals SET avater='${avatar}',name='${i.name}',gendar='${i.gendar}',dob='${i.dob}',m_status='${i.mstatus}',c_location='${i.cl}',occupation='${i.occupation}',education='${i.education}',gothram='${i.gothram}' WHERE id= ${id}`;
            dB_con.query(sql, (err, result)=> {
                if(err) return res.status(401).send(err)
                if(result.protocol41 == true){
                    // console.log(result)
                    res.json({success:true,msg:'Update successfully..'})
                }
            })
        }

        var sql = `UPDATE individuals SET name='${i.name}',gendar='${i.gendar}',dob='${i.dob}',m_status='${i.mstatus}',c_location='${i.cl}',occupation='${i.occupation}',education='${i.education}',gothram='${i.gothram}' WHERE id= ${id}`;
        dB_con.query(sql, (err, result)=> {
            if(err) return res.status(401).send(err)
            if(result.protocol41 == true){
                // console.log(result)
                res.json({success:true,msg:'Update successfully..'})
            }
        })
    },


    deleteMember: function(req, res){
        var id = req.query.body;
        var sql = `DELETE FROM individuals WHERE id = ${id}`;
        dB_con.query(sql, (err, result)=> {
            if(err) return res.status(401).send(err)
            if(result.protocol41 == true){
                // console.log(result)
                res.json({success:true,msg:'Member Deleted successfully..'})
            }
        })
    },


    getFamMembers: function(req,res){
        var id = req.query.body;
        var sql = `SELECT * FROM individuals WHERE fam_id = ${id}`;
        dB_con.query(sql, (err,result)=> {
            if(err) return res.status(401).send(err)
            if(result.length>0){
                console.log('get fam members api..')
                res.json(result)
            }
        })
    },


 // TEMPLATE

//     getTemp1: function(req,res){
//         var d = {ap:[],part:[]}
//         var sql = `SELECT * FROM individuals ORDER BY dob ASC LIMIT 1`;
//          dB_con.query(sql, (err,result) => {
//             if(err) return res.status(401).send(err);
//              if(result.length>0){
//                  d.ap.push(result[0]);
//                  var partner = result[0].partner;
//                  if(partner == 'link'){
//                  if(result[0].gendar == 'Male'){
//                     var id = result[0].id;
                    
//                     var sql = `SELECT * FROM partner WHERE hus_id = ${id}`;
//                     dB_con.query(sql, (err, result0)=> {
//                     if(err) return res.status(401).send(err);
//                         if(result0.length>0){
//                             console.log(result0[0], 'male');
//                             var sql = `SELECT * FROM individuals WHERE id = ${result0[0].part_id}`;
//                             dB_con.query(sql, (err,result1)=> {
//                             if(err) return res.status(401).send(err);
//                             if(result1.length>0){
//                                 d.part.push(result1[0]);
//                                 // console.log(d)
// //
//                                 var sql1 = `SELECT * FROM children WHERE parant_id=${id}`;
//                                 dB_con.query(sql1, (err,result2)=> {
//                                  if(err) return res.status(401).send(err);
//                                  if(result2.length>0){
//                                     var chli = [];

//                                     async.eachSeries(result2, function(item, cb){
//                                         var c_id = item.child_id;
//                                      var sql2 = `SELECT * FROM individuals WHERE id = ${c_id}`;
//                                      dB_con.query(sql2, (err,result3)=> {
//                                      if(err) return res.status(401).send(err);
//                                         if(result3.length>0){
//                                             // console.log(result3)
//                                             chli.push(result3[0]);
//                                             cb();
//                                         }
//                                      })
                                        
//                                     },function(){
//                                         var i = d.ap;
//                                         var sql3 = `SELECT * FROM children WHERE child_id = ${i[0].id}`;
//                                         dB_con.query(sql3, (err,result4)=> {
//                                          if(err) return res.status(401).send(err);
//                                          if(result4.length>0){
//                                          var parant_id = result4[0].parant_id;
//                                          var sql4 = `SELECT * FROM individuals WHERE id = ${parant_id}`;
//                                             dB_con.query(sql4, (err,result5)=>{
//                                              if(err) return res.status(401).send(err);
//                                              if(result4.length>0) {
//                                                 var f = result5;
//                                                 var sql5 = `SELECT * FROM partner,individuals WHERE partner.hus_id='${f[0].id}' AND partner.part_id=individuals.id`
//                                                 dB_con.query(sql5, (err,result6)=> {
//                                                  if(err) return res.status(401).send(err);
//                                                  if(result6.length>0){
//                                                     //  console.log(f, '6th');
//                                                      var m = result6;
//                                                  var sql6 = `SELECT * FROM children,individuals WHERE children.parant_id='${f[0].id}' AND children.child_id=individuals.id` 
//                                                     dB_con.query(sql6, (err,result7)=> {
//                                                      if(err) return res.status(401).send(err);
//                                                         if(result7.length>0){
//                                                             console.log(result7,'7th');
//                                                         }
//                                                     })

//                                                     res.json({
//                                                         coupl:d,
//                                                         c:chli,
//                                                         mom:m,
//                                                         fat:f
//                                                     })
//                                                 }
//                                                 });
//                                             }
//                                             })
//                                          }
//                                         })
//                                         // res.json({
//                                         //     coupl:d,
//                                         //     c:chli
//                                         // })
//                                     })
//                                  }
//                                 })

//                             }
//                             })
//                         }
//                     })
//                  }else {
//                     var id = result[0].id;
                    
//                     var sql = `SELECT * FROM partner WHERE part_id = ${id}`;
//                     dB_con.query(sql, (err, result0)=> {
//                     if(err) return res.status(401).send(err);
//                         if(result0.length>0){
//                             console.log(result0[0].hus_id, 'female');
//                             var sql = `SELECT * FROM individuals WHERE id = ${result0[0].hus_id}`;
//                             dB_con.query(sql, (err,result1)=> {
//                             if(err) return res.status(401).send(err);
//                             if(result1.length>0){
//                                 d.part.push(result1[0]);
//                                 var i = d.part;
//                                 // console.log(i)
//                                 var sql1 = `SELECT * FROM children WHERE parant_id=${i[0].id}`;
//                                 dB_con.query(sql1, (err,result2)=> {
//                                  if(err) return res.status(401).send(err);
//                                  if(result2.length>0){
//                                     var chli = [];

//                                     async.eachSeries(result2, function(item, cb){
//                                         var c_id = item.child_id;
//                                      var sql2 = `SELECT * FROM individuals WHERE id = ${c_id}`;
//                                      dB_con.query(sql2, (err,result3)=> {
//                                      if(err) return res.status(401).send(err);
//                                         if(result3.length>0){
//                                             // console.log(result3)
//                                             chli.push(result3[0]);
//                                             cb();
//                                         }
//                                      })
                                        
//                                     },function(){
//                                         var i = d.ap;
//                                         console.log(i[0].id)
//                                         // var sql3 = `SELECT * FROM children WHERE child_id = ${i[0].id}`;
//                                         // dB_con.query(sql3, (err,result4)=> {
//                                         //  if(err) return res.status(401).send(err);
//                                         //  if(result4.length>0){
//                                         //      console.log(result4)
//                                         //  }
//                                         // })
//                                         res.json({
//                                             coupl:d,
//                                             c:chli
//                                         })
//                                     })
//                                  }
//                                 })
//                             }
//                             })
//                         }
//                     })                     
//                  }

                 
//                  }
//              }
             
//          })    

//     },



    getTemp : function(req,res){
        // console.log(req.user);
        var id = req.query.body;
        var d = {dad:[],mom:[],aplicant:[],wife:[],sis:[],chil:[]}
        var sql = `SELECT * FROM individuals WHERE fam_id=${id} ORDER BY dob ASC LIMIT 1`;
        // var sql = `SELECT * FROM individuals ORDER BY dob ASC LIMIT 1`;
        dB_con.query(sql, (err,result)=>{
         if(err) return res.status(401).send(err);
         if(result.length>0){
          d.aplicant.push(result[0]);
            var data = result[0];
             var sql = `SELECT * FROM children,individuals WHERE children.child_id='${result[0].id}' AND children.parant_id=individuals.id`
              dB_con.query(sql, (err,result)=>{
               if(err) return res.status(401).send(err);
               if(result.length>0){
                  d.dad.push(result[0]);
                var dad = result[0]  
                var sql = `SELECT * FROM partner,individuals WHERE partner.hus_id='${result[0].id}' AND partner.part_id=individuals.id`
                 dB_con.query(sql, (err,result)=>{
                  if(err) return res.status(401).send(err);
                  if(result.length>0){
                    d.mom.push(result[0]);
                 var sql = `SELECT * FROM children,individuals WHERE children.parant_id='${dad.id}' AND children.child_id=individuals.id`
                  dB_con.query(sql, (err,result)=> {
                   if(err) return res.status(401).send(err);
                    if(result.length>0){
                        result.forEach(element => {
                            if(element.id != data.id){
                                d.sis.push(element)
                            }
                        });
                     if(data.partner == 'link'){
                      if(data.gendar == 'Male'){
                        var sql = `SELECT * FROM partner,individuals WHERE partner.hus_id='${data.id}' AND partner.part_id=individuals.id`
                         dB_con.query(sql, (err,result)=>{
                         if(err) return res.status(401).send(err);
                          if(result.length>0){
                              d.wife.push(result[0])
                              
                           var sql = `SELECT * FROM children,individuals WHERE children.parant_id='${data.id}' AND children.child_id=individuals.id`
                            dB_con.query(sql, (err,result)=>{
                             if(err) return res.status(401).send(err);
                             if(result.length>0){
                                 async.eachSeries(result, function(item, cb){
                                    d.chil.push(item);
                                    cb();
                                 }, function(){
                                    res.json(d)
                                 })
                             }else{
                                res.json(d)
                             }
                            })
                          }
                         })

                      }else {
                        var sql = `SELECT * FROM partner,individuals WHERE partner.part_id='${data.id}' AND partner.hus_id=individuals.id`
                         dB_con.query(sql, (err,result)=>{
                         if(err) return res.status(401).send(err);
                          if(result.length>0){
                              d.wife.push(result[0])
                              
                           var sql = `SELECT * FROM children,individuals WHERE children.parant_id='${data.id}' AND children.child_id=individuals.id`
                            dB_con.query(sql, (err,result)=>{
                             if(err) return res.status(401).send(err);
                             if(result.length>0){
                                 async.eachSeries(result, function(item, cb){
                                    d.chil.push(item);
                                    cb();
                                 }, function(){
                                    res.json(d)
                                 })
                             }else{
                                res.json(d)
                             }
                            })
                          }
                         })

                      }

                     }
                    
                    }
                  })
                  }
                 })
               }

              })
         }

        })

    },

  

    appTemp : function(req,res){
        var id = req.query.id;
        var d = {dad:[],mom:[],aplicant:[],wife:[],sis:[],chil:[]}
        var sql = `SELECT * FROM individuals WHERE id='${id}'`;
        dB_con.query(sql, (err,result)=>{
         if(err) return res.status(401).send(err);
         if(result.length>0){
          d.aplicant.push(result[0]);
            var data = result[0];
             var sql = `SELECT * FROM children,individuals WHERE children.child_id='${result[0].id}' AND children.parant_id=individuals.id`
              dB_con.query(sql, (err,result)=>{
               if(err) return res.status(401).send(err);
               if(result.length>0){
                  d.dad.push(result[0]);
                var dad = result[0]  
                var sql = `SELECT * FROM partner,individuals WHERE partner.hus_id='${result[0].id}' AND partner.part_id=individuals.id`
                 dB_con.query(sql, (err,result)=>{
                  if(err) return res.status(401).send(err);
                  if(result.length>0){
                    d.mom.push(result[0]);
                 var sql = `SELECT * FROM children,individuals WHERE children.parant_id='${dad.id}' AND children.child_id=individuals.id`
                  dB_con.query(sql, (err,result)=> {
                   if(err) return res.status(401).send(err);
                    if(result.length>0){
                        result.forEach(element => {
                            if(element.id != data.id){
                                d.sis.push(element)
                            }
                        });
                     if(data.partner == 'link'){
                      if(data.gendar == 'Male'){
                        var sql = `SELECT * FROM partner,individuals WHERE partner.hus_id='${data.id}' AND partner.part_id=individuals.id`
                         dB_con.query(sql, (err,result)=>{
                         if(err) return res.status(401).send(err);
                          if(result.length>0){
                              d.wife.push(result[0])
                              
                           var sql = `SELECT * FROM children,individuals WHERE children.parant_id='${data.id}' AND children.child_id=individuals.id`
                            dB_con.query(sql, (err,result)=>{
                             if(err) return res.status(401).send(err);
                             if(result.length>0){
                                 async.eachSeries(result, function(item, cb){
                                    d.chil.push(item);
                                    cb();
                                 }, function(){
                                    res.json(d)
                                 })
                             }else{
                                 console.log('no childrens')
                                res.json(d)
                             }
                            })
                          }
                         })

                      }else {
                          console.log('female',data.id)
                        var sql = `SELECT * FROM partner,individuals WHERE partner.part_id='${data.id}' AND partner.hus_id=individuals.id`
                         dB_con.query(sql, (err,result)=>{
                         if(err) return res.status(401).send(err);
                          if(result.length>0){
                              d.wife.push(result[0])
                            //   console.log(result[0],'female')
                           var sql = `SELECT * FROM children,individuals WHERE children.parant_id='${data.id}' AND children.child_id=individuals.id`
                            dB_con.query(sql, (err,result)=>{
                             if(err) return res.status(401).send(err);
                             if(result.length>0){
                                 async.eachSeries(result, function(item, cb){
                                    d.chil.push(item);
                                    cb();
                                 }, function(){
                                    res.json(d)
                                 })
                             }else{
                                console.log('no childrens')
                                res.json(d)
                             }
                            })
                          }
                         })

                      }

                     }else{
                         console.log('no partner')
                         res.json(d)
                     }
                    
                    }else{
                        console.log('no Sisters & Brothers')
                        res.json(d)
                    }
                  })
                  }
                 })
               }else{
                   console.log('no parants')
                   res.json(d)
               }

              })
         }

        })

    },









    // FAMILY TREE


    getTree : function(req,res){
        var id = req.query.body;
        var data = [];
        var obj = { id: '',  name: '', img: ''}

        var sql = `SELECT id,name,avater FROM individuals WHERE fam_id = ${id} ORDER BY dob ASC LIMIT 1`
        dB_con.query(sql, (err, result)=>{
          if(err) return res.status(401).send(err);
           if(result.length>0){
            //    console.log(result)
               obj.id = result[0].id;
               obj.name = result[0].name;
               obj.img = result[0].avater;
               data.push(obj)
            var sql = `SELECT i.id,i.avater,i.name,p.hus_id,p.part_id FROM individuals i INNER JOIN partner p ON i.id=p.part_id WHERE i.fam_id=${id} AND p.fam_id=${id}`
               dB_con.query(sql, (err, result)=> {
                if(err) return res.status(401).send(err);
                if(result.length>0){
                    console.log(result)
                    async.eachSeries(result , function(item, cb){
                        var obj1 = { }
                        obj1.id = item.id;
                        obj1.pid = item.hus_id;
                        obj1.name = item.name;
                        obj1.img = item.avater;
                        obj1.tags = ["partner"]
                        data.push(obj1)
                      cb()
                    },function(){
                       var sql = `SELECT i.id,i.avater,i.name,c.child_id,p.hus_id,p.part_id FROM individuals i INNER JOIN children c ON i.id=c.child_id INNER JOIN partner p ON c.parant_id=p.hus_id WHERE i.fam_id=${id} AND c.fam_id=${id}`
                        dB_con.query(sql, (err, result)=> {
                            if(err) return res.status(401).send(err);
                            if(result.length>0){
                                async.eachSeries(result, function(i, cb){
                                    var obj1 = { }
                                    obj1.id = i.id;
                                    obj1.pid = i.hus_id;
                                    obj1.ppid = i.part_id;
                                    obj1.name = i.name;
                                    obj1.img = i.avater;
                                    data.push(obj1)
                                    cb()
                                }, function(){
                                    function getUniqueListBy(arr, key) {
                                        return [...new Map(arr.map(item => [item[key], item])).values()]
                                    }
                                    const unique = getUniqueListBy(data, 'id')
                                    res.json(unique)
                                })
                            }
                        })
                    })

                }
               })
           }
        })
    }
  
 






}

