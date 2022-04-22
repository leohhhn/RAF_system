// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./interfaces/IRAFSystem.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RAFSystem is IRAFSystem {
    using Counters for Counters.Counter;
    Counters.Counter private _predmetIDCounter;

    mapping(address => Student) _studenti;
    mapping(address => bool) _profesori;

    mapping(uint => Predmet) _predmeti;
    mapping(uint => mapping(address => uint8)) _polozili;  // PREDMET > (STUDENT > BODOVI)

    modifier samoProfesor{
        require(_profesori[msg.sender], "Niste profesor!");
        _;
    }

    constructor() {
        _profesori[msg.sender] = true;
    }

    function upisiStudenta(address _noviStudent, string memory _indeks, Smer _smer) override public samoProfesor {
        require(_studenti[_noviStudent].godinaStudiranja == 0, "upisiStudenta: Student je vec upisan!");
        Student memory _novi = Student(_indeks, _smer, 1);

        _studenti[_noviStudent] = _novi;
        emit UpisanStudent(_noviStudent);
    }

    function polozioPredmet(address _student, uint _predmetID, uint8 _poeni) override public samoProfesor {
        require(_studenti[_student].godinaStudiranja != 0, "polozioPredmet: Student ne postoji!");
        require(bytes(_predmeti[_predmetID].nazivPredmeta).length != 0, "polozioPredmet: Predmet ne postoji!");
        require(_poeni > 50, "polozioPredmet: Student moze poloziti sa manje od 51 bod!");

        _polozili[_predmetID][_student] = _poeni;
        _predmeti[_predmetID].polozilo++;
        emit PolozenPredmet(_student, _predmetID);
    }

    function dodajPredmet(string memory _nazivPredmeta, string memory _imeProfesora) public samoProfesor {
        require(bytes(_nazivPredmeta).length != 0 && bytes(_imeProfesora).length != 0, "dodajPredmet: Imena predmeta i profesora ne mogu biti prazni!");

        Predmet memory _noviPredmet = Predmet(_nazivPredmeta, _imeProfesora, 0);
        uint256 _predmetID = Counters.current(_predmetIDCounter);
        _predmeti[_predmetID] = _noviPredmet;

        Counters.increment(_predmetIDCounter);
        emit DodatPredmet(_nazivPredmeta, _predmetID);
    }

    function izracunajOcenu(address _student, uint _predmetID) view override public returns (uint8) {
        require(bytes(_predmeti[_predmetID].nazivPredmeta).length != 0, "izracunajOcenu: Predmet ne postoji!");
        require(_studenti[_student].godinaStudiranja != 0, "polozioPredmet: Student ne postoji!");

        uint8 _poeni = _polozili[_predmetID][_student];

        // todo test
        if (_poeni <= 50) {
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

    function getPredmet(uint _predmetID) public view returns (Predmet memory) {
        require(bytes(_predmeti[_predmetID].nazivPredmeta).length != 0, "getPredmet: Predmet ne postoji!");
        return _predmeti[_predmetID];
    }


}