(function($) {
  // click handler for the add image button
  // most of this is magic boilerplate empowered by wp_enqueue_media(); being called
  $("body").on("click", "#promo_pop_field_body_image", function(e) {
    var send_attachment_bkp = wp.media.editor.send.attachment;
    var button = $(this);
    wp.media.editor.send.attachment = function(props, attachment) {
      $("#image_attachment_id").attr("value", attachment.id);
      $("#promo_image_thumb").attr("src", attachment.url);
      wp.media.editor.send.attachment = send_attachment_bkp;
    };
    wp.media.editor.open(button);
    return false;
  });

  // The "Remove" button (remove the value from input type='hidden')
  $("body").on("click", "#remove_promo_pop_field_body_image", function() {
    var answer = confirm("Are you sure?");
    if (answer == true) {
      $("#promo_image_thumb").attr("src", "");
      $("#image_attachment_id").val("");
    }
    return false;
  });

  $(window).load(function() {
    var displayRuleRow = $('.promo_pop_page_array_type_row');
    var displayRuleSelectElement = displayRuleRow.find('select');
    var displayRule = displayRuleSelectElement.val();
    var displayRuleLabelRow = $('.promo_pop_page_array_row');
    var displayRuleLabel = displayRuleLabelRow.find('label');
    // initialize the date picker on the date fields

    displayRuleLabel.text( updateDisplayRuleLabel(displayRule) );
    displayRuleSelectElement.change( function () {
        var displayRuleRow = $('.promo_pop_page_array_type_row');
        var displayRuleSelectElement = displayRuleRow.find('select');
        var displayRule = displayRuleSelectElement.val();
        displayRuleLabel.text( updateDisplayRuleLabel(displayRule) );
    })
    $(".datepicker").datepicker();
    // add page options to page select box using localized variable from WP enqueue
    var pageSelect = $(".page-select");
    var hiddenPages = $("#hidden-page-select")
      .val()
      .split(",");
    // add a page option (and select it if it's in the array)
    pages.forEach(page => {
      if (hiddenPages.indexOf(page.page_id.toString()) !== -1) {
        var pageOption = $(
          '<option class="page-option" data-page-id="' +
            page.page_id +
            '" selected>' +
            page.page_title +
            "</option>"
        );
      } else {
        var pageOption = $(
          '<option class="page-option" data-page-id="' +
            page.page_id +
            '">' +
            page.page_title +
            "</option>"
        );
      }
      pageSelect.append(pageOption);
    });
  });
  function updateDisplayRuleLabel (rule) {
      if (rule === "include") {
        return "Included Pages";
          }
      else if (rule === "exclude") {
        return "Excluded Pages";
      }
      else {
          return "Pages";
      }
  }
  // init select2 on the multiselect:
  $('#promo_pop_field_page_array').select2();
  $('#promo_pop_field_page_array').on('select2:select', function (e) {
    var pageId = e.params.data.element.dataset.pageId;
    var hiddenInput = $('#hidden-page-select');
    if (hiddenInput.val().length === 0) {
      hiddenInput.val(pageId);
    } else if (hiddenInput.val().indexOf(pageId)<0) {
      hiddenInput.val(hiddenInput.val()+","+pageId)
    }
    
});
$('#promo_pop_field_page_array').on('select2:unselect', function (e) {
  var pageId = e.params.data.element.dataset.pageId;
  var hiddenInput = $('#hidden-page-select');
  var pageArray = hiddenInput.val().split(',');
  pageArray.splice(pageArray.indexOf(pageId),1)
  hiddenInput.val((pageArray).join(','));
});
})(jQuery);
