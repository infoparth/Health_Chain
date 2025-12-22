// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MakeNFT is ERC721, ERC721Enumerable, ERC721URIStorage
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("NFT-Name", "SYMBOL") {}

    function safeMint(address to, string memory uri) public
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
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
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function checkTransfer(address recipient, uint256 tokenId) public view returns (bool) {
        address owner = ownerOf(tokenId);
        return (owner == recipient);
    }
}

contract Documents
{
    /*Hash values of the records stored on the IPFS
    server are mapped to the address of every patient*/
    mapping(address => string[]) documents;

    // **CHANGES HERE**

    function addDocument(string memory documentURI) public 
    returns (uint256)
    {
        //push returns the array length
        documents[msg.sender].push(documentURI);
        return documents[msg.sender].length - 1;
    }

}

contract DoctorAccesses
{

    struct user{
        string name;
        uint8 age;
        string mob_no;
        uint8 registered_as;  // 0 for not registred, 1 for doctor, 2 for patient
    }

    //mapping: Doctor's Address => Pateints' Addresses
    mapping(address => address[]) public doctorPermissions;

    // ** CHANGES HERE**
    mapping (address => user) users;  // mapping to add doctors and patients


    mapping (address => address[]) doctor_for_patients;

    //////////////////////////////////////////////////////////////////////////////////

    //in the mapping above, replace address[], with user array

    //////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////

    function getUserDetails(address _user) public view returns (user memory){
        require(users[_user].registered_as != 0, "The User is not registered");
        return users[_user];
    }

///////////////////////////////////////////////////////////////////////////////////////////////////

    function addDoc(string memory _name, uint8 _age, string memory _mob_no) public {  // function that lets you add a user as doc, when he/she comes for the 
                                            // first time on the page
        users[msg.sender] = user(_name, _age, _mob_no, 1);

    }

    function addPatient(string memory _name, uint8 _age, string memory _mob_no) public { // function that lets you add a user as patient, when he/she comes for the 
                                            // first time on the page

        users[msg.sender] = user(_name, _age, _mob_no, 2);

    }

    /*Patient grants access to a doctor. 
    The patient's address is mapped to the doctor's*/
    function grantAccess(address doctor) public 
    {
        doctorPermissions[doctor].push(msg.sender);
        doctor_for_patients[msg.sender].push(doctor);
    }

    function hasPermission(address doctor, address patient) internal view returns (uint){

        for(uint i = 0; i < doctorPermissions[doctor].length; i++)
        {
            if(doctorPermissions[doctor][i] == patient)
            {
                
                return i + 1;
            }
        }

        return 0;


    }


    function revokeAccess(address doctor) public returns(bool) 
    {

        uint i = hasPermission(doctor, msg.sender);
        if(i != 0 ){
        delete doctorPermissions[doctor][i - 1];
        return true;
        }

        return false;
    }

    function patientsUnderDoctor(address doctor) public view 
    returns (address[] memory)
    {
        return doctorPermissions[doctor];
    }

    function patient_has_doctors() public view returns(address[] memory){

        return doctor_for_patients[msg.sender];
    }

}

contract PatientFunctions is Documents, DoctorAccesses, MakeNFT
{

    // Checks whether the doc is already in the mapping or not 
    
    function checkDoc() public view returns(bool){

        if(users[msg.sender].registered_as == 1)
        return true;

        return false;
    }

    // Checks whether the patiebt is already added ot not and returns a boolean value

    function checkPatient() public view returns(bool){

        if(users[msg.sender].registered_as == 2)
        return true;

        return false;
    }

    function getDocuments(address patient) public view
    returns (string[] memory)
    {
        require(users[patient].registered_as == 2 || hasPermission(msg.sender, patient) != 0, "You can not access the documents!");
        return documents[patient];
    }

}
