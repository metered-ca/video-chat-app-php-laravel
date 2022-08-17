<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">


        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>

        <script src="https://cdn.metered.ca/sdk/video/1.4.5/sdk.min.js"></script>

        <script>
            window.METERED_DOMAIN = "{{ $METERED_DOMAIN }}";
            window.MEETING_ID = "{{ $MEETING_ID }}";

        </script>

        @vite(['resources/css/app.css', 'resources/js/app.js'])


    </head>
    <body class="antialiased">
        
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            <div id="waitingArea" class="max-h-screen">
                <div class="py-4">
                    <h1 class="text-2xl">Meeting Lobby</h1>
                </div>
    
    
                <div class="max-w-2xl  flex flex-col space-y-4 ">
                    
                    <div class="flex items-center justify-center w-full rounded-3xl bg-gray-900">
                        <video id='waitingAreaLocalVideo' class="h-96" autoplay muted></video>
                    </div>
    
                    <div class="flex space-x-4 mb-4 justify-center">
    
                        <button id='waitingAreaToggleMicrophone' class="bg-gray-400 w-10 h-10 rounded-md p-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
    
                        <button id='waitingAreaToggleCamera' class="bg-gray-400 w-10 h-10 rounded-md p-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>           
                        </button>
    
                    </div>
                    <div class="flex flex-col space-y-4 space-x-2 text-sm">
                        <div class="flex space-x-2 items-center">
                            <label>
                                Name:
                                <input class="text-xs" id="username" type="text"  placeholder="Name"/>
                            </label>
    
                            <label>
                                Camera:
                                <select class="text-xs" id='cameraSelectBox'>
                                </select>
                            </label>
        
                            <label>
                                Microphone:
                                <select class="text-xs" id='microphoneSelectBox'>
                                </select>
                            </label>
                        </div>

                        <div>
                            <button id='joinMeetingBtn' class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Join Meeting
                            </button>
                        </div>
                    </div>
    
                </div>
      
            </div>
        </div> 

        <div id='meetingView' class="hidden flex w-screen h-screen space-x-4 p-10">

            <div id="activeSpeakerContainer" class=" bg-gray-900 rounded-3xl flex-1 flex relative">
                <video id="activeSpeakerVideo" src="" autoplay class=" object-contain w-full rounded-t-3xl"></video>
                <div id="activeSpeakerUsername" class="hidden absolute h-8 w-full bg-gray-700 rounded-b-3xl bottom-0 text-white text-center font-bold pt-1">
                    
                </div>
            </div>  

            <div id="remoteParticipantContainer" class="flex flex-col space-y-4">
                <div id="localParticiapntContainer" class="w-48 h-48 rounded-3xl bg-gray-900 relative">
                    <video id="localVideoTag" src="" autoplay class="object-contain w-full rounded-t-3xl"></video>
                    <div id="localUsername" class="absolute h-8 w-full bg-gray-700 rounded-b-3xl bottom-0 text-white text-center font-bold pt-1">
                        Me
                    </div>
                </div>
            </div>

            <div class="flex flex-col space-y-2">
                <button id='toggleMicrophone' class="bg-gray-400 w-10 h-10 rounded-md p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                </button>

                <button id='toggleCamera' class="bg-gray-400 w-10 h-10 rounded-md p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </button>

                <button id='toggleScreen' class="bg-gray-400 w-10 h-10 rounded-md p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </button>

                <button id='leaveMeeting' class="bg-red-400 text-white w-10 h-10 rounded-md p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
                
            </div>
        </div>

        <div id="leaveMeetingView" class="hidden">
            <h1 class="text-center text-3xl mt-10 font-bold">
                You have left the meeting 
            </h1>
        </div>
    </body>
</html>
