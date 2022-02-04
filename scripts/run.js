const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();
    console.log("Contract address: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log("I've had %d total waves!", waveCount);

    let waveTxn;

    //  try multiple times for one sender
    for (let i = 0; i < 1; i++) {
        waveTxn = await waveContract.wave(`Hello, this is message #${i}!`);
        await waveTxn.wait();

        contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
        console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));
    }

    waveTxn = await waveContract.connect(randomPerson).wave("Message from a random person!");
    await waveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

    waveCount = await waveContract.getTotalWaves();
    console.log("I've had %d total waves!", waveCount);
    waveMessages = await waveContract.getWaves();
    console.log(waveMessages);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();
