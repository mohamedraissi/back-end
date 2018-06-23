var express = require('express');
var bcryptjs=require('bcryptjs');
var multer =require('multer');
var upload = multer({ dest: 'public/upload/' });
var router = express.Router(); 
var User = require('../models/user');
var Ville = require('../models/ville');
var Token = require('../models/token');
var Categorie = require('../models/categorie');
var Marker = require('../models/marker');
var path = require('path');
const mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer=require('nodemailer');
var fs = require('fs');

//
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
})
//
var upload = multer({ storage: storage }).single("image");

/* GET home page. */
router.get('/index',userAdminIsLoggedIn,(req, res, next) => {
  res.render('pages/index.html', { title: 'Intro' });
});

router.get('/logout',userAdminIsLoggedIn,(req,res) => {
  req.logout();
  res.redirect('/login');
});
router.get('/getmarker',userAdminIsLoggedIn,(req,res) => {
  Marker.find({}).exec( (err, marker) => {
    if (err) {
      console.log(err);
    } else {
      res.render("pages/getmarker.html",{title:"getMarker",marker:marker,msg6:req.flash('msg6'),msg7:req.flash('msg7')})
    }
});
});
router.get('/addmarker',userAdminIsLoggedIn,(req,res) => {
  Ville.find({},(err,ville) => {
    if(err){
      console.log(err);
    }
    else{
      Categorie.find({},(err,categorie) => {
        if(err){
          console.log(err);
        }
        else{
          res.render('pages/addmarker.html',{title:'addMarker',categorie:categorie,ville:ville});
        }
      });
    }
  });
  
});
router.get('/update/marker/:id',userAdminIsLoggedIn,(req,res) => {
  Marker.findOne({_id:mongoose.Types.ObjectId(req.params.id)},(err,marker) => {
    if(err){
      console.log(err);
    }
    else{
      Ville.find({},(err,ville) => {
        if(err){
          console.log(err);
        }
        else{
          Categorie.find({},(err,categorie) => {
            if(err){
              console.log(err);
            }
            else{
                  res.render('pages/editmarker.html',{title:'updade Marqueur',categorie:categorie,ville:ville,marker:marker,msg8:req.flash('msg8')});
            }
          });
        }
      });
    }
    
});
});
router.post('/addmarker',userAdminIsLoggedIn,(req, res ) => {
  upload(req, res,(err) => {
    if (err) {
      console.log(err);    }
    else {

     if(req.body.cat_id=='5a9a86bbac8e150da48477b0'){
      var marker = new Marker(
        {
          titre:req.body.titre,
          image:req.file.filename,
          description:req.body.desc_extra,
          lat:req.body.lat,
          long:req.body.long,
          zoom:req.body.zoom,
          cat_id:req.body.cat_id,
          ville_id:req.body.ville_id,
          nbre_etoile:req.body.nbr_e,
          type_hebergement:req.body.sc,
          
        }
      );
     }
     else{
      var marker = new Marker(
        {
          titre:req.body.titre,
          image:req.file.filename,
          description:req.body.desc_extra,
          lat:req.body.lat,
          long:req.body.long,
          zoom:req.body.zoom,
          cat_id:req.body.cat_id,
          ville_id:req.body.ville_id,
          
        }
      );
     }
      
      marker.save((err) => {
        if (err) {
          console.log(err);
          if (err.code == 11000 ) {
            res.json({ message : 'marker already exists' });
          }
          else {
            res.send(err);
          }
        } else {
          req.flash('msg6',' le marqueur à été bien enregistré');
          res.redirect("/admin/getmarker");
        }
      });
    }
  });

});
router.post('/update/marker/:id',userAdminIsLoggedIn,(req,res) => {
  upload(req, res,(err) => {
    if (err) {
      console.log(err);    }
    else {
      if(req.file){
        var image=req.file.filename;
      }
      else{
        var image=req.body.img;
      }
      Marker.findOneAndUpdate({_id:req.params.id}, { $set: {titre:req.body.titre,
        image:image,
        description:req.body.desc_extra,
        lat:req.body.lat,
        long:req.body.long,
        cat_id:req.body.cat_id,
        ville_id:req.body.ville_id,
       }},
       (err,marker) => {
        if(err){
          console.log(err);
        }
        else{
          if(req.file){
            fs.unlinkSync("public/upload/"+marker.image);
          }
          req.flash("msg8","le marqueur à été bien modifieé");
          res.redirect("/admin/update/marker/"+req.params.id);
        }
      });
    }
  });
  
});
router.delete('/delete/marker/:id',userAdminIsLoggedIn,(req,res) => {
  Marker.findOneAndRemove({_id:req.params.id}, (err, marker) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
     response = {
        message: "marker successfully deleted",
    };
    fs.unlinkSync("public/upload/"+marker.image);
    req.flash("msg7","le marqueur à été bien supprimeé");
    res.redirect("/admin/getmarker");
  }
});
});
router.get('/addville',userAdminIsLoggedIn,(req,res) => {
  res.render('pages/addville.html',{title:'addVille'});
});
router.get('/getville',userAdminIsLoggedIn,(req,res) => {
  Ville.find({}).exec( (err, ville) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      Ville.count({},(err,count) => {
        let page=Math.round(count/6);
        res.render('pages/getville.html',{villes:ville,title:'getVille',page:page,msg:req.flash("msg1"),msg3:req.flash('msg3')});
      });
      
    }

  });
});
router.post('/addville',userAdminIsLoggedIn,(req, res ) => { 
  upload(req, res,(err) => {
    if (err) {
      console.log(err);    }
    else {
        console.log(req.file);
        var ville = new Ville(
          {
            nom:req.body.nom,
            description:req.body.description,
            desc_extra:req.body.desc_extra,
            gouvernorat:req.body.gouvernorat,
            zoom:req.body.zoom,
            lat:req.body.lat,
            long:req.body.long,
            image:req.file.filename,
          }
        );
          ville.save((err) => {
          if (err) {
            console.log(err);
            if (err.code == 11000 ) {
              res.json({ message : 'ville already exists' });
            }
            else {
              res.send(err);
            }
          } else {
            req.flash('msg1',' la ville à été bien enregistré');
            res.redirect('/admin/getville');
          }
        });
      }
  });
});
router.get("/update/ville/:id",userAdminIsLoggedIn,(req,res) => {
  Ville.findOne({_id: mongoose.Types.ObjectId(req.params.id)},(err,ville) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('pages/editville.html',{title:'edit ville',ville:ville,msg9:req.flash('msg9')});
    }
  });
 });
