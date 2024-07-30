import snsWebSdk from '@sumsub/websdk';

export function launchWebSdk(accessToken: string) {
    const snsWebSdkInstance = snsWebSdk
        .init(accessToken, () => getAccessToken())
        .withConf({
            lang: 'en',
            theme: "dark" || "light",
        })
        .withOptions({ addViewportTag: false, adaptIframeHeight: true })
        .on('idCheck.onStepCompleted', (payload) => {
            console.log('onStepCompleted', payload);
        })
        .on('idCheck.onError', (error) => {
            console.log('onError', error);
        })
        .onMessage((type, payload) => {
            console.log('onMessage', type, payload);
        })
        .build();
    snsWebSdkInstance.launch('#sumsub-websdk-container');
}

function getAccessToken() {
    return fetch('/api/getAccessToken')
        .then(response => response.json())
        .then(data => data.token);
}
