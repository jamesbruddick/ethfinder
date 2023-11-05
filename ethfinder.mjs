import 'dotenv/config';
import { promises as fs } from 'fs';
import Wallet from 'ethereumjs-wallet';
import { Web3 } from 'web3';
import bip39 from 'bip39';
import yargs from 'yargs';

async function ethFinderAddresses(ethAddressesFile, ethBlockStart = 0, ethBlockRequests = 10000) {
	const web3 = new Web3(process.env.WEB3_URL);
	let ethAddresses = new Set(); let web3Requests = 0;
	try {
		await fs.readFile(ethAddressesFile, 'utf-8').then(data => { ethAddresses = new Set(JSON.parse(data)); }).catch(error => { if (error.code !== 'ENOENT') console.error(error); });
		for (let ethBlock = ethBlockStart; ethBlock <= ethBlockStart + ethBlockRequests; ethBlock++) {
			let block = await web3.eth.getBlock(ethBlock); web3Requests++;
			process.stdout.write(`\u001b[?25l\u001b[2K[ethFinder][${ethAddresses.size.toString().padStart(9, '0')}]: block ${ethBlock.toString().padStart(9, '0')} | transaction 0000/0000 | requests ${web3Requests.toString().padStart(6, '0')}\r`);
			if (block.transactions && block.transactions.length !== 0) {
				for(let transactionNum = 0; transactionNum < block.transactions.length; transactionNum++) {
					let transaction = await web3.eth.getTransaction(block.transactions[transactionNum]); web3Requests++;
					if (transaction.to && parseInt(transaction.value) !== 0 && !ethAddresses.has(transaction.to)) {
						await web3.eth.getCode(transaction.to) === '0x' && ethAddresses.add(transaction.to); web3Requests++;
					}
					process.stdout.write(`\u001b[?25l\u001b[2K[ethFinder][${ethAddresses.size.toString().padStart(9, '0')}]: block ${ethBlock.toString().padStart(9, '0')} | transaction ${(transactionNum + 1).toString().padStart(4, '0')}/${block.transactions.length.toString().padStart(4, '0')} | requests ${web3Requests.toString().padStart(6, '0')}\r`);
				}
			}
		}
	} catch (error) {
		process.stdout.write('\n\u001b[?25h');
		console.error(error);
	}
	await fs.writeFile(ethAddressesFile, JSON.stringify(Array.from(ethAddresses))).catch(error => console.error(error));
	process.stdout.write('\n\u001b[?25h');
}

async function ethFinder(ethAddressesFile) {
	try {
		let ethAddresses = new Set(JSON.parse(await fs.readFile(ethAddressesFile, 'utf-8')));
		let addressesSearched = 0; let startTime = Date.now();
		process.stdout.write(`\u001b[?25l\u001b[2K[ethFinder][${ethAddresses.size.toString().padStart(9, '0')}]: Searching...\n`);
		while (true) {
			const ethWallet = Wallet['default'].generate();
			const ethAddress = ethWallet.getChecksumAddressString();
			const ethPrivateKey = ethWallet.getPrivateKeyString();
			if (ethAddresses.has(ethAddress)) {
				console.log(`\u001b[?25l\u001b[2K[ethFinder]: ${ethAddress} | ${ethPrivateKey}`);
				await fs.writeFile(`${ethAddress}.json`, JSON.stringify({ address: ethAddress, privatekey: ethPrivateKey }, null, 2)).catch(error => console.error(error));
				break;
			}
			let elapsedTime = (Date.now() - startTime) / 1000;
			process.stdout.write(`\u001b[?25l\u001b[2K[ethFinder][${ethAddresses.size.toString().padStart(9, '0')}]: ${ethAddress} | ${addressesSearched.toString().padStart(10, '0')} | ${Math.round(addressesSearched / elapsedTime)}/s\r`);
			addressesSearched++;
		}
	} catch (error) {
		process.stdout.write('\n\u001b[?25h');
		console.error(error);
	}
	process.stdout.write('\u001b[?25h');
};

async function ethFinderRegex(ethAddressRegex) {
	console.log(`\u001b[?25l\u001b[2K[ethFinder]: Searching... (${ethAddressRegex})`);
	let addressesSearched = 0; let startTime = Date.now();
	try {
		while (true) {
			const ethMnemonic = bip39.generateMnemonic(256);
			const ethWallet = Wallet.hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(ethMnemonic)).derivePath("m/44'/60'/0'/0/0").getWallet();
			const ethAddress = ethWallet.getChecksumAddressString();
			const ethPrivateKey = ethWallet.getPrivateKeyString();
			if (new RegExp(ethAddressRegex).test(ethAddress)) {
				console.log(`\u001b[?25l\u001b[2K[ethFinder]: ${ethAddress}`);
				await fs.writeFile(`${ethAddress}.json`, JSON.stringify({ address: ethAddress, privatekey: ethPrivateKey, mnemonic: ethMnemonic }, null, 2)).catch(error => console.error(error));
				break;
			}
			let elapsedTime = (Date.now() - startTime) / 1000;
			process.stdout.write(`\u001b[?25l\u001b[2K[ethFinder]: ${ethAddress} | ${addressesSearched.toString().padStart(10, '0')} | ${Math.round(addressesSearched / elapsedTime)}/s\r`);
			addressesSearched++;
		}
	} catch (error) {
		process.stdout.write('\n\u001b[?25h');
		console.error(error);
	}
	process.stdout.write('\u001b[?25h');
};

const argv = yargs(process.argv.slice(2))
	.option('file', {
		alias: 'f',
		description: 'JSON File with Ethereum Addresses',
		type: 'string'
	})
	.option('block', {
		alias: 'b',
		description: 'Start Block for Searching Ethereum Addresses',
		type: 'number'
	})
	.option('regex', {
		alias: 'r',
		description: 'Search Ethereum Addresses with Regex',
		type: 'string'
	})
	.parseSync();

if (argv.file && argv.block) { ethFinderAddresses(argv.file, argv.block); } else if (argv.file) { ethFinder(argv.file); }
if (argv.regex) { ethFinderRegex(argv.regex) }

process.on('SIGINT', () => { process.stdout.write('\n\u001b[?25h'); process.exit(); });
process.on('SIGTSTP', () => { process.stdout.write('\n\u001b[?25h'); process.exit(); });

// ethFinderAddresses('ethaddresses.json');
// ethFinder('ethaddresses.json');
// ethFinderRegex('^0x[a-zA-Z0-9]+$');