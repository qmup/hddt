
window.APP_PUBLIC = {};

/* Region: custom helper functions for DataTable */
APP_PUBLIC.DataTableCustom = function () {

    var initDataTable = function (tableId, container, downloadOptions, filterOptions, callback) {
        //Init table
        var table = $(tableId).DataTable({
            pageLength: 10,
            responsive: true,
            dom: 'Bfrtip',
            buttons: downloadOptions,
            columnDefs: [{
                orderable: false,
                targets: -1
            }],
            initComplete: function (settings, json) {

                if (filterOptions.customerCode !== undefined) {
                    $(container).find('#search-custCode').on('keyup', function () {
                        table.columns(filterOptions.customerCode).search(this.value).draw();
                    });
                }
                if (filterOptions.customer !== undefined) {
                    $(container).find('#search-custName').on('keyup', function () {
                        table.columns(filterOptions.customer).search(this.value).draw();
                    });
                }
                if (filterOptions.service !== undefined) {
                    $(container).find('#search-service').on('change', function () {
                        table.columns(filterOptions.service).search(this.value).draw();
                    });
                }

                if (filterOptions.date !== undefined) {
                    $.fn.dataTable.ext.search.push(
                        function (settings, data, dataIndex) {
                            const DATE_FORMAT = 'DD/MM/YYYY';
                            var $min = $('#search-dateFrom');
                            var $max = $('#search-dateTo');

                            var minDate = moment('01/01/1900'), maxDate = moment('01/01/9999');
                            if ($min.val() !== '')
                                minDate = moment($min.datepicker('getDate'), DATE_FORMAT);

                            if ($max.val() !== '')
                                maxDate = moment($max.datepicker('getDate'), DATE_FORMAT);

                            var currDate = moment(data[filterOptions.date], DATE_FORMAT);
                            return minDate <= currDate && currDate <= maxDate;
                        }
                    );
                    $('#search-dateFrom, #search-dateTo').change(function () {
                        table.draw();
                    });
                }

                var replaceComma = function(i){
                    if(typeof i === 'string'){
                        return i.replace(/\,/g,'');
                    }
                    else return i;
                };

                this.api().columns(8).every(function () {
                    var column = this;

                    var sum = column
                        .data()
                        .reduce(function (a, b) {
                            a = parseFloat(replaceComma(a),10) || 0;
                            
                            b = parseFloat(replaceComma(b), 10) || 0;
                            return a + b;
                        });

                    $(".congno-sum").html(sum.toLocaleString());
                });

                if (callback !== undefined)
                    callback();
            }
        });

        //Init datepicker
        $(container).find('#search-dateTo, #search-dateFrom').datepicker({
            format: 'dd/mm/yyyy',
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true,
            onSelect: function () {
                table.draw();
            }
        });

    }
    return {
        initDataTable: initDataTable
    }

}();


APP_PUBLIC.ManageCongNo = function () {
    // DATATABLE
    var initDataTable = function () {
        var tableId = '#congno';
        var container = '.congno';
        var downloadOptions = [
            {
                extend: 'excel',
                title: 'Hóa đơn'
            }
        ];

        // enable filter with column index
        var filterOptions = {
            customerCode: 0,
            service: 1,
            customer: 2,
            date: 3,
        }


        APP_PUBLIC.DataTableCustom.initDataTable(tableId, container, downloadOptions, filterOptions);
    }
    // end DATATABLE

    return {
        init: initDataTable
    }

}();


$(document).ready(function () {
    APP_PUBLIC.ManageCongNo.init();

    $('.dt-buttons').appendTo($('.table-button-group .left'));
    $('.table-pagination').appendTo($('.dataTables_wrapper'));
    $('.dataTables_info').appendTo($('.table-pagination .left'));
    $('.dataTables_paginate').appendTo($('.table-pagination .right'));

});