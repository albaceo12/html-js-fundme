import {ethers} from "./ethers-min.js"
import {abi, contractAddress} from "./constants.js"
const connectbtn = document.getElementById("btn_1")
const fundbtn = document.getElementById("btn_2")
const balancebtn = document.getElementById("buttonblance")
const withdrawbtn = document.getElementById("buttonwithdraw")
const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
        console.log("awesome there is metamask")
        await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [],
        })
        document.getElementById("btn_1").innerHTML = "connected!"
    } else {
        console.log("sorry i cannot see metmask here")
        document.getElementById("btn_1").innerHTML = "please install metmask"
    }
    console.log("hassan", window.ethereum.isMetaMask)
}
connectbtn.onclick = connect
const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        document.getElementById(
            "buttonblance"
        ).innerHTML = `get Balance : ${ethers.utils.formatEther(balance)}`
        console.log(balance)
        console.log(ethers.utils.formatEther(balance))
    }
}
balancebtn.onclick = getBalance
const fund = async () => {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with: ${ethAmount}....`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signers = provider.getSigner()
        // console.log(signers)
        const contract = new ethers.Contract(contractAddress, abi, signers)
        try {
            const tnxres = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenfor_tnx_mine(tnxres, provider)
            console.log("Done!")
            document.getElementById("ethAmount").value = ""
        } catch (err) {
            console.log(err)
        }
    }
}
const withdraw = async () => {
    console.log("withdrawing....")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
        const tnx_res = await contract.withdraw()
        await listenfor_tnx_mine(tnx_res, provider)
        console.log("done!!!")
        document.getElementById("buttonblance").innerHTML = `get Balance : 0.0`
    } catch (err) {
        console.log(err)
    }
}
withdrawbtn.onclick = withdraw
const listenfor_tnx_mine = (tnxres, provider) => {
    console.log(`mining ${tnxres.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(tnxres.hash, (tnxreceipt) => {
            console.log(
                `completed with ${tnxreceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
fundbtn.onclick = fund
// console.log(ethers)
