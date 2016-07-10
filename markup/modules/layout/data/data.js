data = {'layout': {
    template: {
        pageTitle: '',
        'sidebar-blocks-left': [
            { 'sidebar-block': fullData => fullData['sidebar-block'] }
        ],
        components: [
            { name: fullData => fullData.name },
        ],
        'sidebar-blocks-right': [
            { 'sidebar-block': fullData => fullData['sidebar-block'] }
        ],
    }
}};
