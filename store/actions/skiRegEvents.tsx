import analytics from '@react-native-firebase/analytics';
import axios, {AxiosResponse} from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
// import writeItemToStorage from '../../common/writeItemToStorage';
import { Event } from '../../interfaces/event';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchSkiRegEvents: () => (dispatch: any) => void = () => {
  return async (dispatch: any) => {
    let skiRegEvents: Event[] = [];

    await axios({
      method: 'GET',
      url: 'https://www.skireg.com/api/search',
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

          skiRegEvents.push({
            id: EventId, // TODO: This EventId isn't fully correct as it goes 0, 1, 2, ... instead of the EventID fetched from the API.
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
            '--- Analytics: store -> actions -> skiRegEvents -> fetchSkiRegEvents -> try, skiRegEvents: ' +
            skiRegEvents,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          analytics().logEvent('custom_log', {
            description:
              '--- Analytics: store -> actions -> skiRegEvents -> fetchSkiRegEvents -> catch, error: ' +
              error,
          });
          crashlytics().recordError(error);
        }
      })
      .finally(() => {
        dispatch({
          type: SET_EVENTS,
          events: skiRegEvents,
        });
        // writeItemToStorage(skiRegEvents);
        analytics().logEvent('custom_log', {
          description:
            '--- Analytics: store -> actions -> skiRegEvents -> fetchSkiRegEvents -> finally',
        });
    });
  };
};
