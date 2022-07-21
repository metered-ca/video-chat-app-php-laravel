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

        @vite(['resources/css/app.css', 'resources/js/app.js'])

    </head>
    <body class="antialiased">
        
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="py-4">
                <h1 class="text-2xl">Meeting Lobby</h1>
            </div>


            <div class="max-w-2xl">

                <video id='localVideo' class="w-full" autoplay muted></video>

                <div class="flex space-x-4 mb-4 justify-center">

                    <button id='toggleMicrophone' class="bg-gray-400 w-10 h-10 rounded-md p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>

                    <button id='toggleCamera' class="bg-gray-400 w-10 h-10 rounded-md p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>                    </button>
                    </button>

                </div>
                <div class="flex space-x-2">
                    <input type="text"  placeholder="Name"/>

                    <label>
                        Camera:
                        <select id='cameraSelectBox'>
                        </select>
                    </label>

                    <label>
                        Microphone:
                        <select id='microphoneSelectBox'>
                        </select>
                    </label>

                    <button id='joinMeetingBtn' class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Join Meeting
                    </button>
                </div>

            </div>
  
        </div> 
    </body>
</html>
