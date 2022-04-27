import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Card } from '../Card/Card';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { addStudent } from '../../Services/projectService';

type AddClassCardProps = {
  address: string;
};

const AddStudentCard: FC<AddClassCardProps> = ({ address }) => {
  const [studentAddress, setStudentAddress] = useState<string>('');
  const [studentIndex, setStudentIndex] = useState<string>('');
  const [studentDepartment, setStudentDepartment] = useState<string>('');

  // @ts-ignore
  const addingClass = useSelector(state => state.project.addingClass);
  // @ts-ignore
  const addingClassError = useSelector(state => state.project.addingClassError);
  // @ts-ignore
  const addedClass = useSelector(state => state.project.addedClass);

  const isFormValid = () => {
    return !!studentAddress && !!studentIndex && !!studentDepartment;
  };

  const handleAddClassClick = async () => {
    if (!address || !isFormValid()) {
      return;
    }

    // @ts-ignore
    await addStudent(
      address,
      studentAddress,
      studentIndex,
      parseInt(studentDepartment),
    );
  };

  return (
    <Card>
      <div className="BoldText FontSize3 MarginBottom4">
        Add New RAF Student
      </div>
      <div className="DisplayFlex FlexDirectionColumn FlexGap0">
        <Input
          value={studentAddress}
          placeholder="Student Wallet Address"
          disabled={addingClass}
          onChange={(event) => setStudentAddress(event)}
        />

        <Input
          value={studentIndex}
          placeholder="Student Index"
          disabled={addingClass}
          onChange={(event) => setStudentIndex(event)}
        />

        <Input
          type="number"
          value={studentDepartment}
          placeholder="Department"
          disabled={addingClass}
          onChange={(event) => setStudentDepartment(event)}
        />

        <div className="DisplayFlex">
          <Button disabled={!address || addingClass || !isFormValid()} onClick={handleAddClassClick}>
            <span>{addingClass ? 'Confirming...' : 'Add Student'}</span>
          </Button>
        </div>

        {addedClass && (
          <div>
            <pre className="BackgroundGray Padding1">{JSON.stringify(addedClass, null, 2)}</pre>
          </div>
        )}
        {addingClassError && (
          <div className="BackgroundGray DangerText Padding1">
            {addingClassError}
          </div>
        )}
      </div>
    </Card>
  );
};

export { AddStudentCard };
