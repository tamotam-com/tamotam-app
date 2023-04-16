// TODO: Delete PredictHQ after temporarily access will be granted, because it's too expensive after that.
import * as Localization from "expo-localization";
import analytics from '@react-native-firebase/analytics';
import axios, {AxiosResponse} from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import readItemFromStorage from '../../../common/readItemFromStorage';
import writeItemToStorage from '../../../common/writeItemToStorage';
import {Event} from '../../../interfaces/event';
import {
  PREDICTHQ_ACCESS_TOKEN,
  PREDICTHQ_CATEGORIES,
  PREDICTHQ_LIMIT,
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
        country: Localization.region,
        limit: PREDICTHQ_LIMIT,
      },
      url: 'https://api.predicthq.com/v1/events/',
    })
      .then((response: AxiosResponse<any, any>) => {
        for (const key in response) {
          eventsInStorage.push({
            key,
            description: response.data.results[key].description,
            latitude: response.data.results[key].location[1],
            longitude: response.data.results[key].location[0],
            title: response.data.results[key].title,
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
