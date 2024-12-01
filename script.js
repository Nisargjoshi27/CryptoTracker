const apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
const currency = "usd";
const localStorageKey = "selectedCryptos";
let selectedCryptos = JSON.parse(localStorage.getItem(localStorageKey)) || [];
const maxComparisons = 5;

// Toggle theme function
const toggleTheme = () => {
    const themeValue = document.getElementById("theme-toggle").value;
    if (themeValue == 'dark') {
        
        document.body.classList.add("dark-mode");
    } else if(themeValue == 'light'){
        document.body.classList.remove("dark-mode");
        
    }
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
};

// Toggle font size function
const toggleFontSize = () => {
  document.body.classList.toggle("large-font");
  localStorage.setItem("font-size", document.body.classList.contains("large-font") ? "large" : "normal");
};

// Load saved theme and font size from local storage
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const savedFontSize = localStorage.getItem("font-size");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").value = "dark"
}
if (savedFontSize === "large") {
    document.body.classList.add("large-font");
    document.getElementById("theme-toggle").value = "light"
  }
});

document.getElementById("theme-toggle").addEventListener("change", toggleTheme);
document.getElementById("font-size-toggle").addEventListener("change", toggleFontSize);

const fetchCryptos = async (sort = "market_cap_desc") => {
  try {
    const response = await fetch(
      `${apiUrl}?vs_currency=${currency}&order=${sort}&per_page=20&page=1`
    );
    const data = await response.json();
    displayCryptos(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const displayCryptos = (cryptos) => {
  const container = document.getElementById("crypto-container");
  container.innerHTML = "";

  cryptos.forEach((crypto) => {
    const div = document.createElement("div");
    div.className = "crypto-box";

    div.innerHTML = `
      <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
      <p>Price (USD): $${crypto.current_price.toFixed(2)}</p>
      <p>24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
      <p>Market Cap (USD): ${crypto.market_cap.toLocaleString()}</p>
      <button onclick="addToComparison('${crypto.id}', '${crypto.name}', '${crypto.current_price}')">Compare</button>
    `;

    container.appendChild(div);
  });
};

const addToComparison = (id, name, price) => {
  if (selectedCryptos.length >= maxComparisons) {
    alert("You can only compare up to 5 cryptocurrencies.");
    return;
  }

  if (selectedCryptos.some((crypto) => crypto.id === id)) {
    alert("This cryptocurrency is already in the comparison.");
    return;
  }

  selectedCryptos.push({ id, name, price });
  localStorage.setItem(localStorageKey, JSON.stringify(selectedCryptos));
  displayComparison();
};

const removeComparison = (id) => {
  selectedCryptos = selectedCryptos.filter((crypto) => crypto.id !== id);
  localStorage.setItem(localStorageKey, JSON.stringify(selectedCryptos));
  displayComparison();
};

const displayComparison = () => {
  const container = document.getElementById("comparison-container");
  container.innerHTML = "";

  selectedCryptos.forEach((crypto) => {
    const div = document.createElement("div");
    div.className = "comparison-item";

    div.innerHTML = `
      <h3>${crypto.name}</h3>
      <p>Price: $${crypto.price}</p>
      <button onclick="removeComparison('${crypto.id}')">Remove</button>
    `;

    container.appendChild(div);
  });
};

document.getElementById("sort-options").addEventListener("change", (event) => {
  const sortValue = event.target.value;
  fetchCryptos(sortValue);
});

fetchCryptos();
displayComparison();
