require('dotenv').config(); 
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    
    res.send('Welcome to FinanceTracker');
});

// Feature Endpoints

app.get('/Transactions', (req, res) => {
    res.send('TODO ACTUALLY GET TRANSACTIONS');
});

app.post('/Transactions', (req, res) => {
    res.send('TODO ADD TRANSACTION DATA');
});

//Transition Endpoints

app.get('/Dashboard', (req, res) => {
    res.send('TODO MOVE TO PAGE WITH DASHBOARD');
});

app.get('/hello', (req, res) => {
    res.json({message: 'THIS IS WORKING SO WELL'});
});


const port = 8000; //process.env.PORT

app.listen(port, () => {
    
    console.log(`Server started on port ${port}`);
});