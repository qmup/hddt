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

        if (filterOptions.customer !== undefined) {
          $(container).find('#search-custName').on('keyup', function () {
            table.columns(filterOptions.customer).search(this.value).draw();
          });
        }
        if (filterOptions.building !== undefined) {
          $(container).find('#search-buildingNo').on('keyup', function () {
            table.columns(filterOptions.building).search(this.value).draw();
          });
        }
        if (filterOptions.status !== undefined) {
          $(container).find('#search-status').on('change', function () {
            table.columns(filterOptions.status).search(this.value).draw();
          });
        }
        if (filterOptions.service !== undefined) {
          $(container).find('#search-service').on('change', function () {
            table.columns(filterOptions.service).search(this.value).draw();
          });
        }
        if (filterOptions.date !== undefined) {
          /* Custom filtering function which will search date between two dates */
          $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
              var minDate = $('#search-dateFrom');
              var maxDate = $('#search-dateTo').val();
              var date = data[filterOptions.date] || 0;
              console.log("min: "+minDate+", max: "+maxDate+", date: "+date);
              
              return false;
            }
          );
          $('#search-dateFrom, #search-dateTo').change(function () {
            table.draw();
          });
        }
        if (filterOptions.moneyUnit !== undefined) {
          $(container).find('#search-moneyUnit').on('change', function () {
            table.columns(filterOptions.moneyUnit).search(this.value).draw();
          });
        }

        if (filterOptions.money !== undefined) {
          /* Custom filtering function which will search money between two values */
          $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
              var min = parseFloat($('#search-moneyFrom').val());
              var max = parseFloat($('#search-moneyTo').val());
              var money = parseFloat(data[filterOptions.money]) || 0;

              if ((isNaN(min) && isNaN(max)) ||
                (isNaN(min) && money <= max) ||
                (min <= money && isNaN(max)) ||
                (min <= money && money <= max)) {
                return true;
              }
              return false;
            }
          );
          $('#search-moneyFrom, #search-moneyTo').keyup(function () {
            table.draw();
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


APP_PUBLIC.ManageThongBaoPhi = function () {
  // DATATABLE
  var initDataTable = function () {
    var tableId = '#thongbaophi';
    var container = '.thongbaophi';
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
      customer: 0,
      building: 1,
      date: 2,
      service: 3,
      money: 4,
      moneyUnit: 5,
      status: 6
    }


    APP_PUBLIC.DataTableCustom.initDataTable(tableId, container, downloadOptions, filterOptions);
  }
  // end DATATABLE

  return {
    init: initDataTable
  }

}();


$(document).ready(function () {
  APP_PUBLIC.ManageThongBaoPhi.init();
  $('#checkMulti').click(function(){
    $('.checkTBP').prop("checked",true);
  });
  $('#checkMulti').click(function(){
    $('.checkTBP').prop("checked",false);
  });

  $('.dt-buttons').appendTo($('.table-button-group .left'));
  $('.table-pagination').appendTo($('.dataTables_wrapper'));
  $('.dataTables_info').appendTo($('.table-pagination .left'));
  $('.dataTables_paginate').appendTo($('.table-pagination .right'));

});