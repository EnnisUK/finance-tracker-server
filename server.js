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
    const { category, startDate, endDate, search } = req.query;

    const filters = {};

    if (category) filters.category = category;

    if (startDate || endDate) {
        filters.date = {};
        if (startDate) filters.date.gte = new Date(startDate);
        if (endDate) filters.date.lte = new Date(endDate);
    }

    if (search) {
        filters.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: Object.keys(filters).length ? filters : undefined,
            orderBy: { date: 'desc' },
        });

        res.status(200).json(transactions);
    } catch (err) {
        console.error('🔥 GET /transactions error:', err);  // <-- Add this
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
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

app.put('/Transaction/:id', async (req, res) => {
    
    const { id } = req.params;
    const {name, amount, date, description, category} = req.body;
   
    const foundTransaction = await prisma.transaction.findFirst({where: {id: parseInt(id)}});
    
    if(!foundTransaction) { return res.status(404).send({message: 'Failed to find a transaction'}); }
    
    const updatedTransaction = await prisma.transaction.update({
        where: {id: parseInt(id)},
        data: {name, amount: parseInt(amount), date: parseYDM(date), description, category},
    });
    
    res.status(200).json(updatedTransaction);
})

app.delete('/Transaction/:id', async (req, res) => {
    const { id } = req.params;
    
    try
    {
        await prisma.transaction.delete({where: {id: parseInt(id)}});
        res.status(200).send({message: 'Transaction deleted'});
    }
    catch(err)
    {
        res.status(500).json({message: 'Failed to delete transaction'});
    }
})

const port = 8000; //process.env.PORT

app.listen(port, () => {
    
    console.log(`Server started on port ${port}`);
});