router.post('/update/ville/:id',userAdminIsLoggedIn,(req,res) =>{
  upload(req, res,(err) => {
    if (err) {
      console.log(err);    }
    else {
      if(req.file){
        var image=req.file.filename;
      }
      else{
        var image=req.body.img;
      }
      Ville.findOneAndUpdate({_id:req.params.id}, { $set: {  
        nom:req.body.nom,
        image:image,
        description:req.body.description,
        desc_extra:req.body.desc_extra,
        gouvernorat:req.body.gouvernorat,
        zoom:req.body.zoom,
        lat:req.body.lat,
        long:req.body.long }},
        (err,ville) => {
        if(err){
          console.log(err);
        }
        else{
          if(req.file){
            fs.unlinkSync("public/upload/"+ville.image);
          }
          req.flash('msg9','la ville à été bien modifieé');
          res.redirect("/admin/update/ville/"+req.params.id);
        }
      });
    }
  });
});
router.delete('/delete/ville/:id',userAdminIsLoggedIn,(req,res) => {
  Ville.findOneAndRemove({_id:req.params.id}, (err, ville) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
     response = {
        message: "ville successfully deleted",
    };
    fs.unlinkSync("public/upload/"+ville.image);
    req.flash('msg3','la ville à été bien supprimeé');
    res.redirect('/admin/getville');
  }
});
});
router.get('/update/:id',userAdminIsLoggedIn,(req,res) => {
  User.findOne({_id:mongoose.Types.ObjectId(req.params.id)}).exec((err,user) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render('pages/infoAdmin.html',{title:'update',user:user,msg2:req.flash('msg2'),msg2_2:req.flash('msg2_2')});
    }
  });
});
router.put('/update/:id',userAdminIsLoggedIn,(req,res) => {
  bcryptjs.genSalt(12,(err, salt) => {
    bcryptjs.hash(req.body.password, salt,(err, hash) => {
        if (err) {
          console.log(err);
        }
        else {
          req.body.password=hash;
          User.findOneAndUpdate(req.params.id, { $set: { email:req.body.email ,password:req.body.password }},(err,user) => {
            if(err){
              console.log(err);
              if (err.code == 11000 ) {
                req.flash('msg2_2','user est exist');
                res.redirect('/admin/update/'+user._id);
              }
              
            }
            else{
              req.flash('msg2',' les informations à été bien modifié');
              res.redirect('/admin/update/'+user._id);
            }
          });
        }
    });
});

});
router.get('/getcat',userAdminIsLoggedIn,(req,res) => {
  Categorie.find({},(err,categorie) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('pages/getcat.html',{title:'getcat',msg4:req.flash('msg4'),msg5:req.flash('msg5'),cat:categorie});
    }
  });
});
router.get('/addcat',userAdminIsLoggedIn,(req,res) => {
  
  res.render('pages/addcat.html',{title:'addcat'});
});
router.get('/update/categorie/:id',(req,res) => {
  Categorie.findOne({_id: mongoose.Types.ObjectId(req.params.id)},(err,categorie) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('pages/editcat.html',{title:'editcat',msg6:req.flash('msg6'),cat:categorie});
    }

  });
});
router.post('/addcat',userAdminIsLoggedIn,(req, res ) => {
  var categorie = new Categorie(
    {
      nom:req.body.nom,
    }
  );
  categorie.save((err) => {
    if (err) {
      console.log(err);
      if (err.code == 11000 ) {
        res.json({ message : 'categorie already exists' });
      }
      else {
        res.send(err);
      }
    } else {
      req.flash('msg4','le catégorie à été bien enregistré');
      res.redirect('/admin/getcat');
    }
  });

});
router.delete('/delete/categorie/:id',userAdminIsLoggedIn,(req,res) => {
  Categorie.remove({_id:req.params.id}, (err, categorie) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
     response = {
        message: "ville successfully deleted",
    };
    req.flash('msg5','le catégorie à été bien supprimeé');
    res.redirect('/admin/getcat');
  }
});
});
router.put('/update/categorie/:id',userAdminIsLoggedIn,(req,res) =>{
  Categorie.findOneAndUpdate({_id:req.params.id}, { $set: {  
    nom:req.body.nom,
    }},
    (err,categorie) => {
    if(err){
      console.log(err);
    }
    else{
      req.flash('msg6','catégorie à été bien modifieé');
      res.redirect('/admin/update/categorie/'+categorie._id);
    }
  });
});
router.get('/addadmin',userAdminIsLoggedIn,(req,res) => {
  res.render('pages/addadmin.html',{title:'ajouter un admin'});
});
router.get('/getadmin',userAdminIsLoggedIn,(req,res) => {
  User.find({role:"adminS"},(err,user) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('pages/getadmin.html',{title:' admin',users:user,msg10:req.flash('msg10'),msg11:req.flash('msg11'),msg10_10:req.flash('msg10_10')});
    }
  });
  
});
router.post('/addadmin',userAdminIsLoggedIn,(req,res) => {
  var user = new User(
    {
      prenom:req.body.nom,
      nom:req.body.prenom,
      email: req.body.email,
      role:"adminS",
      tel:req.body.tel,
      adresse:req.body.addresse,
      password:req.body.password,
    }
  );
  bcryptjs.genSalt(12,(err, salt) => {
    bcryptjs.hash(user.password, salt,(err, hash) => {
        if (err) {
          console.log(err);
        }
        else {
          user.password=hash;
          user.save((err) => {
            if (err) {
              console.log(err);
              if (err.code == 11000 ) {
                req.flash('msg10_10','l\'administrateur est exist !!')
                res.redirect("/admin/getadmin");
              }
            }
            else {
                req.flash('msg10','l\'administrateur secondaire à été bien enregistré !!')
                res.redirect("/admin/getadmin");
              }
            
          });
        }
    });
});
var token = new Token({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            let   transporter = nodemailer.createTransport({
              service: 'gmail',
              port: 25,
              secure: false,
              auth: {
                user:'testmed03@gmail.com',
                pass:20181273
              }
          });
          let mailOptions = {
              from: 'testmed03@gmail.com', 
              to: user.email, 
              subject: 'Account Verification Token', 
              html: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/admin/confirmation\/' +user._id+'/'+ token.token + '.\n'
          };
          
          transporter.sendMail(mailOptions, (err, res) => {
              if (err) {
                  return console.log(err);
              }
              else{
                 console.log('Message sent: %s', res);
              }
          });
        });
});
router.get('/confirmation/:id/:token',(req,res) => {
  User.findOneAndUpdate({_id:req.params.id},{ $set: {isVerified:true}},(err,user) => {
    if(err){
      console.log(err);  
    }
    else{
      res.redirect("/");
    }
  });
});
router.delete('/delete/adminS/:id',userAdminIsLoggedIn,(req,res) => {
  User.findOneAndRemove({_id:req.params.id}, (err, user) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
    req.flash('msg11','l\'administrateur'+user.nom+' secondaire à été bien supprimé');
    res.redirect('/admin/getadmin');
  }
});
});
router.get('/map' ,userAdminIsLoggedIn,(req,res) => {
  Categorie.find({},(err,categorie) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('pages/map.html',{title:"Map",categorie:categorie});
    }
  })
  

});
router.get('/cat/:id',userAdminIsLoggedIn,(req,res) => {
  Marker.find({cat_id:req.params.id},(err,marker) => {
    if(err){
      console.log(err);
    }
    else{
      res.json(marker);
    }
  })
});
router.get('/composeMail',userAdminIsLoggedIn,(req,res)=>{
  res.render('pages/composeMail.html',{title:'composer un email'});
});
router.post('/sendMail',(req,res) => {
  var maillist=req.body.email.split(" ");
  let   transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 25,
    secure: false,
    auth: {
      user:'testmed03@gmail.com',
      pass:20181273
    }
});
let mailOptions = {
    from: 'testmed03@gmail.com', 
    to: maillist, 
    subject: req.body.suijet, 
    html: req.body.message
};

transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
        return console.log(err);
    }
    else{
       console.log('Message sent: %s', res);
    }
});
  res.redirect("/admin/composeMail");
});
router.get('/inbox',userAdminIsLoggedIn,(req,res) => {
  res.render("pages/inbox.html");
});
router.get('/users',userAdminIsLoggedIn,(req,res) => {
  User.find({role:'client'},(err,users) =>  {
    if(err){
      console.log(err);
    }
    else{
      res.render('pages/getusers.html',{title:"users",users:users});
    }
  });
  
});
router.get('/addagence',userAdminIsLoggedIn,(req,res) => {
  res.render("pages/addagence.html");
});
router.get('/getagence',userAdminIsLoggedIn,(req,res) => {
  res.render("pages/getagence.html");
});
function userAdminIsLoggedIn(req, res, next) {

  // Si l'utilisateur est authentifié et de role admin, continuez
  if (req.isAuthenticated() && (req.user.role=="adminP" || req.user.role=="adminS")){
    return next();
  }
  else {
    // s'ils ne le redirigent pas =>vers la page login
    res.redirect('/login');
  }
}
module.exports = router; 