data = {'layout': {
    template: {
        'sidebar-blocks-left': {
            mod: '', // опция
            'sidebar-blocks': [
                { 'sidebar-block': fullData => fullData['sidebar-block'] }
            ]
        },
        components: {
            mod: '', // опция
            list: [
                { name: fullData => fullData.name },
            ]
        },
        'sidebar-blocks-right': {
            mod: '', // опция
            'sidebar-blocks': [
                { 'sidebar-block': fullData => fullData['sidebar-block'] }
            ]
        }
    }
}};
