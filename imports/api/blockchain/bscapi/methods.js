import {marbleMethods} from "../../../utils/methods";
import {Bscapi} from "./index";
import {NonFungibleToken} from "../../nft/collections";

marbleMethods({
    /** @desc合約測試 **/
    // test: async function() {
    //     const contractInfo = NonFungibleToken.findOne({name: "bsctest"})
    //     const api = new Bscapi(contractInfo.host, contractInfo.contractInfo.account, contractInfo.contractInfo.priKey, contractInfo.contractInfo)
    //     const res = await api.getTransactionParams('0x2c3ba0dec92e83289fc5185307c9c911a2ecf8104abadeb1c765a12193854ffc') //mint測試
    //     console.log(res)
        /*let inputdata = '0x' + res.input.slice(10)
        console.log(inputdata)
        console.log(api.web3.eth.abi.decodeParameters(['address', 'address', 'uint256', 'bytes'], inputdata))*/
        /*for (let log of res.logs) {
            console.log(api.web3.utils.toHex(log.topics[0]))
            console.log(api.web3.utils.toHex(log.topics[1]))
            console.log(api.web3.utils.toHex(log.topics[2]))
            console.log(api.web3.utils.toHex(log.topics[3]))
            console.log(api.web3.utils.toHex(log.topics[4]))
        }*/
        // const res = await api.abiMint('0x53cD060325FE32eD0fd53B708851244A68b8B318', 4) //mint測試
        // const res = await api.abiGetTokenURI(4) //獲取nft信息地址
        // const res = await api.abiSafeTransferFrom('0x53cd060325fe32ed0fd53b708851244a68b8b318','0x91DC2fC7F34E32aCe5f2c22Ea59E2F234227bce8', 4, '0x53cd060325fe32ed0fd53b708851244a68b8b318') // 轉移測試
        // const res = await api.abiSetTokenURI('https://dev.lulu.market/nft/metadata/') // 設置tokenURI
        // const res = await api.abiBurn(4) // 銷毀nft
        // console.log('bscapi res:', res)
    // },
});
