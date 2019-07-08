// This script is enqueue by WordPress with a localized variables:
// options is an object that contains all of the options associated with the plugin
// details contains all relevant post/page details.

(function($) {
  // console.log(detail);
  // console.log(options);

  var pluginDir = detail.plugin_dir;
  var popDelay = 1000;

  var promoBanner = $('<div class="promo_pop_container">');

  var closeButton = $(
    '<div data-promo-name="' +
      options.title +
      '" class="promo_pop_close" name="close_promo" id="promo_pop_close">'
  );

  var closeButtonImg = $(
    '<img src="' +
      pluginDir +
      'assets/img/close-ui-2.gif" class="promo_pop_close close_button_img" data-promo-name="' +
      options.title +
      '" href="' +
      options.url +
      '">'
  );
  closeButton.append(closeButtonImg);
  var promoImage = $(
    '<img src="' + options.body_image + '" id="promo_pop_image">'
  );
  var promoRelContent = $('<div id="promo_rel_box">');
  var promoFlexContent = $(
    '<a data-promo-name="' +
      options.title +
      '" href="' +
      options.url +
      '" target="_blank" id="promo_flexbox">'
  );
  var promoCopyContainer = $(
    '<div class="promo_copy" data-promo-name="' + options.title + '">'
  );
  // promoCopyContainerLink = $('<div>' )
  var promoTopCopy = $('<p class="promo_headline">' + options.title + "</p>");
  var promoBottomCopy = $(
    '<p id="promo_pop_link" class="promo_link promo_pop_link">' +
      options.cta_label +
      "</p>"
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

  $("body").on("click", "#promo_pop_close", function(e) {
    // console.log("clicked close");
    Cookies.set("promo-pop-closed", "1", { expires: 1 });
    promoBanner.css({ bottom: -baseHeight, opacity: 0 });
  });
})(jQuery);
