/************************************************************************* 
 *  WEB322– Assignment 3 
 * I declare that this assignment is my own work in accordance with Seneca Academic 
 Policy. No part * of this assignment has been copied manually or electronically from any
 other source 
 *  (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: Melika Hamedani  Student ID: 175474212  Date: 02/10/2022 
 * 
 * Your app’s URL (from Heroku) :  https://arcane-mesa-60112.herokuapp.com/
 * 
 * *************************************************************************/
 const express = require ("express");
 const multer = require ("multer");
 const path = require ("path");
 const fs = require("fs");
 const app = express();
 const HTTP_PORT = process.env.PORT || 8080;
 const dataService = require("./data-service");


 const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
});

const upload = multer({storage: storage});

//HTTP_PORT
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//Use
app.use(express.static('./public/site.css'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/home.html"));
});


//About
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});


//Employees
app.get("/employees", (req, res) => {
    if (req.query.status) {
        dataService.getEmployeeByStatus(req.query.status).then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department).then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager).then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
    else {
        dataService.getAllEmployees().then((data) => {
            res.json({data});
        }).catch((err) => {
            res.json({message: err});
        })
    }
});

app.get("/employee/:value", (req,res) => {
    dataService.getEmployeeByNum(req.params.value).then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});


//Add Employee
app.get("/employees/add", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch(err => console.log(err))
})


//Image
app.get("/images/add", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images")
})

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, items) {
        if (err) return console.log(err)
        res.json(items)
    })
})


//Departments
app.get("/departments", function(req,res){
    dataService.getDepartments().then((data) =>{
        res.json(data);
    }).catch((err)=>{
        res.json({ error: err });
    })
});


//Managers
app.get("/managers", function(req,res){
    dataService.getManagers().then((data) =>{
        res.json(data);
    }).catch((err) =>{
        res.json({ error: err })
    })
});

//404 Error
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname,"/public/image/404.jpg"));
})

//Start the server
dataService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch(() => {
    console.log("Unable to load data");
});
