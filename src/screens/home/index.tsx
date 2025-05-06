import React, {useState, useEffect} from 'react';
import Header from './components/header';
import Drafts from './drafts';
import NeedsToBeChecked from './needsToBeChecked';
import {getAllContractsService, getAllDraftsService} from '../../apis';
import {getAsyncStorage} from '../../helpers/asyncStorage';
import * as keyStorage from '../../constants/keyStorage';
import {Logger} from '../../modules/log/logger';
import useActiveRouteNameSetter from '../../hooks/useActiveRouteNameSetter.ts';
import {ContractModel} from '../../model/contract.model.ts';
import {DraftModel} from '../../model/draft.model.ts';

const Index: React.FC = () => {
  const [activeFilter, setActiveFilterName] = useState('اسناد نیازمند بررسی');
  const [detectInitialTabLoading, setInitialTabLoading] = useState(false);

  useActiveRouteNameSetter();

  useEffect(() => {
    // detectActiveFilterByLastDocument().then(null);
    return () => {};
  }, []);

  const getLastDocumentSubmitTime = async () => {
    try {
      const contactInfo = await getAsyncStorage(
        'object',
        keyStorage.CONTACT_INFO,
      );

      const documentParams = {
        accountOwner: false,
        contractStateTypesNot:
          '4&contractStateTypesNot=5&contractStateTypesNot=6',
        pageNumber: 0,
        pageSize: 1,
        contactId: contactInfo.id,
        isInitiator: false,
      };

      const response = await getAllContractsService(documentParams);

      const documentData =
        response && response.data && response.data.contractHashAndSignersMap;

      const lastDocument: ContractModel =
        documentData &&
        Object.values<any>(documentData).length > 0 &&
        Object.values<any>(documentData)[0][0];
      return (
        (lastDocument &&
          lastDocument.contractDto &&
          lastDocument.contractDto?.fromDate) ||
        0
      );
    } catch (error: any) {}
  };

  const getLastDraftSubmitTime = async () => {
    try {
      const draftsParams = {
        pageNumber: 0,
        pageSize: 1,
      };
      const draftsResponse = await getAllDraftsService(draftsParams);

      const lastDraftData: DraftModel =
        draftsResponse &&
        draftsResponse.data &&
        draftsResponse.data.draftDtoList[0];

      return (
        (lastDraftData &&
          lastDraftData.draftStateDtos &&
          lastDraftData.draftStateDtos[0].submitTime) ||
        0
      );
    } catch (error) {}
  };

  const detectActiveFilterByLastDocument = async () => {
    try {
      setInitialTabLoading(true);

      const lastDocumentCreatedDate = await getLastDocumentSubmitTime();

      const lastDraftCreatedDate = await getLastDraftSubmitTime();

      if (!lastDraftCreatedDate && !lastDocumentCreatedDate) {
        setActiveFilterName('اسناد در انتظار امضا');
      }

      if (lastDraftCreatedDate && !lastDocumentCreatedDate) {
        setActiveFilterName('اسناد نیازمند بررسی');
      }

      if (!lastDraftCreatedDate && lastDocumentCreatedDate) {
        setActiveFilterName('اسناد در انتظار امضا');
      }

      if (lastDraftCreatedDate && lastDocumentCreatedDate) {
        if (
          lastDraftCreatedDate &&
          lastDraftCreatedDate < lastDocumentCreatedDate
        ) {
          setActiveFilterName('اسناد در انتظار امضا');
        } else {
          setActiveFilterName('اسناد نیازمند بررسی');
        }
      }

      setInitialTabLoading(false);
    } catch (error) {
      Logger.debugLogger('error in detectActiveFilterByLastDocument: ', error);
      setInitialTabLoading(false);
    }
  };

  return (
    <>
      <Header
        activeFilterName={activeFilter}
        onPress={setActiveFilterName}
        loading={detectInitialTabLoading}
      />
      {!detectInitialTabLoading && (
        <>
          {activeFilter === 'اسناد در انتظار امضا' ? (
            <NeedsToBeChecked />
          ) : (
            <Drafts />
          )}
        </>
      )}
    </>
  );
};

export default Index;
