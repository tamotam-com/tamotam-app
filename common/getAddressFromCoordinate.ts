export default async function getAddressFromCoordinate(this: any, e: any) {
  // TODO: Follow-up issue https://github.com/react-native-maps/react-native-maps/issues/3955 to get the correct address.
  // TODO: "this.mapRef" breaks on reloading in EditEventScreen.tsx only, but in logs is as warning in different screents.
  if (this.mapRef) {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    await this.mapRef
      .addressForCoordinate({ latitude, longitude })
      .then((address: any) => {
        console.log("address", address);
      })
      .catch((err: Error) => {
        console.log("err", err);
      });
  }
}
