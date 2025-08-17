# Handshake Raffle

A blockchain-based raffle system for Handshake domains with automatic winner selection.

## How It Works

**Entry**: Send HNS to the raffle address during the active period
**Duration**: 7 days (1,008 blocks)
**Winner Selection**: Automatic using block height for randomness
**Cost**: 1 HNS = 1 entry (send more HNS for more chances)

## ⚠️ IMPORTANT: Prize Verification

- ✅ **Verified**: Safe to participate - operator owns the domain
- ❌ **Unverified**: Transfer may be pending - operator doesn't own the domain yet

## How to Enter

1. **Check Verification**: Look for ✅ next to the prize
2. **Wait for Active Period**: Only entries during active period count
3. **Send HNS**: Send to the raffle address using any Handshake wallet
4. **Wait**: Your entry shows as ⏳ pending, then ✅ confirmed

**Current Raffle Address:**

```
hs1qsekzkyx5p435c0tzveqw6pfja0fk0kazd5cq93
```

## Raffle Status

- 🟡 **Waiting**: Not started yet
- 🟢 **Active**: Accepting entries (7 days)
- 🔴 **Ended**: Drawing complete

## Supported Wallets

Any Handshake wallet works:

- Bob Wallet (desktop)
- Namebase (web)
- hsd-cli, hs-client (command line)
- other wallets supporting HNS & Handshake TLDs (not exchanges)

## ⚠️ IMPORTANT:

Don't enter from an exchange wallet (other than Namebase) because you won't be able to receive the prize

## Winner Selection

- **Automatic**: Winner selected when end block is reached
- **Fair**: Uses blockchain data for randomness
- **Weighted**: More HNS sent = higher chance of winning
- **Transparent**: All entries visible and verifiable

## Prize Delivery

- Winners receive the domain in their on-chain address
- Delivery within 7 days after raffle ends (transfers require 3-day confirmation period)

## Key Rules

- Minimum 1 HNS per entry
- Multiple entries allowed (send more HNS)
- Only verified prizes (✅) are legitimate
- No refunds once raffle starts
- Entries outside active period don't count

## FAQ

**Q: Can I enter multiple times?**
A: Yes, send more HNS for more entries.

**Q: What if the prize shows ❌?**
A: Don't participate - the operator may not own the domain.

**Q: How do I know it's fair?**
A: Winner is determined by blockchain data, fully transparent.

**Q: What happens to my HNS?**
A: Entry fees fund future raffles and development.
