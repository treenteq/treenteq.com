# Treenteq: A data liquidity platform

Treenteq is a decentralized platform that allows users to tokenize and monetize datasets, enabling secure and transparent data transactions. The platform leverages blockchain technology to create a marketplace where data owners can mint ERC-1155 tokens as proof of ownership for their datasets, and buyers can purchase access to these datasets in a trustless and decentralized manner.

## Key Features

### 1. Tokenization of Datasets

-   Data providers can tokenize their datasets by minting ERC-1155 tokens.
-   Each token represents proof of ownership and access rights to the dataset.

### 2. Decentralized Transactions

-   Buyers can purchase datasets by paying the price specified by the owner during token minting.
-   Payments are transferred to the token holder, ensuring secure and trustless transactions.

### 3. Data Validation

-   An Excel file validator ensures the quality and validity of datasets before tokenization.
-   The validator performs column-based type analysis to check for data integrity.

### 4. Proof of Ownership

-   The platform generates a unique content hash for each dataset, ensuring that ownership and authenticity can be verified at any time.

---

## Tech Stack

### Frontend

-   **Next.js**: Framework for server-side rendering and optimized React applications.
-   **TypeScript**: Ensures type safety and improved developer experience.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **React**: Component-based UI development.

### Backend

-   **Next.js**: Framework for server-side rendering.

### Blockchain

-   **ERC-1155**: Token standard for multi-token support.
-   **Viem**: Library for interacting with the Ethereum blockchain.
-   **Privy**: Wallet authentication and embedded wallet support.

### Additional Tools

-   **Excel Validator**: Custom-built component for validating Excel datasets before tokenization.

---

## Installation

### Prerequisites

-   Node.js (>= 16.x)
-   pnpm or yarn or npm
-   MetaMask Wallet

### Clone the Repository

```bash
git clone https://github.com/treenteq/treenteq.com.git
cd treenteq.com
```

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PRIVY_APP_ID = your_privy_app_id
NEXT_PUBLIC_PINATA_API_KEY = your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY =
PINATA_JWT = your_pinata_secret_key
NEXT_PUBLIC_CONTRACT_OWNER_PRIVATE_KEY = your_private_key
```

### Run the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Usage

### Tokenizing a Dataset

1. Log in with your MetaMask wallet.
2. Upload your dataset in Excel format via the **Excel Validator**.
3. If validation is successful, proceed to mint an ERC-1155 token.
4. Specify the price for accessing the dataset.

### Purchasing a Dataset

1. Browse available datasets on the marketplace.
2. Select a dataset and pay the specified amount using your connected wallet.
3. Access the dataset once the transaction is confirmed.

### Minting Process Overview

-   The dataset is validated for quality.
-   A content hash is generated using `keccak256`.
-   An ERC-1155 token is minted with metadata, including the content hash.

---

## Contributing

### Reporting Issues

If you find any bugs or have feature requests, please open an issue in the [GitHub repository](https://github.com/treenteq/treenteq.com/issues).

### Pull Requests

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes and push to your fork.
4. Open a pull request against the `main` branch.

---

## Roadmap

### Phase 1: Core Functionality

-   Dataset tokenization and marketplace features.
-   Integration of dataset validation and hashing.

### Phase 2: Advanced Features

-   Enable Fiat-to-Cypto Transaction using a web3 paywall
-   Enhanced search and filtering for datasets.

### Phase 3: Community Growth

-   Incentivize dataset providers with rewards.
-   Build partnerships with data providers and enterprises.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
