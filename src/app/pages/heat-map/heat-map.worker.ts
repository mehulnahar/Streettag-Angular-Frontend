/// <reference lib="webworker" />

addEventListener('message', ({data}) => {
  let markers = [];
  data.forEach((e: any) => {
    markers.push({ lat: +e.lat, lng: +e.lng });
  });
  postMessage(markers);
});


