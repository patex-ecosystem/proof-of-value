import { ethers } from "hardhat"

async function main() {

    const token = "0x4200000000000000000000000000000000000042" // 0x4200000000000000000000000000000000000042

    const Activity = await ethers.getContractFactory("ProofOfValueActivityMining")

    const activity = await Activity.deploy(token)

    console.log(`Deployed Activity ${activity.address}`)

    const ProofOfValueValidators = await ethers.getContractFactory("ProofOfValueValidators")

    const staking = await ProofOfValueValidators.deploy(
        "0xB9d11e7AaA0363cfd8904bE23D9CE821E82Aeeef", // owner 0xB9d11e7AaA0363cfd8904bE23D9CE821E82Aeeef
        "0x89183c312de51b4a9d35b1dd8090e68046ead964", // distributer
        token
    )

    console.log(`Deployed staking ${staking.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
