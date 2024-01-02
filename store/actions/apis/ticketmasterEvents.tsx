import analytics from '@react-native-firebase/analytics';
import axios, { AxiosResponse } from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import readItemFromStorage from '../../../common/readItemFromStorage';
import writeItemToStorage from '../../../common/writeItemToStorage';
import {
  TICKETMASTER_API_KEY,
  TICKETMASTER_NUMBER_OF_PAGES,
  TICKETMASTER_SIZE,
  // @ts-ignore
} from '@env';
import { Event } from '../../../interfaces/event';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchTicketmasterEvents: () => (dispatch: any) => void = () => {
  return async (dispatch: any) => {
    let eventsInStorage: Event[] | null | any = await readItemFromStorage();
    let ticketmasterEventsArrayFromSet: Event[] = [];

    const ticketmasterCountries: string[] = [
      'AT',
      'AU',
      'BE',
      'CA',
      'CH',
      'CZ',
      'DE',
      'DK',
      'ES',
      'FI',
      'GB',
      'IE',
      'LU',
      'MX',
      'NO',
      'NL',
      'PL',
      'PT',
      'SE',
      'US',
    ];
    for (const country of ticketmasterCountries) {
      for (let page = 0; page < TICKETMASTER_NUMBER_OF_PAGES; page++) {
        await axios({
          method: 'GET',
          url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=${country}&apikey=${TICKETMASTER_API_KEY}&size=${TICKETMASTER_SIZE}&page=${page}`,
        })
          .then((response: AxiosResponse<any, any>) => {
            for (const id in response.data._embedded.events) {
              eventsInStorage.push({
                id: 'ticketmaster' + response.data._embedded.events[id].id,
                date: new Date(
                  response.data._embedded.events[id].dates.start.dateTime,
                ),
                description:
                  response.data._embedded.events[id]._embedded.venues[0].city
                    .name,
                imageUrl: response.data._embedded.events[id].images[0].url,
                isUserEvent: false,
                latitude:
                  response.data._embedded.events[id]._embedded.venues[0]
                    .location.latitude,
                longitude:
                  response.data._embedded.events[id]._embedded.venues[0]
                    .location.longitude,
                title: response.data._embedded.events[id].name,
              });
            }
            analytics().logEvent('custom_log', {
              description:
                '--- Analytics: store -> actions -> ticketmasterEvents -> fetchTicketmasterEvents -> try, eventsInStorage: ' +
                eventsInStorage,
            });
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              analytics().logEvent('custom_log', {
                description:
                  '--- Analytics: store -> actions -> ticketmasterEvents -> fetchTicketmasterEvents -> catch, error: ' +
                  error,
              });
              crashlytics().recordError(error);
            }
          })
          .finally(() => {
            analytics().logEvent('custom_log', {
              description:
                '--- Analytics: store -> actions -> ticketmasterEvents -> fetchTicketmasterEvents -> finally',
            });
          });
      }
    }
    ticketmasterEventsArrayFromSet = Array.from(new Set(eventsInStorage));
    dispatch({
      type: SET_EVENTS,
      events: ticketmasterEventsArrayFromSet,
    });
    writeItemToStorage(ticketmasterEventsArrayFromSet);
  };
};
