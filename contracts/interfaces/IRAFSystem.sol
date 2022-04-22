// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IRAFSystem {

    enum Smer {RN, RI, D, IT}

    event UpisanStudent(address _student, string indeks, Smer smer);
    event DodatPredmet(string _nazivPredmeta, uint256 _predmetID);
    event PolozenPredmet(address _student, uint256 _predmetID);
    event DodatProfesor(address _noviProfesor);

    struct Student {
        string indeks; // npr 102/2020
        Smer smer;
        uint8 godinaStudiranja; // 1, 2, 3, 4
    }

    struct Predmet {
        string nazivPredmeta;
        string profesor;
        uint256 polozilo; // br studenata koji su polozili predmet
    }

    function upisiStudenta(address _noviStudent, string memory _indeks, Smer _smer) external;

    function polozioPredmet(address _student, uint _predmetID, uint8 _bodovi) external;

    function izracunajOcenu(address _student, uint _predmetID) view external returns (uint8);


}
