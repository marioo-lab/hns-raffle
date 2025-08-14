# Handshake Domain Raffle Instructions

## Overview

This is a decentralized raffle system for Handshake domains that runs entirely on the blockchain. Winners are determined automatically using block height for true randomness, and all transactions are publicly verifiable.

## How It Works

### 🎯 **Current Raffle**

- **Prize**: Handshake emoji or TLDs (🃏, 🧬, 🦖, .gift)
- **Entry Fee**: 1 HNS per entry
- **Duration**: 7 days (1,008 blocks)
- **Multiple Entries**: Send more HNS for more chances to win
- **Prize Verification**: ✅ indicates verified ownership, ❌ indicates unverified

### 📅 **Raffle Timeline**

1. **Waiting Period**: Raffle is scheduled but hasn't started yet
2. **Active Period**: 7 days to submit entries
3. **Automatic Drawing**: Winner selected when end block is reached

## Prize Verification & Trust

### 🔒 **Ownership Verification**

Each raffle prize displays a verification status:

- **✅ Verified**: The raffle operator owns this domain on-chain
- **❌ Unverified**: Cannot confirm the operator owns this domain

### 🔍 **How Verification Works**

- The system automatically checks domain ownership using blockchain data
- It compares the raffle operator's address with the domain's owner address
- Only participate in raffles with verified prizes (✅) for guaranteed legitimacy

### ⚠️ **Trust Considerations**

- **Verified prizes (✅)**: Safe to participate - ownership is blockchain-confirmed
- **Unverified prizes (❌)**: High risk - the operator may not actually own the domain
- Always check the verification status before sending HNS

## How to Enter

### Step 1: Get the Raffle Address

The current raffle address is displayed on the main page:

```
hs1qsekzkyx5p435c0tzveqw6pfja0fk0kazd5cq93
```

### Step 2: Check Prize Verification

⚠️⚠️⚠️ **IMPORTANT** ⚠️⚠️⚠️

**Always verify the prize shows ✅ (verified) before entering!**

- Look for the green checkmark next to the prize name
- Unverified prizes (❌) may not be legitimate
- Only participate in verified raffles to ensure you can actually win the domain

### Step 3: Send HNS

⚠️⚠️⚠️ **Warning** ⚠️⚠️⚠️

Do not send HNS to the raffle address outside the raffle Active Period, because it will not count as an entry!

Send HNS to the raffle address, after the raffle starts, using any Handshake wallet:

**Minimum Entry**: 1 HNS = 1 entry
**Multiple Entries**:

- 2 HNS = 2 entries
- 5 HNS = 5 entries
- 10 HNS = 10 entries
- etc.

### Step 4: Wait for Confirmation

- Your entry appears immediately but shows ⏳ (pending)
- Once confirmed on-chain, it shows ✅ (confirmed)
- Only confirmed entries are eligible for the drawing

## Supported Wallets

You can enter using any Handshake wallet that supports sending HNS:

- **Desktop Wallets**: Bob Wallet, HNS Wallet
- **Web Wallets**: Namebase, Handshake.org wallet
- **Command Line**: hsd-cli, hs-client
- **Mobile Apps**: Any HNS-compatible mobile wallet

### Example Commands

**Using hsd-cli:**

```bash
hsd-cli sendtoaddress hs1qsekzkyx5p435c0tzveqw6pfja0fk0kazd5cq93 1.0
```

**Using hs-client:**

```bash
hsw-cli send --account=default --address=hs1qsekzkyx5p435c0tzveqw6pfja0fk0kazd5cq93 --value=1000000
```

## Winner Selection

### 🎲 **Deterministic Randomness**

- Winner is determined by: `endBlockHeight % totalEntries`
- This creates verifiable randomness using blockchain data
- No human intervention or external randomness sources

### 🏆 **Weighted Selection**

- Each HNS sent = 1 entry in the drawing
- More HNS = higher chance of winning
- Example: If you send 5 HNS, you get 5 entries in the pool

### ⏰ **Automatic Drawing**

- Winner is drawn automatically when the end block is reached
- No manual intervention required
- Results are immediately visible on the page

## Verification & Transparency

### 📊 **Live Tracking**

- All entries are visible in real-time
- Current pool size and participants shown
- Block countdown to raffle end
- Real-time prize ownership verification

### 🔍 **Blockchain Verification**

- All transactions are on-chain and publicly verifiable
- Check entries on any Handshake block explorer
- Transaction hashes provided for each entry
- Prize ownership verified against blockchain records

### 🏅 **Winner Verification**

- Winner announcement includes:
  - Winning address (truncated for privacy)
  - Original entry transaction hash
  - Prize details and transfer information
  - Verification that the operator can actually transfer the prize

## Important Notes

### ⚠️ **Entry Requirements**

- Minimum 1 HNS per entry
- Entries must be sent during the active raffle period
- Transactions outside the time window are not counted
- **ONLY participate in raffles with verified prizes (✅)**

### 💰 **Prize Distribution**

- Winners will receive the prize in their on-chain address, at most 7 days after raffle end (Handshake has a 3 day transfer confirmation)
- Prize transfers only possible if the operator actually owns the domain (verified ✅)

### 🔒 **Security**

- Smart contract-like behavior using Bitcoin Script
- All code is open source and auditable
- Automatic ownership verification prevents fake raffles

### ⏱️ **Timing**

- Block times are approximately 10 minutes
- Raffle duration is measured in blocks, not wall-clock time
- End time is approximate due to variable block timing

## Troubleshooting

### ❓ **My Transaction Isn't Showing**

- Wait for blockchain confirmation (1-2 blocks)
- Check that you sent to the correct address
- Verify the amount meets the minimum requirement

### ❓ **Prize Verification Questions**

- **✅ Green checkmark**: Verified ownership - safe to participate
- **❌ Red X**: Unverified ownership - high risk, avoid participation
- Verification status updates automatically every 30 seconds

### ❓ **Raffle Status Questions**

- 🟡 **Waiting**: Raffle scheduled but not started
- 🟢 **Active**: Entries being accepted
- 🔴 **Ended**: Drawing complete, winner selected

### ❓ **Technical Issues**

- Refresh the page if data seems stale
- Check your internet connection
- The system auto-refreshes every 30 seconds

## FAQ

**Q: Can I enter multiple times?**
A: Yes! Each HNS sent gives you one entry. Send more HNS for more chances.

**Q: What does the verification status mean?**
A: ✅ means the raffle operator actually owns the prize domain (safe). ❌ means ownership cannot be verified (risky - avoid these raffles).

**Q: Should I participate in unverified raffles?**
A: No! Only participate in raffles showing ✅ verification. Unverified raffles may be scams where the operator doesn't actually own the prize.

**Q: How is ownership verified?**
A: The system checks the blockchain to confirm the raffle operator's address matches the domain owner's address from the Handshake name registry.

**Q: What happens to the HNS I send?**
A: Entry fees fund future raffles and platform development. This is not a gambling site.

**Q: How do I know the drawing is fair?**
A: The winner is determined by blockchain data (block height) and is completely transparent and verifiable.

**Q: What if no one enters?**
A: The raffle will still end at the scheduled time. Prizes roll over to the next raffle.

**Q: Can I get a refund?**
A: No refunds once the raffle period begins. Only send what you can afford to lose.

**Q: What if I win but the operator doesn't own the domain?**
A: This is why verification is crucial! Always check for ✅ verification before participating to ensure legitimate prizes.

---

## Contact & Support

For questions or technical support, please check the project's GitHub repository or community channels.

**Remember: Only participate in verified raffles (✅) for your safety! 🔒**

**Good luck! 🍀**
