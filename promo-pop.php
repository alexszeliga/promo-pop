<?php
/**
* Plugin Name: Promo Pop!
* Plugin URI: alexszeliga.com
* Description: A plugin which shows a pop-up Promo
* Version: 0.1
* Author: Alex Szeliga
* Author URI: alexszeliga.com
**/

/**
 * @internal never define functions inside callbacks.
 * these functions could be run multiple times; this would result in a fatal error.
 */
 
/**
 * custom option and settings
 */
function promo_pop_settings_init() {
    global $pagenow;
    if ($pagenow === "options.php" || ( $pagenow === "admin.php" && $_GET['page'] === "promo_pop" ) ) {
    // build Page array
    $page_args = array(
        'post_type'     => 'page',
        'post_per_page' => -1,
        'fields'        => 'ids'
    );
    $page_query = new WP_Query( $page_args );
    $page_ids = $page_query->posts;
    $page_ids_and_titles = array();
    // add home page to pages
    $frontpage_id = get_option( 'page_on_front' );
    $page_ids_and_titles[] = array(
        'page_id'    => $frontpage_id,
        'page_title' => get_the_title($frontpage_id),
    );
    foreach ($page_ids as $page_id) {
        $page_title = get_the_title($page_id);
        $page_ids_and_titles[] = array(
            'page_id'    => $page_id,
            'page_title' => $page_title,
        );
    }
    $post_types_args = array(
        'public' => 'true',
    );
    $post_types = get_post_types( $post_types_args );
    wp_register_style('select2_styles', plugin_dir_url(__FILE__) . 'css/lib/select2.min.css' );
    wp_register_style('promo_pop_admin_styles', plugin_dir_url(__FILE__) . 'css/promo_pop_admin_styles.css' );
    wp_enqueue_style('select2_styles');
    wp_enqueue_style('promo_pop_admin_styles');

    $promo_image_id[] = get_option( 'media_selector_attachment_id', 0 );
    wp_enqueue_media();
    wp_enqueue_script('select2',  plugin_dir_url(__FILE__) . 'js/lib/select2.full.min.js', array( 'jquery' ), '1.0.0', true );
    wp_enqueue_script('promo_pop_admin',  plugin_dir_url(__FILE__) . 'js/promo_pop_admin.js', array( 'jquery' ), '1.0.0', true );
    wp_localize_script('promo_pop_admin', 'pages', $page_ids_and_titles);
    wp_localize_script('promo_pop_admin', 'img_id', $promo_image_id);
    wp_localize_script('promo_pop_admin', 'post_types', $post_types);

// $test = array('active','title','body_image','cta_label','url','start','end','page_array','page_array_type');
$promo_pop_field_name_array = array(
    array(
        'name'  => 'active', 
        'label' => 'Activate Promo'
        ),
    array(
        'name'  => 'title',
        'label' => 'Promo Title'
        ),
    array(
        'name'  => 'body_image',
        'label' => 'Background Image'
        ),
    array(
        'name'  => 'cta_label',
        'label' => 'Call to Action Text'
        ),
    array(
        'name'  => 'url',
        'label' => 'Promo URL'
        ),
    array(
        'name'  => 'start',
        'label' => ''
        ),
    array(
        'name'  => 'end',
        'label' => ''
        ),
    array(
        'name'  => 'page_array_type',
        'label' => 'Display Rule'
        ),
    array(
        'name'  => 'page_array',
        'label' => 'Display Pages'
        ),
    array(
        'name'  => 'developer_mode',
        'label' => 'Activate Developer Mode?'
     ));

 // register settings for "promo_pop" page

 foreach ($promo_pop_field_name_array as $field_name) {
    register_setting( 'promo_pop', 'promo_pop_' . $field_name['name'] );
        // register a new field in the "promo_pop_section_developers" section, inside the "promo_pop" page
    if ($field_name['name'] == "start") {
        add_settings_field(
            'promo_pop_field_' . $field_name['name'], // ID: used only internally
            // use $args' label_for to populate the id inside the callback
            'Promo Window', // Setting Label
            'promo_pop_field_' . $field_name['name'] . '_cb', //function that returns HTML for form element
            'promo_pop', // page slug string from 'add_menu_page' function
            'promo_pop_section_developers', // section from 'add_setting_section' function
                [
                    'label_for' => 'promo_pop_field_' . $field_name['name'],
                    'class' => 'promo_pop_' . $field_name['name'] . '_row',
                ] // $args
            );
    }
    elseif ($field_name['name'] != "end") {
    add_settings_field(
        'promo_pop_field_' . $field_name['name'], // ID: used only internally
        // use $args' label_for to populate the id inside the callback
        $field_name['label'], // Setting Label
        'promo_pop_field_' . $field_name['name'] . '_cb', //function that returns HTML for form element
        'promo_pop', // page slug string from 'add_menu_page' function
        'promo_pop_section_developers', // section from 'add_setting_section' function
            [
                'label_for' => 'promo_pop_field_' . $field_name['name'],
                'class' => 'promo_pop_' . $field_name['name'] . '_row',
            ] // $args
        );
    }
    }
 }


 // register a new section in the "promo_pop" page
 add_settings_section(
 'promo_pop_section_developers',
 __( 'Promo Options', 'promo_pop' ),
 'promo_pop_section_developers_cb',
 'promo_pop'
 );

}
 
