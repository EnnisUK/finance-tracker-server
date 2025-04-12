import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

//Helper functions

function parseYMD(dateStr) {
    // Replace slashes with dashes
    const isoFormatted = dateStr.replace(/\//g, '-'); // "2025-04-12"
    const dateObj = new Date(isoFormatted);

    if (isNaN(dateObj)) {
        throw new Error(`Invalid date: ${dateStr}`);
    }

    return dateObj;
}


app.get('/', (req, res) => {
    
   try
   {
       res.json({message: 'Welcome to the Finance Tracker!'});
   }
   catch(err) {res.status(404).send({message: 'Failed to get the finance tracker'});}
});

// Feature Endpoints

app.get('/Transactions', async (req, res) => {
    res.send('TODO ACTUALLY GET TRANSACTIONS');
});

app.post('/Transaction', async (req, res) => {
    try
    {

        console.log("Incoming body:", req.body); 
        const {name, amount, date, description, category} = req.body;
        const parsedDate = parseYMD(date);
        const parsedAmount = parseInt(amount);
        
        const newTransaction = await prisma.transaction.create({
            data: {
                name,
                amount: parsedAmount,
                date: parsedDate,
                description,
                category,
            }
        });
        res.status(201).json(newTransaction);
    }
    catch(err) 
    {
        console.error('❌ Failed to create transaction:', err.message);
        res.status(500).json({
            message: 'Failed to create transaction',
            error: err.message
        });
    }
});

app.get('/hello', (req, res) => {
    res.json({message: 'THIS IS WORKING SO WELL'});
});


const port = 8000; //process.env.PORT

app.listen(port, () => {
    
    console.log(`Server started on port ${port}`);
});