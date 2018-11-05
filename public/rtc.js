'use strict';

const constraints = {audio: false, video: true};

const caller = new RTCPeerConnection();

const onIceCandidate = (evt) => {
  socket.emit('candidate', JSON.stringify({candidate: evt.candidate}));
};

caller.onaddstream = (event) => {
  console.log('onaddstream called');
  document.querySelector('#remoteVideo').srcObject = event.stream;
};

caller.onicecandidate = (evt) => {
  if (!evt.candidate) return;
  console.log('onicecandidate called');
  onIceCandidate(evt);
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
