import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import readItemFromStorage from '../../../common/readItemFromStorage';
import writeItemToStorage from '../../../common/writeItemToStorage';
import { Event } from '../../../interfaces/event';
import {
  FIRESTORE_COLLECTION,
  // @ts-ignore
} from '@env';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchUsersEvents: () => (dispatch: any) => void = () => {
  return async (dispatch: any) => {
    let eventsInStorage: Event[] | null | any = await readItemFromStorage();

    await firestore()
      .collection(FIRESTORE_COLLECTION)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          eventsInStorage.push({
            id: documentSnapshot.data().id,
            date: new Date(documentSnapshot.data().date.seconds * 1000),
            description: documentSnapshot.data().description,
            imageUrl: '',
            isUserEvent: documentSnapshot.data().isUserEvent,
            latitude: documentSnapshot.data().coordinate.latitude,
            longitude: documentSnapshot.data().coordinate.longitude,
            title: documentSnapshot.data().title,
          });
        });
        analytics().logEvent('custom_log', {
          description:
            '--- Analytics: store -> actions -> usersEvents -> fetchUsersEvents -> then, eventsInStorage: ' +
            eventsInStorage,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          analytics().logEvent('custom_log', {
            description:
              '--- Analytics: store -> actions -> usersEvents -> fetchUsersEvents -> catch, error: ' +
              error,
          });
          crashlytics().recordError(error);
        }
      })
      .finally(() => {
        dispatch({
          type: SET_EVENTS,
          events: eventsInStorage,
        });
        writeItemToStorage(eventsInStorage);
        analytics().logEvent('custom_log', {
          description:
            '--- Analytics: store -> actions -> usersEvents -> fetchUsersEvents -> finally',
        });
      });
  };
};
