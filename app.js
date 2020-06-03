const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const PORT = 3000;



const emailRegex = /^\w+([\.+-]?\w+)*@\w+([\.+-]?\w+)*(\.\w{2,3})+$/;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.listen(PORT || 3000, () => {
    console.log(`Server started and is running on port ${PORT}`);
})

app.get('/', (req, res) => {
    res.status(200).send('Please send an array of email addresses to /emailChecker route to see the results')
})

/*
/emailChecker
params: 
{
    data: [List of email addresses]
}

*/

app.post('/emailChecker', (req,res) => {
    
    const list = req.body.data;

    if(!list || !Array.isArray(list)){
        res.status(500).send({
            status: 'Error',
            message: 'Wrong Params: Please provide an ARRAY of email addresses in data attribute'
        })
    } else {
        const db = {};

        list.forEach(element => {
            if(typeof element == 'string'){
                validateEmail(element, db);
            }
        });

        res.status(200).send({total: Object.keys(db).length, data: db});
    }
    
})


/*
validateEmail
params: 
email[String] (emailAddress)
db[Object] (HashMap to store unique values for each request)

Definition:
- In this function I am basically checking if the given Email address passes my regex test (making sure it is a valid email)
- Also double checking to see if the given email address is already in the list, if so, then skip
- After passing first if check, I am dividing email address into 2 chunks localPart and domainPart and checking following
    - Plus sign check:
        This part is to get rid of whatever comes after plus sign
    - Lowercase Control
        Making sure everything is being recorded as lowercase to avoid creating extra key value pairs due to different capitalization
    - Dot check
        Saving email adress without the dot character in the 'localPart'

*/

const validateEmail = (email, db) => {

    if (emailRegex.test(email) && !db[email]){

        let [localPart,domainPart] = email.split('@');
        
        localPart = localPart.split('+')[0].toLowerCase();
        localPart = localPart.split('.').join('').toLowerCase();

        db[`${localPart}@${domainPart.toLowerCase()}`] = true;
    }

}