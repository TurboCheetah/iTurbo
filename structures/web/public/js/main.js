;(function ($) {
  'use strict'
  $('.column100').on('mouseover', function () {
    const table1 = $(this).parent().parent().parent()
    const table2 = $(this).parent().parent()
    const verTable = $(table1).data('vertable') + ''
    const column = $(this).data('column') + ''

    $(table2)
      .find('.' + column)
      .addClass('hov-column-' + verTable)
    $(table1)
      .find('.row100.head .' + column)
      .addClass('hov-column-head-' + verTable)
  })

  $('.column100').on('mouseout', function () {
    const table1 = $(this).parent().parent().parent()
    const table2 = $(this).parent().parent()
    const verTable = $(table1).data('vertable') + ''
    const column = $(this).data('column') + ''

    $(table2)
      .find('.' + column)
      .removeClass('hov-column-' + verTable)
    $(table1)
      .find('.row100.head .' + column)
      .removeClass('hov-column-head-' + verTable)
  })
})(jQuery)

$('.js-pscroll').each(function () {
  const ps = new PerfectScrollbar(this)

  $(window).on('resize', function () {
    ps.update()
  })
})
