// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.5.8;

contract Conference {
     address admin = 0xB02B95024cd1b2F12083A338f863027c307A3AC7;
    mapping(address => bool) private isAuthorized;
    mapping(address => string) private passwords;
    mapping(address => string) private emails;
    mapping(address => string) private roles;

    struct Conference {
        address adresseEthereum;
        string ref;
        string title;
        string confEmail;
        string status;
    }

    struct Certificate {
        string participantId;
        string confEmail;
        string confId;
        string diplomaHash;
        string diplomaId;
        uint timestamp;
    }

    Conference[] public Conferences;
    Certificate[] public Certificates;
    uint256 public ConferenceCount = 0;
    uint256 public CertificateCount = 0;
    event InstituteAlreadyExists(address indexed _adresseEthereum);
    event RefAlreadyExists(string indexed _ref);
    mapping(string => bool) public conferenceExists;
    mapping(string => string[]) private conferencesByEmail;
    event CertificateAdded(string participantId, string confEmail, string indexed conferenceId, string indexed diplomaHash, string diplomaId);
  function checkAuthorization(string memory email,string memory passwordHash) public view returns (bool) {
        // Vérifier si l'adresse est autorisée
        if (!isAuthorized[msg.sender]) {
            return false;
        }
        string storage storedPasswordHash = passwords[msg.sender];
        bool passwordMatches = keccak256(bytes(passwordHash)) == keccak256(bytes(storedPasswordHash));
          if (!passwordMatches) {
        return false;
    }
        string storage storedEmail = emails[msg.sender];
        bool emailMatches = keccak256(bytes(email)) == keccak256(bytes(storedEmail));
        if (!emailMatches) {
        return false;
    }
        return true;
}
event ConferenceAdded(address indexed _adresseEthereum, string _ref, string _title, string _confEmail, string _status);
 event ConferenceStatusUpdated(address indexed _adresseEthereum, string _ref, string _newStatus);

function addConference(address _adresseEthereum, string memory _ref, string memory _title, string memory _confEmail, string memory _status) public {
    Conferences.push(Conference(_adresseEthereum, _ref, _title, _confEmail, _status));
    ConferenceCount++;

    // Emit an event to log the addition of the conference
    emit ConferenceAdded(_adresseEthereum, _ref, _title, _confEmail, _status);
}



    // Fonction pour récupérer tous les conferenciers
function getConferences() public view returns (Conference[] memory) {
    return Conferences;
}
// update conf status 
    function updateConferenceStatus(string memory _ref, string memory _newStatus) public {
        bool found = false;
        for (uint i = 0; i < Conferences.length; i++) {
            if (keccak256(abi.encodePacked(Conferences[i].ref)) == keccak256(abi.encodePacked(_ref))) {
                Conferences[i].status = _newStatus;
                emit ConferenceStatusUpdated(Conferences[i].adresseEthereum, _ref, _newStatus);
                found = true;
                break;
            }
        }
        require(found, "Conference not found");
    }
   function addCertificates(string[] memory _participantId, string memory _confEmail, string memory _confId, string[] memory _diplomaHash, string[] memory _diplomaIds) public {
        for (uint i = 0; i < _diplomaHash.length; i++) {
            Certificates.push(Certificate(_participantId[i], _confEmail, _confId, _diplomaHash[i], _diplomaIds[i], block.timestamp));
            CertificateCount++;
            emit CertificateAdded(_participantId[i], _confEmail, _confId, _diplomaHash[i], _diplomaIds[i]);
        }
    }

    function getCertificatesForConference(string memory _confId) public view returns (string[] memory) {
        // Initialize an array to store certificate IDs
        string[] memory certificateIds = new string[](CertificateCount);
        uint256 index = 0;
        // Loop through all certificates
        for (uint256 i = 0; i < CertificateCount; i++) {
            // Check if the certificate belongs to the specified conference ID
            if (keccak256(bytes(Certificates[i].confId)) == keccak256(bytes(_confId))) {
                // Add certificate ID to the result array
                certificateIds[index] = Certificates[i].diplomaId;
                index++;
            }
        }
        // Resize the array to remove any empty slots
        assembly { mstore(certificateIds, index) }
        return certificateIds;
    }
    function getCertificatesForConfEmail(string memory _confEmail) public view returns (Certificate[] memory) {
        // Initialize an array to store certificate IDs
        Certificate[] memory certificates = new Certificate[](CertificateCount);
        uint256 index = 0;
        // Loop through all certificates
        for (uint256 i = 0; i < CertificateCount; i++) {
            // Check if the certificate belongs to the specified conference ID
            if (keccak256(bytes(Certificates[i].confEmail)) == keccak256(bytes(_confEmail))) {
                // Add certificate ID to the result array
                certificates[index] = Certificates[i];
                index++;
            }
        }
        // Resize the array to remove any empty slots
        assembly { mstore(certificates, index) }
        return certificates;
    }
function getCertificateOfDiplomaId(string memory _diplomaId) public view returns (Certificate memory) {
    for (uint256 i = 0; i < CertificateCount; i++) {
        if (keccak256(bytes(Certificates[i].diplomaId)) == keccak256(bytes(_diplomaId))) {
            return Certificates[i];
        }
    }
    revert("Certificate not found");
}
    function getAllCertificates() public view returns (Certificate[] memory) {
            return Certificates;
    }
}