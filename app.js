const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { urlencoded } = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //to use static files like images and css files

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us11.api.mailchimp.com/3.0/lists/b1f3735b58"

    const options = {
        method: "POST",
        auth: "deepti1:4ecbbcaa807c58b9882f4a4d2eabdb3a-us11"
    }
    
    const request = https.request(url, options, function (response) {
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })

    });
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started at port 3000.")
});


// API Key (Mailchimp)
// 4ecbbcaa807c58b9882f4a4d2eabdb3a-us11

// List Id
// b1f3735b58