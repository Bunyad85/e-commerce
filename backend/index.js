const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');


const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/images', express.static('upload/images'));

// Upload qovluğu yaradılırsa
const uploadPath = './upload/images';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('upload/images qovluğu yaradıldı');
}

// MongoDB bağlantısı
mongoose.connect('mongodb+srv://bunyadseferov:bunyad1972@cluster0.re2imqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB bağlantısı uğurludur'))
    .catch((err) => console.error('MongoDB bağlantı xətası:', err));

// Root test endpoint
app.get('/', (req, res) => {
    res.send("Express App is running");
});

// Multer config                
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// POST: Şəkil yükləmə
app.post('/upload', upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: 'Fayl tapılmadı' });
    }

    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Product modeli
const Product = mongoose.model('Product', {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

// Add product
app.post('/addproducts', async (req, res) => {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    try {
        const product = new Product({
            id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await product.save();
        console.log("Məhsul bazaya əlavə olundu:", product.name);

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Xəta:", error.message);
        res.status(500).json({ success: false, message: "Server xətası" });
    }
});

// Remove product
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed product id:", req.body.id);
    res.json({
        success: true,
        id: req.body.id,
    });
});

// All products
app.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        console.log("All products fetched");
        res.status(200).json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({ error: "Server Error: Unable to fetch products" });
    }
});

// User modeli
const Users = mongoose.model("Users", {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now },
});

// Signup
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({
            success: false,
            errors: 'Exist user found with same email address'
        });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id,
        }
    };

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});


app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id,
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: 'Wrong Password' });
        }
    }
    else {
        res.json({ success: false, errors: 'Wrong Email Id' })
    }

})

app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log('NeCollections Fetched');
    res.send(newcollection);
})

app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: 'women' });
    let popular_in_women = products.slice(0, 4);
    console.log('Popular in women Fetched');
    res.send(popular_in_women);
})


const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" });
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: 'please authenticate using a valid token' })
        }
    }
}

app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("added", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send('Added')
})

app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0)
        userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send('Removed')
})

app.post('/getcart', fetchUser, async (req, res) => {
    console.log('GetCart');
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})


app.listen(port, (error) => {
    if (!error) {
        console.log(`Server ${port} portunda işləyir`);
    } else {
        console.log("Xəta:", error);
    }
});
