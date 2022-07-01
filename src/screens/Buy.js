/* eslint-disable react-hooks/exhaustive-deps */
import {
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Button,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import RNIap, {
  purchaseUpdatedListener,
  finishTransaction,
  getInstallSourceAndroid,
} from 'react-native-iap';

import { subs} from '../conf';
import { useDispatch } from 'react-redux';
import { images } from '../assets';

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

export default function App() {
  const [products, setProducts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const initialIAP = useCallback(async () => {
    try {
      const source = getInstallSourceAndroid();
      setIsLoading(true);
      await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();

      purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
        const receipt = purchase.purchaseToken;
        if (receipt) {
          finishTransaction(purchase, true)
            .then(() => {
              handleCompletePurchase(purchase);
            })
            .catch(() => {
              Alert.alert('purchase is failed', 'the purchase is failed');
            });
        }
      });

      const subsSku = subs.map(item => item.sku);

      const resSubs = await RNIap.getSubscriptions(subsSku);


      setProducts(res);
      setSubscriptions(resSubs);
    } catch (err) {
      Alert.alert(err.message);
      // console.warn(err.code, err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initialIAP();

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);


  const handleCompletePurchase = ({productId}) => {

    switch (productId) {
      case subs[0].sku:
        dispatch(increamentByAmount(subs[0].value));
        break;
      case subs[1].sku:
        dispatch(increamentByAmount(subs[1].value));
        break;
      case subs[2].sku:
        dispatch(increamentByAmount(subs[2].value));
        break;
      case subs[3].sku:
        dispatch(increamentByAmount(subs[3].value));
        break;
      default:
        break;
    }
  };

  const handleRequestBuy = productId => {
    RNIap.requestPurchase(productId);
  };

  return (
    <ImageBackground source={images.background} style={styles.homeView}>
      <ScrollView
      style={styles.bg}
      contentContainerStyle={{paddingHorizontal: 20, paddingTop: 10, alignItems: 'center'}}>
      {isLoading ? (
        <ActivityIndicator size="small" />
      ) : (
        <>
          <Text style={styles.labelText}>Subscriptions</Text>
            {subscriptions.map((product, index) => (
              <View style={styles.item3} key={product.productId}>
                <TouchableOpacity
                  onPress={() => handleRequestBuy(product.productId)}
                  style={styles.item3Content}>
                  {/* <Image source={turnlogo} style={styles.d} /> */}
                  <Text style={styles.price}>{product.localizedPrice}</Text>
                  <Text style={styles.descr}>{product.description}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </>
      )}

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  items: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  homeView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    resizeMode: 'cover',
  },
  itemsSubs: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 30,
    fontFamily: 'MestizoFont',
    color: 'white',
  },
  item: {
    margin: 5,
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSub: {
    margin: 5,
    width: 150,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  d: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
  price: {
    fontFamily: 'MestizoFont',
    fontSize: 16,
    color: '#212121',
  },
  descr: {
    fontSize: 14,
    color: '#212121',
    fontFamily: 'MestizoFont',
  },
  itemList: {},
  item2: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    elevation: 2,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item2Body: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  item3: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    width: windowWidth * 0.8,
    height: windowHeight * 0.2,
  },
  item3Content: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    elevation: 2,
    marginBottom: 10,

    alignItems: 'center',
    justifyContent: 'space-between',
  },
});