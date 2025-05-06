import RbSheet from '../../../../components/rbSheet';
import {Image, StyleSheet, Text, View} from 'react-native';
import Button from '../../../../components/button';
import React, {useRef} from 'react';

type PropsModel = {
  show: boolean;
  onClose: () => void;
  type: string;
};

const Index: React.FC<PropsModel> = props => {
  const {show, onClose, type} = props;
  const refRBSheet = useRef();

  return (
    <View>
      <RbSheet
        ref={refRBSheet}
        disabled={true}
        height={520}
        visible={show}
        onClose={onClose}>
        <View style={{padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 10,
            }}>
            <Image
              source={require('../../../../assets/img/png/certificate_info_banner.png')}
              resizeMethod="resize"
            />
          </View>
          <Text
            style={[
              styles.titleText,
              {
                color: '#000',
                borderBottomWidth: 0,
              },
            ]}>
            {type === 'rishe' && 'گواهی امضا مرکز ریشه وزارت صمت'}
            {type === 'namad' && 'گواهی امضا نماد بانک مرکزی'}
          </Text>
          <Text style={[styles.text]}>
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
            استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است،
          </Text>
          <View>
            <Button title="متوجه شدم!" type="success" onPress={onClose} />
          </View>
        </View>
      </RbSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#253858',
    fontSize: 14,
    fontFamily: 'YekanBakh-Bold',
    marginVertical: 4,
  },
  titleText: {
    color: '#00091A',
    fontSize: 22,
    fontFamily: 'YekanBakh-Bold',
    marginVertical: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  validationIcon: {
    width: 22,
    height: 22,
  },
  btnGroupWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnWrapper: {
    width: '50%',
  },

  infoWrapper: {
    borderRadius: 10,
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#FFFBE6',
  },
  infoTextWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  infoIcon: {
    width: 25,
    height: 25,
  },

  infoTextHeader: {
    color: '#00091A',
    fontSize: 18,
    fontFamily: 'YekanBakh-Bold',
  },
});

export default Index;
