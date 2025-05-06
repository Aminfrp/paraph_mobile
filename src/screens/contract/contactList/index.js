import React, {useState, useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import ContactListFilter from '../components/contactListFilter';
import ContactList from '../../contact/components/contactList';
import OrderContactList from '../components/createContractOrderContactList';
import {loadContactService} from '../../../apis';
import {useIsFocused} from '@react-navigation/native';
import useCurrentRoute from '../../../hooks/useCurrentRoute';
import ContactFilter from '../../contact/filter';
import initialFilter from '../../contact/contactList/initialFilter';
import colors from '../../../assets/theme/colors';
import {checkFirstOrderValid} from '../../../modules/validation/validation';
import useParamsState from '../../../hooks/useParamsState';
import debugLogger from '../../../helpers/debugLogger';

const Index = props => {
  const paramsState = useParamsState();
  const {onBack, setSelectContactList, selectContactsList, resetError} =
    paramsState;

  const [filter, setFilter] = useState({...initialFilter});
  const [pageFilter, setPageFilter] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [contactsLength, setContactsLength] = useState(0);
  const [isDataEnded, setIsDataEnded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([
    ...selectContactsList,
  ]);
  const [isSelectedAllContacts, setIsSelectedAllContacts] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [filterInputValue, setFilterInputValue] = useState('');
  const [isOrderList, setIsOrderList] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [getContactsLoading, setGetContactsLoading] = useState(false);

  const isFocused = useIsFocused();
  const refRBSheet = useRef();

  const onBackHandle = () => {
    resetSelected();
    onBack();
  };

  useCurrentRoute(true, onBackHandle);

  const toggleOptionsBar = () => setShowOptions(!showOptions);

  useEffect(() => {
    if (isFocused) {
      getContacts(filter);
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
        // setIsSelectedAllContacts(true);
      }
    }
  }, [selectedContacts]);

  const getContacts = async filter => {
    try {
      const {reset, ...otherFilters} = filter;
      setGetContactsLoading(true);

      const response = await loadContactService(otherFilters);
      const data = response && response.data;
      const countData = response && response.countData;

      if (data.length > 0) {
        if (reset) {
          setContacts(prev => [...data]);
        } else {
          setContacts(prev => [...prev, ...data]);
        }
      } else {
        if (reset) {
          setContacts(prev => [...data]);
        }
        setIsDataEnded(true);
      }

      setGetContactsLoading(false);
    } catch (error) {
      debugLogger('error in getContacts:', error);
      setGetContactsLoading(false);
    }
  };

  const loadMoreData = () => {
    setPageFilter(pageFilter + 1);
  };

  const selectContacts = async () => {
    try {
      setIsOrderList(true);
    } catch (error) {
      debugLogger('error in selectContacts contacts:', error);
    }
  };

  const getCardBorderColor = id => {
    const isItemExist = isContactSelect({id});

    return isItemExist ? colors.primary.success : colors.white;
  };

  const onContactHandler = item => {
    setShowOptions(true);
    onFilterContactsHandler(item);
  };

  const onFilterContactsHandler = item => {
    const isItemExist = isContactSelect(item);

    if (isItemExist) {
      setSelectedContacts(prev => prev.filter(el => el.id !== item.id));
      isAllChecked && setIsAllChecked(false);
    } else {
      setSelectedContacts(prev => [...prev, item]);
    }
  };

  const isContactSelect = item => {
    return (
      selectedContacts &&
      selectedContacts.length > 0 &&
      selectedContacts.find(el => el.id === item.id)
    );
  };

  const resetSelected = () => {
    toggleOptionsBar();
    setIsAllChecked(false);
    setIsSelectedAllContacts(false);
  };

  const toggleSelectAllContacts = isSelectedAllContacts => {
    if (isSelectedAllContacts) {
      setSelectedContacts(contacts);

      return;
    }
    setSelectedContacts([]);
  };

  const toggleCheckbox = () => {
    if (!isAllChecked) {
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

  const onFilterBar = () => setIsFilter(!isFilter);

  const onSubmitFilter = params => {
    setFilter({...initialFilter, ...params});
    setPageFilter(0);
    setIsDataEnded(false);
    setFilterInputValue(params.firstName + ' ' + params.lastName);

    onFilterBar();
  };

  const onResetFilter = () => {
    setFilter({...initialFilter});
    setPageFilter(0);
    setIsDataEnded(false);
    setFilterInputValue('');
    onFilterBar();
  };

  const closeOrderContactList = () => {
    setIsOrderList(false);
    setOrderError(null);
  };

  const onSubmit = list => {
    const hasFirstOrder = list && checkFirstOrderValid(list);

    if (hasFirstOrder) {
      if (list.length !== 0) {
        resetError('selectedContacts');
      }
      closeOrderContactList();
      setSelectContactList(list);
      onBackHandle();

      return;
    }

    setOrderError('حداقل یکی از امضا کنندگان اولویت اول باشد.');
  };

  const onUserType = userType => {
    if (userType === 'ALL') {
      setFilter({...initialFilter});
    }
    if (userType === 'ONLY_NOT_LEGAL') {
      setFilter({...initialFilter, legalUser: false});
    }
    if (userType === 'ONLY_LEGAL') {
      setFilter({...initialFilter, legalUser: true});
    }
  };

  return (
    <>
      {isFilter ? (
        <ContactFilter
          onSubmit={onSubmitFilter}
          onResetFilter={onResetFilter}
        />
      ) : (
        <View style={{flex: 1}}>
          <ContactListFilter
            toggleOptionsBar={resetSelected}
            showOptions={showOptions}
            selectContacts={selectContacts}
            selectedContactsCount={selectedContacts && selectedContacts.length}
            contactsCount={contacts && contacts.length}
            toggleCheckbox={toggleCheckbox}
            isAllChecked={isAllChecked}
            selectContactsLoading={false}
            onFilterBar={onFilterBar}
            filterInputValue={filterInputValue}
            onBack={onBackHandle}
          />

          <ContactList
            data={contacts}
            loadMoreData={loadMoreData}
            loading={getContactsLoading}
            getCardBorderColor={getCardBorderColor}
            holdContactHandler={
              !showOptions ? item => onContactHandler(item) : () => null
            }
            onContactHandler={onContactHandler}
            showCreateBtn={false}
            onUserType={onUserType}
          />
        </View>
      )}
      <OrderContactList
        data={selectedContacts}
        setData={setSelectContactList}
        setList={setSelectedContacts}
        refRBSheet={refRBSheet}
        visible={isOrderList}
        onClose={closeOrderContactList}
        onSubmit={onSubmit}
        error={orderError}
      />
    </>
  );
};

export default Index;
