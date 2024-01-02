import analytics from '@react-native-firebase/analytics';
import axios, { AxiosResponse } from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import readItemFromStorage from '../../../common/readItemFromStorage';
import writeItemToStorage from '../../../common/writeItemToStorage';
import { Event } from '../../../interfaces/event';
import {
  RUNREG_NUMBER_OF_PAGES,
  // @ts-ignore
} from '@env';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchRunRegEvents: () => (dispatch: any) => void = () => {
  return async (dispatch: any) => {
    let eventsInStorage: Event[] | null | any = await readItemFromStorage();

    for (let page: number = 0; page < RUNREG_NUMBER_OF_PAGES; page++) {
      await axios({
        method: 'GET',
        url: `https://www.runreg.com/api/search?startpage=${page}`,
      })
        .then((response: AxiosResponse<any, any>) => {
          for (const EventId in response.data.MatchingEvents) {
            const arrayByDashSignDivider =
              response.data.MatchingEvents[EventId].EventDate.match(/\d+/g);
            const checkForDash = /-/.test(
              response.data.MatchingEvents[EventId].EventDate,
            )
              ? -1
              : +1;
            const dateInMilliseconds =
              +arrayByDashSignDivider[0] +
              checkForDash *
              (arrayByDashSignDivider[1].slice(0, 2) * 3.6e6 +
                arrayByDashSignDivider[1].slice(-2) * 6e4);

            eventsInStorage.push({
              id: 'runreg' + response.data.MatchingEvents[EventId].EventId,
              date: new Date(dateInMilliseconds),
              description: response.data.MatchingEvents[EventId].PresentedBy,
              imageUrl: '',
              isUserEvent: false,
              latitude: response.data.MatchingEvents[EventId].Latitude,
              longitude: response.data.MatchingEvents[EventId].Longitude,
              title: response.data.MatchingEvents[EventId].EventName,
            });
          }
          analytics().logEvent('custom_log', {
            description:
              '--- Analytics: store -> actions -> runRegEvents -> fetchRunRegEvents -> try, eventsInStorage: ' +
              eventsInStorage,
          });
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            analytics().logEvent('custom_log', {
              description:
                '--- Analytics: store -> actions -> runRegEvents -> fetchRunRegEvents -> catch, error: ' +
                error,
            });
            crashlytics().recordError(error);
          }
        })
        .finally(() => {
          analytics().logEvent('custom_log', {
            description:
              '--- Analytics: store -> actions -> runRegEvents -> fetchRunRegEvents -> finally',
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
