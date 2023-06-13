import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import readItemFromStorage from '../../../common/readItemFromStorage';
import storage from "@react-native-firebase/storage";
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
    let imageUrlPath: string = "";

    await firestore()
      .collection(FIRESTORE_COLLECTION)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async documentSnapshot => {
          await storage().ref(documentSnapshot.data().imageUrl).getDownloadURL()
            .then((imageUrlStorage) => {
              imageUrlPath = imageUrlStorage;

              analytics().logEvent('custom_log', {
                description:
                  '--- Analytics: store -> actions -> usersEvents -> fetchUsersEvents -> then -> then2'
              });
            }).catch((error: unknown) => {
              if (error instanceof Error) {
                imageUrlPath = "";

                analytics().logEvent('custom_log', {
                  description:
                    '--- Analytics: store -> actions -> usersEvents -> fetchUsersEvents -> then -> catch, error: ' +
                    error,
                });
                crashlytics().recordError(error);
              }
            });

          eventsInStorage.push({
            id: documentSnapshot.data().id,
            date: new Date(documentSnapshot.data().date.seconds * 1000),
            description: documentSnapshot.data().description,
            // @ts-ignore
            firestoreDocumentId: documentSnapshot.ref._documentPath._parts[1],
            imageUrl: imageUrlPath,
            isUserEvent: documentSnapshot.data().isUserEvent,
            latitude: documentSnapshot.data().latitude,
            longitude: documentSnapshot.data().longitude,
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
        // TODO: Temporary solution with the "setTimeout", make it properly with async actions (redux-thunk).
        setTimeout(() => {
          dispatch({
            type: SET_EVENTS,
            events: eventsInStorage,
          });
          writeItemToStorage(eventsInStorage);
        }, 1000);
        analytics().logEvent('custom_log', {
          description:
            '--- Analytics: store -> actions -> usersEvents -> fetchUsersEvents -> finally',
        });
      });
  };
};
