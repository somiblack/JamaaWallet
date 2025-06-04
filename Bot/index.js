//-----------------------IMPORTS & CONFIG----------------------------
const express = require('express');
const dotenv = require('dotenv');
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const axios = require('axios');

dotenv.config();

const app = express();
const port = 3000;

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const api_key = process.env.MPESA_PAYMENT_KEY;
const payment_url = 'https://lipia-api.kreativelabske.com/api/request/stk';
const mongo_uri = process.env.MONGO_URI;

if (!telegramToken || !api_key || !mongo_uri) {
  console.error('Required environment variables are missing.');
  process.exit(1);
}

//-----------------------MONGODB CONFIG----------------------------

mongoose.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  phone: String,
  balance: { type: Number, default: 0 },
  transactions: [
    {
      type: { type: String }, // 'deposit', 'withdrawal', etc.
      amount: Number,
      date: { type: Date, default: Date.now },
      reference: String
    }
  ]
});

const User = mongoose.model('User', userSchema);

//-----------------------TELEGRAM BOT----------------------------

const bot = new Telegraf(telegramToken);

const mainMenu = `Welcome to ETH Wallet Services:
1. Send ETH
2. Withdraw ETH
3. Deposit ETH with M-Pesa
4. Buy Airtime
5. Loans and Savings
6. My Account

Please reply with a number (1-6) to continue.`;

const userStates = new Map(); // track user step e.g. awaiting phone

bot.start((ctx) => {
  ctx.reply(mainMenu);
  userStates.set(ctx.from.id, null);
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const input = ctx.message.text.trim();
  let session = userStates.get(userId) || {};

  // Step 1: Expecting phone
  if (session.step === 'awaiting_deposit_phone') {
    const phone = input.replace(/\s+/g, '');

    if (!/^07\d{8}$/.test(phone)) {
      ctx.reply('❌ Invalid phone number. Please enter a valid Safaricom number starting with 07...');
      return;
    }

    // Store valid phone in session
    session.phone = phone;
    session.step = 'awaiting_deposit_amount';
    userStates.set(userId, session);

    ctx.reply('✅ Phone number received.\nPlease enter the amount to deposit (e.g., 100):');
    return;
  }

  // Step 2: Expecting amount
  if (session.step === 'awaiting_deposit_amount' && session.phone) {
    const amount = parseFloat(input);

    if (isNaN(amount) || amount < 1) {
      ctx.reply('❌ Invalid amount. Please enter a valid number greater than 0.');
      return;
    }

    try {
      const response = await axios.post(payment_url, {
        phone: session.phone,
        amount
      }, {
        headers: {
          Authorization: `Bearer ${api_key}`
        }
      });

      const ref = response.data.data.refference;
      console.log('STK Push response:', response.data);
      // //convert deposit amount to Eth using coingecko API
      // //--TODO--
      // const ethRate = 2000; // Example rate, replace with actual API call
      // const ethAmount = amount / ethRate;

      // Fetch ETH to KES rate
    let ethAmount = 0;
    try {
      const ethRes = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'ethereum',
          vs_currencies: 'kes'
        }
      });
    
      const ethRate = ethRes.data?.ethereum?.kes;
      console.log('ETH to KES rate:', ethRate);
    
      if (!ethRate) throw new Error('Invalid ETH rate from API');

      ethAmount = amount / ethRate; // Convert KES to ETH


      // Save to DB
      await User.findOneAndUpdate(
        { telegramId: userId.toString() },
        {
          telegramId: userId.toString(),
          phone: session.phone,
          $push: {
        transactions: {
          type: 'deposit',
          amount: ethAmount,
          reference: ref
        }
          },
          $inc: { balance: ethAmount }
        },
        { upsert: true, new: true }
      );

      ctx.reply(`Transaction of KES ${amount} to ${session.phone} Successful. Eth credited to your account.\nReference: ${ref}`);
    } catch (err) {
      console.error('STK error:', err.response?.data || err.message);
      ctx.reply(`❌ Failed to send STK push. ${err.response?.data?.message || 'Please try again.'}`);
    }

    userStates.delete(userId); // Reset session
    return;
  } catch (err) {
      console.error('Error fetching ETH rate:', err);
      ctx.reply('❌ Failed to fetch ETH rate. Please try again later.');
      return;
    }
  }




  switch (input) {
    case '1':
      ctx.reply('🔁 Send ETH\nPlease enter the recipient Phone Number and amount (e.g., 254... or 07...)');

      break;
    case '2':
      ctx.reply('💵 Withdraw ETH\nPlease enter your withdrawal amount and M-Pesa number.');
      break;
    case '3':
      ctx.reply('📥 Deposit ETH with M-Pesa\nEnter your phone number (e.g., 2547xxxxxxx or 07xxxxxxx):');
      userStates.set(userId, { step: 'awaiting_deposit_phone' }); // FIXED LINE
      break;
    case '4':
      ctx.reply('📲 Buy Airtime\nEnter amount and phone number (e.g., 50 0712345678).');
      break;
    case '5':
      ctx.reply('💰 Loans and Savings\nReply with:\n1. Apply for Loan\n2. Save ETH\n3. Loan Balance');
      break;
    case '6':
      const user = await User.findOne({ telegramId: userId.toString() });
      if (user) {
        ctx.reply(`👤 Account Info:\nPhone: ${user.phone}\nBalance: ${user.balance} ETH`);
      } else {
        ctx.reply('⚠️ No account info found. Try depositing first.');
      }
      break;
    default:
      ctx.reply('❌ Invalid option. Please enter a number between 1 and 6.');
      ctx.reply(mainMenu);
  }
});

bot.launch().then(() => {
  console.log('✅ Telegram bot is running...');
}).catch(err => {
  console.error('❌ Failed to start the Telegram bot:', err);
});

//-----------------------EXPRESS APP----------------------------

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
