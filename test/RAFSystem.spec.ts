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

    describe('Deployment & ownership', async () => {
        it('should add deployer to profesori', async () => {
            expect(await sc.profesori(admin.address)).to.be.eq(true);
        });

        it('should revert on non-profa caller', async () => {
            await expect(sc.connect(student).upisiStudenta(student.address, '102/2020', 0))
                .to.be.revertedWith('samoProfesor: Niste profesor!');
        });

        it('should add new profa', async () => {
            await expect(sc.dodajProfesora(student.address))
                .to.emit(sc, 'DodatProfesor').withArgs(student.address);
        });
    });

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

        it('should correctly remove student', async () => {
            await sc.upisiStudenta(student.address, '102/2020', 0);
            expect(sc.ispisiStudenta(student.address))
                .to.emit(sc, 'IspisanStudent').withArgs(student.address);
        });

    });

    describe('Predmeti', async () => {
        it('should add new Predmet', async () => {
            expect(sc.dodajPredmet('Matematicka analiza', 'Irena Jovanovic', 6))
                .to.emit(sc, 'DodatPredmet').withArgs('Matematicka analiza', 0);
            expect(sc.dodajPredmet('Linearna algebra i analiticka geometrija', 'Milanka', 6))
                .to.emit(sc, 'DodatPredmet').withArgs('Linearna algebra i analiticka geometrija', 1);

            expect((await sc.getPredmet(0))[1]).to.be.eq(6);
            expect((await sc.getPredmet(0))[2]).to.be.eq('Matematicka analiza');
            expect((await sc.getPredmet(0))[3]).to.be.eq('Irena Jovanovic');

        });

        it('should revert on empty Predmet args', async () => {
            expect(sc.dodajPredmet('', 'Irena Jovanovic', 6))
                .to.be.revertedWith('dodajPredmet: Imena predmeta i profesora ne mogu biti prazni!');
            expect(sc.dodajPredmet('Matematicka analiza', '', 6))
                .to.be.revertedWith('dodajPredmet: Imena predmeta i profesora ne mogu biti prazni!');
            await expect(sc.dodajPredmet('Matematicka analiza', 'Irena', 0))
                .to.be.revertedWith('dodajPredmet: ESPB mora biti veci od 0!');
        });

        it('should return correct grade', async () => {
            await sc.upisiStudenta(student.address, '3/2019', 1);

            for (let i = 0; i < 5; i++) {
                await sc.dodajPredmet('Mata '.concat(i.toString()), 'Profa '.concat(i.toString()), i + 1);
                await sc.polozioPredmet(student.address, i, 51 + i * 10);
                expect(await sc.izracunajOcenu(student.address, i)).to.be.eq(6 + i);
            }

            await sc.dodajPredmet('Mata 5', 'Profa 5', 6);
            expect(await sc.izracunajOcenu(student.address, 5)).to.be.eq(5);
        });

        it('should revert on already polozen predmet', async () => {
            await sc.dodajPredmet('Mata 1', 'Profa 1', 6);
            await sc.upisiStudenta(student.address, '3/2019', 1);

            await sc.polozioPredmet(student.address, 0, 99);
            await expect(sc.polozioPredmet(student.address, 0, 99))
                .to.be.revertedWith('polozioPredmet: Student je vec polozio predmet!');
        });

        it('should revert on bad predmetID', async () => {
            await sc.dodajPredmet('Mata 1', 'Irena Jovanovic', 6);
            await sc.getPredmet(0);

            await expect(sc.getPredmet(4))
                .to.be.revertedWith('validanPredmet: Predmet sa tim ID-em ne postoji ili je obrisan!');
        });

        it('should revert on <51 poena', async () => {
            await sc.dodajPredmet('Mata 1', 'Profa 1', 6);
            await sc.upisiStudenta(student.address, '3/2019', 1);

            await expect(sc.polozioPredmet(student.address, 0, 34))
                .to.be.revertedWith('polozioPredmet: Student ne moze poloziti sa manje od 51 poen!');
        });

        it('should emit PolozenPredmet correctly', async () => {
            await sc.dodajPredmet('Mata 1', 'Profa 1', 6);
            await sc.upisiStudenta(student.address, '3/2019', 1);

            await expect(sc.polozioPredmet(student.address, 0, 98))
                .to.emit(sc, 'PolozenPredmet').withArgs(student.address, 0);
        });
    });
});