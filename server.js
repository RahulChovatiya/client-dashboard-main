const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Client = require('./src/models/dataSchema');
const SentEmail = require('./src/models/emailSchema');
const authRoutes = require('./src/models/authRoutes'); // Ensure this file is correctly implemented

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://127.0.0.1:27017/client_add';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);

app.post('/clients', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    console.error('Error saving client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Client.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/send-email', async (req, res) => {
  const { clientIds, emailSubject, emailDescription, senderEmail } = req.body;

  if (!clientIds || !emailSubject || !emailDescription || !senderEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const clients = await Client.find({ _id: { $in: clientIds } });
    if (clients.length === 0) {
      return res.status(404).json({ error: 'No clients found' });
    }

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '111658506cf4ff',
        pass: 'f71d6bf3f66cac'
      }
    });

    await Promise.all(clients.map(client => {
      return transporter.sendMail({
        from: senderEmail,
        to: client.email,
        subject: emailSubject,
        text: emailDescription
      });
    }));

    const emailLog = new SentEmail({
      emailSubject,
      emailDescription,
      clientEmails: clients.map(client => client.email),
      senderEmail,
    });

    await emailLog.save();

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
