var express = require('express');
var bcryptjs=require('bcryptjs');
var multer =require('multer');
var upload = multer({ dest: 'public/upload/' });
var router = express.Router(); 
var User = require('../models/user');
var Ville = require('../models/ville');
var Categorie = require('../models/categorie');
var Marker = require('../models/marker');
var path = require('path');
const mongoose = require('mongoose');
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
router.get('/getmarker',(req,res) => {
  Marker.find({}).exec( (err, marker) => {
    if (err) {
      console.log(err);
    } else {
      console.log(marker);
      res.render("pages/getmarker.html",{title:"getMarker",marker:marker,msg6:req.flash('msg6'),msg7:req.flash('msg7')})
    }
});
});
router.get('/addmarker',(req,res) => {
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
          console.log(ville)
          res.render('pages/addmarker.html',{title:'addMarker',categorie:categorie,ville:ville});
        }
      });
    }
  });
  
});
router.get('/update/marker/:id',(req,res) => {
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
                  console.log(categorie);
                  console.log(marker.cat_id[0]);
                  res.render('pages/editmarker.html',{title:'updade Marqueur',categorie:categorie,ville:ville,marker:marker,msg8:req.flash('msg8')});
            }
          });
        }
      });
    }
    
});
});
router.post('/addmarker',(req, res ) => {
  upload(req, res,(err) => {
    if (err) {
      console.log(err);    }
    else {
      
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
          console.log('marker saved successfully');
          req.flash('msg6',' c bon');
          res.redirect("/admin/getmarker");
        }
      });
    }
  });

});
router.post('/update/marker/:id',(req,res) => {
  upload(req, res,(err) => {
    if (err) {
      console.log(err);    }
    else {
      Marker.findOneAndUpdate({_id:req.params.id}, { $set: {titre:req.body.titre,
        image:req.file.filename,
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
          fs.unlinkSync("public/upload/"+marker.image);
          req.flash("msg8","modifier");
          res.redirect("/admin//update/marker/"+req.params.id);
        }
      });
    }
  });
  
});
router.delete('/delete/marker/:id',(req,res) => {
  Marker.findOneAndRemove({_id:req.params.id}, (err, marker) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
     response = {
        message: "marker successfully deleted",
    };
    fs.unlinkSync("public/upload/"+marker.image);
    req.flash("msg7","supprimer");
    res.redirect("/admin/getmarker");
  }
});
});
router.get('/addville',(req,res) => {
  res.render('pages/addville.html',{title:'addVille'});
});
router.get('/getville',(req,res) => {
  Ville.find({}).exec( (err, ville) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      Ville.count({},(err,count) => {
        let page=Math.round(count/6);
        res.render('pages/getville.html',{villes:ville,title:'getVille',page:page,msg:req.flash("msg1"),msg3:req.flash('msg3')});
        console.log(req.flash("msg1"));
      });
      
    }

  });
});
router.post('/addville',(req, res ) => { 
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
            console.log('ville saved successfully');
            req.flash('msg1',' c bon');
            res.redirect('/admin/getville');
          }
        });
      }
  });
});
router.get("/update/ville/:id",(req,res) => {
  Ville.findOne({_id: mongoose.Types.ObjectId(req.params.id)},(err,ville) => {
    if(err){
      console.log(err);
    }
    else{
      console.log(ville);
      res.render('pages/editville.html',{title:'editcat',ville:ville,msg9:req.flash('msg9')});
    }
  });
 });
router.post('/update/ville/:id',(req,res) =>{
  upload(req, res,(err) => {
    if (err) {
      console.log(err);    }
    else {
      Ville.findOneAndUpdate({_id:req.params.id}, { $set: {  
        nom:req.body.nom,
        image:req.file.filename,
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
          console.log(ville);
          if(req.file.filename){
            fs.unlinkSync("public/upload/"+ville.image);
          }
          req.flash('msg9','modifier');
          res.redirect("/admin/update/ville/"+req.params.id);
        }
      });
    }
  });
});
router.delete('/delete/ville/:id',(req,res) => {
  Ville.findOneAndRemove({_id:req.params.id}, (err, ville) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
     response = {
        message: "ville successfully deleted",
    };
    fs.unlinkSync("public/upload/"+ville.image);
    req.flash('msg3','supprimer');
    res.redirect('/admin/getville');
  }
});
});
router.get('/update/:id',(req,res) => {
  User.findOne({_id:mongoose.Types.ObjectId(req.params.id)}).exec((err,user) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(user)
      res.render('pages/infoAdmin.html',{title:'update',user:user,msg2:req.flash('msg2'),msg2_2:req.flash('msg2_2')});
    }
  });
});
router.put('/update/:id',(req,res) => {
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
router.get('/getcat',(req,res) => {
  Categorie.find({},(err,categorie) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('pages/getcat.html',{title:'getcat',msg4:req.flash('msg4'),msg5:req.flash('msg5'),cat:categorie});
    }
  });
});
router.get('/addcat',(req,res) => {
  
  res.render('pages/addcat.html',{title:'addcat'});
});
router.get('/update/categorie/:id',(req,res) => {
  Categorie.findOne({_id: mongoose.Types.ObjectId(req.params.id)},(err,categorie) => {
    if(err){
      console.log(err);
    }
    else{
      console.log(categorie);
      res.render('pages/editcat.html',{title:'editcat',msg6:req.flash('msg6'),cat:categorie});
    }

  });
});
router.post('/addcat',(req, res ) => {
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
      console.log('categorie saved successfully');
      req.flash('msg4','enregistrer');
      res.redirect('/admin/getcat');
    }
  });

});
router.delete('/delete/categorie/:id',(req,res) => {
  Categorie.remove({_id:req.params.id}, (err, categorie) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
     response = {
        message: "ville successfully deleted",
    };
    req.flash('msg5','supprimer');
    res.redirect('/admin/getcat');
  }
});
});
router.put('/update/categorie/:id',(req,res) =>{
  Categorie.findOneAndUpdate({_id:req.params.id}, { $set: {  
    nom:req.body.nom,
    }},
    (err,categorie) => {
    if(err){
      console.log(err);
    }
    else{
      console.log(categorie);
      req.flash('msg6','modifier');
      res.redirect('/admin/update/categorie/'+categorie._id);
    }
  });
});
router.get('/addadmin',(req,res) => {
  res.render('pages/addadmin.html',{title:'ajouter un admin'});
});
router.get('/getadmin',(req,res) => {
  User.find({role:"adminS"},(err,user) => {
    if(err){
      console.log(err);
    }
    else{
      res.render('pages/getadmin.html',{title:' admin',users:user,msg10:req.flash('msg10'),msg11:req.flash('msg11'),msg10_10:req.flash('msg10_10')});
    }
  });
  
});
router.post('/addadmin',(req,res) => {
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
});
router.delete('/delete/adminS/:id',(req,res) => {
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
