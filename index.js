// Import packages
const express = require('express')
const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary').v2

// Using packeges
const app = express()

// Stored with multer in the images folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let ext = path.extname(file.originalname);  
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
          cb(new Error("File type is not supported"), false);
          return;
        }
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    },
})

// Image direction
const upload = multer({storage: storage})

// Configure cloudinary
cloudinary.config({ 
    cloud_name: 'umg-adrian8a', 
    api_key: '318491327277661', 
    api_secret: 'ExGC8vtsOXRF4ANeITM3k5Yt5RE',
    secure: true,
  })

// Set port for APP
let port = 8080

// Middleware
app.use(express.json())

// Start route
app.get('/', (req, res) => {
    res.status(200).send("<h1> Welcome - Upload Image </h1> \
                <form method='POST' action='/Upload' enctype='multipart/form-data'> \
                    <input type='file' name='image'> <br><br> \
                    <input type='submit'> \
                </form> ")
})

// Health route
app.get('/health', (req, res) => {
    res.status(200).send("<h1> OK! </h1>")
})

// Post 
app.post('/Upload', upload.single('image'), async (req, res) => {

    const name = req.file.filename.substr(0,req.file.filename.length -4)   

    try {
        const result = await cloudinary.uploader.upload(req.file.path, 
            {public_id:name, overwrite:true})
     
        const trans = cloudinary.image(name, {transformation: [
            {effect: "cartoonify"},
            {radius: "max"},
            {effect: "outline:100", color: "lightblue"},
            {background: "lightblue"},
            {height: 300, crop: "scale"}
            ]})

        res.status(200).send("<h1> Image Uploaded </h1>  \
                            Applying image effects and filters: <br><br> "+trans)
        
    } catch (err) {
        res.status(404).send(err)
    }
})

// Listen server
app.listen(port, () => {
    console.log("Server running on port "+port)
})