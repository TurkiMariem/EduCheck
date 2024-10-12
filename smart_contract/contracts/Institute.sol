// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.5.8;

contract Institute {
    address admin = 0xB02B95024cd1b2F12083A338f863027c307A3AC7;
    mapping(address => bool) private isAuthorized;
    mapping(address => string) private passwords;
    mapping(address => string) private emails;
    mapping(address => string) private roles;
    constructor() public {
        // Donner l'autorisation à l'adresse admin
        isAuthorized[admin] = true;
        passwords[admin] = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";        emails[admin] = "admin@example.com";
        roles[admin] ="admin";
    }
    struct Institute
    {
        address adresseEthereum;
        string ref;
        string name;
        string acronym;
        string emailOff;
        string emailValid;
        string WebSite;
        string[] diplomasNames;
        string[] diplomasRefs;
        bool autorisation;
    }
    struct Comptes_institute
    {
       string email;
       string pass;
       string role;
    }
    struct Student
    {
        string institutename;
        string name;
        string email;
        string dateOfBirth;
        string mention;
        string dateRemiseDiplome;
        string numCIN;
        string diploma; /** a corriger */
        string ipfsHash;
        string id;
        string validated;
    }
    Institute[] public institute;
    uint256 public instituteCount = 0;
    uint256 public ConferenceCount = 0;
    //mapping(address=>Compte) public compte;
    mapping(address => Comptes_institute[2]) public compte_inst;
    // Mapping pour associer à chaque adresse d'institut la liste de ses étudiants
    mapping(address => Student[]) private instituteToStudents;
    mapping(string => Student) studentsById;
    mapping(string => Student) studentByCin;
    mapping(address => string[]) public diplomasNamesByAddress;
    mapping(address => string[]) public diplomasRefsByAddress;
    mapping(address => string[]) public namesByAddress;
    mapping(address => string[]) public emailsByAddress;
    mapping(address => string[]) public birthsByAddress;
    mapping(address => string[]) public mentionsByAddress;
    mapping(address => string[]) public diplomatedByAddress;
    mapping(address => string[]) public cinsByAddress;
    mapping(address => string[]) public diplomarefsByAddress;
    mapping(address => string[]) public hashsByAddress;
    mapping(address => string[]) public idsByAddress;
    event InstituteAlreadyExists(address indexed _adresseEthereum);
    event RefAlreadyExists(string indexed _ref);
    function addInstitute(
    address _adresseEthereum,
    string memory _ref,
    string memory _name,
    string memory _acronym,
    string memory _emailOff,
    string memory _emailValid,
    string memory _WebSite,
    string[] memory _diplomasNames,
    string[] memory _diplomasRefs
) public {
    // verifier si l'adresse Ethereum existe déjà, si oui, on ne peut pas ajouter l'institut
    bool adder_exists = false;
    bool ref_exists = false;
    for (uint i = 0; i < institute.length; i++) {
        if (institute[i].adresseEthereum == _adresseEthereum) {
            adder_exists = true;
            emit InstituteAlreadyExists(_adresseEthereum);
            break;
        }
        if (keccak256(bytes(institute[i].ref)) == keccak256(bytes(_ref))) {
            ref_exists = true;
            emit RefAlreadyExists(_ref);
            break;
        }
    }
    require(!adder_exists, "Institute address already exists");
    require(!ref_exists, "Institute ref already exists");
    institute.push(Institute(
        _adresseEthereum,
        _ref,
        _name,
        _acronym,
        _emailOff,
        _emailValid,
        _WebSite,
        _diplomasNames,
        _diplomasRefs,
        true
    ));
    instituteCount++;
    diplomasNamesByAddress[_adresseEthereum] = _diplomasNames;
    diplomasRefsByAddress[_adresseEthereum] = _diplomasRefs;
    // assign roles and hashed password
    string memory hashedPassword = string(abi.encodePacked("institute"));
    compte_inst[_adresseEthereum][0] = Comptes_institute(_emailOff, hashedPassword, "officier");
    compte_inst[_adresseEthereum][1] = Comptes_institute(_emailValid, hashedPassword, "validator");
    roles[_adresseEthereum] = "institute";
}



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
    function getInstitute(uint index) public view returns (address, string memory, string memory,string memory, string memory, string memory,string memory, bool) {
        require(index >= 0 && index < institute.length, "Index en dehors de la plage valide");

        Institute memory inst = institute[index];
        return (inst.adresseEthereum, inst.ref, inst.name, inst.emailOff, inst.emailValid, inst.WebSite, inst.acronym, inst.autorisation);
    }
   function getInstituteCount() public view returns (uint256) {
        return institute.length;
    }
 function getInstitutes() public view returns (Institute[] memory) {
    return institute;
}
     
function getMyInstitute() public view returns (address, string memory, string memory, string memory,string memory, string memory,string[] memory,string[] memory, string memory, bool) {
    address myAddress = msg.sender;
    for (uint i = 0; i < institute.length; i++) {
        if (institute[i].adresseEthereum == myAddress) {
            Institute memory inst = institute[i+1];
            return (inst.adresseEthereum, inst.ref, inst.name,inst.acronym, inst.emailOff,inst.emailValid,inst.diplomasNames,inst.diplomasRefs, inst.WebSite, inst.autorisation);
        }
    }
    revert("Institute doesn t exist!");
    }

    function findInstitute(address _adresseEthereum) public view returns(int256)
    {
        for(uint i=0; i<instituteCount; i++)
        {
            if(_adresseEthereum == institute [i].adresseEthereum)
                return int256(i);
        }
        return -1;
    }
    function findInstRef(string memory _ref) public view returns (int256)
    {
           for(uint i=0; i<instituteCount; i++)
        {
            if(keccak256(bytes(_ref)) == keccak256(bytes(institute [i].ref)))
                return int256(i);
        }
        return -1;
    }

    function getInstituteAddressByEmail(string memory _email) public view returns (address) {
    for (uint i = 0; i < institute.length; i++) {
        //le email est hashé
        if ((keccak256(bytes(compte_inst[institute[i].adresseEthereum][0].email)) == keccak256(bytes(_email)))||
        (keccak256(bytes(compte_inst[institute[i].adresseEthereum][1].email)) == keccak256(bytes(_email)))) {
            return institute[i].adresseEthereum;
        }
    }
    return address(0); // retourne l'adresse zéro si l'email n'est associé à aucun institut
}
//update password forget
    function resetInstitutePassword(string memory email, string memory newPassword) public {
    //require(msg.sender == getInstituteAddressByEmail(email), "Seul l institut peut reinitialiser son mot de passe");
    
    string memory hashedNewPassword = string(abi.encodePacked(newPassword));
    if (keccak256(bytes(compte_inst[msg.sender][0].email)) == keccak256(bytes(email))) {
        compte_inst[msg.sender][0].pass = hashedNewPassword;
    }
    else if 
    (keccak256(bytes(compte_inst[msg.sender][1].email)) ==keccak256(bytes( email))) {
        compte_inst[msg.sender][1].pass =hashedNewPassword;
    } 
    emit InstituteCredentialsUpdated(email, newPassword);
}

    function authorizedInstitute(string memory email, string memory password) public view returns (string memory) {
    //bytes32 roleInstitute = keccak256(abi.encodePacked("institute"));
    string memory hashedPassword = string(abi.encodePacked(password));
    //email hashé depuis la fonction getInstituteAddressByEmail
    address instituteAddress = getInstituteAddressByEmail(email);
    if(instituteAddress == msg.sender &&
         keccak256(bytes(compte_inst[instituteAddress][0].pass))==  keccak256(bytes(hashedPassword)) &&
        keccak256(bytes(compte_inst[instituteAddress][0].email)) == keccak256(bytes(email)) 
    ){
        return compte_inst[instituteAddress][0].role;
    }
    else if (instituteAddress == msg.sender &&
         keccak256(bytes(compte_inst[instituteAddress][1].pass)) ==  keccak256(bytes(hashedPassword)) &&
        keccak256(bytes(compte_inst[instituteAddress][1].email)) == keccak256(bytes(email))
    ) {
        return compte_inst[instituteAddress][1].role;
    }
    else{
    return "false";
}
}
    event InstituteCredentialsUpdated(string indexed _email, string _newPassword);
    function updateInstituteCredentials(string memory email, string memory oldPassword, string memory newPassword) public {
        require(
            keccak256(bytes(authorizedInstitute(email, oldPassword)))!= keccak256(bytes("false")),
            "ne peut pas acceder"
        );
        string memory hashedNewPassword =  string(abi.encodePacked(newPassword));
         if (keccak256(bytes(compte_inst[msg.sender][0].email)) == keccak256(bytes(email))) {
        compte_inst[msg.sender][0].pass =hashedNewPassword;
    }
    else if 
    (keccak256(bytes(compte_inst[msg.sender][1].email)) == keccak256(bytes(email))) {
        compte_inst[msg.sender][1].pass =hashedNewPassword;
    }}

function addStudentForInstitute(
    address _instituteAddress,
    string memory _institutename,
    string memory _name,
    string memory _email, 
    string memory _dateOfBirth, 
    string memory _mention, 
    string memory _dateRemiseDiplome, 
    string memory _numCIN, 
    string memory _diploma, 
    string memory _ipfsHash,
    string memory _diplomaId) public {
    // require(msg.sender == _instituteAddress, "Vous n etes pas autorise a ajouter un etudiant pour cet institut.");    
    // Créer un nouvel étudiant
    Student memory newStudent = Student({
        institutename: _institutename,
        name: _name,
        email:_email,
        dateOfBirth: _dateOfBirth,
        mention: _mention,
        dateRemiseDiplome: _dateRemiseDiplome,
        numCIN: _numCIN,
        diploma:_diploma,
        ipfsHash:_ipfsHash,
        id:_diplomaId,
        validated: "Pending"
    });
    // Ajouter l'étudiant à la liste correspondante à l'adresse de l'institut
    instituteToStudents[_instituteAddress].push(newStudent);
    studentsById[_diplomaId] = newStudent;
    studentByCin[_numCIN] = newStudent;
}
function addStudentsForInstitute(
    address _instituteAddress,
    string memory _instituteName,
    string[] memory _names,
    string[] memory _emails,
    string[] memory _dateOfBirths,
    string[] memory _mentions,
    string[] memory _dateRemiseDiplomes,
    string[] memory _numCINs,
    string[] memory _diplomas,
    string[] memory _ipfsHashes,
    string[] memory _diplomaIds
) public {
   for (uint i = 0; i < _names.length; i++) {
        instituteToStudents[_instituteAddress].push(
            Student(
                _instituteName,
                _names[i],
                _emails[i],
                _dateOfBirths[i],
                _mentions[i],
                _dateRemiseDiplomes[i],
                _numCINs[i],
                _diplomas[i],
                _ipfsHashes[i],
                _diplomaIds[i],
                "Pending"
            )
        );
        studentsById[_diplomaIds[i]] = Student(
            _instituteName,
            _names[i],
            _emails[i],
            _dateOfBirths[i],
            _mentions[i],
            _dateRemiseDiplomes[i],
            _numCINs[i],
            _diplomas[i],
            _ipfsHashes[i],
            _diplomaIds[i],
            "Pending"
        );
        studentByCin[_numCINs[i]] = Student(
            _instituteName,
            _names[i],
            _emails[i],
            _dateOfBirths[i],
            _mentions[i],
            _dateRemiseDiplomes[i],
            _numCINs[i],
            _diplomas[i],
            _ipfsHashes[i],
            _diplomaIds[i],
            "Pending"
        );
    }
}


// Fonction pour récupérer tous les étudiants enregistrés pour un institut donné
function getStudentsForInstitute(address _instituteAddress) public view returns (Student[] memory) {
    return instituteToStudents[_instituteAddress];
}
// Fonction pour récupérer tou les diplomes de l'institue

// Fonction pour récupérer un étudiant par son diplôme ID
function getDiplomaById(string memory _diplomaId) public view returns (Student memory) {
    return studentsById[_diplomaId];
}
function getDiplomaByCin(string memory _numCIN) public view returns (Student memory){
    return studentByCin[_numCIN];
}

function setDiplomaStatus(string memory _numCIN, string memory _ID, string memory _status) public{
     studentByCin[_numCIN].validated= _status;
     studentsById[_ID].validated=_status;
     Student[] storage students = instituteToStudents[msg.sender];
     for (uint256 i = 0; i < students.length; i++) {
            if (keccak256(bytes(students[i].numCIN)) == keccak256(bytes(_numCIN))) {
                instituteToStudents[msg.sender][i].validated=_status;
            }
     }    
}
}
    
