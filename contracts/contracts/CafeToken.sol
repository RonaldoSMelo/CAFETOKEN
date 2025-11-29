// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CafeToken
 * @dev NFT contract for tokenized coffee microlots with physical backing
 * @notice Each token represents a real, certified coffee microlot stored in a warehouse
 */
contract CafeToken is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    
    // ============ State Variables ============
    
    uint256 private _tokenIdCounter;
    uint256 public mintFee = 0.01 ether;
    uint256 public marketplaceFee = 300; // 3% in basis points (300/10000)
    
    // ============ Structs ============
    
    struct CoffeeLot {
        string lotCode;
        address producer;
        uint256 weightKg;
        uint256 scaScore;
        uint256 harvestTimestamp;
        string qualityReportHash;
        bool redeemed;
        uint256 mintedAt;
    }
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
    
    // ============ Mappings ============
    
    mapping(uint256 => CoffeeLot) public coffeeLots;
    mapping(uint256 => Listing) public listings;
    mapping(string => bool) public lotCodeExists;
    mapping(address => bool) public verifiedProducers;
    
    // ============ Events ============
    
    event CoffeeMinted(
        uint256 indexed tokenId,
        string lotCode,
        address indexed producer,
        uint256 weightKg,
        uint256 scaScore,
        string tokenURI
    );
    
    event CoffeeListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    
    event ListingCancelled(
        uint256 indexed tokenId,
        address indexed seller
    );
    
    event CoffeeSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    
    event CoffeeRedeemed(
        uint256 indexed tokenId,
        address indexed redeemer,
        string lotCode
    );
    
    event ProducerVerified(address indexed producer, bool status);
    
    event MintFeeUpdated(uint256 oldFee, uint256 newFee);
    
    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // ============ Modifiers ============
    
    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _;
    }
    
    modifier tokenExists(uint256 tokenId) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _;
    }
    
    modifier notRedeemed(uint256 tokenId) {
        require(!coffeeLots[tokenId].redeemed, "Coffee already redeemed");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() ERC721("CafeToken", "CAFE") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }
    
    // ============ Minting Functions ============
    
    /**
     * @dev Mint a new coffee NFT
     * @param _tokenURI IPFS URI containing the metadata
     * @param _lotCode Unique identifier for the coffee lot
     * @param _weightKg Weight of the lot in kilograms
     * @param _scaScore SCA cupping score (0-100, stored as 8000-10000 for 80.00-100.00)
     * @param _harvestTimestamp Unix timestamp of harvest date
     * @param _qualityReportHash IPFS hash of the quality report
     */
    function mintCoffeeLot(
        string memory _tokenURI,
        string memory _lotCode,
        uint256 _weightKg,
        uint256 _scaScore,
        uint256 _harvestTimestamp,
        string memory _qualityReportHash
    ) external payable returns (uint256) {
        require(msg.value >= mintFee, "Insufficient mint fee");
        require(bytes(_lotCode).length > 0, "Lot code required");
        require(!lotCodeExists[_lotCode], "Lot code already exists");
        require(_weightKg > 0, "Weight must be positive");
        require(_scaScore >= 8000 && _scaScore <= 10000, "Invalid SCA score");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        coffeeLots[tokenId] = CoffeeLot({
            lotCode: _lotCode,
            producer: msg.sender,
            weightKg: _weightKg,
            scaScore: _scaScore,
            harvestTimestamp: _harvestTimestamp,
            qualityReportHash: _qualityReportHash,
            redeemed: false,
            mintedAt: block.timestamp
        });
        
        lotCodeExists[_lotCode] = true;
        
        emit CoffeeMinted(
            tokenId,
            _lotCode,
            msg.sender,
            _weightKg,
            _scaScore,
            _tokenURI
        );
        
        // Refund excess payment
        if (msg.value > mintFee) {
            payable(msg.sender).transfer(msg.value - mintFee);
        }
        
        return tokenId;
    }
    
    // ============ Marketplace Functions ============
    
    /**
     * @dev List a coffee NFT for sale
     * @param tokenId ID of the token to list
     * @param price Sale price in wei
     */
    function listForSale(uint256 tokenId, uint256 price) 
        external 
        onlyTokenOwner(tokenId) 
        notRedeemed(tokenId) 
    {
        require(price > 0, "Price must be positive");
        require(!listings[tokenId].active, "Already listed");
        
        // Approve marketplace to transfer
        approve(address(this), tokenId);
        
        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });
        
        emit CoffeeListed(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Cancel an active listing
     * @param tokenId ID of the token to delist
     */
    function cancelListing(uint256 tokenId) 
        external 
        onlyTokenOwner(tokenId) 
    {
        require(listings[tokenId].active, "Not listed");
        
        listings[tokenId].active = false;
        
        emit ListingCancelled(tokenId, msg.sender);
    }
    
    /**
     * @dev Buy a listed coffee NFT
     * @param tokenId ID of the token to buy
     */
    function buyNFT(uint256 tokenId) 
        external 
        payable 
        nonReentrant 
        tokenExists(tokenId) 
        notRedeemed(tokenId) 
    {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy own NFT");
        
        // Calculate fees
        uint256 fee = (listing.price * marketplaceFee) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Update state before external calls
        listings[tokenId].active = false;
        
        // Transfer NFT
        _transfer(listing.seller, msg.sender, tokenId);
        
        // Transfer payment to seller
        payable(listing.seller).transfer(sellerAmount);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        emit CoffeeSold(tokenId, listing.seller, msg.sender, listing.price);
    }
    
    /**
     * @dev Update the price of a listed NFT
     * @param tokenId ID of the token
     * @param newPrice New price in wei
     */
    function updateListingPrice(uint256 tokenId, uint256 newPrice) 
        external 
        onlyTokenOwner(tokenId) 
    {
        require(listings[tokenId].active, "Not listed");
        require(newPrice > 0, "Price must be positive");
        
        listings[tokenId].price = newPrice;
        
        emit CoffeeListed(tokenId, msg.sender, newPrice);
    }
    
    // ============ Redeem Functions ============
    
    /**
     * @dev Redeem the physical coffee lot
     * @param tokenId ID of the token to redeem
     * @notice This marks the NFT as redeemed and triggers physical delivery
     */
    function redeemCoffee(uint256 tokenId) 
        external 
        onlyTokenOwner(tokenId) 
        notRedeemed(tokenId) 
    {
        // Cancel any active listing
        if (listings[tokenId].active) {
            listings[tokenId].active = false;
        }
        
        // Mark as redeemed
        coffeeLots[tokenId].redeemed = true;
        
        emit CoffeeRedeemed(tokenId, msg.sender, coffeeLots[tokenId].lotCode);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get full details of a coffee lot
     * @param tokenId ID of the token
     */
    function getCoffeeLot(uint256 tokenId) 
        external 
        view 
        tokenExists(tokenId) 
        returns (CoffeeLot memory) 
    {
        return coffeeLots[tokenId];
    }
    
    /**
     * @dev Get listing details
     * @param tokenId ID of the token
     */
    function getListing(uint256 tokenId) 
        external 
        view 
        returns (Listing memory) 
    {
        return listings[tokenId];
    }
    
    /**
     * @dev Get all tokens owned by an address
     * @param owner Address to query
     */
    function getTokensByOwner(address owner) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokens;
    }
    
    /**
     * @dev Get all active listings
     */
    function getActiveListings() 
        external 
        view 
        returns (uint256[] memory, Listing[] memory) 
    {
        uint256 total = _tokenIdCounter - 1;
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 1; i <= total; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }
        
        // Populate arrays
        uint256[] memory tokenIds = new uint256[](activeCount);
        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= total; i++) {
            if (listings[i].active) {
                tokenIds[index] = i;
                activeListings[index] = listings[i];
                index++;
            }
        }
        
        return (tokenIds, activeListings);
    }
    
    /**
     * @dev Get total number of tokens minted
     */
    function getTotalMinted() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Set mint fee (only owner)
     * @param newFee New mint fee in wei
     */
    function setMintFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = mintFee;
        mintFee = newFee;
        emit MintFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Set marketplace fee (only owner)
     * @param newFee New fee in basis points (e.g., 300 = 3%)
     */
    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        uint256 oldFee = marketplaceFee;
        marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Verify or unverify a producer (only owner)
     * @param producer Address of the producer
     * @param status Verification status
     */
    function setProducerVerification(address producer, bool status) external onlyOwner {
        verifiedProducers[producer] = status;
        emit ProducerVerified(producer, status);
    }
    
    /**
     * @dev Withdraw accumulated fees (only owner)
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // ============ Override Functions ============
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

