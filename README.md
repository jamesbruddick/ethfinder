# ethfinder

ethfinder is a command-line tool written in JavaScript for searching Ethereum addresses. It utilizes the Ethereum blockchain and various libraries to find specific addresses or discover new ones.

## Installation

To use ethfinder, you need to have Node.js installed on your machine. You can download and install Node.js from the official website: [https://nodejs.org](https://nodejs.org)

1. Clone the ethfinder repository from GitHub:

```bash
git clone https://github.com/JamesTGH/ethfinder.git
```

2. Navigate to the project directory:

```bash
cd ethfinder
```

3. Install the required dependencies:

```bash
npm install
```

## Usage

The ethfinder tool provides several options to search for Ethereum addresses. You can specify these options through command-line arguments.

### Search for Ethereum Addresses from Start Block to Append to JSON File

To search for Ethereum addresses from start block and append to JSON file, use the following command:

```bash
node ethfinder.js --file <file_path> --block <start_block>
```

Replace `<file_path>` with the path to your JSON file containing Ethereum addresses, and `<start_block>` with the block number from which to start the search.

### Search for Ethereum Addresses Private Keys from JSON File

To search for Ethereum addresses private keys from a JSON file, use the following command:

```bash
node ethfinder.js --file <file_path>
```

Replace `<file_path>` with the path to your JSON file containing Ethereum addresses.

### Search for Ethereum Addresses with Regular Expression

To search for Ethereum addresses using a regular expression pattern, use the following command:

```bash
node ethfinder.js --regex <regex_pattern>
```

Replace `<regex_pattern>` with your desired regular expression pattern to match against Ethereum addresses.

## Examples

Here are a few examples to demonstrate the usage of ethfinder:

1. Search for Ethereum Addresses from start block and append them to a JSON file:

```bash
node ethfinder.js --file ethaddresses.json --block 0
```

This command will search for Ethereum addresses and store them in `ethaddresses.json` starting from block number 0.

2. Search for Ethereum addresses private keys from a JSON file:

```bash
node ethfinder.js --file ethaddresses.json
```

This command will search for Ethereum addresses private keys for each address in the `ethaddresses.json` file.

3. Search for Ethereum addresses using a regular expression pattern:

```bash
node ethfinder.js --regex "^0x[a-zA-Z0-9]+$"
```

This command will search for Ethereum addresses that match the regular expression pattern `^0x[a-zA-Z0-9]+$`.

## Notes

- The `dotenv/config` package is used to load environment variables from a `.env` file in the project directory. Make sure to create a `.env` file and set the `WEB3_URL` variable to your desired Ethereum node URL.
- The `ethFinderAddresses` function searches for Ethereum addresses by iterating over blocks within a specified range and saves the discovered addresses to a JSON file.
- The `ethFinder` function generates random Ethereum addresses until a match is found with the addresses in the provided file. It saves the matched address and its private key to a JSON file.
- The `ethFinderRegex` function generates random Ethereum addresses until a match is found with the provided regular expression pattern. It saves the matched address, private key, and mnemonic to a JSON file.
