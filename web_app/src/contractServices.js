
import Web3 from 'web3';
import Conference from './contracts/Conference.json';
import Institute from './contracts/Institute.json';

const web3=new Web3(Web3.givenProvider);

export const getContractInstanceInst=async() =>{
    const networkId = await web3.eth.net.getId();
    const deployedNetworkInst = Institute.networks[networkId];
    if (!deployedNetworkInst){
        throw new Error (`Le smart contract n'est pas déployé sur le réseau avec l'ID ${networkId}`);
        
    }
    const contractAddress=deployedNetworkInst.address;
    const contractInstance = new web3.eth.Contract(Institute.abi,contractAddress);

    return{
        instance: contractInstance,
        
    };
};
export const getContractInstanceConf=async() =>{
    const networkId = await web3.eth.net.getId();
    const deployedNetworkConf = Conference.networks[networkId];
    if (!deployedNetworkConf){
        throw new Error (`Le smart contract n'est pas déployé sur le réseau avec l'ID ${networkId}`);
        
    }
    const contractAddress=deployedNetworkConf.address;
    const contractInstance = new web3.eth.Contract(Conference.abi,contractAddress);

    return{
        instance: contractInstance,
        
    };
};