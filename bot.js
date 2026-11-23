const http = require('http');
const mineflayer = require('mineflayer');
const config = require('./config.json');

// Keep-alive web server for Render
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is alive');
}).listen(process.env.PORT || 3000);

function createBot() {
  const bot = mineflayer.createBot({
    host: config.serverHost,
    port: config.serverPort,
    username: config.botUsername,
    auth: 'offline',
    viewDistance: config.botChunk || 4
  });

  bot.once('spawn', () => {
    console.log(`✅ ${config.botUsername} is Ready!`);

    // Anti-AFK movement loop every 25 seconds
    setInterval(() => {
      if (!bot.entity) return;
      bot.setControlState('jump', true);
      bot.setControlState('sneak', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
        bot.setControlState('sneak', false);
      }, 500);
      bot.look(Math.random() * Math.PI * 2, 0);
    }, 25000);
  });

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err.message);
  });
}

createBot();
