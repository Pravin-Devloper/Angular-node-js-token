let express = require('express')
let router = express.Router();
const multer = require('multer')

const gurd = require('../middleware/auth')

const stroeEng = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() +'--'+ file.originalname)
  }
  
});

const upload = multer({storage: stroeEng});

let auth = require('../control/auth')
let fam = require('../control/famliy')
let dash = require('../control/dash');
let mobile = require('../mobile/api');
const { Router } = require('express');


router.get('/', function(req,res){
    res.json({code:200,msg:'api is running...'})
})

// ADMIN LOGIN
router.post('/adminlogin', auth.adminLogin);

// APP AUTHENDICATION
router.post('/signup', auth.signup);
router.get('/login', auth.login);
// router.post('/otp', auth.otp);
router.get('/apusers', auth.apusers)
router.get('/getusers', auth.getusers);
router.put('/adminapproval', auth.adminApproval)



// FAMILY
router.post('/addfamily', fam.addFamily);
router.get('/get_familys', fam.get_familys);

// PARTNER
router.get('/select_part', fam.select_part);
router.post('/addpartner', fam.addPartner);

// CHILDREN
router.get('/select_child', fam.select_child);
router.post('/addchild', fam.addChild);

// MEMBER
router.post('/addmember', upload.single('avatar'),fam.addMember);
router.get('/fammembers', fam.getFamMembers);
router.get('/getmemberdetails', fam.getMemberDetails);
router.post('/update_m', upload.single('avatar'),fam.update_m);
router.get('/deletemember', fam.deleteMember);


//FAMILY TEMPLATE
router.get('/gettemplate', fam.getTemp);
router.get('/apptemplate', fam.appTemp);

// FAMILY TREE
router.get('/gettree', fam.getTree)


// ADMIN & ANDROID CONFLICT MOBILE API ONLIY 
router.post('/fam_join', mobile.joinRequest);
router.get('/m_getfams', mobile.m_getFams);
router.post('/updatejoin', mobile.updateJoin);
router.get('/getjoinreq', mobile.getJoinReq);
router.get('/m_select_part', mobile.m_select_part);
router.get('/m_select_child', mobile.m_select_child);




// DASHBOARD
// router.get('/famtree', fam.getTree);
router.get('/getmembers', fam.getmembers);
router.get('/get_unmarried_count', fam.get_unmarried_count);
router.get('/maleun', dash.maleUn);
router.get('/femaleun', dash.femaleUn);
router.get('/marriedcount', dash.marriedCount);

// TESTING
router.post('/testimg', upload.single('avatar'),auth.testapiimg)
router.post('/testapi', auth.testapi);



module.exports = router;