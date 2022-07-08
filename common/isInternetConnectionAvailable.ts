import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

let stateIsConnected: boolean | null = null;
export const isInternetConnectionAvailable: () => Promise<boolean | null> = async () => {
  NetInfo.addEventListener((state: NetInfoState) => {
    stateIsConnected = state.isConnected;
  });
  return stateIsConnected;
}

export default isInternetConnectionAvailable;
