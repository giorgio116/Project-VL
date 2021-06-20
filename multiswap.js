const ethers = require('ethers');

const addresses = {
  factory: 'insert factory address', 
  router: 'insert router address',
}

//connecting to the blockchain using websocket
const provider = new ethers.providers.WebSocketProvider('insert socket address');

//adding 5 wallets
var privateKey1 = 'insert private key for address 1';
var privateKey2 = 'insert private key for address 2';
var privateKey3 = 'insert private key for address 3';
var privateKey4 = 'insert private key for address 4';
var privateKey5 = 'insert private key for address 5';
var wallet1 = new ethers.Wallet(privateKey1);
var wallet2 = new ethers.Wallet(privateKey2);
var wallet3 = new ethers.Wallet(privateKey3);
var wallet4 = new ethers.Wallet(privateKey4);
var wallet5 = new ethers.Wallet(privateKey5);
const account1 = wallet1.connect(provider);
const account2 = wallet2.connect(provider);
const account3 = wallet3.connect(provider);
const account4 = wallet4.connect(provider);
const account5 = wallet5.connect(provider);


//inserting some parameters
const inputam = 0.01;
const slippage = 90; //slipage (in %)
const inputamount = inputam.toString(); //create an input for this in html
const amountIn = ethers.utils.parseUnits(inputamount, 'ether'); //amount of ONE to swap
tokenIn = addresses.ONE; //ONE address
tokenOut = '0x8D4F19bec883Ba20F4f295706C53F760Cd0BC2B0'; //viper on viperswap
const mygasPrice = ethers.utils.parseUnits('1', 'gwei');
const mygasLimit = 300000

console.log(`
    List of addresses:
    =================
    Address private1: ${wallet1.address}
    Address private2: ${wallet2.address}
    Address private3: ${wallet3.address}
    Address private4: ${wallet4.address}
    Address private5: ${wallet5.address}
`);

//import contract functions
const router1 = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account1
);
//for wallet2  
const router2 = new ethers.Contract(
    addresses.router,
    [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
    ],
    account2
);
//for wallet3 
const router3 = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account3
);
//for wallet4
const router4 = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account4
);
//for wallet5
const router5 = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account5
);


//Now the actual swap function
async function swap() {
  try {
    //trying to get amount of tokens we get, for amountIn (only once necessary )
    console.log('Starting the swap.');
    const amounts = await router1.getAmountsOut(amountIn, [tokenIn, tokenOut]);
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
    //transactions for different wallets
    const tx1 = await router1.swapExactETHForTokens(
      amountOutMin,
      [tokenIn, tokenOut],
      wallet1.address,
      Math.floor(Date.now() / 1000) + 60 * 3, //3 minutes
      {
        gasPrice: mygasPrice,
        //gasLimit: mygasLimit,
        value: ethers.utils.parseUnits(inputamount, 'ether')
      }
    );
    console.log('Sent transaction 1');
    const tx2 = await router2.swapExactETHForTokens(
        amountOutMin,
        [tokenIn, tokenOut],
        wallet2.address,
        Math.floor(Date.now() / 1000) + 60 * 3, //3 minutes
        {
          gasPrice: mygasPrice,
          //gasLimit: mygasLimit,
          value: ethers.utils.parseUnits(inputamount, 'ether')
        }
    );
    console.log('Sent transaction 2');
    const tx3 = await router3.swapExactETHForTokens(
        amountOutMin,
        [tokenIn, tokenOut],
        wallet3.address,
        Math.floor(Date.now() / 1000) + 60 * 3, //3 minutes
        {
          gasPrice: mygasPrice,
          //gasLimit: mygasLimit,
          value: ethers.utils.parseUnits(inputamount, 'ether')
        }
    );
    console.log('Sent transaction 3');
    const tx4 = await router4.swapExactETHForTokens(
      amountOutMin,
      [tokenIn, tokenOut],
      wallet4.address,
      Math.floor(Date.now() / 1000) + 60 * 3, //3 minutes
      {
        gasPrice: mygasPrice,
        //gasLimit: mygasLimit,
        value: ethers.utils.parseUnits(inputamount, 'ether')
      }
    );
    console.log('Sent transaction 4');
    const tx5 = await router5.swapExactETHForTokens(
      amountOutMin,
      [tokenIn, tokenOut],
      wallet5.address,
      Math.floor(Date.now() / 1000) + 60 * 3, //3 minutes
      {
        gasPrice: mygasPrice,
        //gasLimit: mygasLimit,
        value: ethers.utils.parseUnits(inputamount, 'ether')
      }
    );
    console.log('Sent transaction 5');
    console.log(`
      =================
      Waiting for receipt of transaction 5
    `);
    const receipt5 = await tx5.wait(); 
    console.log('Transaction receipt');
    console.log(receipt5);
    console.log('Ending the swap.');
    return process.exit(1);
  } catch(e) {
    console.log(e);
  }
}

swap();
