// This script is enqueue by WordPress with a localized variables:
// options is an object that contains all of the options associated with the plugin
// details contains all relevant post/page details.

(function($) {
  var promoIsCurrent = false;
  var promoIsActive = false;
  var postsToFilter = options.page_array.split(",");
  var filterMethod = options.page_array_type;
  var thisPostId = detail.post_id;
  var pluginDir = detail.plugin_dir;
  var popDelay = 1000;
  //   Cookies.remove('promo-pop-closed'); // uncomment for testing; promo will always pop.
  var cookieState = Cookies.get("promo-pop-closed");
  var now = parseInt(options.now);
  var start = parseInt(options.start);
  var end = parseInt(options.end);
  if (now > start && now <= end) {
    promoIsCurrent = true;
  }
  if (options.active === "on") {
    promoIsActive = true;
  }
  if (
    ((postsToFilter.indexOf(thisPostId) >= 0 && filterMethod === "include") ||
      (postsToFilter.indexOf(thisPostId) === -1 &&
        filterMethod === "exclude")) &&
    !cookieState &&
    promoIsCurrent &&
    promoIsActive
  ) {
    promoBanner = $('<div class="promo_pop_container">');

    closeButton = $(
      '<div class="promo_pop_close" name="close_promo" id="promo_pop_close">'
    );

    closeButtonImg = $(
      '<img src="' +
        pluginDir +
        'assets/img/close-ui-2.gif" class="promo_pop_close close_button_img">'
    );
    closeButton.append(closeButtonImg);
    promoImage = $(
      '<img src="' + options.body_image + '" id="promo_pop_image">'
    );
    promoRelContent = $('<div id="promo_rel_box">');
    promoFlexContent = $('<div id="promo_flexbox">');
    promoCopyContainer = $('<div class="promo_copy">');
    promoTopCopy = $('<p class="promo_headline">' + options.title + "</p>");
    promoBottomCopy = $(
      '<p class="promo_link"><a class="promo_pop_link" id="promo_pop_link" href="' +
        options.url +
        '" target="_blank">' +
        options.cta_label +
        "</a></p>"
    );
    promoCopyContainer.append(promoTopCopy);
    promoCopyContainer.append(promoBottomCopy);
    promoRelContent.append(promoImage);
    promoFlexContent.append(promoCopyContainer);
    promoRelContent.append(promoFlexContent);
    promoBanner.append(promoRelContent);
    promoBanner.append(closeButton);
    var baseHeight = 0;
    promoBanner.appendTo($("body"));
    baseHeight += promoBanner.outerHeight();
    promoBanner.css({ bottom: -baseHeight });
    setTimeout(function() {
      promoBanner.css({ bottom: 0, opacity: 1 });
    }, popDelay);
  }
  $("body").on("click", "#promo_pop_close", function(e) {
    // console.log("clicked close");
    Cookies.set("promo-pop-closed", "1", { expires: 2 });
    promoBanner.css({ bottom: -baseHeight, opacity: 0 });
  });
})(jQuery);
