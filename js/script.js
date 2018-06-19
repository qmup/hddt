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
        
        $(container).find('#search-code').on('keyup', function () {
          table.columns(0).search(this.value).draw();
        });

        $(container).find('#search-name').on('keyup', function () {
          table.columns(1).search(this.value).draw();
        });

        $(container).find('#search-account').on('keyup', function () {
          table.columns(2).search(this.value).draw();
        });

        $(container).find('#search-address').on('keyup', function () {
          table.columns(3).search(this.value).draw();
        });

        $(container).find('#search-email').on('keyup', function () {
          table.columns(5).search(this.value).draw();
        });

        $(container).find('#search-phone').on('keyup', function () {
          table.columns(6).search(this.value).draw();
        });

        if (filterOptions.bank !== undefined) {
          $(container).find('#search-bank').on('change', function () {
            table.columns(filterOptions.bank).search(this.value).draw();
          });
        }

        if (callback !== undefined)
          callback();
      }
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
      bank: 4
    }


    APP_PUBLIC.DataTableCustom.initDataTable(tableId, container, downloadOptions, filterOptions);
  }
  // end DATATABLE

  return {
    init: initDataTable
  }

}();


$(document).ready(function () {
  APP_PUBLIC.ManageInvoices.init();
   
  $('.dt-buttons').appendTo($('.table-button-group .left'));
  $('.table-pagination').appendTo($('.dataTables_wrapper'));
  $('.dataTables_info').appendTo($('.table-pagination .left'));
  $('.dataTables_paginate').appendTo($('.table-pagination .right'));

});