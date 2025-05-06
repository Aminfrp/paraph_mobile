import React from 'react';
import Message from '../../message';
import {getPersianDate} from '../../../helpers/date';

const Index = props => {
  const {data, isContractInitiator} = props;
  const [isSigned, setIsSigned] = React.useState(false);
  const [isNotSigned, setIsNotSigned] = React.useState(false);
  const [signedDate, setSignedDate] = React.useState(null);
  const [unSignedDate, setUnSignedDate] = React.useState(null);
  const [isRejected, setIsRejected] = React.useState(false);
  const [rejectedDate, setRejectedDate] = React.useState(null);

  React.useEffect(() => {
    data.forEach(i => {
      if (i.contractStateType === 'SIGNED') {
        setIsSigned(true);
        setSignedDate(i.submitTime);
      } else if (i.contractStateType === 'NOT_SIGNED') {
        setIsNotSigned(true);
        setUnSignedDate(i.submitTime);
      } else if (i.contractStateType === 'REJECTED') {
        setIsRejected(true);
        setRejectedDate(i.submitTime);
      }
    });
  }, [data]);

  const renderRejectedMessage = () => {
    if (isContractInitiator) {
      return `شما سند را در تاریخ ${
        getPersianDate(rejectedDate).date
      } لغو کرده اید.`;
    } else {
      return ` سند شما در تاریخ ${
        getPersianDate(rejectedDate).date
      } لغو شده است.`;
    }
  };

  return (
    <>
      {!isRejected && isSigned && (
        <Message
          show={true}
          message={`شما سند را در تاریخ ${
            getPersianDate(signedDate).date
          } امضا کرده اید.`}
          type="success"
        />
      )}
      {!isRejected && isNotSigned && (
        <Message
          show={true}
          message={`شما سند را در تاریخ ${
            getPersianDate(unSignedDate).date
          } رد کرده اید.`}
          type="danger"
        />
      )}
      {isRejected && (
        <Message show={true} message={renderRejectedMessage()} type="danger" />
      )}
    </>
  );
};

export default Index;
