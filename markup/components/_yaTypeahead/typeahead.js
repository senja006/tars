yaModules.typeahead = (function () {

    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
        'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
        'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
        'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
        'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    let defaultOptions = {
        minLength: 0,
        highlight: true
    };

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };

    function create(inputs, options, data) {
        let currentData = data || states;
        let currentOptions = options || defaultOptions;
        inputs.typeahead(currentOptions,
            {
                name: 'states',
                limit: 1000,
                source: substringMatcher(currentData)
            }
        );

        //inputs.on('typeahead:select typeahead:autocomplete', (ev, suggestion) => {
        //    console.log(suggestion);
        //});
        //inputs.typeahead('destroy');
        //
        //inputs.typeahead(options,
        //    {
        //        name: 'states',
        //        limit: 1000,
        //        source: substringMatcher(['Мой город', 'Мой город'])
        //    }
        //);
    }

    return {
        create(inputs, data) {
            create(inputs, data);
        }
    }
}());