/**
 * register our promo_pop_settings_init to the admin_init action hook
 */
add_action( 'admin_init', 'promo_pop_settings_init' );
add_action( 'admin_enqueue_scripts', 'promo_pop_admin_scripts');
add_action( 'admin_print_styles', 'promo_pop_admin_styles');
 
function promo_pop_admin_scripts() {
    // Load the datepicker script (pre-registered in WordPress).
    wp_enqueue_script( 'jquery-ui-datepicker' );
}

function promo_pop_admin_styles () {
        // You need styling for the datepicker. For simplicity I've linked to Google's hosted jQuery UI CSS.
        wp_register_style( 'jquery-ui-datepicker-style', 'https://code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css' );
        wp_enqueue_style( 'jquery-ui-datepicker-style' );  
}
/**
 * custom option and settings:
 * callback functions
 */
 
// developers section cb
 
function promo_pop_section_developers_cb( $args ) {
 ?>
 <p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Define the look and feel of your promotional pop-up', 'promo_pop' ); ?></p>
 <?php
}
 

//
function promo_pop_field_developer_mode_cb( $args ) {
    // get the value of the setting we've registered with register_setting()
    $option = get_option( 'promo_pop_developer_mode' );
    // output the field
    ?>
    <input type="checkbox" id="<?php echo esc_attr( $args['label_for'] ); ?>"
    name="promo_pop_developer_mode" <?php if ($option === 'on') echo 'checked';?>>
    <?php
}
// active field cb
function promo_pop_field_active_cb( $args ) {
 // get the value of the setting we've registered with register_setting()
 $option = get_option( 'promo_pop_active' );
 // output the field
 ?>
 <input type="checkbox" id="<?php echo esc_attr( $args['label_for'] ); ?>"
 name="promo_pop_active" <?php if ($option === 'on') echo 'checked';?>>
 <?php
}

function promo_pop_field_title_cb( $args ) {
    $option = get_option( 'promo_pop_title' );
    ?>
    <input type="text" name="promo_pop_title" id="<?php echo esc_attr( $args['label_for'] ); ?>" value="<?php echo $option; ?>">
<?php
}
function promo_pop_field_body_image_cb( $args ) {
    $option = get_option( 'promo_pop_body_image' );
    ?>
    <img src='<?php echo wp_get_attachment_image_src($option)[0]; ?>' id='promo_image_thumb' width='150px' height='150px'/>
    <br>
    <input name="promo_pop_body_image_button" type="button" id="<?php echo esc_attr( $args['label_for'] ); ?>" value="<?php _e("Upload Image"); ?>">
    <input name="promo_pop_body_remove_image_button" type="button" id="remove_<?php echo esc_attr( $args['label_for'] ); ?>" value="<?php _e("Remove Image"); ?>">
    <input type='hidden' name='promo_pop_body_image' id='image_attachment_id' value='<?php echo $option; ?>'>
    <p>Recommended image size: 1024 x 350</p>


<?php
}
function promo_pop_field_cta_label_cb( $args ) {
    $option = get_option( 'promo_pop_cta_label' );
    ?>
    <input type="text" name="promo_pop_cta_label" id="<?php echo esc_attr( $args['label_for'] ); ?>" value="<?php echo $option; ?>">
<?php
}
function promo_pop_field_url_cb( $args ) {
    $option = get_option( 'promo_pop_url' );
    ?>
    <input type="text" name="promo_pop_url" id="<?php echo esc_attr( $args['label_for'] ); ?>" value="<?php echo $option; ?>">
<?php
}
function promo_pop_field_start_cb( $args ) {
    $option = get_option( 'promo_pop_start' );
    $option_end = get_option ( 'promo_pop_end' );
    ?>
    <div style="display:flex;">
        <div style="margin-right: 1em;">
            <p style="font-weight:bold;">Start</p>
            <input autocomplete="off" name="promo_pop_start" class="datepicker" id="<?php echo esc_attr( $args['label_for'] ); ?>" value="<?php echo $option; ?>">
        </div>
        <div>
            <p style="font-weight:bold;">End</p>
            <input autocomplete="off" name="promo_pop_end" class="datepicker" id="<?php echo esc_attr( $args['label_for'] ); ?>-end" value="<?php echo $option_end; ?>">
        </div>
    </div>
<?php
}
function promo_pop_field_end_cb( $args ) {
    ?>

<?php
}
function promo_pop_field_page_array_cb( $args ) {
    $option = get_option( 'promo_pop_page_array' );

    ?>
    <select class="page-select" multiple="multiple" name="promo_pop_page_array_input" id="<?php echo esc_attr( $args['label_for'] ); ?>"></select>
    <input type="hidden" id="hidden-page-select" name="promo_pop_page_array" value="<?php echo $option; ?>">
    <div class="page-array-container">
    </div>
<?php
}
function promo_pop_field_page_array_type_cb( $args ) {
    $option = get_option( 'promo_pop_page_array_type' );
    ?>
    <select name="promo_pop_page_array_type" id="<?php echo esc_attr( $args['label_for'] ); ?>">
        <option  <?php if ($option == 'include') {echo 'selected'; } ?> value="include">Include Promo on Selected Pages</option>
        <option  <?php if ($option == 'exclude') {echo 'selected'; } ?> value="exclude">Exclude Promo on Selected Pages</option>
<?php
}
 
