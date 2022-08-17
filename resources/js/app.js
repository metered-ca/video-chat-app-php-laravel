import './bootstrap';
import jquery from 'jquery';

let meetingJoined = false;
const meeting = new Metered.Meeting();
let cameraOn = false;
let micOn = false;
let screenSharingOn = false;
let localVideoStream = null;
let activeSpeakerId = null;
let meetingInfo = {};

async function initializeView() {
    /**
     * Populating the cameras
     */
     const videoInputDevices = await meeting.listVideoInputDevices();
     const videoOptions = [];
     for (let item of videoInputDevices) {
        videoOptions.push(
            `<option value="${item.deviceId}">${item.label}</option>`
        )
     }
    jquery("#cameraSelectBox").html(videoOptions.join(""));

    /**
     * Populating Microphones
     */
    const audioInputDevices = await meeting.listAudioInputDevices();
    const audioOptions = [];
    for (let item of audioInputDevices) {
        audioOptions.push(
            `<option value="${item.deviceId}">${item.label}</option>`
        )
    }
    jquery("#microphoneSelectBox").html(audioOptions.join(""));
    

    /**
     * Mute/Unmute Camera and Microphone
     */
    jquery("#waitingAreaToggleMicrophone").on("click", function() {
        if (micOn) {
            micOn = false;
            jquery("#waitingAreaToggleMicrophone").removeClass("bg-gray-500");
            jquery("#waitingAreaToggleMicrophone").addClass("bg-gray-400");
        } else {
            micOn = true;
            jquery("#waitingAreaToggleMicrophone").removeClass("bg-gray-400");
            jquery("#waitingAreaToggleMicrophone").addClass("bg-gray-500");
        }
    });

    jquery("#waitingAreaToggleCamera").on("click", async function() {
        if (cameraOn) {
            cameraOn = false;
            jquery("#waitingAreaToggleCamera").removeClass("bg-gray-500");
            jquery("#waitingAreaToggleCamera").addClass("bg-gray-400");
            const tracks = localVideoStream.getTracks();
            tracks.forEach(function (track) {
              track.stop();
            });
            localVideoStream = null;
            jquery("#waitingAreaLocalVideo")[0].srcObject = null;
        } else {
            cameraOn = true;
            jquery("#waitingAreaToggleCamera").removeClass("bg-gray-400");
            jquery("#waitingAreaToggleCamera").addClass("bg-gray-500");
            localVideoStream = await meeting.getLocalVideoStream();
            jquery("#waitingAreaLocalVideo")[0].srcObject = localVideoStream;
            cameraOn = true;
        }
    });

    /**
     * Adding Event Handlers
     */
         jquery("#cameraSelectBox").on("change", async function() {
          const deviceId = jquery("#cameraSelectBox").val();
          await meeting.chooseVideoInputDevice(deviceId);
          if (cameraOn) {
              localVideoStream = await meeting.getLocalVideoStream();
              jquery("#waitingAreaLocalVideo")[0].srcObject = localVideoStream;
          }
      });
  
      jquery("#microphoneSelectBox").on("change", async function() {
          const deviceId = jquery("#microphoneSelectBox").val();
          await meeting.chooseAudioInputDevice(deviceId);
      });
  
}
initializeView();

