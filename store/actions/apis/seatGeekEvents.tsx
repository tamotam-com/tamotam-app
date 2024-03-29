import analytics from '@react-native-firebase/analytics';
import axios, { AxiosResponse } from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import readItemFromStorage from '../../../common/readItemFromStorage';
import writeItemToStorage from '../../../common/writeItemToStorage';
import { Dispatch } from 'redux';
import { Event } from '../../../interfaces/event';
import {
  SEATGEEK_CLIENT_ID,
  SEATGEEK_PAGE_SIZE,
  SEATGEEK_NUMBER_OF_PAGES,
  SEATGEEK_SECRET,
  // @ts-ignore
} from '@env';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchSeatGeekEvents: () => (dispatch: Dispatch) => void = () => {
  return async (dispatch: Dispatch) => {
    let eventsInStorage: Event[] | null | any = await readItemFromStorage();

    for (let page: number = 0; page < SEATGEEK_NUMBER_OF_PAGES; page++) {
      await axios({
        method: 'GET',
        url: `https://api.seatgeek.com/2/events?client_id=${SEATGEEK_CLIENT_ID}&client_secret=${SEATGEEK_SECRET}&per_page=${SEATGEEK_PAGE_SIZE}`,
      })
        .then((response: AxiosResponse<any, any>) => {
          for (const id in response.data.events) {
            eventsInStorage.push({
              id: 'seatgeek' + response.data.events[id].id,
              date: new Date(response.data.events[id].datetime_local),
              description: response.data.events[id].description,
              imageUrl: response.data.events[id].performers[0].image,
              latitude: response.data.events[id].venue.location.lat,
              longitude: response.data.events[id].venue.location.lon,
              isUserEvent: false,
              title: response.data.events[id].title,
            });
          }
          analytics().logEvent('custom_log', {
            description:
              '--- Analytics: store -> actions -> seatGeekEvents -> fetchSeatGeekEvents -> try, eventsInStorage: ' +
              eventsInStorage,
          });
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            analytics().logEvent('custom_log', {
              description:
                '--- Analytics: store -> actions -> seatGeekEvents -> fetchSeatGeekEvents -> catch, error: ' +
                error,
            });
            crashlytics().recordError(error);
          }
        })
        .finally(() => {
          analytics().logEvent('custom_log', {
            description:
              '--- Analytics: store -> actions -> seatGeekEvents -> fetchSeatGeekEvents -> finally',
          });
        });
    }
    dispatch({
      type: SET_EVENTS,
      events: eventsInStorage,
    });
    writeItemToStorage(eventsInStorage);
  };
};
