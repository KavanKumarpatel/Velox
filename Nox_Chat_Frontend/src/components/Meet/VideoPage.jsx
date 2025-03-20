import React from 'react';
import {useParams} from  "react-router-dom";
//import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APP_ID, SERVER_SECRET } from './constant';
import uuid from 'react-native-uuid'

const VideoPage = () => {
    const {id} = useParams();
    const roomID = id;
    // let randomID = uuid.v1();
    // const roomID = getUrlParams().get('roomID') || randomID(5);
    let myMeeting = async (element) => {
        // generate Kit Token
        const appID =APP_ID ;
        const serverSecret =SERVER_SECRET ;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,Date.now().toString(),"Velox Real time ");


        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Personal link(Copy)',
                    url:
                        window.location.protocol + '//' +
                        window.location.host + window.location.pathname +
                        '?roomID=' +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
            },
        });
    
}
    return (
        <div ref={myMeeting}>

        </div>
    )
}

export default VideoPage;