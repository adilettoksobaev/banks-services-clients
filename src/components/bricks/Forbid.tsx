import React from 'react';
import '../App/App.scss';

const userDeviceArray = [
    {device: 'Android', platform: /Android/},
    {device: 'iPhone', platform: /iPhone/},
    {device: 'iPad', platform: /iPad/},
    {device: 'Symbian', platform: /Symbian/},
    {device: 'Windows Phone', platform: /Windows Phone/},
    {device: 'Tablet OS', platform: /Tablet OS/},
    {device: 'Linux', platform: /Linux/},
    {device: 'Windows', platform: /Windows NT/},
    {device: 'Macintosh', platform: /Macintosh/}
];

const Forbid = () => {
    const platform = navigator.userAgent;
    const getPlatform = () => {
        for (var i in userDeviceArray) {
            if (userDeviceArray[i].platform.test(platform)) {
                if(userDeviceArray[i].device === 'Android' || userDeviceArray[i].device === 'Windows') {
                    return <div className="forbid__text">К сожалению этот браузер не поддерживает весь функционал, пожалуйста откройте в Google Chrome</div>
                }
                if(userDeviceArray[i].device === 'iPhone' || userDeviceArray[i].device === 'iPad' || userDeviceArray[i].device === 'Tablet OS' || userDeviceArray[i].device === 'Macintosh') {
                    return <div className="forbid__text">К сожалению этот браузер не поддерживает весь функционал, пожалуйста откройте в Safari</div>
                }
                return <div className="forbid__text">К сожалению этот браузер не поддерживает весь функционал, если у Вас Android откройте Google Chrome, если iPhone то Safari</div>
            }
        }
        return 'Неизвестная платформа!' + platform;
    }
    return (
        <div className="forbid">
            {getPlatform()}
        </div>
    );
}

export default Forbid;