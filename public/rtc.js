'use strict';

const constraints = {audio: false, video: true};

const caller = new RTCPeerConnection();
caller.onaddstream = (event) => {
  console.log('onaddstream called');
  document.querySelector('#remoteVideo').srcObject = event.stream;
};

navigator.mediaDevices
  .getUserMedia(constraints)
  .then((mediaStream) => {
    const video = document.querySelector('video');
    video.srcObject = mediaStream;

    caller.addStream(mediaStream);
  })
  .catch((err) => {
    console.log(err.name + ': ' + err.message);
  });
