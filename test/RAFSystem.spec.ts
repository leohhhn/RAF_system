import {ethers} from 'hardhat';
import {expect} from 'chai';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {RAFSystem} from '../typechain-types';

describe('RAFSystem', async () => {

    let sc: RAFSystem;
    let admin: SignerWithAddress, student: SignerWithAddress;
    const provider = ethers.provider;

    beforeEach(async () => {
        const RAFSystem = await ethers.getContractFactory(`RAFSystem`);
        [admin, student] = await ethers.getSigners();
        sc = (await RAFSystem.deploy()) as RAFSystem;
        await sc.deployed();
    });

    describe('Deployment', async () => {
        it('should add deployer to profesori', async () => {
            expect(await sc.profesori(admin.address)).to.be.eq(true);
        });
    });

    /*
    * TODO tests:
    *   getPredmet:
    *       revert on predmet ne postoji
    *       return correct predmet
    *   izracunajOcenu:
    *       predmet ne postoji
    *       student ne postoji
    *       test za ocene
    *   polozioPredmet
    *       student ne postoji
    *       predmet ne postoji
    *       poeni < 51
    *       emits correct predmet
    *   dodajProfesora:
    *       dodaje novog profesora
    *
    * */

    describe('Studenti', async () => {
        it('should revert on existing student', async () => {
            await sc.upisiStudenta(student.address, '102/2020', 0);
            await expect(sc.upisiStudenta(student.address, '102/2020', 0))
                .to.be.revertedWith('upisiStudenta: Student je vec upisan!')
        });

        it('should correctly enroll student', async () => {
            expect(await sc.upisiStudenta(student.address, '102/2020', 0))
                .to.emit(sc, 'UpisanStudent').withArgs(student.address, '102/2020', 0);
        });


    });

    describe('Predmeti', async () => {
        it('should add new Predmet', async () => {
            expect(sc.dodajPredmet('Matematicka analiza', 'Irena Jovanovic'))
                .to.emit(sc, 'DodatPredmet').withArgs('Matematicka analiza', 0);
            expect(sc.dodajPredmet('Linearna algebra i analiticka geometrija', 'Milanka'))
                .to.emit(sc, 'DodatPredmet').withArgs('Linearna algebra i analiticka geometrija', 1);
        });

        it('should revert on empty Predmet args', async () => {
            expect(sc.dodajPredmet('', 'Irena Jovanovic'))
                .to.be.revertedWith('dodajPredmet: Imena predmeta i profesora ne mogu biti prazni!');
            expect(sc.dodajPredmet('Matematicka analiza', ''))
                .to.be.revertedWith('dodajPredmet: Imena predmeta i profesora ne mogu biti prazni!');
        });

        it('should return correct grade', async () => {
            await sc.dodajPredmet('Mata 1', 'Profa 1');
            await sc.upisiStudenta(student.address, '3/2019', 1);

            await sc.polozioPredmet(student.address, 0, 99);
            // todo test all cases
            expect(await sc.izracunajOcenu(student.address, 0)).to.be.eq(10);
        });
    });

    it('should revert on non-profa caller', async () => {
        await expect(sc.connect(student).upisiStudenta(student.address, '102/2020', 0))
            .to.be.revertedWith('Niste profesor!');
    });



});