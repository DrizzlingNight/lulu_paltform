
import { settings } from "../imports/settings";


function importGoogleTagJs() {

    if (!settings.gtagId)
        return

    const gtagId = settings.gtagId;

    var script = document.createElement('script');
    const src = 'https://www.googletagmanager.com/gtag/js?id=' + gtagId;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', src);
    document.getElementsByTagName('head')[0].appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', gtagId);
}

function importGoogleAnalyticsJs() {

    if (!settings.firebaseConfig)
        return
    const analyticsId = settings.firebaseConfig.measurementId;

    var script = document.createElement('script');
    const src = 'https://www.googletagmanager.com/gtag/js?id=' + analyticsId;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', src);
    document.getElementsByTagName('head')[0].appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', analyticsId);

}

importGoogleTagJs()
importGoogleAnalyticsJs()