/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';

import RNIap, {
  purchaseUpdatedListener,
  finishTransaction,
} from 'react-native-iap';
import {useDispatch} from 'react-redux';
import {items} from '../conf';
import {increamentByAmount} from '../redux/pointSlice';
import { images } from '../assets';

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;
const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

export default function Buy() {
  // const [products, setProducts] = useState(fakeProducts);
  // const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const initialIAP = useCallback(async () => {
    try {
      setIsLoading(true);
      await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
        const receipt = purchase.purchaseToken;
        if (receipt) {
          finishTransaction(purchase, true)
            .then(() => {
              handleCompletePurchase(purchase.productId);
            })
            .catch(() => {
              Alert.alert('purchase is failed', 'the purchase is failed');
            });
        }
      });

      const res = await RNIap.getProducts(items.map(item => item.sku));

      setProducts(res);
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

  const handleCompletePurchase = productId => {
    switch (productId) {
      case items[0].sku:
        dispatch(increamentByAmount(items[0].value));
        break;
      case items[1].sku:
        dispatch(increamentByAmount(items[1].value));
        break;
      case items[2].sku:
        dispatch(increamentByAmount(items[2].value));
        break;
      case items[3].sku:
        dispatch(increamentByAmount(items[3].value));
        break;
      default:
        break;
    }
  };

  const handleRequestBuy = productId => {
    RNIap.requestPurchase(productId);
  };

  return (
    <View style={styles.homeView}>
    <ScrollView
      contentContainerStyle={{paddingHorizontal: 20, paddingTop: 10}}>
      {isLoading ? (
        <ActivityIndicator size="small" />
      ) : (
        <>
          <View style={styles.itemList3}>
            {products.map((product, index) => (
              <View style={styles.item3} key={product.productId}>
                <TouchableOpacity
                  onPress={() => handleRequestBuy(product.productId)}
                  style={styles.item3Content}>
                  <Text style={styles.price}>{product.localizedPrice}</Text>
                  <Text style={styles.descr}>{product.description}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  homeView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    resizeMode: 'cover',
    backgroundColor: '#001d3a',
  },
  price: {
    fontFamily: 'MestizoFont',
    fontSize: 25,
    color: 'black',
  },
  descr: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'MestizoFont',
  },
  itemList3: {
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  item3: {
    width: '100%',
    padding: 5,
  },
  item3Content: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 4,
    width: windowWidth * 0.8,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});