jquery("#joinMeetingBtn").on("click", async function () {
    var username = jquery("#username").val();
    if (!username) {
      return alert("Please enter a username");
    }
  
    try {
      meetingInfo = await meeting.join({
        roomURL: `${window.METERED_DOMAIN}/${window.MEETING_ID}`,
        name: username,
      });
      
      console.log("Meeting joined", meetingInfo);
      jquery("#waitingArea").addClass("hidden");
      jquery("#meetingView").removeClass("hidden");
      jquery("#meetingAreaUsername").text(username);

      /**
       * If camera button is clicked on the meeting view
       * then sharing the camera after joining the meeting.
       */
      if (cameraOn) {
        await meeting.startVideo();
        jquery("#localVideoTag")[0].srcObject = localVideoStream;
        jquery("#localVideoTag")[0].play();
        jquery("#toggleCamera").removeClass("bg-gray-400");
        jquery("#toggleCamera").addClass("bg-gray-500");
      }
      
      /**
       * Microphone button is clicked on the meeting view then
       * sharing the microphone after joining the meeting
       */
      if (micOn) {
        jquery("#toggleMicrophone").removeClass("bg-gray-400");
        jquery("#toggleMicrophone").addClass("bg-gray-500");
        await meeting.startAudio();
      }

    } catch (ex) {
      console.log("Error occurred when joining the meeting", ex);
    }
  });

  /**
   * Handling Events
   */
  meeting.on("onlineParticipants", function(participants) {
    
    for (let participantInfo of participants) {
      if (!jquery(`#participant-${participantInfo._id}`)[0] && participantInfo._id !== meeting.participantInfo._id) {
        jquery("#remoteParticipantContainer").append(
          `
          <div id="participant-${participantInfo._id}" class="w-48 h-48 rounded-3xl bg-gray-900 relative">
            <video id="video-${participantInfo._id}" src="" autoplay class="object-contain w-full rounded-t-3xl"></video>
            <video id="audio-${participantInfo._id}" src="" autoplay class="hidden"></video>
            <div class="absolute h-8 w-full bg-gray-700 rounded-b-3xl bottom-0 text-white text-center font-bold pt-1">
                ${participantInfo.name}
            </div>
          </div>
          `
        );
      }
    }
  });

  meeting.on("participantLeft", function(participantInfo) {
    jquery("#participant-" + participantInfo._id).remove();
    if (participantInfo._id === activeSpeakerId) {
      jquery("#activeSpeakerUsername").text("");
      jquery("#activeSpeakerUsername").addClass("hidden");
    }
  });

  meeting.on("remoteTrackStarted", function(remoteTrackItem) {
    jquery("#activeSpeakerUsername").removeClass("hidden");

    if (remoteTrackItem.type === "video") {
      let mediaStream = new MediaStream();
      mediaStream.addTrack(remoteTrackItem.track);
      if (jquery("#video-" + remoteTrackItem.participantSessionId)[0]) {
        jquery("#video-" + remoteTrackItem.participantSessionId)[0].srcObject = mediaStream;
        jquery("#video-" + remoteTrackItem.participantSessionId)[0].play();
      }
    }

    if (remoteTrackItem.type === "audio") {
      let mediaStream = new MediaStream();
      mediaStream.addTrack(remoteTrackItem.track);
      if ( jquery("#video-" + remoteTrackItem.participantSessionId)[0]) {
        jquery("#audio-" + remoteTrackItem.participantSessionId)[0].srcObject = mediaStream;
        jquery("#audio-" + remoteTrackItem.participantSessionId)[0].play();
      }
    }
    setActiveSpeaker(remoteTrackItem);
  });

  meeting.on("remoteTrackStopped", function(remoteTrackItem) {
    if (remoteTrackItem.type === "video") {
      if ( jquery("#video-" + remoteTrackItem.participantSessionId)[0]) {
        jquery("#video-" + remoteTrackItem.participantSessionId)[0].srcObject = null;
        jquery("#video-" + remoteTrackItem.participantSessionId)[0].pause();
      }
      
      if (remoteTrackItem.participantSessionId === activeSpeakerId) {
        jquery("#activeSpeakerVideo")[0].srcObject = null;
        jquery("#activeSpeakerVideo")[0].pause();
      }
    }

    if (remoteTrackItem.type === "audio") {
      if (jquery("#audio-" + remoteTrackItem.participantSessionId)[0]) {
        jquery("#audio-" + remoteTrackItem.participantSessionId)[0].srcObject = null;
        jquery("#audio-" + remoteTrackItem.participantSessionId)[0].pause();
      }
    }
  });


  meeting.on("activeSpeaker", function(activeSpeaker) {
    setActiveSpeaker(activeSpeaker);
  });

  function setActiveSpeaker(activeSpeaker) {

    if (activeSpeakerId  != activeSpeaker.participantSessionId) {
      jquery(`#participant-${activeSpeakerId}`).show();
    } 

    activeSpeakerId = activeSpeaker.participantSessionId;
    jquery(`#participant-${activeSpeakerId}`).hide();

    jquery("#activeSpeakerUsername").text(activeSpeaker.name || activeSpeaker.participant.name);
    
    if (jquery(`#video-${activeSpeaker.participantSessionId}`)[0]) {
      let stream = jquery(
        `#video-${activeSpeaker.participantSessionId}`
      )[0].srcObject;
      jquery("#activeSpeakerVideo")[0].srcObject = stream.clone();
    }
  
    if (activeSpeaker.participantSessionId === meeting.participantSessionId) {
      let stream = jquery(`#localVideoTag`)[0].srcObject;
      if (stream) {
        jquery("#localVideoTag")[0].srcObject = stream.clone();
      }
    }
  }

  jquery("#toggleMicrophone").on("click",  async function() {
    if (micOn) {
      jquery("#toggleMicrophone").removeClass("bg-gray-500");
      jquery("#toggleMicrophone").addClass("bg-gray-400");
      micOn = false;
      await meeting.stopAudio();
    } else {
      jquery("#toggleMicrophone").removeClass("bg-gray-400");
      jquery("#toggleMicrophone").addClass("bg-gray-500");
      micOn = true;
      await meeting.startAudio();
    }
  });

  
  jquery("#toggleCamera").on("click",  async function() {
    if (cameraOn) {
      jquery("#toggleCamera").removeClass("bg-gray-500");
      jquery("#toggleCamera").addClass("bg-gray-400");
      jquery("#toggleScreen").removeClass("bg-gray-500");
      jquery("#toggleScreen").addClass("bg-gray-400");
      cameraOn = false;
      await meeting.stopVideo();
      const tracks = localVideoStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
      localVideoStream = null;
      jquery("#localVideoTag")[0].srcObject = null;
    } else {
      jquery("#toggleCamera").removeClass("bg-gray-400");
      jquery("#toggleCamera").addClass("bg-gray-500");
      cameraOn = true;
      await meeting.startVideo();
      localVideoStream = await meeting.getLocalVideoStream();
      jquery("#localVideoTag")[0].srcObject = localVideoStream;
    }
  });

  
  jquery("#toggleScreen").on("click",  async function() {
    if (screenSharingOn) {
      jquery("#toggleScreen").removeClass("bg-gray-500");
      jquery("#toggleScreen").addClass("bg-gray-400");
      screenSharingOn = false;
      await meeting.stopVideo();
      const tracks = localVideoStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
      localVideoStream = null;
      jquery("#localVideoTag")[0].srcObject = null;

    } else {
      jquery("#toggleScreen").removeClass("bg-gray-400");
      jquery("#toggleScreen").addClass("bg-gray-500");
      jquery("#toggleCamera").removeClass("bg-gray-500");
      jquery("#toggleCamera").addClass("bg-gray-400");
      screenSharingOn = true;
      localVideoStream = await meeting.startScreenShare();
      jquery("#localVideoTag")[0].srcObject = localVideoStream;
    }
  });

  
  jquery("#leaveMeeting").on("click", async function() {
    await meeting.leaveMeeting();
    jquery("#meetingView").addClass("hidden");
    jquery("#leaveMeetingView").removeClass("hidden");
  });