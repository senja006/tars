var data = {columns: {
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
                { 'page-title': fullData => fullData['page-title'] },
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
