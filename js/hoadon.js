$(".check").click(function () {
  swal({
    title: 'Bạn có chắc không ?',
    text: "Bạn không thể hoàn tác lại hành động này!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  }).then((result) => {
    if (result.value) {
      swal(
        'Đã chấp nhận!',
        'Thực hiện thành công.',
        'success'
      )
    }
  })
});

$(".cancel").click(function () {
  swal({
    title: 'Bạn có chắc không ?',
    text: "Bạn không thể hoàn tác lại hành động này!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Có',
    cancelButtonText: 'Không'
  }).then((result) => {
    if (result.value) {
      swal(
        'Đã từ chối!',
        'Đã từ chối thành công.',
        'success'
      )
    }
  })
});

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

        $(container).find('#search-address').on('keyup', function () {
          table.columns(1).search(this.value).draw();
        });

        $(container).find('#search-code').on('keyup', function () {
          table.columns(3).search(this.value).draw();
        });

        if (filterOptions.unit !== undefined) {
          $(container).find('#search-unit').on('change', function () {
            table.columns(filterOptions.unit).search(this.value).draw();
          });
        }

        if (filterOptions.status !== undefined) {
          $(container).find('#search-status').on('change', function () {
            table.columns(filterOptions.status).search(this.value).draw();
          });
        }

        if (filterOptions.date !== undefined) {
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

        if (filterOptions.price !== undefined) {
          $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
              var min = parseFloat($('#search-min').val(), 10);
              var max = parseFloat($('#search-max').val(), 10);
              var value = parseFloat(data[filterOptions.price].replace(/\,/g, '')) || 0; // use data for the value column

              if ((isNaN(min) && isNaN(max)) ||
                (isNaN(min) && value <= max) ||
                (min <= value && isNaN(max)) ||
                (min <= value && value <= max)) {
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
      date: 2,
      unit: 4,
      price: 5,
      status: 6
    }


    APP_PUBLIC.DataTableCustom.initDataTable(tableId, container, downloadOptions, filterOptions);
  }
  // end DATATABLE

  return {
    init: initDataTable
  }

}();

$('body').on('shown.bs.modal', '#modal-form', function() {
  var mySwiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 30,
    keyboard: {
      enabled: true,
    },
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});

$(document).ready(function () {
  APP_PUBLIC.ManageInvoices.init();
  $(".table-action button:last-child").click(function () {
    var rowCurrent = $(this).parent().parent().index('tr');
    $(this).attr('data-id', rowCurrent);
    // $(".modal-body #index").val($(this).data('id'));
  });

  $('.dt-buttons').appendTo($('.table-button-group .left'));
  $('.table-pagination').appendTo($('.dataTables_wrapper'));
  $('.dataTables_info').appendTo($('.table-pagination .left'));
  $('.dataTables_paginate').appendTo($('.table-pagination .right'));
});