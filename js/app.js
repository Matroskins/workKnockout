(function() {
    var data;

    function AppViewModel() {
        var self = this;
        self.paymentName = ko.observable('');
        self.paymentMoney = ko.observable();
        self.personValidateName = ko.computed(function() {
            return self.paymentName() ? Boolean(self.paymentName().match(/^[a-zA-Z]{1,}$/)) : false;
        });
        self.personValidateAge = ko.computed(function() {
            return self.paymentMoney() ? Boolean(self.paymentMoney().match(/^\d{1,}$/)) : false;
        })
    };

    function ReservationsViewModel() {
        var self = this;


        // Editable data
        self.forms = ko.observableArray([
            new AppViewModel()
        ]);

        // Operations
        self.addRow = function() {
            self.forms.push(new AppViewModel());
        }

        self.summa = ko.computed(function() {
            var summ = 0;
            var moneyArray = self.forms();
            var tempMoneyVal = 0;
            for (var i = 0; i < moneyArray.length; i++) {
                tempMoneyVal = (isNaN(parseInt(moneyArray[i].paymentMoney()))) ? 0 : parseInt(moneyArray[i].paymentMoney());
                summ += tempMoneyVal;
            }
            return summ;
        });

        self.removeRow = function(form) {
            self.forms.remove(form)
        }


        self.seeResult = ko.computed(function() {

            var filteredArray = _.filter(self.forms(), (arrayElement) => {
                if (arrayElement.personValidateName() && arrayElement.personValidateAge()) {
                    return arrayElement;
                }
            });

            if (filteredArray.length === 0) {
                filteredArray[0] = new AppViewModel();
            }


            var filteredArrayNames = () => {
                if (!(filteredArray.length === 0)) {
                    return filteredArray;
                } else {
                    return _.map(filteredArray, (arrayElement) => {
                        return arrayElement.paymentName()
                    });
                }
            }

            var filteredArrayMoney = () => {
                if (!(filteredArray.length === 0)) {
                    return filteredArray;
                } else {
                    return _.map(filteredArray, (arrayElement) => {
                        return arrayElement.paymentMoney()
                    });
                }
            }

            console.log('filter name right  ' + filteredArrayNames()[0].paymentName());

            data = {
                labels: _.map(filteredArrayNames(), (arrayElement) => {
                    return arrayElement.paymentName()
                }),
                datasets: [{
                    data: _.map(filteredArrayMoney(), (arrayElement) => {
                        return arrayElement.paymentMoney()
                    }),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#ff9999',
                        '#4286f4',
                        '#bc42f4',
                        '#f442dc',
                        '#d31547'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#ff9999',
                        '#4286f4',
                        '#bc42f4',
                        '#f442dc',
                        '#d31547'
                    ]
                }]
            };

            var ctx = $("#myChart");
            var myChart = new Chart(ctx, {

                type: 'pie',
                data: data
            });

        });
    }


    var koObj = new ReservationsViewModel();
    ko.applyBindings(koObj);

    $(document).on('keyup', '.namePayment input', function(event) {
        validateName(event);
    });

    $(document).on('keyup', '.moneyPayment input', function(event) {
        validateMoney(event);
    });


    function validateName(element) {

        var arg1 = $(element.target).val();
        var parentInput = $(element.target).parent();

        if (arg1.match(/^[a-zA-Z]{1,}$/)) {
            parentInput.removeClass('has-error').addClass('has-success');
        } else {
            parentInput.removeClass('has-success').addClass('has-error');
        }
    }


    function validateMoney(element) {

        var elementFull = $(element.target);
        var arg1 = elementFull.val();
        var parentInput = $(element.target).parent();

        if (arg1.match(/^\d{1,}$/)) {
            parentInput.removeClass('has-error').addClass('has-success');
            elementFull.attr("data-bind: 'paymentMoney' ")
        } else {
            parentInput.removeClass('has-success').addClass('has-error');
            elementFull.removeAttr("data-bind");
        }
    }
})();