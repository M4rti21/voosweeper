export const packagerConfig = {
    icon: '/public/favicon.ico',
    makers: [
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    icon: '/public/favicon.png'
                }
            }
        }
    ]
};
