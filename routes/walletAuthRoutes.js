const express = require('express');
const Web3 = require('web3');
const WalletConnectProvider = require("@walletconnect/web3-provider");
const router = express.Router();

// Middleware to check if user is already logged in
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.address) {
    return res.redirect('/');
  }
  next();
};

router.get('/auth/wallet', redirectIfAuthenticated, async (req, res) => {
    res.render('walletLogin', { title: 'Login with Ethereum Wallet' });
});

router.post('/auth/wallet', async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        console.error("Wallet address is required for login.");
        return res.status(400).send('Wallet address is required.');
    }

    try {
        // Simulating the authentication process
        // In a real-world scenario, you would verify the wallet address signature
        req.session.address = walletAddress;
        console.log(`User authenticated with wallet address: ${walletAddress}`);
        return res.redirect('/');
    } catch (error) {
        console.error(`Error during wallet authentication: ${error.message}`, error);
        res.status(500).send('An error occurred during authentication.');
    }
});

module.exports = router;