import {ethers} from 'hardhat';
import {expect} from 'chai';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {RAFSystem} from '../typechain-types';

describe('RAFSystem', async () => {

    let contract: RAFSystem;
    let admin: SignerWithAddress, user: SignerWithAddress;
    const provider = ethers.provider;

    beforeEach(async () => {
        const RAFSystem = await ethers.getContractFactory(`RAFSystem`);
        [admin, user] = await ethers.getSigners();
        contract = (await RAFSystem.deploy()) as RAFSystem;
        await contract.deployed();
    });

    it('treba da doda novi predmet', async () => {
        expect(contract.dodajPredmet('Matematicka analiza', 'Irena Jovanovic'))
            .to.emit(contract, 'DodatPredmet').withArgs('Matematicka analiza', 0);

    });


});