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
        $(container).find('#search-name').on('keyup', function () {
          table.columns(0).search(this.value).draw();
        });

        $(container).find('#search-code').on('keyup', function () {
          table.columns(1).search(this.value).draw();
        });

        if (filterOptions.payment !== undefined) {
          $(container).find('#search-payment').on('change', function () {
            table.columns(filterOptions.payment).search(this.value).draw();
          });
        }

        if (filterOptions.status !== undefined){
          $(container).find('#search-status').on('change', function () {
            table.columns(filterOptions.status).search(this.value).draw();
          });
        }

        if (filterOptions.date !== undefined){
          $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
              const DATE_FORMAT = 'DD/MM/YYYY';
              var $min = $('#min');
              var $max = $('#max');

              var minDate = moment('01/01/1900'), maxDate = moment('01/01/9999');
              if ($min.val() !== '')
                minDate = moment($min.datepicker('getDate'), DATE_FORMAT);

              if ($max.val() !== '')
                maxDate = moment($max.datepicker('getDate'), DATE_FORMAT);

              var currDate = moment(data[filterOptions.date], DATE_FORMAT);
              return minDate <= currDate && currDate <= maxDate;
            }
          );
        }

        if (filterOptions.price !== undefined){
          $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
              var min = parseFloat($('#search-min').val(), 10);
              var max = parseFloat($('#search-max').val(), 10);
              var value = parseFloat( data[filterOptions.price].replace(/\,/g, '') ) || 0; // use data for the value column

              if ( ( isNaN( min ) && isNaN( max ) ) ||
                   ( isNaN( min ) && value <= max ) ||
                   ( min <= value   && isNaN( max ) ) ||
                   ( min <= value   && value <= max ) )
              {
                  return true;
              }
              return false;
            }
          );
        }

        if (callback !== undefined)
          callback();
      }
    });

    //Init datepicker
    $(container).find('#min, #max').datepicker({
      format: 'dd/mm/yyyy',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true,
      onSelect: function () {
        table.draw();
      }
    });

    $(container).find('#min, #max').change(function () {
      table.draw();
    });

    $(container).find('#search-min, #search-max').on('keyup', function () {
      table.draw();
    });
  }

  return {
    initDataTable: initDataTable
  }

}();

APP_PUBLIC.ManageInvoices = function () {
  // DATATABLE
  var initDataTable = function () {
    var tableId = '#invoice-table';
    var container = '.invoice';
    var downloadOptions = [{
        extend: 'copy'
      },
      {
        extend: 'excel',
        title: 'Hóa đơn'
      },
      {
        extend: 'pdf',
        title: 'Hóa đơn'
      }
    ];

    // enable filter with column index
    var filterOptions = {
      date: 6,
      payment: 5,
      status: 7
    }


    APP_PUBLIC.DataTableCustom.initDataTable(tableId, container, downloadOptions, filterOptions);
  }
  // end DATATABLE

  return {
    init: initDataTable
  }

}();

APP_PUBLIC.ManageProducts = function () {
  // DATATABLE
  var initDataTable = function () {
    var tableId = '#product-table';
    var container = '.product';
    var downloadOptions = [{
        extend: 'copy'
      },
      {
        extend: 'excel',
        title: 'Sản phẩm'
      },
      {
        extend: 'pdf',
        title: 'Sản phẩm'
      }
    ];

    // enable filter with column index
    var filterOptions = {
      price: 3
    }


    APP_PUBLIC.DataTableCustom.initDataTable(tableId, container, downloadOptions, filterOptions);
  }
  // end DATATABLE

  return {
    init: initDataTable
  }

}();

APP_PUBLIC.ManageProformas = function () {
  // DATATABLE
  var initDataTable = function () {
    var tableId = '#proforma-table';
    var container = '.proforma';
    var downloadOptions = [{
        extend: 'copy'
      },
      {
        extend: 'excel',
        title: 'Thông báo phí'
      },
      {
        extend: 'pdf',
        title: 'Thông báo phí'
      }
    ];

    // enable filter with column index
    var filterOptions = {
      status: 4
    }


    APP_PUBLIC.DataTableCustom.initDataTable(tableId, container, downloadOptions, filterOptions);
  }
  // end DATATABLE

  return {
    init: initDataTable
  }

}();

$(document).ready(function () {
  if ($('.wrapper-content').hasClass('invoice')) {
    APP_PUBLIC.ManageInvoices.init();
  }
  else if ($('.wrapper-content').hasClass('product')) {
    APP_PUBLIC.ManageProducts.init();  
  }
  else if ($('.wrapper-content').hasClass('product')) {
    APP_PUBLIC.ManageProducts.init();  
  }
   
  $('.dt-buttons').appendTo($('.table-button-group .left'));
  $('.table-pagination').appendTo($('.dataTables_wrapper'));
  $('.dataTables_info').appendTo($('.table-pagination .left'));
  $('.dataTables_paginate').appendTo($('.table-pagination .right'));

});