const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

//CHECK LOGIN//
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}

//GET Admin - login page//
router.get('/admin',(req,res)=>{
    try {
        const locals = {
            title:"Admin",
            description: "Simple blog created using node express and mongodb",
        }
        res.render("admin/index",{locals,layout:adminLayout});
    } catch (error) {
        console.log(error);
    }
});

//POST Admin - check login//
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne( { username } );

    if(!user) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const token = jwt.sign({ userId: user._id}, jwtSecret );
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
  }
});

// GET - ADMIN - dashboard//
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await Post.find();
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});


//GET admin - create new post 


//POST Admin - register//
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       const user = await User.create({ username, password:hashedPassword });
//       res.status(201).json({ message: 'User Created', user });
//     } catch (error) {
//       if(error.code === 11000) {
//         res.status(409).json({ message: 'User already in use'});
//       }
//       res.status(500).json({ message: 'Internal server error'})
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });

// POST / Admin - Register//
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword });
      res.status(201).json({ message: 'User Created', user });
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }

  } catch (error) {
    console.log(error);
  }
});

//GET CREATE NEW POST//
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await Post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

//GET ADMIN CREATE NEW POST//
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    
    const locals = {
      title: "Edit Post",
      description: "Free Nodejs User management System",
    };

    const data = await Post.find({_id: req.params.id});
    
    res.render('/edit-post/',{
      locals,
      data,
      layout:adminLayout
    })

  } catch (error) {
    console.log(error);
  }

});

//PUT ADMIN CREATE NEW POST//
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    
    await Post.findByIdAndUpdate(req.params.id,{
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    })
    res.redirect(`/edit-post/${req.params.id}`)

  } catch (error) {
    console.log(error);
  }

});

//POST CREATED NEW POST//
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body
      });

      await Post.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }
});

// router.post('/admin', async (req, res) => {
//   try {
//     const { username, password } = req.body;
    
//     if(req.body.username === 'admin' && req.body.password === 'password') {
//       res.send('You are logged in.')
//     } else {
//       res.send('Wrong username or password');
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });


module.exports= router;