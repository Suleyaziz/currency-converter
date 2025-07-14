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

//when page loads...
window.addEventListener(`DOMContentLoaded`, initApp)

function initApp(){
    baseInput.addEventListener('input', convertCurrency);//listens for input and run conert Currency after
    swapBtn.addEventListener('click', swapCurrencies);// listens for click then run swap Currencies function
    baseCurrencyBtn.addEventListener('click',()=> showCurrencyMenu(true));//displays other currencies 
    targetCurrencyBtn.addEventListener('click', ()=> showCurrencyMenu(false));//display other currencies
fetchRates();// gets rates
};
function fetchRates(){
    fetch(`${API_URL}${baseCurrency}`).then(response=>response.json()).then(data=>{ //gets excjange rate for diplayed target currency
        rates=data.conversion_rates;// assings rates empty obj some values
        updateDisplay();//cb
    })
}
function convertCurrency(){
    const amount = parseFloat(baseInput.value);//value inputted. parseFloat changes string to number
    const covertAmt=(amount * rates[targetCurrency]).toFixed(4);//multiplies by rate of conversion target currency
    targetInput.value = covertAmt;// updates target value
}
//update display to new currencies
function updateDisplay(){
    baseCurrencyBtn.textContent= baseCurrency;//update base cuurency
    targetCurrencyBtn.textContent=targetCurrency;// updates taget currency
    const rate = rates[targetCurrency];// specifically target currency rate
    exchangeRateSpan.textContent = `1${baseCurrency} = ${rate}${targetCurrency}`// shows what you get after coverting 
     if(baseInput.value){  convertCurrency()};// if base input has any value, convert it
}
//swap currencies
function swapCurrencies(){
    [baseCurrency, targetCurrency] = [targetCurrency, baseCurrency];//swaps the two
    fetchRates();//fetches rates
}
//show currencyMenu
function showCurrencyMenu(isBaseCurrency) {
    // Remove existing menu if any
    const oldMenu = document.querySelector('.currency-menu');
    if (oldMenu) oldMenu.remove();
   //create a new menu for displaying other currencies
    const menu = document.createElement('div');
    menu.className = 'currency-menu';
    menu.style.position = 'absolute';
    menu.style.background = '#4A6BFF';
    menu.style.border = '1px solid #4A6BFF';
    menu.style.borderRadius = '4px';
    menu.style.padding = '8px';
 // for each currency
    currencies.forEach(currency => {
        if (currency === (isBaseCurrency ? baseCurrency : targetCurrency)) return; //skip current currency
        //create new div for each currency
        const option = document.createElement('div');
        option.style.color = 'white';
        option.textContent = currency;
        option.style.padding = '4px 8px';
        option.style.cursor = 'pointer';
        //if you click a currency
        option.addEventListener('click', () => {
            if (isBaseCurrency) {// checks which menu clicked
                baseCurrency = currency;// for base currency, return selected currenct
            } else {
                targetCurrency = currency;//if target Currency is selected
            }
            document.body.removeChild(menu);//removes the menu once done
            fetchRates();// fetches rates
        });
        
        menu.appendChild(option);// updates DOM
    });

    // Position menu below button. Intially, menu shows up in the middle of the page
    const button = isBaseCurrency ? baseCurrencyBtn : targetCurrencyBtn;
    const rect = button.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    
    document.body.appendChild(menu);//updates DOM
}