const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Client = require('./src/models/dataSchema'); // Ensure this path is correct
const SentEmail = require('./src/models/emailSchema'); // New schema for sent emails

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/client_add', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.post('/clients', async (req, res) => {
  try {
    console.log('Request body:', req. body); // Log the request body to inspect it
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

  // Check for required fields
  if (!clientIds || !emailSubject || !emailDescription || !senderEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Fetch clients
    const clients = await Client.find({ _id: { $in: clientIds } });
    if (clients.length === 0) {
      return res.status(404).json({ error: 'No clients found' });
    }

    // Configure nodemailer transport with Mailtrap
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,  // Mailtrap SMTP port
      auth: {
        user: 'db3987ce75a311', // Replace with your Mailtrap username
        pass: '297cb7934a55d8'  // Replace with your Mailtrap password
      }
    });

    // Send emails from a fixed sender email address
    await Promise.all(clients.map(client => {
      return transporter.sendMail({
        from: senderEmail, // Use the senderEmail from the request body
        to: client.email,
        subject: emailSubject,
        text: emailDescription
      });
    }));

    // Log email sending with sender email from the request body
    const emailLog = new SentEmail({
      emailSubject,
      emailDescription,
      clientEmails: clients.map(client => client.email),
      senderEmail, // Include the senderEmail from the request body in the log
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
