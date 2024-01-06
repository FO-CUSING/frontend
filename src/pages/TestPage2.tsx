import React, { useEffect, useRef } from 'react';
import kurentoUtils from 'kurento-utils';

function TestPage2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const webRtcPeerRef = useRef<kurentoUtils.WebRtcPeer | null>(null);

  useEffect(() => {
    webSocketRef.current = new WebSocket('wss://3.39.179.45:32000/signal');

    const options = {
      localVideo: videoRef.current,
      onicecandidate: (candidate: any) => {
        console.log('New ICE candidate', candidate);
        const message = {
          id: 'onIceCandidate',
          candidate: candidate,
        };
        if(webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
          webSocketRef.current?.send(JSON.stringify(message));
        }
      },
    };

    webRtcPeerRef.current = new (kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv as any)(options, (error: any) => {
      if (error) return console.error(error);

      webRtcPeerRef.current?.generateOffer((error, offer) => {
        if (error) return console.error(error);
        const message = {
          id: 'joinchat',
          sdpOffer: offer,
          name : "temp"
        };
        if(webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
          webSocketRef.current?.send(JSON.stringify(message));
        }
      });
    });

    webSocketRef.current.onmessage = (message) => {
      console.log(message)
      const parsedMessage = JSON.parse(message.data);
      console.info('Received message:', parsedMessage);

      switch (parsedMessage.id) {
        case 'startResponse':
          webRtcPeerRef.current?.processAnswer(parsedMessage.sdpAnswer);
          break;
        case 'iceCandidate':
          webRtcPeerRef.current?.addIceCandidate(parsedMessage.candidate);
          break;
        // case 'close':
        //   webRtcPeerRef.current?.dispose();
        //   break;
        default:
          // console.error('Unrecognized message', parsedMessage);
      }
    };

    return () => {
      // webSocketRef.current?.close();
    };
  }, []);

  return (
    <div>
      <video autoPlay ref={videoRef} />
    </div>
  );
}

export default TestPage2;
