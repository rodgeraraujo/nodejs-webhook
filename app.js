const express = require('express');
const webhooks = require('node-webhooks');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.send({
    msg: 'See the project in https://github.com/rodgeraraujo/nodejs-webhook',
  })
);

app.post('/trigger-event', async (req, res) => {
  try {
    const data = {
      user: {
        id: 1,
        name: 'superman',
        age: 8999,
      },
    };

    const hooks = registerHooks();
    hooks.trigger('callback_hook', { topic: 'users', data });

    return res.send({ data: 'webhook event sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'error', error: err.message });
  }
});

app.post('/webhook-client', async (req, res) => {
  try {
    const { topic, data } = req.body;

    // if topic name not be `users`, then throw a exception
    if (topic === 'users') {
      // if already ok, send a success response to webhook provider
      res.send('OK');
      // log data reiceved
      console.info(data);
    }

    throw new Error('Invalid');
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Error: ${err.message}`);
  }
});

const registerHooks = () => {
  return new webhooks({
    db: {
      callback_hook: [
        'https://enfy3455woybtda.m.pipedream.net',
        'http://localhost:3000/webhook-client',
      ],
    },
  });
};

app.listen(process.env.PORT || 3000, () => {
  console.log('Node-Webhook has been stated at: http://localhost:3000');
});
