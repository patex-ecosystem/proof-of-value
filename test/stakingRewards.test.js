const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { ethers, network } = require("hardhat")

async function increaseTime(n) {

    await hre.network.provider.request({
        method: "evm_increaseTime",
        params: [n]
    })
  
    await hre.network.provider.request({
        method: "evm_mine",
        params: []
    })
}
  
async function getCurrentTimestamp() {
    const blockNumber = await ethers.provider.getBlockNumber()
    const blockBefore = await ethers.provider.getBlock(blockNumber)
    return blockBefore.timestamp
}

describe("", function () {
  
    async function deployFixture() {

        const [ owner, user1, user2, user3 ] = await ethers.getSigners()

        const PatexStakingRewards = await ethers.getContractFactory("PatexStakingRewards")
        const Activity = await ethers.getContractFactory("Activity")
        const Token = await ethers.getContractFactory("Token")

        const token = await Token.deploy()
        const staking = await PatexStakingRewards.deploy(owner.address, owner.address, token.address)
        const activity = await Activity.deploy(token.address)

        const amount = ethers.utils.parseUnits("1000.0", 18)   

        await token.transfer(user1.address, amount)
        await token.transfer(user2.address, amount)
        await token.transfer(user3.address, amount)

        await token.connect(user1).approve(staking.address, amount)
        await token.connect(user2).approve(staking.address, amount)
        await token.connect(user3).approve(staking.address, amount)

        await staking.adminAddWhiteList([user1.address, user2.address, user3.address])

        return { token, staking, activity, owner, user1, user2, user3 }
    }

    describe("staking + activity flows", function () {

        it("staking", async function() {

            const { staking, owner, user1, user2, user3 } = await loadFixture(deployFixture)
            const rewardAmount = ethers.utils.parseUnits("1.0", 18)
            const stakeAmount = ethers.utils.parseUnits("100.0", 18)

            const seconds = 172800 // 2 days in seconds

            await owner.sendTransaction({
                to: staking.address,
                value: rewardAmount
            })

            // await staking.notifyRewardAmount(rewardAmount)

            await staking.connect(user1).stake(stakeAmount)
            await staking.connect(user2).stake(stakeAmount)
            // await staking.connect(user3).stake(stakeAmount)

            await increaseTime(seconds)

            console.log((await staking.earned(user1.address)).toString())
            console.log((await staking.earned(user2.address)).toString())
            console.log((await staking.earned(user3.address)).toString())

            await owner.sendTransaction({
                to: staking.address,
                value: rewardAmount.mul(10)
            })
            
            // await staking.notifyRewardAmount(rewardAmount)

            await staking.connect(user3).stake(stakeAmount)

            await increaseTime(seconds)

            console.log((await staking.earned(user1.address)).toString())
            console.log((await staking.earned(user2.address)).toString())
            console.log((await staking.earned(user3.address)).toString())

        })

        it("avtivity", async function() {

            const { activity, token, owner, user1, user2, user3 } = await loadFixture(deployFixture)

            const rewardAmount = ethers.utils.parseUnits("10.0", 18)
            const block = 1

            await token.transfer(activity.address, rewardAmount.mul(100))

            await activity.rewardAccounts(
                [
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user1.address, 
                    user2.address, 
                    user3.address,
                    user3.address,
                ],
                [
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                    rewardAmount,
                ],
                block
            )

            await activity.connect(user1).claim()
            await activity.connect(user2).claim()
            await activity.connect(user3).claim()

        })

    })
})