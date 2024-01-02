import analytics from '@react-native-firebase/analytics';
import axios, { AxiosResponse } from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import readItemFromStorage from '../../../common/readItemFromStorage';
import writeItemToStorage from '../../../common/writeItemToStorage';
import { Event } from '../../../interfaces/event';
import {
  PREDICTHQ_ACCESS_TOKEN,
  PREDICTHQ_CATEGORIES,
  PREDICTHQ_LOCATIONS
  // @ts-ignore
} from '@env';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchPredictHqEvents: () => (dispatch: any) => void = () => {
  return async (dispatch: any) => {
    let eventsInStorage: Event[] | null | any = await readItemFromStorage();

    await axios({
      headers: {
        Authorization: `Bearer ${PREDICTHQ_ACCESS_TOKEN}`,
        Accept: 'application/json',
      },
      method: 'GET',
      params: {
        category: PREDICTHQ_CATEGORIES,
        "saved_location.location_id": PREDICTHQ_LOCATIONS,
      },
      url: 'https://api.predicthq.com/v1/events/',
    })
      .then((response: AxiosResponse<any, any>) => {
        for (const id in response.data.results) {
          eventsInStorage.push({
            id: 'predicthq' + response.data.results[id].id,
            date: new Date(response.data.results[id].start),
            description: response.data.results[id].description,
            imageUrl: '',
            isUserEvent: false,
            latitude: response.data.results[id].location[1],
            longitude: response.data.results[id].location[0],
            title: response.data.results[id].title,
          });
        }
        analytics().logEvent('custom_log', {
          description:
            '--- Analytics: store -> actions -> skiRegEvents -> fetchPredictHqEvents -> try, eventsInStorage: ' +
            eventsInStorage,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          analytics().logEvent('custom_log', {
            description:
              '--- Analytics: store -> actions -> fetchPredictHqEvents -> catch, error: ' +
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
            '--- Analytics: store -> actions -> fetchPredictHqEvents -> finally',
        });
      });
  };
};
