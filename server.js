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

function parseDMY(dateString) {
    const [year, month, day] = dateString.split('/');
    
    if (!day || !month || !year) {
        throw new Error(`Invalid date format: ${dateString}`);
    }

    return new Date(`${year}-${month}-${day}`);
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
        const {name, amount, date, description, category} = req.body;
        const parsedDate = parseDMY(date);
        
        const newTransaction = await prisma.transaction.create({
            data: {
                name,
                amount,
                date: parsedDate,
                description,
                category,
            }
        });
        res.status(201).send(newTransaction);
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