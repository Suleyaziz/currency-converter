//get all DOM elements
const baseCurrencyBtn= document.getElementById('base');
const targetCurrencyBtn = document.getElementById('target');
const baseInput = document.getElementById('base-input');
const targetInput = document.getElementById('target-input');
const swapBtn = document.getElementById('swap-btn');
const exchangeRateSpan = document.getElementById('exchange-rate');
//storing currencies 
let currencies = [  'KES', 'USD', 'EUR', 'GBP', 'JPY', // Kenya + majors
    'AUD', 'CAD', 'CHF', 'CNY', // Other majors
    'ZAR', 'NGN', 'GHS', 'EGP', // African currencies
    'AED', 'SAR', // Middle East
    'INR', 'PKR', // South Asia
    'SGD', 'MYR', // Southeast Asia
    'BRL', 'MXN', // Latin America
    'RUB', 'TRY', // Europe/Asia
    ];
let rates={};
let baseCurrency= 'KES';//base currency
let targetCurrency = 'USD';//convert 


//for the API
const API_KEY= "5c7495fb2330754fb722bdc6";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;//our exchange rate API

//when page loads...(event listener 1)
window.addEventListener(`DOMContentLoaded`, initApp)

function initApp(){
    baseInput.addEventListener('input', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    baseCurrencyBtn.addEventListener('click',()=> showCurrencyMenu(true));//displays other currencies 
    targetCurrencyBtn.addEventListener('click', ()=> showCurrencyMenu(false));
fetchRates();
};
function fetchRates(){
    fetch(`${API_URL}${baseCurrency}`).then(response=>response.json()).then(data=>{
        rates=data.conversion_rates;
        updateDisplay();//cb
    })
}
function convertCurrency(){
    const amount = parseFloat(baseInput.value);//value inputted
    const covertAmt=(amount * rates[targetCurrency]).toFixed(4);//multiplqies by rate of target currency
    targetInput.value = covertAmt;// updates target value
}
//update display to new currencies
function updateDisplay(){
    baseCurrencyBtn.textContent= baseCurrency;
    targetCurrencyBtn.textContent=targetCurrency;
    const rate = rates[targetCurrency];
    exchangeRateSpan.textContent = `1${baseCurrency} = ${rate}${targetCurrency}`// shows what you get after coverting 
     if(baseInput.value){  convertCurrency()};
}
//swap currencies
function swapCurrencies(){
    [baseCurrency, targetCurrency] = [targetCurrency, baseCurrency];//swaps the two
    fetchRates();
}
//show currencyMenu
function showCurrencyMenu(isBaseCurrency) {
    // Remove existing menu if any
    const oldMenu = document.querySelector('.currency-menu');
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'currency-menu';
    menu.style.position = 'absolute';
    menu.style.background = 'white';
    menu.style.border = '1px solid #ddd';
    menu.style.borderRadius = '4px';
    menu.style.padding = '8px';
    menu.style.zIndex = '100';

    currencies.forEach(currency => {
        if (currency === (isBaseCurrency ? baseCurrency : targetCurrency)) return; // fixed: skip current currency
        
        const option = document.createElement('div');
        option.textContent = currency;
        option.style.padding = '4px 8px';
        option.style.cursor = 'pointer';
        
        option.addEventListener('click', () => {
            if (isBaseCurrency) {
                baseCurrency = currency;
            } else {
                targetCurrency = currency;
            }
            document.body.removeChild(menu);
            fetchRates();
        });
        
        menu.appendChild(option);
    });

    // Position menu below button
    const button = isBaseCurrency ? baseCurrencyBtn : targetCurrencyBtn;
    const rect = button.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    
    document.body.appendChild(menu);
}