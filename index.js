const express = require('express')
const app = express()
const mysql = require('mysql')
const bcrypt = require('bcrypt');
var cors = require('cors')
const fileUpload = require('express-fileupload');

const port = 3001
const ip = '0.0.0.0'

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "coffee_valley"
});

// con.query(
//   "CREATE TABLE if not exists users (\
//       id INT AUTO_INCREMENT PRIMARY KEY, \
//       password VARCHAR(64) NOT NULL \
//   )",
//   function (err) {
//     if (err) throw err;
// });

// con.query(
//   "CREATE TABLE if not exists beans (\
//       id INT AUTO_INCREMENT PRIMARY KEY, \
//       name VARCHAR(16) UNIQUE NOT NULL, \
//       description VARCHAR(64), \
//       price DECIMAL(10, 2) NOT NULL \
//   )",
//   function (err) {
//     if (err) throw err;
// });

// con.query(
//     "CREATE TABLE if not exists daily_bean (\
//         id INT AUTO_INCREMENT PRIMARY KEY, \
//         sale_price DECIMAL(10, 2) NOT NULL, \
//         bean_id INT NOT NULL, \
//         FOREIGN KEY(bean_id) REFERENCES beans(id) \
//     )",
//     function (err, result) {
//         if (err) throw err;
// });

// con.query(
//     "CREATE TABLE if not exists distributors (\
//         id INT AUTO_INCREMENT PRIMARY KEY, \
//         name VARCHAR(32) NOT NULL, \
//         city VARCHAR(32) NOT NULL, \
//         region VARCHAR(32) NOT NULL, \
//         country VARCHAR(32) NOT NULL, \
//         phone VARCHAR(32) NOT NULL, \
//         email VARCHAR(32) NOT NULL \
//     )",
//     function (err) {
//       if (err) throw err;
//   });

//   con.query(
//     "CREATE TABLE if not exists uploads (\
//         id INT AUTO_INCREMENT PRIMARY KEY, \
//         title VARCHAR(64) NOT NULL, \
//         file VARCHAR(128) NOT NULL, \
//         upload VARCHAR(32) NOT NULL \
//     )",
//     function (err) {
//       if (err) throw err;
//   });

app.use(cors(), express.json(), fileUpload())

app.post('/login', (req, res) => {

    con.query("SELECT * FROM users WHERE id = ? AND password = ?", [
      req.body.id,
      req.body.password
    ], function (err, result) {
      if (err) throw err;

      if (result.length === 0) {
        return res.json({ message: 'Invalid User ID or User Password' });
      }

      const user = result[0]

      return res.json({ message: 'Valid User ID and User Password', user });
  
    //   if (result.length === 0) {
    //     res.send("Invalid User ID or User Password")
    //   }

    //   const user = result[0]

    //   bcrypt.compare(req.body.password, user.passwordHash, (err, result) => {
    //     if (err || !result) {
    //         return res.send("Invalid User ID or User Password")
    //     }
  
    //     res.json({ message: 'Valid User ID or User Password', user });
    //   });
    });
  })

  app.get('/beans', (req, res) => {
    con.query("SELECT * FROM beans", function (err, result, fields) {
      if (err) throw err;
  
      res.send(result);
    });
  })

//   app.get('/daily-bean', (req, res) => {
//     con.query("SELECT * FROM beans WHERE price >= 0 LIMIT 1", function (err, result, fields) {
//       if (err) throw err;
  
//       res.send(result);
//     });
//   })

    app.get('/daily-bean', (req, res) => {
        con.query("SELECT b.name, b.description, d.sale_price FROM beans b JOIN daily_bean d ON (b.id = d.bean_id) WHERE d.sale_price >= 0 LIMIT 1", function (err, result, fields) {
        if (err) throw err;
    
        res.send(result);
        });
    })

  app.get('/distributors', (req, res) => {
    con.query("SELECT * FROM distributors", function (err, result, fields) {
      if (err) throw err;
  
      res.send(result);
    });
  })

  app.get('/distributor/:id', (req, res) => {
    con.query("SELECT * FROM distributors where id = ?", [
      req.params.id
    ], function (err, result, fields) {
      if (err) throw err;
  
      res.send(result);
    });
  })

  app.post('/distributor', (req, res) => {
    con.query("INSERT INTO distributors (name, city, region, country, phone, email) VALUES (?, ?, ?, ?, ?, ?)", [
      req.body.name,
      req.body.city,
      req.body.region,
      req.body.country,
      req.body.phone,
      req.body.email
    ], function (err, result) {
      if (err) throw err;
  
      return res.json({ message: 'Distributor Successfully Created'});
    });
  })

  app.put('/distributor', (req, res) => {
    con.query("UPDATE distributors SET name=?, city=?, region=?, country=?, phone=?, email=? WHERE id=?", [
      req.body.name,
      req.body.city,
      req.body.region,
      req.body.country,
      req.body.phone,
      req.body.email,
      req.query.id
    ], function (err, result) {
      if (err) throw err;
  
      return res.json({ message: 'Distributor Successfully Updated'});
    });
  })

  app.get('/uploads', (req, res) => {
    con.query("SELECT * FROM uploads", function (err, result) {
      if (err) throw err;
  
      res.send(result);
    });
  })

  app.post('/upload', (req, res) => {
    let uploadedFile = req.files.file;
    
    con.query("INSERT INTO uploads (title, file, author) VALUES (?, ?, ?)", [
      req.body.title,
      req.body.file,
      req.body.author
    ], function (err, result) {
      if (err) throw err;
  
      return res.json({ message: 'Upload Successfully Created'});
    });
  })

app.listen(port, ip, () => {
console.log(`Example app listening on port ${port}`)
})