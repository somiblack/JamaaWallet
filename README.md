# JamaaWallet - Web3 Wallet for Africa

A comprehensive Web3 wallet application designed specifically for African users, featuring ETH transactions, M-Pesa integration, airtime purchases, savings accounts, and loan services.

## Features

- **Send ETH**: Connect MetaMask/WalletConnect and send Ethereum to any address
- **Withdraw to M-Pesa**: Convert ETH to KES and withdraw to M-Pesa (simulated)
- **Deposit with M-Pesa**: Convert KES to ETH using M-Pesa payments (simulated)
- **Buy Airtime**: Purchase airtime for Safaricom, Airtel, and Telkom using ETH
- **Savings & Loans**: Earn interest on ETH savings and access loans based on savings history
- **Account Management**: View transaction history, wallet details, and access Telegram bot

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: Ethers.js for Ethereum interactions
- **State Management**: React Context API
- **Styling**: Tailwind CSS with Afrocentric coastal theme
- **Backend**: Next.js API routes
- **Deployment**: Optimized for Vercel

## Design Theme

The app features a warm, coastal Afrocentric design with:
- Gold (#F59E0B), indigo (#4F46E5), and earth tones
- Curved shapes and friendly UI elements
- Mobile-first responsive design
- Dark/light mode toggle

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/jamaa-wallet.git
cd jamaa-wallet
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:
- Add your Infura project ID for Ethereum network access
- Configure M-Pesa credentials (for production)
- Set up database URL (optional)

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/jamaa-wallet)

### Manual Deployment

1. **Prepare your repository**:
   - Push your code to GitHub, GitLab, or Bitbucket
   - Ensure all files are committed

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will automatically detect Next.js configuration

3. **Configure Environment Variables**:
   In your Vercel dashboard, go to Settings > Environment Variables and add:
   \`\`\`
   NEXT_PUBLIC_ETHEREUM_NETWORK=mainnet
   NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_BUSINESS_SHORT_CODE=174379
   MPESA_PASSKEY=your_mpesa_passkey
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-app.vercel.app
   \`\`\`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Your app will be available at `https://your-app.vercel.app`

### Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

## Production Considerations

### Security
- Use environment variables for all sensitive data
- Implement proper input validation
- Add rate limiting for API endpoints
- Use HTTPS in production

### M-Pesa Integration
- Register with Safaricom for M-Pesa API access
- Implement proper webhook handling for payment confirmations
- Add transaction logging and reconciliation

### Database
- Set up a production database (PostgreSQL, MongoDB, etc.)
- Implement proper transaction history storage
- Add user authentication and authorization

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Implement analytics (Google Analytics, Mixpanel)
- Monitor API performance and usage

## API Endpoints

- `POST /api/withdraw` - Initiate M-Pesa withdrawal
- `POST /api/deposit` - Generate M-Pesa deposit payment code
- `POST /api/airtime` - Purchase airtime with ETH

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Telegram: [@jamaawallet_bot](https://t.me/jamaawallet_bot)
- Email: support@jamaawallet.com
- USSD: *384*7# (Coming Soon)

## Roadmap

- [ ] Real M-Pesa API integration
- [ ] Multi-currency support (USDC, USDT)
- [ ] Telegram bot implementation
- [ ] USSD access for feature phones
- [ ] DeFi yield farming integration
- [ ] Cross-border remittances
- [ ] Merchant payment solutions

# JamaaWallet
JamaaWallet is a community-driven crypto wallet for Africa, supporting Lisk and Ethereum with DeFi utilities, Telegram bot access, and future USSD support for phone-based, offline crypto.
