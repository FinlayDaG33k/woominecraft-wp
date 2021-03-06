window.WooMinecraft = ( function( window, document, $ ) {

	var app = {};
		app.l10n = woominecraft || {};

	app.cache = function() {
		app.$body = $( 'body' );
		app.$nonce = app.$body.find( '#woo_minecraft_nonce' );
		app.$resend_donations = app.$body.find( '#resendDonations' );
	};

	app.init = function() {

		app.cache();

		app.$body.on( 'click', '.woo_minecraft_add', app.add_command );
		app.$body.on( 'click', '.remove_row', app.remove_command );
		app.$body.on( 'click', '.woo_minecraft_reset', app.reset_form );

		if ( app.l10n.player_id ) {
			app.$resend_donations.on( 'click', app.resend_donations );
		} else {
			app.$resend_donations.prop( 'disabled', true );
		}

	};

	app.resend_donations = function( evt ) {
		evt.preventDefault();

		app.$resend_donations.prop( 'disabled', true );
		$.ajax( {
			url:      ajaxurl,
			data:     {
				action:    'wmc_resend_donations',
				order_id:  app.l10n.order_id,
				player_id: app.l10n.player_id
			},
			dataType: 'json',
			method:   'POST'
		} ).done( app.xhrDone );

	};

	app.xhrDone = function( data, textStatus, jqXHR ) {
		if ( data.success ) {
			// TODO: Make a prettier dialog, instead of this crap.
			alert( app.l10n.donations_resent );
		}


		app.$resend_donations.prop( 'disabled', false );
	};

	/**
	 * Adds more rows for the commands.
	 * @param evt
	 */
	app.add_command = function( evt ) {
		evt.preventDefault();
		var current_block = $( this ).closest( '.form-fields' );  // Update to grab the parent
		var cloned = current_block.find( '.woo_minecraft_copyme' ).clone().removeClass( 'woo_minecraft_copyme' ).removeAttr( 'style' );
		current_block.append( cloned );
	};

	/**
	 * Removes commands from post data.
	 * @param evt
	 */
	app.remove_command = function( evt ) {
		evt.preventDefault();

		$(this).parent('span').fadeOut(200, function(e){
			$(this).remove();
		});
	};

	/**
	 * Removes ALL commands from the current selection.
	 * @param evt
	 */
	app.reset_form = function( evt ){
		evt.preventDefault();

		var confirmation = confirm( app.l10n.confirm );
		if ( confirmation ) {
			// Finds the closest parent and removes all commands from within
			$( this ).closest('.form-fields').find( 'span' ).not( '.woo_minecraft_copyme, .woocommerce-help-tip' ).fadeOut( 200, function() {
				$( this ).remove();

				// This is very inefficient, but WooCommerce does this, so why not?
				//noinspection JSJQueryEfficiency
				$( '#variable_product_options .woocommerce_variations :input' ).trigger( 'change' );
			} );
		}
	};

	/**
	 * Logging helper, will ONLY log if SCRIPT_DEBUG is enabled
	 * in the wp-config file.
	 */
	app.log = function() {
		if ( app.l10n.script_debug && window.console ) {
			window.console.log( Array.prototype.slice.call( arguments ) );
		}
	};

	$( document ).ready( app.init );

	return app;

} )( window, document, jQuery );