import express from 'express';
import connect from './src/Config/index.js';
import cors from 'cors';
connect();

import destinations from './src/Routes/destinations.js';
import clients from './src/Routes/clients.js';
import admins from './src/Routes/admins.js';
import blogs from './src/Routes/blogs.js';
import comments from './src/Routes/comments.js';
import locations from './src/Routes/locations.js';
import categories from './src/Routes/categories.js';
import orders from './src/Routes/orders.js';
import cron from 'node-cron';
import orderService from './src/Services/orders.js';
import { sendAlert } from './src/Services/sendMail.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/destinations", destinations);
app.use("/clients", clients);
app.use("/admins", admins);
app.use("/blogs", blogs);
app.use("/comments", comments);
app.use("/locations", locations);
app.use("/categories", categories);
app.use("/orders", orders);

cron.schedule('20 20 * * *', async() => {
    orderService.getOrderSchedule().then(allOrders => {
        console.log(allOrders);
        allOrders.forEach(async order => {
            try {
                sendAlert(order.idClient.email, 'Reminder', order);
            } catch (err) {
                console.log(err);
            }
        });
    });
});

app.listen(PORT, () => {
    console.log('Example app listening on port 3000!');
});