const axios = require('axios');


let priceHistory = [];
let lastPrice = null;

const fetchCurrentPrice = async () => {
  try {
    const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
    return response.data.bpi.USD.rate_float;
  } catch (error) {
    console.error('Error fetching price:', error);
  }
};

// green or red 
const printPriceWithChange = (currentPrice) => {
  if (lastPrice === null) {
    console.log(`Current Price: ${currentPrice.toFixed(2)} USD (No change)`);
  } else {
    const priceChange = currentPrice - lastPrice;

    if (priceChange > 0) {
      // Green when price increase
      console.log(`\x1b[32mCurrent Price: ${currentPrice.toFixed(2)} USD (Increase of ${priceChange.toFixed(2)} USD)\x1b[0m`);
    } else if (priceChange < 0) {
      // Red when price decrease
      console.log(`\x1b[31mCurrent Price: ${currentPrice.toFixed(2)} USD (Decrease of ${Math.abs(priceChange).toFixed(2)} USD)\x1b[0m`);
    } else {
      console.log(`Current Price: ${currentPrice.toFixed(2)} USD (No change)`);
    }
  }
};

const printRollingAverage = () => {
  if (priceHistory.length < 10) {
    console.log(`Wait to calculate the average`);
    return;
  }

  const sum = priceHistory.reduce((acc, price) => acc + price, 0);
  const average = sum / priceHistory.length;

  console.log(`Rolling Average (based on all ${priceHistory.length} prices): ${average.toFixed(2)} USD`);
};

const updatePriceHistory = (price) => {
  priceHistory.push(price); 
};

const startPriceTracker = async () => {
  setInterval(async () => {
    const price = await fetchCurrentPrice();
    if (price) {
      console.clear(); // every 3 seconds
      printPriceWithChange(price);
      updatePriceHistory(price);
      printRollingAverage();

      lastPrice = price;
    }
  }, 3000);
};

startPriceTracker();
