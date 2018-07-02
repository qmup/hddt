
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

        if (filterOptions.moneyUnit !== undefined) {
          $(container).find('#search-moneyUnit').on('change', function () {
            table.columns(filterOptions.moneyUnit).search(this.value).draw();
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

        if (filterOptions.money !== undefined) {
          /* Custom filtering function which will search money between two values */
          $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {
              var min = parseFloat($('#search-moneyFrom').val());
              var max = parseFloat($('#search-moneyTo').val());
              var money = parseFloat(data[filterOptions.money].replace(/\,/g, '')) || 0;

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
  //init sweet alert
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

  //select all check boxes
  $('#checkMulti').click(function () {
    var c = this.checked;
    if (c == true) {
      $('.thongbaophi .main-action').show();
    }
    else {
      $('.thongbaophi .main-action').hide();
    }
    $('.checkTBP').each(function (index, value) {
      value.checked = c;
    })
  })
  //show button when check
  $('.checkTBP').each(function (index, value) {
    $(value).click(function () {
      if (value.checked == true) {
        $('.thongbaophi .main-action').show();
      }

      var hide = 0;
      //true = 1, false = 0
      $('.checkTBP').each(function (index, value) {
        hide += value.checked;
      })
      if (hide == 0) {
        $('.thongbaophi .main-action').hide();
      }
    })
  })

  //init-swiper
  $('body').on('shown.bs.modal', '#modal-form', function () {
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

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
  $('.dt-buttons').appendTo($('.table-button-group .left'));
  $('.table-pagination').appendTo($('.dataTables_wrapper'));
  $('.dataTables_info').appendTo($('.table-pagination .left'));
  $('.dataTables_paginate').appendTo($('.table-pagination .right'));

});