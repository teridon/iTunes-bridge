var iTunesApp = WScript.CreateObject("iTunes.Application");


switch(WScript.arguments(0)){
    case "next":{
        iTunesApp.NextTrack();
        break;
    }
	case "prev":{
        iTunesApp.PreviousTrack();
        break;
    }
    case "play":{
        iTunesApp.play();
        break;
    }
    case "playpause":{
        iTunesApp.playpause();
        break;
    }
    case "pause":{
        iTunesApp.pause();
        break;
    }
    case "stop":{
        iTunesApp.stop();
        break;
    }
    case "setSoundVolume":{
        iTunesApp.SoundVolume(WScript.arguments(1));
        break;
    }
}