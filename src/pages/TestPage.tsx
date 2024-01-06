import React, { useState, useEffect, useRef } from 'react';
import kurentoUtils from 'kurento-utils';


const TestPage: React.FC = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [webRtcPeer, setWebRtcPeer] = useState<any | null>(null);
    const [channel, setChannel] = useState<RTCDataChannel | null>(null);
    const [state, setState] = useState<string | null>(null);

    const videoInput = useRef<HTMLVideoElement | null>(null);
    const videoOutput = useRef<HTMLVideoElement | null>(null);
    const dataChannelSend = useRef<HTMLTextAreaElement | null>(null);

    const I_AM_STARTING = 'I_AM_STARTING';
    const I_CAN_START = 'I_CAN_START';
    const I_CAN_STOP = 'I_CAN_STOP';

    useEffect(() => {
        const ws = new WebSocket('wss://3.39.179.45:32000/signal');
        setWs(ws);

        ws.onmessage = (message: MessageEvent) => {
            const parsedMessage = JSON.parse(message.data);
            console.info('Received message: ' + message.data);

            switch (parsedMessage.id) {
                case 'startResponse':
                    startResponse(parsedMessage);
                    break;
                case 'error':
                    if (state === I_AM_STARTING) {
                        setState(I_CAN_START);
                    }
                    onError("Error message from server: " + parsedMessage.message);
                    break;
                case 'iceCandidate':
                    if (webRtcPeer) {
                        webRtcPeer.addIceCandidate(parsedMessage.candidate, function (error: any) {
                            if (error) {
                                console.error("Error adding candidate: " + error);
                                return;
                            }
                        });
                    }
                    break;
                default:
                    if (state === I_AM_STARTING) {
                        setState(I_CAN_START);
                    }
                    // onError('Unrecognized message', parsedMessage);
            }
        };
    }, [state]);

    const onSendChannelStateChange = () => {
        if (!channel) return;
        const readyState = channel.readyState;
        console.log("sendChannel state changed to " + readyState);

        if (readyState === 'open') {
            if (dataChannelSend.current) {
                dataChannelSend.current.disabled = false;
                dataChannelSend.current.focus();
            }
        } else {
            if (dataChannelSend.current) {
                dataChannelSend.current.disabled = true;
            }
        }
    };

    const start = async () => {
        console.log("Starting video call ...");
        setState(I_AM_STARTING);

        const servers = null;
        const configuration: RTCConfiguration = {};

        const peerConnection = new RTCPeerConnection(configuration);

        console.log("Creating channel");
        const dataConstraints = null;

        const createdChannel = peerConnection.createDataChannel(getChannelName(), undefined);
        createdChannel.onopen = onSendChannelStateChange;
        createdChannel.onclose = onSendChannelStateChange;

        setChannel(createdChannel);

        console.log("Creating WebRtcPeer and generating local sdp offer ...");

        const options = {
            peerConnection: peerConnection,
            localVideo: videoInput.current!,
            remoteVideo: videoOutput.current!,
            onicecandidate: onIceCandidate
        };

        try {
            const createdWebRtcPeer: any = new (kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv as any)(
                options,
                (error: any) => {
                    if (error) {
                        return console.error(error);
                    }
                    createdWebRtcPeer.generateOffer(onOffer);
                    console.log(createdWebRtcPeer)
                }
            );

            setWebRtcPeer(createdWebRtcPeer);
        } catch (error) {
            console.error("Error creating WebRtcPeer: " + error);
        }
    };

    const closeChannels = () => {
        if (channel) {
            channel.close();
            if (dataChannelSend.current) {
                dataChannelSend.current.disabled = true;
            }
            setChannel(null);
        }
    };

    const onOffer = (error: any, offerSdp: any) => {
        if (error) {
            return console.error("Error generating the offer");
        }
        console.info('Invoking SDP offer callback function ' + window.location.host);

        const message = {
            id: 'joinchat', // 수정1
            sdpOffer: offerSdp
        };

        sendMessage(message);
    };

    const onError = (error: string) => {
        console.error(error);
    };

    const onIceCandidate = (candidate: any) => {
        console.log("Local candidate" + JSON.stringify(candidate));

        const message = {
            id: 'joinchat', // 수정2
            candidate: candidate
        };

        sendMessage(message);
    };

    const startResponse = (message: { sdpAnswer: any; }) => {
        setState(I_CAN_STOP);
        console.log("SDP answer received from server. Processing ...");

        if (webRtcPeer) {
            webRtcPeer.processAnswer(message.sdpAnswer, function (error: any) {
                if (error) {
                    return console.error(error);
                }
            });
        }
    };

    const stop = () => {
        console.log("Stopping video call ...");
        setState(I_CAN_START);

        if (webRtcPeer) {
            closeChannels();

            webRtcPeer.dispose();
            setWebRtcPeer(null);

            const message = {
                id: 'stop'
            };

            sendMessage(message);
        }
        // hideSpinner(videoInput.current, videoOutput.current);
    };

    const sendMessage = (message: { id: string; sdpOffer?: any; candidate?: any; }) => {
        const jsonMessage = JSON.stringify(message);
        console.log('Sending message: ' + jsonMessage);

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(jsonMessage);
        }
    };

    const getChannelName = () => {
        // Implement your logic to generate a channel name
        return "your_channel_name";
    };

    return (
        <div>
            <video ref={videoInput} autoPlay={true}></video>
            <video ref={videoOutput} autoPlay={true}></video>
            <textarea ref={dataChannelSend}></textarea>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
        </div>
    );
};

export default TestPage;
