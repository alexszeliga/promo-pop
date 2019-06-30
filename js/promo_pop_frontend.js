// This script is enqueue by WordPress with a localized variables:
// options is an object that contains all of the options associated with the plugin
// details contains all relevant post/page details.

(function($) {
  console.log(detail.post);
var now = parseInt(options.now);
var start = parseInt(options.start);
var end = parseInt(options.end);

var promoIsCurrent = false;
if (now > start && now <= end) {
  promoIsCurrent = true;
}
var promoIsActive = false;
if (options.active === "on") {
  promoIsActive = true;
}
var devMode = false;
if ( options.dev_mode === "on" ) {
  devMode = true;
}
var userLoggedIn = false;
if ( options.logged_in === "1" ) {
  userLoggedIn = true;
}
var pagesToFilter = options.page_array.split(",");
var filterMethod = options.page_array_type;
var thisPostType = detail.post.post_type;
var thisPostId = detail.post.ID;
var pluginDir = detail.plugin_dir;
var popDelay = 1000;
var cookieState = Cookies.get("promo-pop-closed");

if (
   (devMode && userLoggedIn && ((pagesToFilter.indexOf(thisPostId) >= 0 && filterMethod === "include") ||
(pagesToFilter.indexOf(thisPostId) === -1 &&
  filterMethod === "exclude"))) ||
  (((pagesToFilter.indexOf(thisPostId) >= 0 && filterMethod === "include") ||
    (pagesToFilter.indexOf(thisPostId) === -1 &&
      filterMethod === "exclude")) &&
  !cookieState &&
  promoIsCurrent &&
  promoIsActive)
) {
  promoBanner = $('<div class="promo_pop_container">');

  closeButton = $(
    '<div data-promo-name="' + options.title + '" class="promo_pop_close" name="close_promo" id="promo_pop_close">'
  );

  closeButtonImg = $(
    '<img src="' +
      pluginDir +
      'assets/img/close-ui-2.gif" class="promo_pop_close close_button_img" data-promo-name="' + options.title + '" href="' + options.url + '">'
  );
  closeButton.append(closeButtonImg);
  promoImage = $(
    '<img src="' + options.body_image + '" id="promo_pop_image">'
  );
  promoRelContent = $('<div id="promo_rel_box">');
  promoFlexContent = $('<a data-promo-name="' + options.title + '" href="' + options.url + '" target="_blank" id="promo_flexbox">');
  promoCopyContainer = $('<div class="promo_copy" data-promo-name="' + options.title + '">');
  promoCopyContainerLink = $('<div>' )
  promoTopCopy = $('<p class="promo_headline">' + options.title + "</p>");
  promoBottomCopy = $(
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
}
$("body").on("click", "#promo_pop_close", function(e) {
  // console.log("clicked close");
  Cookies.set("promo-pop-closed", "1", { expires: 1 });
  promoBanner.css({ bottom: -baseHeight, opacity: 0 });
});
})(jQuery);
