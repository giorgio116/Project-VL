const ethers = require('ethers');


var privateKey = 'insert private key for wallet'; 
const provider = new ethers.providers.WebSocketProvider('insert socket address');
var wallet = new ethers.Wallet(privateKey);
const account = wallet.connect(provider);

const addresses = {
    ETH: 'insert ETH address',
    factory: 'insert factory address',
    router: 'insert router address', 
    recipient: wallet.address
};


//input parameters
const inputam = 0.1; //amount of tokens to swap
const slippage = 90; //slipage (in %)
const inputamount = inputam.toString(); //create an input for this in html
const amountIn = ethers.utils.parseUnits(inputamount, 'ether'); //amount of ETH to swap
tokenIn = addresses.ETH;
tokenOut = 'insert address of tokenOut'; 
const mygasPrice = ethers.utils.parseUnits('5', 'gwei');
const mygasLimit = 200000;


//define contract functions
const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account
);


//Now the actual swap function
async function asyncCall() {
  try {
    //trying to get amount of tokens we get, for amountIn ONE
    console.log('Starting the swap.');
    const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    console.log(`
      Swap price:
      =================
      amount of tokenIn: ${amounts[0].toString()}
      amount of tokenOut: ${amounts[1].toString()}
    `);

    //buy the new token
    //Our execution price will be a bit different, we need some flexbility
    const amountOutMin = (amounts[1].mul(100-slippage)).div(100);
    console.log(`
      Buying new token
      =================
      tokenIn: ${amountIn.toString()} ${tokenIn} (ONE)
      slippage used: ${slippage} %
      minimumTokenOut: ${amountOutMin.toString()} ${tokenOut}
    `);
    const tx = await router.swapExactETHForTokens(
        amountOutMin,
        [tokenIn, tokenOut],
        addresses.recipient,
        Math.floor(Date.now() / 1000) + 60 * 3, //3 minutes
        {
          gasPrice: mygasPrice,
          //gasLimit: mygasLimit,
          value: ethers.utils.parseUnits(inputamount, 'ether')
        }
    );
    console.log('Sent transaction, now waiting for receipt.');
    const receipt = await tx.wait(); 
    console.log('Transaction receipt');
    console.log(receipt);
    console.log('Ending the swap.');
    return process.exit(1);
    } catch(e) {
    console.log(e);
  }
};

asyncCall();