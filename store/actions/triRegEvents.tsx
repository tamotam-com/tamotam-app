import analytics from '@react-native-firebase/analytics';
import axios, {AxiosResponse} from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
// import writeItemToStorage from '../../common/writeItemToStorage';
import { Event } from '../../interfaces/event';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchTriRegEvents: () => (dispatch: any) => void = () => {
  return async (dispatch: any) => {
    let triRegEvents: Event[] = [];

    await axios({
      method: 'GET',
      url: 'https://www.trireg.com/api/search',
    })
      .then((response: AxiosResponse<any, any>) => {
        // console.log(response.data.MatchingEvents);
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

          triRegEvents.push({
            id: EventId, // TODO: This EventId isn't fully correct as it goes 0, 1, 2, ... instead of the EventID fetched from the API.
            // TODO: That's the only case such a check is required. Let's see if it shouldn't be done on the MapScreen side.
            date: new Date(dateInMilliseconds),
            description: response.data.MatchingEvents[EventId].PresentedBy,
            imageUrl: '',
            isUserEvent: false,
            latitude: response.data.MatchingEvents[EventId].Latitude
              ? response.data.MatchingEvents[EventId].Latitude
              : 32.2332,
            longitude: response.data.MatchingEvents[EventId].Longitude
              ? response.data.MatchingEvents[EventId].Longitude
              : 5.213,
            title: response.data.MatchingEvents[EventId].EventName,
          });
        }
        analytics().logEvent('custom_log', {
          description:
            '--- Analytics: store -> actions -> triRegEvents -> fetchTriRegEvents -> try, triRegEvents: ' +
            triRegEvents,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          analytics().logEvent('custom_log', {
            description:
              '--- Analytics: store -> actions -> triRegEvents -> fetchTriRegEvents -> catch, error: ' +
              error,
          });
          crashlytics().recordError(error);
        }
      })
      .finally(() => {
        dispatch({
          type: SET_EVENTS,
          events: triRegEvents,
        });
        // writeItemToStorage(triRegEvents);
        analytics().logEvent('custom_log', {
          description:
            '--- Analytics: store -> actions -> triRegEvents -> fetchTriRegEvents -> finally',
        });
      });
  };
};
