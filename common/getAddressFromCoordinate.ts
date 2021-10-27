export default async function getAddressFromCoordinate(this: any) {
  // TODO: It breaks when the app will reload.
  // TODO: Transform this to addressForCoordinate.
  if (this.mapRef) {
    try {
      const camera = await this.mapRef.getCamera();
      console.log("test", camera);
    } catch (err) {
      console.error(err);
    }
  }
}
