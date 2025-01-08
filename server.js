const express = require('express');
const WebSocket = require('ws');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function(req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
    }
});

// Quote request endpoint
app.post('/api/quote', upload.array('attachments', 5), async (req, res) => {
    try {
        const quoteData = {
            ...req.body,
            files: req.files,
            timestamp: new Date(),
            status: 'pending'
        };

        // Here you would typically save to a database
        console.log('New quote request:', quoteData);

        // Send email notification (implement your email service here)
        await sendEmailNotification('quote', quoteData);

        res.status(200).json({ message: 'Quote request received successfully' });
    } catch (error) {
        console.error('Error processing quote request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Callback request endpoint
app.post('/api/callback', async (req, res) => {
    try {
        const callbackData = {
            ...req.body,
            timestamp: new Date(),
            status: 'pending'
        };

        // Here you would typically save to a database
        console.log('New callback request:', callbackData);

        // Send email notification (implement your email service here)
        await sendEmailNotification('callback', callbackData);

        res.status(200).json({ message: 'Callback request received successfully' });
    } catch (error) {
        console.error('Error processing callback request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// WebSocket server for live chat
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('New client connected');

    ws.on('message', function incoming(message) {
        // Broadcast to all connected clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                // In a real application, you would have an agent dashboard
                // and route messages appropriately
                setTimeout(() => {
                    client.send(JSON.stringify({
                        sender: 'Agent',
                        text: 'Merci pour votre message. Un conseiller vous répondra dans quelques instants.',
                        timestamp: new Date()
                    }));
                }, 1000);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Helper function for sending email notifications (implement your email service)
async function sendEmailNotification(type, data) {
    // Implement your email service here (e.g., using nodemailer)
    console.log(`Email notification for ${type}:`, data);
}

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
