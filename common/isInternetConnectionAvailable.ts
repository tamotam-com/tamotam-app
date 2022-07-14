import analytics from "@react-native-firebase/analytics";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

let stateIsConnected: boolean | null = null;
export const isInternetConnectionAvailable: () => Promise<boolean | null> = async () => {
  NetInfo.addEventListener((state: NetInfoState) => {
    stateIsConnected = state.isConnected;
  });
  analytics().logEvent("custom_log", {
    description: "--- Analytics: common -> isInternetConnectionAvailable -> stateIsConnected: " + stateIsConnected,
  });
  return stateIsConnected;
}

export default isInternetConnectionAvailable;