/**
 * top level menu
 */
function promo_pop_options_page() {
 // add top level menu page
 add_menu_page(
 'Promotional Display',
 'Promotional Display',
 'manage_options',
 'promo_pop', //menu slug
 'promo_pop_options_page_html',
 'dashicons-megaphone'
 );
}
 
/**
 * register our promo_pop_options_page to the admin_menu action hook
 */
add_action( 'admin_menu', 'promo_pop_options_page' );
 
/**
 * top level menu:
 * callback functions
 */
function promo_pop_options_page_html() {
 // check user capabilities
 if ( ! current_user_can( 'manage_options' ) ) {
 return;
 }
 
 // add error/update messages
 
 // check if the user have submitted the settings
 // wordpress will add the "settings-updated" $_GET parameter to the url
 if ( isset( $_GET['settings-updated'] ) ) {
 // add settings saved message with the class of "updated"
 add_settings_error( 'promo_pop_messages', 'promo_pop_message', __( 'Settings Saved', 'promo_pop' ), 'updated' );
 }
 
 // show error/update messages
 settings_errors( 'promo_pop_messages' );
 ?>
 <div class="wrap promo-pop-wrap">
 <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
 <form action="options.php" method="post">
 <?php
 // output security fields for the registered setting "promo_pop"
 settings_fields( 'promo_pop' );
 // output setting sections and their fields
 // (sections are registered for "promo_pop", each field is registered to a specific section)
 do_settings_sections( 'promo_pop' );
 // output save settings button
 submit_button( 'Save Settings' );
 ?>
 </form>
 </div>
 <?php
}

function promo_pop_promo() {
    wp_enqueue_script('jcookie',  plugin_dir_url(__FILE__) . 'js/lib/jquery.cookie.js', array( 'jquery' ), '1.0.0', true );
    wp_enqueue_style( 'promo_pop_styles', plugin_dir_url(__FILE__) . 'css/promo_pop_styles.css', array(), '1.0.0' );
    $options['active'] = get_option( 'promo_pop_active' );
    $options['title'] = get_option( 'promo_pop_title' );
    $options['body_image'] = wp_get_attachment_url( get_option( 'promo_pop_body_image' ) );
    $options['cta_label'] = get_option( 'promo_pop_cta_label' );
    $options['url'] = get_option( 'promo_pop_url' );
    $options['start'] = strtotime( get_option( 'promo_pop_start' ) );
    $options['end'] = strtotime( get_option( 'promo_pop_end' ) );
    $options['now'] = strtotime('today');
    $options['page_array'] = get_option( 'promo_pop_page_array' );
    $options['page_array_type'] = get_option( 'promo_pop_page_array_type' );
    $options['dev_mode'] = get_option( 'promo_pop_developer_mode');
    $options['logged_in'] = is_user_logged_in();
    $detail['post_id'] = get_the_ID();
    $detail['plugin_dir'] = plugin_dir_url(__FILE__);
    wp_enqueue_script('promo_pop_frontend',  plugin_dir_url(__FILE__) . 'js/promo_pop_frontend.js', array( 'jquery' ), '1.0.0', true );
    wp_localize_script('promo_pop_frontend', 'options', $options);
    wp_localize_script('promo_pop_frontend', 'detail', $detail);
}
?>