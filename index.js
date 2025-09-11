class HandshakeLottery {
  constructor() {
    this.nodeUrl = "https://hsd.hns.au";
    this.lotteryAddress = "hs1qsekzkyx5p435c0tzveqw6pfja0fk0kazd5cq93";
    this.participants = [];
    this.entryFee = 1.0;
    this.blockHeight = 0;
    this.winnerDrawn = false;

    // Block-based timing (approximately 10 minutes per block)
    this.BLOCK_TIME_MINUTES = 10;
    this.RAFFLE_DURATION_BLOCKS = 1008; // 7 days = 7 * 24 * 6 blocks

    // Predefined raffle blocks - update these for each raffle
    this.startBlockHeight = 293220; // Set this to your desired start block
    this.endBlockHeight = this.startBlockHeight + this.RAFFLE_DURATION_BLOCKS;

    this.availablePrizes = [
      {
        name: "xn--1ugx245pcja4k",
        display: "👩🏿‍💻",
        type: "Emoji",
        url: "https://shakeshift.com/name/xn--1ugx245pcja4k",
      },
    ];

    this.init();
  }

  async init() {
    await this.selectPrize();
    await this.connect();
    await this.checkTransactions();

    // Check raffle status and draw winner immediately if needed
    await this.checkRaffleStatus();

    this.updateDisplay();
    this.startMonitoring();
  }

  async selectPrize() {
    this.currentPrize = this.availablePrizes[0];
    this.currentPrize.nameInfo = await this.apiRequest(
      `/api/v1/name/${this.currentPrize.name}`
    );

    // Check if the raffle operator owns this prize
    this.currentPrize.isVerified = await this.verifyPrizeOwnership(
      this.currentPrize
    );
  }

  async verifyPrizeOwnership(prize) {
    try {
      // Check if we have valid name info
      if (!prize.nameInfo || !prize.nameInfo.info) {
        console.log(
          `Prize ${prize.name} has no name info - may not be registered yet`
        );
        return false;
      }

      const owner = prize.nameInfo.info.owner;

      // Check if name has an owner (not null/empty)
      if (
        !owner ||
        owner.hash ===
          "0000000000000000000000000000000000000000000000000000000000000000" ||
        owner.index === 4294967295
      ) {
        console.log(
          `Prize ${prize.name} has no owner - name may be expired or not registered`
        );
        return false;
      }

      // Get the address hash from the owner info
      const ownerAddress = await this.getAddressFromOwner(owner);

      if (!ownerAddress) {
        console.log(`Could not resolve owner address for ${prize.name}`);
        return false;
      }

      // Compare the owner address with raffle address
      const isOwned = ownerAddress === this.lotteryAddress;

      console.log(`Prize ${prize.name} ownership verification:`, {
        ownerHash: owner.hash,
        ownerIndex: owner.index,
        ownerAddress,
        raffleAddress: this.lotteryAddress,
        isOwned,
      });

      return isOwned;
    } catch (error) {
      console.error("Error verifying prize ownership:", error);
      return false;
    }
  }

  async getAddressFromOwner(owner) {
    try {
      // The owner hash in getnameinfo is actually an outpoint reference
      // We need to get the coin/output at that outpoint to find the address
      const coin = await this.apiRequest(
        `/api/v1/coin/${owner.hash}/${owner.index}`
      );
      if (coin && coin.address) {
        return coin.address;
      }

      console.log("No address found for owner:", owner);
      return null;
    } catch (error) {
      console.error("Error getting address from owner:", error);
      return null;
    }
  }

  selectRandomPrize() {
    const randomIndex = Math.floor(Math.random() * this.availablePrizes.length);
    this.currentPrize = this.availablePrizes[randomIndex];
  }

  async apiRequest(endpoint) {
    try {
      const response = await fetch(`${this.nodeUrl}${endpoint}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("API request failed:", error);
      return null;
    }
  }

  async connect() {
    const info = await this.apiRequest("/api/v1/chain");
    if (info) {
      this.blockHeight = info.chain?.height || 0;
      document.getElementById("blockHeight").textContent = this.blockHeight;
      document.getElementById("networkInfo").textContent =
        info.network || "unknown";
      document.getElementById("blockchainInfo").style.display = "block";
      this.updateBalance();
    }
  }

  async checkRaffleStatus() {
    if (this.blockHeight > this.endBlockHeight) {
      // Raffle ended - automatically draw winner if not done yet
      if (!this.winnerDrawn && this.participants.length > 0) {
        await this.drawWinner();
        this.winnerDrawn = true;
      }
    }
  }

  getRaffleState() {
    if (this.blockHeight < this.startBlockHeight) {
      return "waiting"; // Raffle hasn't started
    } else if (this.blockHeight <= this.endBlockHeight) {
      return "active"; // Raffle is running
    } else {
      return "ended"; // Raffle has ended
    }
  }

  getEstimatedTimeRemaining() {
    const state = this.getRaffleState();

    if (state === "ended") {
      return { text: "Raffle Ended" };
    }

    // Active state
    const blocksRemaining = this.endBlockHeight - this.blockHeight;
    const minutesRemaining = blocksRemaining * this.BLOCK_TIME_MINUTES;

    return {
      text: this.formatTimeFromMinutes(minutesRemaining),
    };
  }

  formatTimeFromMinutes(totalMinutes) {
    if (totalMinutes <= 0) return "0m";

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = Math.floor(totalMinutes % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  async updateBalance() {
    const coins = await this.apiRequest(
      `/api/v1/coin/address/${this.lotteryAddress}`
    );
    if (coins && Array.isArray(coins)) {
      const totalBalance = coins.reduce((sum, coin) => sum + coin.value, 0);
      const hnsBalance = (totalBalance / 1000000).toFixed(6);
      document.getElementById("lotteryBalance").textContent = hnsBalance;
    }
  }

  async checkTransactions() {
    const transactions = await this.apiRequest(
      `/api/v1/tx/address/${this.lotteryAddress}`
    );
    if (transactions && Array.isArray(transactions)) {
      this.processTransactions(transactions);
    }
  }

  processTransactions(transactions) {
    transactions.forEach((tx) => {
      if (this.isProcessed(tx.hash)) return;

      // Only process transactions within the raffle period
      if (
        tx.height &&
        (tx.height < this.startBlockHeight || tx.height > this.endBlockHeight)
      ) {
        this.markProcessed(tx.hash);
        return;
      }

      const lotteryOutput = tx.outputs?.find(
        (output) => output.address === this.lotteryAddress
      );

      if (lotteryOutput && tx.inputs?.length > 0) {
        const senderAddress = tx.inputs[0].coin?.address;
        const amount = lotteryOutput.value / 1000000;

        if (senderAddress && amount >= this.entryFee) {
          this.addParticipant({
            address: senderAddress,
            amount: amount,
            entries: Math.floor(amount / this.entryFee),
            timestamp: new Date(tx.mtime * 1000),
            txHash: tx.hash,
            blockHeight: tx.height,
            confirmed: tx.height > 0,
          });
        }
      }

      this.markProcessed(tx.hash);
    });

    this.updateDisplay();
  }

  isProcessed(txHash) {
    return this.processedTx?.includes(txHash) || false;
  }

  markProcessed(txHash) {
    this.processedTx = this.processedTx || [];
    this.processedTx.push(txHash);
  }

  addParticipant(participant) {
    const existingIndex = this.participants.findIndex(
      (p) => p.address === participant.address
    );

    if (existingIndex >= 0) {
      this.participants[existingIndex].amount += participant.amount;
      this.participants[existingIndex].entries += participant.entries;
    } else {
      this.participants.push(participant);
    }
  }

  startMonitoring() {
    // Check every 30 seconds for new blocks and transactions
    this.monitoringInterval = setInterval(async () => {
      await this.connect();
      await this.checkTransactions();
      await this.checkRaffleStatus();
      this.updateDisplay();
    }, 30000);
  }

  updateTimeDisplay() {
    const timeInfo = this.getEstimatedTimeRemaining();
    const timeElement = document.getElementById("timeLeft");
    const state = this.getRaffleState();

    // Create display with time and end block
    const timeDisplay = `${timeInfo.text}<br><small style="font-size: 0.7em; opacity: 0.8;">Block ${this.endBlockHeight}</small>`;

    if (state === "ended") {
      timeElement.innerHTML = timeDisplay;
      timeElement.style.color = "#e74c3c";
    } else if (state === "waiting") {
      timeElement.innerHTML = timeDisplay;
      timeElement.style.color = "#f39c12";
    } else {
      timeElement.innerHTML = timeDisplay;
      timeElement.style.color = "#2ecc71";
    }
  }

  updateRaffleStatus() {
    const state = this.getRaffleState();
    const statusElement = document.getElementById("raffleStatus");
    const statusTextElement = document.getElementById("raffleStatusText");

    // Remove existing status classes
    statusElement.className = "status";

    if (state === "waiting") {
      const blocksRemaining = this.startBlockHeight - this.blockHeight;
      const minutesRemaining = blocksRemaining * this.BLOCK_TIME_MINUTES;

      statusElement.classList.add("info");
      statusTextElement.textContent = `🟡 Raffle starts at block ${
        this.startBlockHeight
      } (${blocksRemaining} blocks to go - ${this.formatTimeFromMinutes(
        minutesRemaining
      )})`;
    } else if (state === "active") {
      statusElement.classList.add("success");
      statusTextElement.textContent = `🟢 Raffle is ACTIVE! Entries accepted until block ${this.endBlockHeight}`;
    } else {
      statusElement.classList.add("error");
      statusTextElement.textContent = `🔴 Raffle ENDED at block ${this.endBlockHeight}`;
    }
  }

  async drawWinner() {
    if (this.participants.length === 0) return;

    // Get the block hash at end height for more entropy
    const blockInfo = await this.apiRequest(
      `/api/v1/block/${this.endBlockHeight}`
    );
    if (!blockInfo || !blockInfo.hash) {
      console.error("Could not get block hash for randomness");
      return;
    }

    // Create weighted array based on entries
    const weightedParticipants = [];
    this.participants.forEach((participant) => {
      for (let i = 0; i < participant.entries; i++) {
        weightedParticipants.push(participant);
      }
    });

    // Use block hash for better entropy
    const hashBytes = this.hexToBytes(blockInfo.hash);
    const randomValue = this.bytesToBigInt(hashBytes);
    const randomIndex = Number(
      randomValue % BigInt(weightedParticipants.length)
    );

    const winner = weightedParticipants[randomIndex];
    this.showWinner(winner);
  }

  showWinner(winner) {
    document.getElementById("winnerSection").style.display = "block";
    document.getElementById("winnerPrize").textContent =
      this.currentPrize.display;
    document.getElementById("winnerPrize").href = this.currentPrize.url;
    document.getElementById("winnerAddress").textContent = winner.address;
    document.getElementById(
      "winnerPrizeText"
    ).textContent = `${this.currentPrize.name} (${this.currentPrize.type})`;

    if (winner.txHash) {
      document.getElementById("winnerTxHash").style.display = "block";
      document.getElementById(
        "winnerTxHash"
      ).textContent = `Entry Transaction: ${winner.txHash}`;
      document.getElementById(
        "winnerTxHash"
      ).href = `https://shakeshift.com/transaction/${winner.txHash}`;
    }

    document.getElementById("winnerSection").scrollIntoView({
      behavior: "smooth",
    });
  }

  updateDisplay() {
    // Update prize info with verification status
    const prizeElement = document.getElementById("currentPrize");
    prizeElement.textContent = this.currentPrize.display;
    prizeElement.href = this.currentPrize.url;

    document.getElementById("currentPrize").innerHTML =
      this.currentPrize.display;

    document.getElementById("prizeType").textContent = this.currentPrize.type;

    // Show verification status in prize type as well
    const verificationText = this.currentPrize.isVerified
      ? " (Verified Owner ✅)"
      : " (Unverified ❌)";
    document.getElementById("prizeType").textContent =
      this.currentPrize.type + verificationText;

    document.getElementById("lotteryAddress").textContent = this.lotteryAddress;
    document.getElementById("entryFee").textContent = this.entryFee.toString();

    // Update stats
    document.getElementById("totalParticipants").textContent =
      this.participants.length;
    document.getElementById("participantCount").textContent =
      this.participants.length;

    const totalPool = this.participants.reduce((sum, p) => sum + p.amount, 0);
    document.getElementById("totalPool").textContent = totalPool.toFixed(1);

    // Update time display
    this.updateTimeDisplay();

    // Update raffle status
    this.updateRaffleStatus();

    this.updateParticipantList();
  }

  updateParticipantList() {
    const listElement = document.getElementById("participantList");

    if (this.participants.length === 0) {
      listElement.innerHTML =
        '<p style="text-align: center; opacity: 0.7;">No participants yet. Send some HNS to the raffle address to enter!</p>';
      return;
    }

    listElement.innerHTML = this.participants
      .sort((a, b) => b.amount - a.amount)
      .map((participant) => {
        const status = participant.confirmed ? "✅" : "⏳";
        return `
          <div class="participant-item">
            <span>${participant.address.substring(0, 20)}... ${status}</span>
            <span>${participant.amount} HNS (${
          participant.entries
        } entries)</span>
          </div>
        `;
      })
      .join("");
  }

  // Helper functions for hash manipulation
  hexToBytes(hex) {
    // Remove '0x' prefix if present
    hex = hex.replace(/^0x/, "");
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
  }

  bytesToBigInt(bytes) {
    let result = BigInt(0);
    for (let byte of bytes) {
      result = (result << BigInt(8)) + BigInt(byte);
    }
    return result;
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  new HandshakeLottery();
});
