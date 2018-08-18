'use strict';

const constraints = {audio: false, video: true};
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((mediaStream) => {
    const video = document.querySelector('video');
    video.srcObject = mediaStream;
  })
  .catch((err) => {
    console.log(err.name + ': ' + err.message);
  });
