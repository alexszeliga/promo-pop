# promo-pop
A WordPress plugin allows content managers to create and display pop-up promotions.

# How to use:
* Go to the plugin directory for your WordPress installation and create a directory called 'promo-pop'
* Go to the new empty directory
* Clone this repository
* Activate the plugin in WordPress's admin area.
* Fill in all the fields in the "Promo Pop! Options" area.
* Add this function call to which ever pages or templates you'd like to have calling the plugin: `promo_pop_promo();`

# Technical Direction
* This plugin is intended to provide a flexible UI for generating and displaying promos
* This plugin is intended to allow for attachment to analytics
* This plugin is intended to allow content managers to create and save multiple promos
* This plugin is intended to allow for scheduled deployment of specific promos based on date
* This plugin uses jQuery to generate the promo markup manipulate the DOM