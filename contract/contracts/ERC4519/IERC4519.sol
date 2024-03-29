///SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.19;


 /// @title EIP-4519 NFT: Extension of EIP-721 Non-Fungible Token Standard.
///  Note: the EIP-165 identifier for this interface is 0x8a68abe3
 interface IERC4519{
    /// @dev This emits when the NFT is assigned as utility of a new user.
    ///  This event emits when the user of the token changes.
    ///  (`_addressUser` == 0) when no user is assigned.
    event UserAssigned(uint256 indexed tokenId, address indexed _addressUser);

    /// @dev This emits when user and asset finish mutual authentication process successfully.
    ///  This event emits when both the user and the asset prove they share a secure communication channel.
    event UserEngaged(uint256 indexed tokenId);

    /// @dev This emits when owner and asset finish mutual authentication process successfully.
    ///  This event emits when both the owner and the asset prove they share a secure communication channel.
    event OwnerEngaged(uint256 indexed tokenId);

    /// @dev This emits when it is checked that the timeout has expired.
    ///  This event emits when the timestamp of the EIP-4519 NFT is not updated in timeout.
    event TimeoutAlarm(uint256 indexed tokenId);
    /// @notice This function defines how the NFT is assigned as utility of a new user (if "addressUser" is defined).
    /// @dev Only the owner of the EIP-4519 NFT can assign a user. If "addressAsset" is defined, then the state of the token must be
    /// "engagedWithOwner","waitingForUser" or "engagedWithUser" and this function changes the state of the token defined by "_tokenId" to
    /// "waitingForUser". If "addressAsset" is not defined, the state is set to "userAssigned". In both cases, this function sets the parameter
    /// "addressUser" to "_addressUser".
    /// @param _tokenId is the tokenId of the EIP-4519 NFT tied to the asset.
    /// @param _addressUser is the address of the new user.
    function setUser(uint256 _tokenId, address _addressUser) external payable;
    /// @notice This function defines the initialization of the mutual authentication process between the owner and the asset.
    /// @dev Only the owner of the token can start this authentication process if "addressAsset" is defined and the state of the token is "waitingForOwner".
    /// The function does not change the state of the token and saves "_dataEngagement"
    /// and "_hashK_OA" in the parameters of the token.
    /// @param _tokenId is the tokenId of the EIP-4519 NFT tied to the asset.
    /// @param _dataEngagement is the public data proposed by the owner for the agreement of the shared key.
    /// @param _hashK_OA is the hash of the secret proposed by the owner to share with the asset.
    function startOwnerEngagement(uint256 _tokenId, uint256 _dataEngagement, uint256 _hashK_OA) external payable;

    /// @notice This function completes the mutual authentication process between the owner and the asset.
    /// @dev Only the asset tied to the token can finish this authentication process provided that the state of the token is
    /// "waitingForOwner" and dataEngagement is different from 0. This function compares hashK_OA saved in
    /// the token with hashK_A. If they are equal then the state of the token changes to "engagedWithOwner", dataEngagement is set to 0,
    /// and the event "OwnerEngaged" is emitted.
    /// @param _hashK_A is the hash of the secret generated by the asset to share with the owner.
    function ownerEngagement(uint256 _hashK_A) external payable;

    /// @notice This function defines the initialization of the mutual authentication process between the user and the asset.
    /// @dev Only the user of the token can start this authentication process if "addressAsset" and "addressUser" are defined and
    /// the state of the token is "waitingForUser". The function does not change the state of the token and saves "_dataEngagement"
    /// and "_hashK_UA" in the parameters of the token.
    /// @param _tokenId is the tokenId of the EIP-4519 NFT tied to the asset.
    /// @param _dataEngagement is the public data proposed by the user for the agreement of the shared key.
    /// @param _hashK_UA is the hash of the secret proposed by the user to share with the asset.
    function startUserEngagement(uint256 _tokenId, uint256 _dataEngagement, uint256 _hashK_UA) external payable;

    /// @notice This function completes the mutual authentication process between the user and the asset.
    /// @dev Only the asset tied to the token can finish this authentication process provided that the state of the token is
    /// "waitingForUser" and dataEngagement is different from 0. This function compares hashK_UA saved in
    /// the token with hashK_A. If they are equal then the state of the token changes to "engagedWithUser", dataEngagement is set to 0,
    /// and the event "UserEngaged" is emitted.
    /// @param _hashK_A is the hash of the secret generated by the asset to share with the user.
    function userEngagement(uint256 _hashK_A) external payable;

    /// @notice This function checks if the timeout has expired.
    /// @dev Everybody can call this function to check if the timeout has expired. The event "TimeoutAlarm" is emitted
    /// if the timeout has expired.
    /// @param _tokenId is the tokenId of the EIP-4519 NFT tied to the asset.
    /// @return true if timeout has expired and false in other case.
    function checkTimeout(uint256 _tokenId) external returns (bool);

    /// @notice This function sets the value of timeout.
    /// @dev Only the owner of the token can set this value provided that the state of the token is "engagedWithOwner",
    /// "waitingForUser" or "engagedWithUser".
    /// @param _tokenId is the tokenId of the EIP-4519 NFT tied to the asset.
    /// @param _timeout is the value to assign to timeout.
    function setTimeout(uint256 _tokenId, uint256 _timeout) external;

    /// @notice This function updates the timestamp, thus avoiding the timeout alarm.
    /// @dev Only the asset tied to the token can update its own timestamp.
    function updateTimestamp() external;

    /// @notice This function lets obtain the tokenId from an address.
    /// @dev Everybody can call this function. The code executed only reads from Ethereum.
    /// @param _addressAsset is the address to obtain the tokenId from it.
    /// @return tokenId of the token tied to the asset that generates _addressAsset.
    function tokenFromBCA(address _addressAsset) external view returns (uint256);

    /// @notice This function lets know the owner of the token from the address of the asset tied to the token.
    /// @dev Everybody can call this function. The code executed only reads from Ethereum.
    /// @param _addressAsset is the address to obtain the owner from it.
    /// @return owner of the token bound to the asset that generates _addressAsset.
    function ownerOfFromBCA(address _addressAsset) external view returns (address);

    /// @notice This function lets know the user of the token from its tokenId.
    /// @dev Everybody can call this function. The code executed only reads from Ethereum.
    /// @param _tokenId is the tokenId of the EIP-4519 NFT tied to the asset.
    /// @return user of the token from its _tokenId.
    function userOf(uint256 _tokenId) external view returns (address);

    /// @notice This function lets know the user of the token from the address of the asset tied to the token.
    /// @dev Everybody can call this function. The code executed only reads from Ethereum.
    /// @param _addressAsset is the address to obtain the user from it.
    /// @return user of the token tied to the asset that generates _addressAsset.
    function userOfFromBCA(address _addressAsset) external view returns (address);

    /// @notice This function lets know how many tokens are assigned to a user.
    /// @dev Everybody can call this function. The code executed only reads from Ethereum.
    /// @param _addressUser is the address of the user.
    /// @return number of tokens assigned to a user.
    function userBalanceOf(address _addressUser) external view returns (uint256);

    /// @notice This function lets know how many tokens of a particular owner are assigned to a user.
    /// @dev Everybody can call this function. The code executed only reads from Ethereum.
    /// @param _addressUser is the address of the user.
    /// @param _addressOwner is the address of the owner.
    /// @return number of tokens assigned to a user from an owner.
    function userBalanceOfAnOwner(address _addressUser, address _addressOwner) external view returns (uint256);
}
