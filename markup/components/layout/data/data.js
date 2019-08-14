var data = {
    'layout': {
        template: {
            'sidebar-blocks-left': {
                mod: '', // option
                'sidebar-blocks': [
                    {
                        mod: '', // option
                        title: '', // option
                        subTitle: '', // option
                        components: [
                            {name: fullData => fullData.name}
                        ]
                    }
                ]
            },
            components: {
                mod: '', // option
                list: [
                    {name: fullData => fullData.name},
                    {
                        cols: {
                            'sidebar-blocks-left': {
                                mod: '', // option
                                'sidebar-blocks': [
                                    {
                                        mod: '', // option
                                        title: '', // option
                                        subTitle: '', // option
                                        components: [
                                            {name: fullData => fullData.name}
                                        ]
                                    }
                                ]
                            },
                            components: {
                                mod: '', // option
                                list: [
                                    {name: fullData => fullData.name}
                                ]
                            },
                            'sidebar-blocks-right': {
                                mod: '', // option
                                'sidebar-blocks': [
                                    {
                                        mod: '', // option
                                        title: '', // option
                                        subTitle: '', // option
                                        components: [
                                            {name: fullData => fullData.name}
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ]
            },
            'sidebar-blocks-right': {
                mod: '', // option
                'sidebar-blocks': [
                    {
                        mod: '', // option
                        title: '', // option
                        subTitle: '', // option
                        components: [
                            {name: fullData => fullData.name}
                        ]
                    }
                ]
            }
        },
        test: {
            components: {
                list: [
                    {compare: fullData => fullData.compare.default},
                    {text: fullData => fullData.text.example},
                    {form: fullData => fullData.form.template},
                    {'mobile-menu': fullData => fullData['mobile-menu'].example_left},
                    {'mobile-menu': fullData => fullData['mobile-menu'].example_right},
                ]
            },
        }
    }
};
