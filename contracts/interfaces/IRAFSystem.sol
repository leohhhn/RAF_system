// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IRAFSystem {

    enum Smer {RN, RI, D, IT}

    event UpisanStudent(Student _student);
    event IspisanStudent(Student _student);
    event DodatPredmet(string indexed _nazivPredmeta, uint256 indexed _predmetID);
    event PolozenPredmet(address _student, uint256 _predmetID);
    event DodatProfesor(address _noviProfesor);

    struct Student {
        Smer smer;
        uint8 godinaStudiranja; // 1, 2, 3, 4
        uint8 diplomiran;
        string indeks; // npr 102/2020
    }

    struct Predmet {
        uint64 polozilo; // br studenata koji su polozili predmet
        uint8 espb;
        string nazivPredmeta;
        string profesor;
    }

    function upisiStudenta(address _noviStudent, string memory _indeks, Smer _smer) external;

    function ispisiStudenta(address _noviStudent) external;

    function polozioPredmet(address _student, uint _predmetID, uint8 _bodovi) external;

    function dodajPredmet(string memory _nazivPredmeta, string memory _imeProfesora, uint8 _espb) external;

    function izracunajOcenu(address _student, uint _predmetID) view external returns (uint8);

    function getPredmet(uint _predmetID) external view returns (Predmet memory);

    function dodajProfesora(address _noviProfesor) external;
}
