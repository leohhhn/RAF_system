import { RafSystemContract } from './contractRegistryService';

import { RafClass } from '../Core/Models';
import callTx from './txService';

export const getLatestClassID = async () => {
  const contract = await RafSystemContract();
  return contract.methods.getLastestPredmetID().call();
}
// @ts-ignore
window.getLatestClassID = getLatestClassID;

export const getClassById = async (id: number) => {
  const contract = await RafSystemContract();
  const rafClass = await contract.methods.getPredmet(id).call();
  return RafClass.buildFromResponse(rafClass);
}
// @ts-ignore
window.getClassById = getClassById;

export const isWalletProfessor = async (address: string) => {
  const contract = await RafSystemContract();
  return contract.methods.profesori(address).call();
}
// @ts-ignore
window.isWalletProfessor = isWalletProfessor;

export const addClass = async (address: string, className: string, professorName: string, espb: number) => {
  const contract = await RafSystemContract();
  return callTx(contract, 'dodajPredmet', [className, professorName, espb], { from: address });
}
// @ts-ignore
window.addClass = addClass;

export const addStudent = async (address: string, studentAddress: string, index: string, department: number) => {
  const contract = await RafSystemContract();
  return callTx(contract, 'upisiStudenta', [studentAddress, index, department], { from: address });
}
// @ts-ignore
window.addStudent = addStudent;
