import analytics from '@react-native-firebase/analytics';
import axios, {AxiosResponse} from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import readItemFromStorage from '../../common/readItemFromStorage';
import writeItemToStorage from '../../common/writeItemToStorage';
import {
  TICKETMASTER_API_KEY,
  TICKETMASTER_NUMBER_OF_PAGES,
  TICKETMASTER_SIZE,
  // @ts-ignore
} from '@env';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchTicketmasterEvents: () => (dispatch: any) => void = () => {
  return async (dispatch: any) => {
    let eventsInStorage: null | any = await readItemFromStorage();
    let ticketmasterEventsCountry: any[] = [];

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
              // "JSON.stringify" is needed to achieve unique Set of Objects.
              ticketmasterEventsCountry.push(
                JSON.stringify({
                  id,
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
                }),
              );
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
      const ticketmasterEventsSet: Set<any> = new Set(
        ticketmasterEventsCountry,
      );
      const list: any[] = Array.from(ticketmasterEventsSet);

      list.forEach((eventStringified: string) => {
        JSON.parse(eventStringified);
        eventsInStorage.push(JSON.parse(eventStringified));
        ticketmasterEventsCountry.push(JSON.parse(eventStringified));
      });

      ticketmasterEventsCountry.forEach(
        (eventStringified: any, index: number) => {
          ticketmasterEventsCountry[index].id = Number(eventStringified.id);
          ticketmasterEventsCountry[index].date = new Date(
            eventStringified.date,
          );
          ticketmasterEventsCountry[index].description =
            eventStringified.description;
          ticketmasterEventsCountry[index].imageUrl = eventStringified.imageUrl;
          ticketmasterEventsCountry[index].latitude = Number(
            eventStringified.latitude,
          );
          ticketmasterEventsCountry[index].longitude = Number(
            eventStringified.longitude,
          );
          ticketmasterEventsCountry[index].title = eventStringified.title;
        },
      );
      // TODO: Optimize the performance, it looks like ticketmasterEventsCountry will be useless.
      // dispatch({
      //   type: SET_EVENTS,
      //   events: ticketmasterEventsCountry,
      // });
      ticketmasterEventsCountry = [];
    }
    eventsInStorage.forEach((eventStringified: any, index: number) => {
      eventsInStorage[index].id = Number(eventStringified.id);
      eventsInStorage[index].date = new Date(eventStringified.date);
      eventsInStorage[index].description = eventStringified.description;
      eventsInStorage[index].imageUrl = eventStringified.imageUrl;
      eventsInStorage[index].latitude = Number(eventStringified.latitude);
      eventsInStorage[index].longitude = Number(eventStringified.longitude);
      eventsInStorage[index].title = eventStringified.title;
    });
    dispatch({
      type: SET_EVENTS,
      events: eventsInStorage,
    });
    writeItemToStorage(eventsInStorage);
  };
};
