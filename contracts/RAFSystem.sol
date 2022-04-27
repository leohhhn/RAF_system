// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./interfaces/IRAFSystem.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RAFSystem is IRAFSystem {
    using Counters for Counters.Counter;
    Counters.Counter private _predmetIDCounter;

    mapping(address => Student) public studenti;
    mapping(address => bool) public profesori;

    mapping(uint => Predmet) public predmeti;
    mapping(uint => mapping(address => uint8)) polozeno;  // PREDMET > (STUDENT > BODOVI)

    modifier samoProfesor {
        require(profesori[msg.sender], "samoProfesor: Niste profesor!");
        _;
    }

    modifier validanStudent(address _student) {
        require(studenti[_student].godinaStudiranja != 0, "validanStudent: Student nije upisan ili je vec ispisan!");
        _;
    }

    modifier validanPredmet(uint256 _predmetID) {
        require(bytes(predmeti[_predmetID].nazivPredmeta).length != 0, "validanPredmet: Predmet sa tim ID-em ne postoji ili je obrisan!");
        _;
    }

    constructor() {
        profesori[msg.sender] = true;
    }

    function upisiStudenta(address _noviStudent, string memory _indeks, Smer _smer) override public samoProfesor {
        require(studenti[_noviStudent].godinaStudiranja == 0, "upisiStudenta: Student je vec upisan!");
        Student memory _novi = Student(_smer, 1, 0, _indeks);

        studenti[_noviStudent] = _novi;
        emit UpisanStudent(_novi);
    }

    function ispisiStudenta(address _student) override public samoProfesor validanStudent(_student) {
        emit IspisanStudent(studenti[_student]);
        delete studenti[_student];
    }

    function polozioPredmet(address _student, uint _predmetID, uint8 _poeni) override public samoProfesor validanStudent(_student) validanPredmet(_predmetID) {
        require(_poeni >= 51, "polozioPredmet: Student ne moze poloziti sa manje od 51 poen!");
        require(polozeno[_predmetID][_student] == 0, "polozioPredmet: Student je vec polozio predmet!");

        polozeno[_predmetID][_student] = _poeni;
        predmeti[_predmetID].polozilo++;

        emit PolozenPredmet(_student, _predmetID);
    }

    function izracunajOcenu(address _student, uint _predmetID) view override public validanStudent(_student) validanPredmet(_predmetID) returns (uint8) {
        uint8 _poeni = polozeno[_predmetID][_student];

        if (_poeni == 0) {// student nije polozio predmet
            return 5;
        } else if (_poeni <= 60) {
            return 6;
        } else if (_poeni <= 70) {
            return 7;
        } else if (_poeni <= 80) {
            return 8;
        } else if (_poeni <= 90) {
            return 9;
        } else {
            return 10;
        }
    }

    function getLatestPredmetID() view public returns (uint256) {
        return Counters.current(_predmetIDCounter) - 1;
    }

    function getPredmet(uint _predmetID) public override view validanPredmet(_predmetID) returns (Predmet memory)  {
        return predmeti[_predmetID];
    }

    function dodajProfesora(address _noviProfesor) public override samoProfesor {
        profesori[_noviProfesor] = true;
        emit DodatProfesor(_noviProfesor);
    }

    function dodajPredmet(string memory _nazivPredmeta, string memory _imeProfesora, uint8 _espb) public override samoProfesor {
        require(bytes(_nazivPredmeta).length != 0 && bytes(_imeProfesora).length != 0, "dodajPredmet: Imena predmeta i profesora ne mogu biti prazni!");
        require(_espb > 0, "dodajPredmet: ESPB mora biti veci od 0!");

        Predmet memory _noviPredmet = Predmet(0, _espb, _nazivPredmeta, _imeProfesora);
        uint256 _predmetID = Counters.current(_predmetIDCounter);
        predmeti[_predmetID] = _noviPredmet;

        Counters.increment(_predmetIDCounter);
        emit DodatPredmet(_nazivPredmeta, _predmetID);
    }

}