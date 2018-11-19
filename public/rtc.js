'use strict';

const constraints = {audio: true, video: true};

const servers = {
  iceServers: [
    {urls: 'stun:stun.services.mozilla.com'},
    {urls: 'stun:stun.l.google.com:19302'},
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'password123',
      username: 'mikkojam@metropolia.fi'
    }
  ]
};

const callButton = document.querySelector('#btnMakeCall');

const caller = new RTCPeerConnection(servers);

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
    const video = document.querySelector('#localVideo');
    video.srcObject = mediaStream;

    caller.addStream(mediaStream);
  })
  .catch((err) => {
    console.log(err.name + ': ' + err.message);
  });

const socket = io.connect('https://sssf-weekly-all.paas.datacenter.fi');

const makeNewCall = (socket) => {
  caller
    .createOffer()
    .then((res) => {
      caller.setLocalDescription(new RTCSessionDescription(res));

      socket.emit('call', JSON.stringify(res));
    })
    .catch((err) => {
      console.log(err);
    });
};

callButton.addEventListener(
  'click',
  () => {
    makeNewCall(socket);
  },
  false
);

socket.on('answer', (message) => {
  caller.setRemoteDescription(new RTCSessionDescription(JSON.parse(message)));
});

socket.on('call', (message) => {
  console.log(message);
  socket.emit('answer', 'Call answered');

  caller.setRemoteDescription(new RTCSessionDescription(JSON.parse(message)));

  caller.createAnswer().then((call) => {
    caller.setLocalDescription(new RTCSessionDescription(call));
    socket.emit('answer', JSON.stringify(call));
  });
});

socket.on('candidate', (message) => {
  console.log(message);
  caller.addIceCandidate(new RTCIceCandidate(JSON.parse(message).candidate));
});
