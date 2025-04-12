import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());



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
        const newTransaction = await prisma.transaction.create({
            data: {
                date: new Date(req.body.date),
                amount: parseFloat(req.body.amount),
                type: req.body.type,
                category: req.body.category,
                description: req.body.description,
            }
        });
        res.json(newTransaction);
    }
    catch(err) 
    {
        res.status(500).json({ message: 'Failed to create transaction', error: err.message });
    }
});

app.get('/hello', (req, res) => {
    res.json({message: 'THIS IS WORKING SO WELL'});
});


const port = 8000; //process.env.PORT

app.listen(port, () => {
    
    console.log(`Server started on port ${port}`);
});