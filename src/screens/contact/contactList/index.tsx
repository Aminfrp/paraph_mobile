import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import ContactListFilter from '../components/contactListFilter';
import ContactList from '../components/contactList';
import {loadContactService, deleteContactService} from '../../../apis';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ContactInfoModal from '../components/contactInfoModal';
import useCurrentRoute from '../../../hooks/useCurrentRoute';
import ContactFilter from '../filter';
import initialFilter from './initialFilter';
import colors from '../../../assets/theme/colors';
import * as routesName from '../../../constants/routesName';
import {ContactModel} from '../../../model/contact.model';
import {Logger} from '../../../modules/log/logger';
import {ContactFilterModel} from '../../../model/contactFilter.model';
import useCustomState from '../../../hooks/useCustomState.ts';

const Index: React.FC = () => {
  const navigation = useNavigation();
  const {navigate} = navigation;

  const [filter, setFilter] = useCustomState<ContactFilterModel>({
    ...initialFilter,
  });
  const [userType, setUserType] = useCustomState('ALL');
  const [pageFilter, setPageFilter] = useCustomState(0);
  const [contacts, setContacts] = useCustomState<ContactModel[]>([]);
  const [contactsLength, setContactsLength] = useCustomState(0);
  const [isDataEnded, setIsDataEnded] = useCustomState(false);
  const [showOptions, setShowOptions] = useCustomState(false);
  const [selectedContacts, setSelectedContacts] = useCustomState<
    ContactModel[]
  >([]);
  const [isSelectedAllContacts, setIsSelectedAllContacts] =
    useCustomState(false);
  const [isAllChecked, setIsAllChecked] = useCustomState(false);
  const [contactInfoModalValue, setContactInfoModalValue] = useCustomState<{
    show: boolean;
    contact: ContactModel | null;
  }>({
    show: false,
    contact: null,
  });
  const [isFilter, setIsFilter] = useCustomState(false);
  const [filterInputValue, setFilterInputValue] = useCustomState('');

  const [removeContactsLoading, setRemoveContactsLoading] = useState(false);
  const [getContactsLoading, setGetContactsLoading] = useState(false);

  const isFocused = useIsFocused();

  useCurrentRoute(true);

  const toggleOptionsBar = () => setShowOptions(!showOptions);

  useEffect(() => {
    if (isFocused) {
      getContacts(filter).then(r => null);
    }
  }, [filter, isFocused]);

  useEffect(() => {
    pageFilter !== 0 &&
      !isDataEnded &&
      setFilter({...filter, offset: pageFilter * 10, reset: false});
  }, [pageFilter]);

  useEffect(() => setContactsLength(contacts.length), [contacts]);

  useEffect(() => {
    showOptions && toggleSelectAllContacts(isSelectedAllContacts);
  }, [isSelectedAllContacts]);

  useEffect(() => {
    showOptions &&
      isSelectedAllContacts &&
      toggleSelectAllContacts(isSelectedAllContacts);
  }, [contactsLength]);

  useEffect(() => {
    const selectedCount = selectedContacts && selectedContacts.length;
    if (showOptions) {
      if (selectedCount === contactsLength) {
        setIsAllChecked(true);
      }
    }
  }, [selectedContacts]);

  const getContacts = async (filter: ContactFilterModel) => {
    try {
      const {reset, ...otherFilters} = filter;
      setGetContactsLoading(true);

      const response = await loadContactService(otherFilters);
      const data = response && response.data;
      const countData = response && response.countData;

      if (data.length > 0) {
        if (reset) {
          setContacts([...data]);
        } else {
          const updatedContacts = [...contacts, ...data];
          setContacts(updatedContacts);
        }
      } else {
        if (reset) {
          setContacts([...data]);
        }
        setIsDataEnded(true);
      }

      setGetContactsLoading(false);
    } catch (error) {
      Logger.debugLogger('error in getContacts:', error);
      setGetContactsLoading(false);
    }
  };

  const loadMoreData = () => {
    setPageFilter(pageFilter + 1);
  };

  const onUserType = (userType: string) => {
    setFilterInputValue('');
    if (userType === 'ALL') {
      setFilter({...initialFilter});
      setUserType('ALL');
    }
    if (userType === 'ONLY_NOT_LEGAL') {
      setFilter({...initialFilter, legalUser: false});
      setUserType('ONLY_NOT_LEGAL');
    }
    if (userType === 'ONLY_LEGAL') {
      setFilter({...initialFilter, legalUser: true});
      setUserType('ONLY_LEGAL');
    }
  };

  const removeContacts = async () => {
    try {
      setRemoveContactsLoading(true);

      await removeContactsHandler(selectedContacts).then(() => {
        setFilter({...initialFilter});
        resetSelected();
      });

      setRemoveContactsLoading(false);
    } catch (error) {
      Logger.debugLogger('error in remove contacts:', error);
      setRemoveContactsLoading(false);
    }
  };

  const removeContactsHandler = async (list: ContactModel[]) => {
    try {
      let index: number = 0;
      const chunkList: {[name: string]: ContactModel[]} = {};

      if (list.length > 0) {
        const chunkSize = 50;
        for (let i = 0; i < list.length; i += chunkSize) {
          const chunk = list.slice(i, i + chunkSize);

          chunkList[index] = chunk;

          index = index + 1;
        }
      }

      for (let el in chunkList) {
        const list = chunkList[el];
        await deleteContactService(list);
      }
    } catch (error) {
      Logger.debugLogger('error in removeContactsHandler:', error);
    }
  };

  const getCardBorderColor = (id: string) => {
    const isItemExist =
      selectedContacts &&
      selectedContacts.length > 0 &&
      selectedContacts.find(el => el.id === id);

    return isItemExist ? colors.primary.success : colors.white;
  };

  const holdContactHandler = (item: ContactModel) => {
    setShowOptions(true);
    const selectedList: ContactModel[] = [...selectedContacts, item];
    setSelectedContacts(selectedList);
  };

  const onContactHandler = (item: ContactModel) => {
    if (showOptions) {
      onFilterContactsHandler(item);
    } else {
      Logger.debugLogger('show contacts details...');
      toggleContactInfoModal(true, item);
    }
  };

  const onFilterContactsHandler = (item: ContactModel) => {
    const isItemExist =
      selectedContacts &&
      selectedContacts.length > 0 &&
      selectedContacts.find((el: ContactModel) => el.id === item.id);

    if (isItemExist) {
      const selectedList = selectedContacts.filter(
        (el: ContactModel) => el.id !== item.id,
      );
      setSelectedContacts(selectedList);
      isAllChecked && setIsAllChecked(false);
    } else {
      const selectedList: ContactModel[] = [...selectedContacts, item];
      setSelectedContacts(selectedList);
    }
  };

  const resetSelected = () => {
    toggleOptionsBar();
    setSelectedContacts([]);
    setIsAllChecked(false);
    setIsSelectedAllContacts(false);
  };

  const toggleSelectAllContacts = (isSelectedAllContacts: boolean) => {
    if (isSelectedAllContacts) {
      setSelectedContacts(contacts);

      return;
    }
    setSelectedContacts([]);
  };

  const toggleCheckbox = () => {
    if (!isAllChecked) {
      // toggleSelectAllContacts(true);
      setIsAllChecked(true);

      if (isSelectedAllContacts) {
        toggleSelectAllContacts(true);

        return;
      }
      setIsSelectedAllContacts(true);

      return;
    }

    setIsSelectedAllContacts(!isSelectedAllContacts);
    setIsAllChecked(!isAllChecked);
  };

  const toggleContactInfoModal = (
    show = true,
    contact: ContactModel | null,
  ) => {
    setContactInfoModalValue({show, contact});
  };

  const createContract = () => {
    // @ts-ignore
    navigate(routesName.CREATE_CONTRACT, {
      screen: routesName.CREATE_CONTRACT,
      params: {
        contact: contactInfoModalValue.contact,
      },
    });
    toggleContactInfoModal(false, null);
  };

  const editContact = () => {
    // @ts-ignore
    navigate(routesName.CREATE_CONTACT, {
      contact: contactInfoModalValue.contact,
    });
    toggleContactInfoModal(false, null);
  };

  const onFilterBar = () => setIsFilter(!isFilter);

  const onSubmitFilter = <T,>(params: ContactFilterModel) => {
    if (userType === 'ALL') {
      setFilter({...initialFilter, ...params});
    }
    if (userType === 'ONLY_NOT_LEGAL') {
      setFilter({...initialFilter, ...params, legalUser: false});
    }
    if (userType === 'ONLY_LEGAL') {
      setFilter({...initialFilter, ...params, legalUser: true});
    }

    setPageFilter(0);
    setIsDataEnded(false);
    setFilterInputValue(params.firstName + ' ' + params.lastName);
    onFilterBar();
  };

  const onResetFilter = () => {
    setFilter({...initialFilter});
    setUserType('ALL');
    setPageFilter(0);
    setIsDataEnded(false);
    setFilterInputValue('');
    onFilterBar();
  };

  return (
    <>
      {isFilter ? (
        <ContactFilter
          onSubmit={(input: ContactFilterModel) => onSubmitFilter(input)}
          onResetFilter={onResetFilter}
        />
      ) : (
        <View style={{flex: 1}}>
          <ContactListFilter
            toggleOptionsBar={resetSelected}
            showOptions={showOptions}
            removeContacts={removeContacts}
            selectedContactsCount={selectedContacts && selectedContacts.length}
            contactsCount={contacts && contacts.length}
            toggleCheckbox={toggleCheckbox}
            isAllChecked={isAllChecked}
            removeContactsLoading={removeContactsLoading}
            onFilterBar={onFilterBar}
            filterInputValue={filterInputValue}
          />
          <ContactList
            data={contacts}
            loadMoreData={loadMoreData}
            loading={getContactsLoading}
            getCardBorderColor={getCardBorderColor}
            holdContactHandler={
              !showOptions
                ? (item: ContactModel) => holdContactHandler(item)
                : () => null
            }
            onContactHandler={onContactHandler}
            onUserType={onUserType}
            userType={userType}
          />
        </View>
      )}
      {contactInfoModalValue.contact && (
        <ContactInfoModal
          visible={contactInfoModalValue.show}
          data={contactInfoModalValue.contact}
          onClose={() => toggleContactInfoModal(false, null)}
          createContract={createContract}
          editContact={editContact}
        />
      )}
    </>
  );
};

export default Index;
