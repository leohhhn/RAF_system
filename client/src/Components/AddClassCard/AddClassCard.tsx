import React, { FC, useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { Card } from '../Card/Card';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { addClassAction } from '../../Redux/Actions/projectActions';

type AddClassCardProps = {
  address: string;
};

const AddClassCard: FC<AddClassCardProps> = ({ address }) => {
  const dispatch: Dispatch = useDispatch();

  const [className, setClassName] = useState<string>('');
  const [professorName, setProfessorName] = useState<string>('');
  const [espb, setEspb] = useState<string>('');

  // @ts-ignore
  const addingClass = useSelector(state => state.project.addingClass);
  // @ts-ignore
  const addingClassError = useSelector(state => state.project.addingClassError);
  // @ts-ignore
  const addedClass = useSelector(state => state.project.addedClass);

  const isFormValid = () => {
    return !!className && !!professorName && !!espb;
  };

  const handleAddClassClick = () => {
    if (!address || !isFormValid()) {
      return;
    }

    // @ts-ignore
    dispatch(addClassAction(
      address,
      className,
      professorName,
      parseInt(espb),
    ));
  };

  return (
    <Card>
      <div className="BoldText FontSize3 MarginBottom4">
        Add New RAF Class
      </div>
      <div className="DisplayFlex FlexDirectionColumn FlexGap0">
        <Input
          value={className}
          placeholder="Class Name"
          disabled={addingClass}
          onChange={(event) => setClassName(event)}
        />

        <Input
          value={professorName}
          placeholder="Professor Name"
          disabled={addingClass}
          onChange={(event) => setProfessorName(event)}
        />

        <Input
          type="number"
          value={espb}
          placeholder="ESPB"
          disabled={addingClass}
          onChange={(event) => setEspb(event)}
        />

        <div className="DisplayFlex">
          <Button disabled={!address || addingClass || !isFormValid()} onClick={handleAddClassClick}>
            <span>{addingClass ? 'Confirming...' : 'Add Class'}</span>
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

export { AddClassCard };
