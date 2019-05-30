(function($) {
    console.log(post_types);
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

  // handler for selecting an option in the page selecter
  $("body").on("mousedown", ".page-option", function(e) {
    e.preventDefault();
    var pageId = $(this).data("page-id");
    // flip-flop the selected property
    $(this).prop("selected", !$(this).prop("selected"));

    // conditions for adding/removing from the saved list,
    // the saved list is stored as a value on a hidden input
    if ($(this).prop("selected")) {
      var hiddenPages = $("#hidden-page-select").val();
      if (hiddenPages === "") {
        $("#hidden-page-select").val(pageId);
      } else {
        $("#hidden-page-select").val(hiddenPages + "," + pageId);
      }
    } else {
      var hiddenPages = $("#hidden-page-select")
        .val()
        .split(",");

      var filteredList = hiddenPages.filter(function(page) {
        return parseInt(page) !== parseInt(pageId);
      });
      $("#hidden-page-select").val(filteredList.join());
    }
    return false;
  });

  $(window).load(function() {
    // initialize the date picker on the date fields
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
})(jQuery);