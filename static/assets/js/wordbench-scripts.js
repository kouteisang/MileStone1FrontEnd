/**
 * Table of contents
 *
 * 1. General
 * 2. Components
 * 3. Header
 * 4. Core
 * 5. Elements
 * 6. Other
 * 7. Plugins
 */

(function($){ "use strict";
$(document).ready( function() {

/* -----------------------------------------------------------------------------

	1. GENERAL

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		IMPROVE ACCESSIBILITY
	-------------------------------------------------------------------------- */

	$('body').addClass( 'lsvr-using-keyboard' );

	// User is using mouse
	$(document).on( 'mousedown', function() {
		$('body').addClass( 'lsvr-using-mouse' );
		$('body').removeClass( 'lsvr-using-keyboard' );
	});

	// User is using keyboard
	$(document).on( 'keyup', function(e) {
		if ( e.key === "Tab" ) {
			$('body').addClass( 'lsvr-using-keyboard' );
			$('body').removeClass( 'lsvr-using-mouse' );
		}
	});


/* -----------------------------------------------------------------------------

	2. COMPONENTS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		GRID
	-------------------------------------------------------------------------- */

	// Masonry
	if ( $.fn.masonry && $.fn.imagesLoaded ) {
		$( '.lsvr-grid--masonry' ).each(function() {

			var $this = $(this),
				isOriginLeft = $( 'html' ).attr( 'dir' ) && 'rtl' === $( 'html' ).attr( 'dir' ) ? false : true;

			// Wait for images to load
			$this.imagesLoaded(function() {
				$this.masonry({
					isOriginLeft: isOriginLeft
				});
			});

		});
	}


/* -----------------------------------------------------------------------------

	3. HEADER

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		STICKY NAVBAR
	------------------------------------------------------------------------- */

	$( '.header--sticky' ).each(function(){

		var	$header = $(this),
			$topbar = $header.find( '.header__topbar' ),
			headerHeight = $header.outerHeight(),
			scrollTop = 0;

		// Insert navbar placeholder element
		$header.after( '<div class="header-placeholder"></div>' );
		var $placeholder = $( '.header-placeholder' );

		// Set placeholder height
		if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
			$placeholder.css( 'height', headerHeight );
		}

		// Set sticky header
		function setStickyHeader() {

			var topbarHeight = $topbar.length > 0 ? $topbar.outerHeight() - 5 : 0;
				headerHeight = $header.outerHeight();

			$placeholder.css( 'height', headerHeight );

			// Scroll down
    		if ( ( $(window).scrollTop() > topbarHeight ) && ( $(window).scrollTop() > scrollTop ) ) {

    			$placeholder.addClass( 'header-placeholder--active' );
    			$header.addClass( 'header--sticky-active' );

    			// Hide topbar
    			if ( $topbar.length > 0 ) {
    				$header.css( 'top', - topbarHeight );
    			}

    		}

    		// Scroll up
    		else if ( ( $(window).scrollTop() > topbarHeight ) && ( $(window).scrollTop() < scrollTop ) ) {

    			// Show topbar
    			if ( $topbar.length > 0 ) {
    				$header.css( 'top', 0 );
    			}

    		}

    		scrollTop = $(window).scrollTop();

		}

		// On scroll
		$(window).on( 'scroll', function() {
			if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
				setStickyHeader();
			}
		});

		// On page refresh
		if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
			setStickyHeader();
		}

		// Reset on screen transition
		$(document).on( 'lsvrWordbenchScreenTransition', function() {

			if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {

				setStickyHeader();

			} else {

    			$placeholder.removeClass( 'header-placeholder--active' );
    			$header.removeClass( 'header--sticky-active' );
    			$header.removeAttr( 'style' );

			}

		});

		// Back to top link fix
		$( '.back-to-top__link' ).on( 'click', function() {
			$placeholder.removeClass( 'header-placeholder--active' );
			$header.removeClass( 'header--sticky-active' );
			$header.removeAttr( 'style' );
		});

	});

	/* -------------------------------------------------------------------------
		HEADER SEARCH
	------------------------------------------------------------------------- */

	$( '.header-search' ).each(function() {

		var $popup = $(this),
			$toggle = $( '.header-search-toggle__button' ),
			$input = $popup.find( '.header-search__input' ),
			$filter = $popup.find( '.header-search__filter' ),
			$closeButton = $popup.find( '.header-search__close-button' ),
			expandPopupLabel = $toggle.data( 'label-expand-popup' ),
			collapsePopupLabel = $toggle.data( 'label-collapse-popup' );

		// Close form function
		function closeSearch() {
			$popup.slideUp( 100 );
			$toggle.removeClass( 'header-search__toggle--active' );
			$toggle.attr( 'title', expandPopupLabel );
			$toggle.attr( 'aria-expanded', false );
			$popup.attr( 'aria-expanded', false );
			$( 'body' ).removeClass( 'lsvr-scrolling-disabled' );
		}

		// Refresh filter function
		function refreshSearchFilter( checkbox ) {

			if ( true === checkbox.prop( 'checked' ) || 'checked' === checkbox.prop( 'checked' ) ) {

				checkbox.parent().addClass( 'header-search__filter-label--active' );

				// Filter all
				if ( checkbox.attr( 'id' ).indexOf( 'header-search-filter-type-any' ) >= 0 ) {
					$filter.find( 'input:not( [id^=header-search-filter-type-any] )' ).prop( 'checked', false ).trigger( 'change' );
				}

				// Filter others
				else {
					$filter.find( 'input[id^=header-search-filter-type-any]' ).prop( 'checked', false ).trigger( 'change' );
				}

			} else {

				checkbox.parent().removeClass( 'header-search__filter-label--active' );

				// Filter All if there is no other filter active
				if ( $filter.find( 'input:checked' ).length < 1 ) {
					$filter.find( 'input[id^=header-search-filter-type-any]' ).prop( 'checked', true ).trigger( 'change' );
				}

			}

		}

		// Toggle search
		$toggle.on( 'click', function() {

			$toggle.toggleClass( 'header-search__toggle--active' );
			$popup.slideToggle( 100 );

			if ( $toggle.hasClass( 'header-search__toggle--active' ) ) {
				$input.focus();
				$toggle.attr( 'title', collapsePopupLabel ).attr( 'aria-expanded', true );
				$popup.attr( 'aria-expanded', true );
				$( 'body' ).addClass( 'lsvr-scrolling-disabled' );

			} else {
				$toggle.attr( 'title', expandPopupLabel ).attr( 'aria-expanded', false );
				$popup.attr( 'aria-expanded', false );
				$( 'body' ).removeClass( 'lsvr-scrolling-disabled' );
			}

		});

		// Search filter
		$filter.find( 'input' ).each(function() {
			refreshSearchFilter( $(this) );
			$(this).on( 'change', function() {
				refreshSearchFilter( $(this) );
			});
		});

		// Close on click on close button
		$closeButton.on( 'click', function() {
			closeSearch();
		});

		// Close on click outside
		$(document).on( 'click.lsvrWordbenchHeaderSearchClosePopupOnClickOutside', function(e) {
			if ( $popup.is( ':visible' ) ) {
				if ( ! $( e.target ).closest( '#header' ).length && $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
					closeSearch();
				}
			}
		});

		// Close on ESC key
		$(document).on( 'keyup.lsvrWordbenchHeaderSearchClosePopupOnEscKey', function(e) {
			if ( e.key === "Escape" && $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
				closeSearch();
			}
		});

		// Remove inline styles on screen transition
		$(document).on( 'lsvrWordbenchScreenTransition', function() {
			$popup.removeAttr( 'style' ).attr( 'aria-expanded', false );
			$toggle.removeClass( 'header-search__toggle--active' ).attr( 'title', expandPopupLabel ).attr( 'aria-expanded', false );
			$(document).off( 'click.lsvrWordbenchHeaderSearchClosePopupOnClickOutside' );
		});

	});


	/* -------------------------------------------------------------------------
		PRIMARY MENU
	------------------------------------------------------------------------- */

	$( '.header-menu-primary' ).each( function() {

		var $this = $(this),
			expandPopupLabel = $this.data( 'label-expand-popup' ),
			collapsePopupLabel = $this.data( 'label-collapse-popup' );

		// Hide desktop all submenus function
		function resetMenu() {
			$this.find( '.header-menu-primary__item' ).removeClass( 'header-menu-primary__item--hover header-menu-primary__item--active' );
			$this.find( '.header-menu-primary__item-link' ).attr( 'aria-expanded', false );
			$this.find( '.header-menu-primary__item-link-indicator' ).removeAttr( 'style' );
			$this.find( '.header-menu-primary__submenu-wrapper' ).removeClass( 'header-menu-primary__submenu-wrapper--hover' ).removeAttr( 'style' ).attr( 'aria-expanded', false );
			$this.find( '.header-menu-primary__submenu-toggle' ).removeClass( 'header-menu-primary__submenu-toggle--active' ).attr( 'title', expandPopupLabel ).attr( 'aria-expanded', false );
		}

		// Init mobile
		function initMobile() {
			$this.find( '.header-menu-primary__item-link' ).each(function() {
				if ( $(this).attr( 'aria-controls' ) ) {
					$(this).attr( 'data-aria-controls', $(this).attr( 'aria-controls' ) ).removeAttr( 'aria-controls' ).removeAttr( 'aria-owns' ).removeAttr( 'aria-haspopup' ).removeAttr( 'aria-expanded' );
				}
			});
		}

		// Init desktop
		function initDesktop() {
			$this.find( '.header-menu-primary__item-link' ).each(function() {
				if ( $(this).attr( 'data-aria-controls' ) ) {
					$(this).attr( 'aria-controls', $(this).attr( 'data-aria-controls' ) ).attr( 'aria-owns', $(this).attr( 'data-aria-controls' ) ).attr( 'aria-haspopup', true ).attr( 'aria-expanded', false );
				}
			});
		}

		// Init mobile version on refresh
		if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() < 992 ) {
			initMobile();
		}

		// Parse submenus
		$this.find( '.header-menu-primary__submenu-wrapper' ).each(function() {

			var $submenu = $(this),
				$parent = $submenu.parent(),
				$toggle = $parent.find( '> .header-menu-primary__submenu-toggle' ),
				$link = $parent.find( '> .header-menu-primary__item-link' ),
				$indicator = $link.find( '> .header-menu-primary__item-link-indicator' ),
				type = $link.closest( '.header-menu-primary__item--megamenu' ).length > 0 ? 'megamenu' : 'dropdown';

			// Show desktop submenu function
			function desktopShowSubmenu() {
				$submenu.stop().fadeIn( 150 );
				$indicator.stop().fadeIn( 150 );
				$submenu.addClass( 'header-menu-primary__submenu-wrapper--hover' );
				$submenu.attr( 'aria-expanded', true );
				$parent.addClass( 'header-menu-primary__item--hover' );
				$link.attr( 'aria-expanded', true );
			}

			// Hide desktop submenu function
			function desktopHideSubmenu() {
				$submenu.stop().fadeOut( 150 );
				$indicator.stop().fadeOut( 150 );
				$submenu.removeClass( 'header-menu-primary__submenu-wrapper--hover' );
				$submenu.attr( 'aria-expanded', false );
				$parent.removeClass( 'header-menu-primary__item--hover' );
				$link.attr( 'aria-expanded', false );
			}

			// Show mobile submenu function
			function mobileShowSubmenu() {
				$submenu.slideDown( 150 );
				$submenu.attr( 'aria-expanded', true );
				$parent.addClass( 'header-menu-primary__item--active' );
				$toggle.attr( 'title', collapsePopupLabel ).attr( 'aria-expanded', true );
			}

			// Hide mobile submenu function
			function mobileHideSubmenu() {
				$submenu.slideUp( 150 );
				$submenu.attr( 'aria-expanded', false );
				$parent.removeClass( 'header-menu-primary__item--active' );
				$toggle.attr( 'title', expandPopupLabel ).attr( 'aria-expanded', false );
			}

			// Hide other submenus
			function resetSiblings() {
				$parent.siblings( '.header-menu-primary__item.header-menu-primary__item--hover' ).each(function() {
					$(this).removeClass( 'header-menu-primary__item--hover' );
					$(this).find( '.header-menu-primary__item--hover' ).removeClass( 'header-menu-primary__item--hover' );
					$(this).find( '.header-menu-primary__submenu-wrapper' ).removeAttr( 'style' );
					$(this).find( '.header-menu-primary__item-link-indicator' ).removeAttr( 'style' );
					$(this).find( '.header-menu-primary__item-link' ).attr( 'aria-expanded', false );
					$(this).find( '.header-menu-primary__submenu-wrapper' ).attr( 'aria-expanded', false );
				});
			}

			// Desktop interaction
			if ( ( 'dropdown' === type &&
					( $submenu.hasClass( 'header-menu-primary__submenu-wrapper--level-2' ) || $submenu.hasClass( 'header-menu-primary__submenu-wrapper--level-3' ) ) ) ||
						( 'megamenu' === type && $submenu.hasClass( 'header-menu-primary__submenu-wrapper--level-2' ) ) ) {

				// Desktop mouseover and focus action
				$parent.on( 'mouseover focus', function() {
					if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
						desktopShowSubmenu();
					}
				});

				// Desktop mouseleave and blur action
				$parent.on( 'mouseleave blur', function() {
					if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
						desktopHideSubmenu();
					}
				});

				// Touchstart event
				$link.on( 'touchstart', function() {

					if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 && ! $parent.hasClass( 'header-menu-primary__item--hover' ) ) {

						// Hide opened submenus
						resetSiblings();

						// Show submenu
						desktopShowSubmenu();

						// Hide on click outside
						$( 'html' ).on( 'touchstart.lsvrWordbenchHeaderMenuPrimaryCloseSubmenuOnClickOutside', function(e) {
							if ( ! $( e.target ).closest( '.header-menu-primary' ).length && $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
								desktopHideSubmenu();
								$( 'html' ).unbind( 'touchstart.lsvrWordbenchHeaderMenuPrimaryCloseSubmenuOnClickOutside' );
							}
						});

						return false;

					}

				});

				// Keyboard navigation
				$link.on( 'click', function() {

					if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 && ! $parent.hasClass( 'header-menu-primary__item--hover' ) ) {

						// Hide opened submenus
						resetSiblings();

						// Show submenu
						desktopShowSubmenu();

						return false;

					}

				});

			}

			// Mobile interaction
			$toggle.on( 'click', function() {

				$toggle.toggleClass( 'header-menu-primary__submenu-toggle--active' );
				if ( $toggle.hasClass( 'header-menu-primary__submenu-toggle--active' ) ) {
					mobileShowSubmenu();
				} else {
					mobileHideSubmenu();
				}

			});

		});

		// Reset menu on ESC key
		$(document).on( 'keyup.lsvrWordbenchHeaderMenuPrimaryCloseSubmenuOnEscKey', function(e) {

			if ( e.key === "Escape" ) {

				// Close active submenu
				if ( $( '*:focus' ).closest( '.header-menu-primary__item--hover, .header-menu-primary__item--active' ).length > 0 ) {

					$( '*:focus' ).closest( '.header-menu-primary__item--hover, .header-menu-primary__item--active' ).each(function() {

						$(this).removeClass( 'header-menu-primary__item--hover header-menu-primary__item--active' );
						$(this).find( '.header-menu-primary__item-link-indicator' ).hide();
						$(this).find( '> .header-menu-primary__submenu-wrapper' ).hide();
						$(this).find( '> .header-menu-primary__submenu-wrapper' ).attr( 'aria-expanded', false );
						$(this).find( '> .header-menu-primary__submenu-toggle' ).removeClass( 'header-menu-primary__submenu-toggle--active' ).attr( 'title', expandPopupLabel ).attr( 'aria-expanded', false );
						if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
							$(this).find( '> .header-menu-primary__item-link' ).attr( 'aria-expanded', false );
							$(this).find( '> .header-menu-primary__item-link' ).focus();
						} else {
							$(this).find( '> .header-menu-primary__submenu-toggle' ).focus();
						}

					});

				}

				// Otherwise close all submenus
				else {

					$( '.header-menu-primary__item--hover, .header-menu-primary__item--active' ).each(function() {

						$(this).removeClass( 'header-menu-primary__item--hover header-menu-primary__item--active' );
						$(this).find( '.header-menu-primary__item-link-indicator' ).hide();
						$(this).find( '> .header-menu-primary__submenu-wrapper' ).hide();
						$(this).find( '> .header-menu-primary__submenu-wrapper' ).attr( 'aria-expanded', false );
						$(this).find( '> .header-menu-primary__submenu-toggle' ).removeClass( 'header-menu-primary__submenu-toggle--active' ).attr( 'title', expandPopupLabel ).attr( 'aria-expanded', false );
						if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
							$(this).find( '> .header-menu-primary__item-link' ).attr( 'aria-expanded', false );
						}

					});

				}

			}

		});

		// Reset on screen transition
		$(document).on( 'lsvrWordbenchScreenTransition', function() {

			resetMenu();

			if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
				initDesktop();
			} else {
				initMobile();
			}

		});

	});

	/* -------------------------------------------------------------------------
		MOBILE HEADER
	------------------------------------------------------------------------- */

	$( '#header' ).each(function() {

		var $header = $(this),
			$searchToggle = $header.find( '.header-mobile-search-toggle' ),
			$menuToggle = $header.find( '.header-mobile-menu-toggle' ),
			$search = $header.find( '.header-search' ),
			$menu = $header.find( '.header__navbar-menu' ),
			$languages = $header.find( '.header-menu-languages' ),
			$secondaryMenu = $header.find( '.header-menu-secondary' ),
			$socialLinks = $header.find( '.header-social' ),
			expandSearchPopupLabel = $searchToggle.data( 'label-expand-popup' ),
			collapseSearchPopupLabel = $searchToggle.data( 'label-collapse-popup' ),
			expandMenuPopupLabel = $menuToggle.data( 'label-expand-popup' ),
			collapseMenuPopupLabel = $menuToggle.data( 'label-collapse-popup' );

		// Init on desktop
		var initDesktop = function() {
			$search.insertBefore( '.header__navbar' );
		};

		// Init on mobile
		var initMobile = function() {

			$search.appendTo( '.header__navbar-inner' );

			// Clone languages
			if ( $menu.find( '.header-menu-languages' ).length < 1 ) {
				$languages.clone().appendTo( $menu );
			}

			// Clone secondary menu
			if ( $menu.find( '.header-menu-secondary' ).length < 1 ) {
				$secondaryMenu.clone().appendTo( $menu );
			}

			// Clone social links
			if ( $menu.find( '.header-social' ).length < 1 ) {
				$socialLinks.clone().appendTo( $menu );
			}

		};

		// Reset header function
		var resetHeader = function() {
			$searchToggle.removeClass( 'header-mobile-search-toggle--active' );
			$searchToggle.attr( 'aria-expanded', false ).attr( 'title', expandSearchPopupLabel );
			$search.removeAttr( 'style' );
			$search.attr( 'aria-expanded', false );
			$menuToggle.removeClass( 'header-mobile-menu-toggle--active' );
			$menuToggle.attr( 'aria-expanded', false ).attr( 'title', expandMenuPopupLabel );
			$menu.removeAttr( 'style' );
			$menu.attr( 'aria-expanded', false );
			$menu.find( '.header-menu-languages' ).remove();
			$menu.find( '.header-menu-secondary' ).remove();
			$menu.find( '.header-social' ).remove();
		};

		// Open search function
		var openSearch = function() {

			$searchToggle.addClass( 'header-mobile-search-toggle--active' );
			$searchToggle.attr( 'aria-expanded', true ).attr( 'title', collapseSearchPopupLabel );
			$search.slideDown( 200, function() {
				$search.find( '.header-search__input' ).focus();
			});
			$search.attr( 'aria-expanded', true );
			closeMenu();

		};

		// Close search function
		var closeSearch = function() {
			$searchToggle.removeClass( 'header-mobile-search-toggle--active' );
			$searchToggle.attr( 'aria-expanded', false ).attr( 'title', expandSearchPopupLabel );
			$search.slideUp( 200 );
			$search.attr( 'aria-expanded', false );
		};

		// Open menu function
		var openMenu = function() {
			$menuToggle.addClass( 'header-mobile-menu-toggle--active' );
			$menuToggle.attr( 'aria-expanded', true ).attr( 'title', collapseMenuPopupLabel );
			$menu.slideDown( 200 );
			$menu.attr( 'aria-expanded', true );
			closeSearch();
		};


		// Close menu function
		var closeMenu = function() {
			$menuToggle.removeClass( 'header-mobile-menu-toggle--active' );
			$menuToggle.attr( 'aria-expanded', false ).attr( 'title', expandMenuPopupLabel );
			$menu.slideUp( 200 );
			$menu.attr( 'aria-expanded', false );
		};

		// Toggle search
		$searchToggle.on( 'click', function() {

			$(this).toggleClass( 'header-mobile-search-toggle--active' );

			// Open search
			if ( $(this).hasClass( 'header-mobile-search-toggle--active' ) ) {
				openSearch();
			}

			// Close search
			else {
				closeSearch();
			}

		});

		// Toggle menu
		$menuToggle.on( 'click', function() {

			$(this).toggleClass( 'header-mobile-menu-toggle--active' );

			// Open menu
			if ( $(this).hasClass( 'header-mobile-menu-toggle--active' ) ) {
				openMenu();
			}

			// Close menu
			else {
				closeMenu();
			}

		});

		// Init mobile version on refresh
		if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() < 992 ) {
			initMobile();
		}

		// Reset on screen transition
		$(document).on( 'lsvrWordbenchScreenTransition', function() {

			resetHeader();

			if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
				initDesktop();
			} else {
				initMobile();
			}

		});

	});


/* -----------------------------------------------------------------------------

	4. CORE

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		MAIN IMAGE SCROLL EFFECT
	-------------------------------------------------------------------------- */

	$( '.main-image--parallax' ).each(function() {
		if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 1199 ) {

			var $wrapper = $(this),
				$image = $(this).find( '.main-image__inner' ),
				wrapperHeight = $wrapper.height(),
				initialOffset = $wrapper.offset().top,
				parallaxSpeed = parseInt( $wrapper.data( 'parallax-speed' ) );

			// Set styles
			var doParallax = function( scrollTop ) {
				$image.css( 'top', ( scrollTop - initialOffset ) / parallaxSpeed );
			};

			// Reset styles
			var resetParallax = function() {
				$image.css( 'top', 0 );
			};

			// Set on page load
			if ( $(window).scrollTop() > initialOffset ) {
				doParallax( $(window).scrollTop() );
			}

			// Scroll
			$(window).scroll(function() {

				var scrollTop = $(this).scrollTop();

				// Check if on the top of the screen
				if ( scrollTop > initialOffset && ( scrollTop - initialOffset ) < wrapperHeight ) {
					doParallax( scrollTop );
				}

				else if ( scrollTop <= initialOffset ) {
					resetParallax();
				}

			});

			// Reset on screen transition
			$(document).on( 'lsvrWordbenchScreenTransition', function() {
				resetParallax();
			});

		}
	});

	/* -------------------------------------------------------------------------
		CONTACT FORM
	------------------------------------------------------------------------- */

	$( '.lsvr-form--contact' ).each(function() {

		var $form = $(this),
			$validationErrorMessage = $form.find( '.lsvr-form__message--validation-error' ),
			$connectionErrorMessage = $form.find( '.lsvr-form__message--connection-error' ),
			$successMessage = $form.find( '.lsvr-form__message--success' ),
			$submitBtn = $form.find( '.lsvr-form__submit' );

		// Submit
		$form.on( 'submit', function( e ) {

			// Check if not loading
			if ( ! $form.hasClass( 'lsvr-form--loading' ) ) {

				// Form is valid - make ajax request
				if ( true === $form.lsvrWordbenchValidateForm() && $form.hasClass( 'lsvr-form--ajax' ) ) {

					e.preventDefault();

					$connectionErrorMessage.slideUp( 200 );
					$validationErrorMessage.slideUp( 200 );
					$successMessage.slideUp( 200 );
					$form.addClass( 'lsvr-form--loading' );
					$submitBtn.attr( 'data-label', $submitBtn.text() ).text( $submitBtn.data( 'loading-label' ) );

					// Make ajax request
					$.ajax({
						type: 'post',
	            		dataType: 'json',
						url: $form.attr( 'action' ),
						data: $form.serialize(),
						success: function( response ) {

							$form.removeClass( 'lsvr-form--loading' );
							$submitBtn.text( $submitBtn.attr( 'data-label' ) );

							// Connection error
							if ( response.hasOwnProperty( 'type' ) && 'connection-error' === response.type && response.hasOwnProperty( 'message' ) ) {

								$connectionErrorMessage.html( '<span class="lsvr-alert-message__icon" aria-hidden="true"></span><p>' + response.message + '</p>' );
								$connectionErrorMessage.slideDown( 200 );

							}

							// Validation error
							else if ( response.hasOwnProperty( 'type' ) && 'validation-error' === response.type && response.hasOwnProperty( 'message' ) ) {

								$validationErrorMessage.html( '<span class="lsvr-alert-message__icon" aria-hidden="true"></span><p>' + response.message + '</p>' );
								$validationErrorMessage.slideDown( 200 );

							}

							// Success
							else if ( response.hasOwnProperty( 'type' ) && 'success' === response.type && response.hasOwnProperty( 'message' ) ) {

								$successMessage.html( '<span class="lsvr-alert-message__icon" aria-hidden="true"></span><p>' + response.message + '</p>' );
								$successMessage.slideDown( 200 );

								// Reset all fields
								$form.find( 'input, textarea' ).val( '' );

							}

							// Unable to parse
							else {

								$form.removeClass( 'lsvr-form--loading' );
								$submitBtn.text( $submitBtn.attr( 'data-label' ) );
								$connectionErrorMessage.slideDown( 200 );

							}

						},
						error: function() {

							$form.removeClass( 'lsvr-form--loading' );
							$submitBtn.text( $submitBtn.attr( 'data-label' ) );
							$connectionErrorMessage.slideDown( 200 );

						}
					});

				}

				// Form is valid
				else if ( true === $form.lsvrWordbenchValidateForm() ) {
					$successMessage.slideDown( 200 );
					$validationErrorMessage.slideUp( 200 );
				}

				// Form is invalid
				else {
					$successMessage.slideUp( 200 );
					$validationErrorMessage.slideDown( 200 );
					return false;
				}

			}

			// Form is loading
			else {
				return false;
			}

		});

	});

	/* -------------------------------------------------------------------------
		DOCUMENTS
	-------------------------------------------------------------------------- */

	// Categorized attachments
	$( '.lsvr_document-attachments' ).each(function() {

		var expandSubmenuLabel = $(this).data( 'label-expand-submenu' ),
			collapseSubmenuLabel = $(this).data( 'label-collapse-submenu' );

		// Toggle function
		var toggleChildren = function( $toggle, $parent, $children ) {

			$toggle.toggleClass( 'lsvr_document-attachments__item-toggle--active' );
			$parent.toggleClass( 'lsvr_document-attachments__item--active' );
			$children.slideToggle( 200 );

			if ( $toggle.hasClass( 'lsvr_document-attachments__item-toggle--active' ) ) {

				$toggle.attr( 'aria-label', collapseSubmenuLabel );
				$toggle.attr( 'aria-expanded', true );
				$children.attr( 'aria-expanded', true );

			} else {

				$toggle.attr( 'aria-label', expandSubmenuLabel );
				$toggle.attr( 'aria-expanded', false );
				$children.attr( 'aria-expanded', false );

			}

		};

		$(this).find( '.lsvr_document-attachments__item-toggle' ).each(function() {

			var $toggle = $(this),
				$parent = $(this).parent(),
				$children = $parent.find( '> .lsvr_document-attachments__children' );

			// Click on toggle
			$toggle.on( 'click', function() {
				toggleChildren( $toggle, $parent, $children );
			});

			// Click on holder
			$parent.find( '> .lsvr_document-attachments__item-link-holder--folder' ).each(function() {

				// Toggle on parent click
				$(this).on( 'click', function(e) {
					toggleChildren( $toggle, $parent, $children );
				});

				// Prevent toggling on link click
				$(this).find( '> .lsvr_document-attachments__item-link' ).on( 'click', function(e) {
					e.stopPropagation();
				});

			});

		});

	});

	/* -------------------------------------------------------------------------
		FAQ
	-------------------------------------------------------------------------- */

	// Expandable posts
	$( '.lsvr_faq-post-archive .post-archive__list--expandable' ).each(function() {

		var expandSubmenuLabel = $(this).data( 'label-expand-submenu' ),
			collapseSubmenuLabel = $(this).data( 'label-collapse-submenu' );

		$(this).find( '.post' ).each(function() {

			var $post = $(this),
				$title = $post.find( '.post__title' ),
				$content = $post.find( '.post__content-wrapper' ),
				$toggle = $post.find( '.post__header-toggle' );

			// Toggle function
			var toggleAccordion = function() {

				$content.slideToggle( 200 );
				$post.toggleClass( 'post--expanded' );
				$toggle.toggleClass( 'post__header-toggle--active' );

				if ( $post.hasClass( 'post--expanded' ) ) {

					$toggle.attr( 'aria-label', collapseSubmenuLabel );
					$toggle.attr( 'aria-expanded', true );
					$content.attr( 'aria-expanded', true );

				} else {

					$toggle.attr( 'aria-label', expandSubmenuLabel );
					$toggle.attr( 'aria-expanded', false );
					$content.attr( 'aria-expanded', false );

				}
			};

			// Toggle
			$title.on( 'click', toggleAccordion );
			$toggle.on( 'click', toggleAccordion );


		});

	});

	/* -------------------------------------------------------------------------
		GALLERIES
	-------------------------------------------------------------------------- */

	// Photo grid hover effect
	$( '.lsvr_gallery-post-archive--photogrid .post' ).each(function() {

		var $post = $(this),
			$container = $post.find( '.post__container' ),
			containerHeight = $container.outerHeight(),
			$overlayLink = $post.find( '.post__overlay-link' );


		// Mouse over functon
		function mouseOver() {
			$post.css( 'background-position-y', '-' + containerHeight + 'px' );
			$container.css( 'margin-top', '-' + containerHeight + 'px' );
		}

		// Mouse leave
		function mouseLeave() {
			$post.css( 'background-position-y', 'center' );
			$container.css( 'margin-top', '0' );
			$overlayLink.removeClass( 'post__overlay-link--active' );
		}

		// Post hover
		$post.on( 'mouseover focus', function() {
			mouseOver();
		});

		// Post leave
		$post.on( 'mouseleave blur', function() {
			mouseLeave();
		});

		// Overlay click on mobile
		$overlayLink.on( 'click', function() {

			if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() <= 991 && ! $(this).hasClass( 'post__overlay-link--active' ) ) {
				$(this).addClass( 'post__overlay-link--active' );
				mouseOver();
				return false;
			}

		});

		// Close on click outside
		$(document).on( 'click.lsvrWordbenchPortfolioPhotogridCloseOnClickOutside', function(e) {
			if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() <= 991 && $overlayLink.hasClass( 'post__overlay-link--active' ) && ! $( e.target ).closest( '.post' ).length ) {
				mouseLeave();
			}
		});

		// Reset on screen transition
		$(document).on( 'lsvrWordbenchScreenTransition', function() {
			$post.css( 'background-position-y', 'center' );
			$container.removeAttr( 'style' );
			containerHeight = $container.outerHeight();
			$overlayLink.removeClass( 'post__overlay-link--active' );
		});

	});


/* -----------------------------------------------------------------------------

	5. ELEMENTS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		WORDBENCH HERO
	-------------------------------------------------------------------------- */

	// Parallax
	$( '.lsvr-wordbench-hero--has-parallax' ).each(function() {
		if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 1199 ) {

			var $wrapper = $(this),
				$image = $(this).find( '.lsvr-wordbench-hero__bg' ),
				wrapperHeight = $wrapper.height(),
				initialOffset = $wrapper.offset().top,
				parallaxSpeed = parseInt( $wrapper.data( 'parallax-speed' ) );

			// Set styles
			var doParallax = function( scrollTop ) {
				$image.css( 'top', ( scrollTop - initialOffset ) / parallaxSpeed );
			};

			// Reset styles
			var resetParallax = function() {
				$image.css( 'top', 0 );
			};

			// Set on page load
			if ( $(window).scrollTop() > initialOffset ) {
				doParallax( $(window).scrollTop() );
			}

			// Scroll
			$(window).scroll(function() {

				var scrollTop = $(this).scrollTop();

				// Check if on the top of the screen
				if ( scrollTop > initialOffset && ( scrollTop - initialOffset ) < wrapperHeight ) {
					doParallax( scrollTop );
				}

				else if ( scrollTop <= initialOffset ) {
					resetParallax();
				}

			});

			// Reset on screen transition
			$(document).on( 'lsvrWordbenchScreenTransition', function() {
				resetParallax();
			});

		}
	});

	// Search
	$( '.lsvr-wordbench-hero--has-search-panel .lsvr-wordbench-hero__search' ).each(function() {

		var $search = $(this),
			$popup = $search.find( '.lsvr-wordbench-hero__search-panel' ),
			$input = $search.find( '.lsvr-wordbench-hero__search-input' ),
			$filter = $search.find( '.lsvr-wordbench-hero__search-filter' ),
			$filterToggle = $search.find( '.lsvr-wordbench-hero__search-filter-toggle' );

		// Show popup function
		var showPopup = function() {

			if ( ! $search.hasClass( 'lsvr-wordbench-hero__search--expanded' ) ) {
				$search.addClass( 'lsvr-wordbench-hero__search--expanded' );
				$popup.slideDown( 100 );
				$popup.attr( 'aria-expanded', true );
			}

		};

		// Close popup function
		var closePopup = function() {
			$search.removeClass( 'lsvr-wordbench-hero__search--expanded' );
			$popup.slideUp( 100, function() {
				$(this).removeAttr( 'style' );
			});
			$popup.attr( 'aria-expanded', false );
			$input.blur();
		};

		// Show filter function
		var showFilter = function() {

			// If popup is visible, slide down filter
			if ( $search.hasClass( 'lsvr-wordbench-hero__search--expanded' ) ) {
				$filter.slideDown(100);
			}

			// Otherwise show the popup and show filter without animation
			else {
				showPopup();
				$filter.show();
			}

			$filterToggle.addClass( 'lsvr-wordbench-hero__search-filter-toggle--active' );
			$search.addClass( 'lsvr-wordbench-hero__search--filter-expanded' );

		};

		// Hide filter function
		var closeFilter = function() {

			// If there are search results, hide only filter
			if ( $popup.find( '.lsvr-wordbench-hero__search-results' ).length > 0 ) {
				$filter.slideUp(100);
			}

			// Otherwise hide the whole popup
			else {
				closePopup();
				$filter.hide();
			}

			$filterToggle.removeClass( 'lsvr-wordbench-hero__search-filter-toggle--active' );
			$search.removeClass( 'lsvr-wordbench-hero__search--filter-expanded' );

			// Reset filter on close
			resetSearchFilter();

		};

		// Reset filter function
		var resetSearchFilter = function() {

			$filter.find( 'lsvr-wordbench-hero__search-filter-label--active' ).removeClass( 'lsvr-wordbench-hero__search-filter-label--active' );
			$filter.find( 'input' ).prop( 'checked', false ).trigger( 'change' );
			$filter.find( 'input[id^=lsvr-wordbench-hero__search-filter-type-any]' ).parent().addClass( 'lsvr-wordbench-hero__search-filter-label--active' );
			$filter.find( 'input[id^=lsvr-wordbench-hero__search-filter-type-any]' ).prop( 'checked', true ).trigger( 'change' );

		};
		resetSearchFilter();

		// Refresh filter function
		var refreshSearchFilter = function( checkbox ) {

			if ( true === checkbox.prop( 'checked' ) || 'checked' === checkbox.prop( 'checked' ) ) {

				checkbox.parent().addClass( 'lsvr-wordbench-hero__search-filter-label--active' );

				// Filter all
				if ( checkbox.attr( 'id' ).indexOf( 'lsvr-wordbench-hero__search-filter-type-any' ) >= 0 ) {
					$filter.find( 'input:not( [id^=lsvr-wordbench-hero__search-filter-type-any] )' ).prop( 'checked', false ).trigger( 'change' );
				}

				// Filter others
				else {
					$filter.find( 'input[id^=lsvr-wordbench-hero__search-filter-type-any]' ).prop( 'checked', false ).trigger( 'change' );
				}

			} else {

				checkbox.parent().removeClass( 'lsvr-wordbench-hero__search-filter-label--active' );

				// Filter All if there is no other filter active
				if ( $filter.find( 'input:checked' ).length < 1 ) {
					$filter.find( 'input[id^=lsvr-wordbench-hero__search-filter-type-any]' ).prop( 'checked', true ).trigger( 'change' );
				}

			}

		};

		// Show popup after search results loaded
		$(document).on( 'lsvrWordbenchAjaxSearchCompleted', function() {

			if ( $input.is( ':focus' ) && $popup.find( '.lsvr-wordbench-hero__search-results' ).length > 0 ) {
				showPopup();
			}

		});

		// Show popup on input focus
		$input.on( 'focus', function() {

			if ( $popup.find( '.lsvr-wordbench-hero__search-results' ).length > 0 || $search.hasClass( 'lsvr-wordbench-hero__search--filter-expanded' ) ) {
				showPopup();
			}

		});

		// Toggle filter
		$filterToggle.on( 'click', function() {

			if ( $search.hasClass( 'lsvr-wordbench-hero__search--filter-expanded' ) && $filter.is( ':visible' ) ) {
				closeFilter();
			} else {
				showFilter();
			}

		});

		// Search filter
		$filter.find( 'input' ).each(function() {
			refreshSearchFilter( $(this) );
			$(this).on( 'change', function() {
				refreshSearchFilter( $(this) );
			});
		});

		// Close on click outside
		$(document).on( 'click.lsvrWordbenchHeroSearchClosePopupOnClickOutside', function(e) {
			if ( $popup.is( ':visible' ) ) {
				if ( ! $( e.target ).closest( '.lsvr-wordbench-hero__search-form' ).length ) {
					closePopup();
				}
			}
		});

		// Close on ESC key
		$(document).on( 'keyup.lsvrWordbenchHeroSearchClosePopupOnEscKey', function(e) {
			if ( e.key === "Escape" && $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
				closePopup();
			}
		});

		// Remove inline styles on screen transition
		$(document).on( 'lsvrWordbenchScreenTransition', function() {
			closePopup();
		});

	});

	/* -------------------------------------------------------------------------
		WORDBENCH SITEMAP
	-------------------------------------------------------------------------- */

	// Search
	$( '.lsvr-wordbench-sitemap--has-search-panel .lsvr-wordbench-sitemap__search' ).each(function() {

		var $search = $(this),
			$popup = $search.find( '.lsvr-wordbench-sitemap__search-panel' ),
			$input = $search.find( '.lsvr-wordbench-sitemap__search-input' ),
			$filter = $search.find( '.lsvr-wordbench-sitemap__search-filter' ),
			$filterToggle = $search.find( '.lsvr-wordbench-sitemap__search-filter-toggle' );

		// Show popup function
		var showPopup = function() {

			if ( ! $search.hasClass( 'lsvr-wordbench-sitemap__search--expanded' ) ) {
				$search.addClass( 'lsvr-wordbench-sitemap__search--expanded' );
				$popup.slideDown( 100 );
				$popup.attr( 'aria-expanded', true );
			}

		};

		// Close popup function
		var closePopup = function() {
			$search.removeClass( 'lsvr-wordbench-sitemap__search--expanded' );
			$popup.slideUp( 100, function() {
				$(this).removeAttr( 'style' );
			});
			$popup.attr( 'aria-expanded', false );
			$input.blur();
		};

		// Show filter function
		var showFilter = function() {

			// If popup is visible, slide down filter
			if ( $search.hasClass( 'lsvr-wordbench-sitemap__search--expanded' ) ) {
				$filter.slideDown(100);
			}

			// Otherwise show the popup and show filter without animation
			else {
				showPopup();
				$filter.show();
			}

			$filterToggle.addClass( 'lsvr-wordbench-sitemap__search-filter-toggle--active' );
			$search.addClass( 'lsvr-wordbench-sitemap__search--filter-expanded' );

		};

		// Hide filter function
		var closeFilter = function() {

			// If there are search results, hide only filter
			if ( $popup.find( '.lsvr-wordbench-sitemap__search-results' ).length > 0 ) {
				$filter.slideUp(100);
			}

			// Otherwise hide the whole popup
			else {
				closePopup();
				$filter.hide();
			}

			$filterToggle.removeClass( 'lsvr-wordbench-sitemap__search-filter-toggle--active' );
			$search.removeClass( 'lsvr-wordbench-sitemap__search--filter-expanded' );

			// Reset filter on close
			resetSearchFilter();

		};

		// Reset filter function
		var resetSearchFilter = function() {

			$filter.find( 'lsvr-wordbench-sitemap__search-filter-label--active' ).removeClass( 'lsvr-wordbench-sitemap__search-filter-label--active' );
			$filter.find( 'input' ).prop( 'checked', false ).trigger( 'change' );
			$filter.find( 'input[id^=lsvr-wordbench-sitemap__search-filter-type-any]' ).parent().addClass( 'lsvr-wordbench-sitemap__search-filter-label--active' );
			$filter.find( 'input[id^=lsvr-wordbench-sitemap__search-filter-type-any]' ).prop( 'checked', true ).trigger( 'change' );

		};
		resetSearchFilter();

		// Refresh filter function
		var refreshSearchFilter = function( checkbox ) {

			if ( true === checkbox.prop( 'checked' ) || 'checked' === checkbox.prop( 'checked' ) ) {

				checkbox.parent().addClass( 'lsvr-wordbench-sitemap__search-filter-label--active' );

				// Filter all
				if ( checkbox.attr( 'id' ).indexOf( 'lsvr-wordbench-sitemap__search-filter-type-any' ) >= 0 ) {
					$filter.find( 'input:not( [id^=lsvr-wordbench-sitemap__search-filter-type-any] )' ).prop( 'checked', false ).trigger( 'change' );
				}

				// Filter others
				else {
					$filter.find( 'input[id^=lsvr-wordbench-sitemap__search-filter-type-any]' ).prop( 'checked', false ).trigger( 'change' );
				}

			} else {

				checkbox.parent().removeClass( 'lsvr-wordbench-sitemap__search-filter-label--active' );

				// Filter All if there is no other filter active
				if ( $filter.find( 'input:checked' ).length < 1 ) {
					$filter.find( 'input[id^=lsvr-wordbench-sitemap__search-filter-type-any]' ).prop( 'checked', true ).trigger( 'change' );
				}

			}

		};

		// Show popup after search results loaded
		$(document).on( 'lsvrWordbenchAjaxSearchCompleted', function() {

			if ( $input.is( ':focus' ) && $popup.find( '.lsvr-wordbench-sitemap__search-results' ).length > 0 ) {
				showPopup();
			}

		});

		// Show popup on input focus
		$input.on( 'focus', function() {

			if ( $popup.find( '.lsvr-wordbench-sitemap__search-results' ).length > 0 || $search.hasClass( 'lsvr-wordbench-sitemap__search--filter-expanded' ) ) {
				showPopup();
			}

		});

		// Toggle filter
		$filterToggle.on( 'click', function() {

			if ( $search.hasClass( 'lsvr-wordbench-sitemap__search--filter-expanded' ) && $filter.is( ':visible' ) ) {
				closeFilter();
			} else {
				showFilter();
			}

		});

		// Search filter
		$filter.find( 'input' ).each(function() {
			refreshSearchFilter( $(this) );
			$(this).on( 'change', function() {
				refreshSearchFilter( $(this) );
			});
		});

		// Close on click outside
		$(document).on( 'click.lsvrWordbenchSitemapSearchClosePopupOnClickOutside', function(e) {
			if ( $popup.is( ':visible' ) ) {
				if ( ! $( e.target ).closest( '.lsvr-wordbench-sitemap__search-form' ).length ) {
					closePopup();
				}
			}
		});

		// Close on ESC key
		$(document).on( 'keyup.lsvrWordbenchSitemapSearchClosePopupOnEscKey', function(e) {
			if ( e.key === "Escape" && $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 991 ) {
				closePopup();
			}
		});

		// Remove inline styles on screen transition
		$(document).on( 'lsvrWordbenchScreenTransition', function() {
			closePopup();
		});

	});

	/* -------------------------------------------------------------------------
		WORDBENCH SLIDER
	-------------------------------------------------------------------------- */

	$( '.lsvr-wordbench-slider' ).each(function() {

		var $this = $(this),
			$slides = $this.find( '.lsvr-wordbench-slider__item' ),
			$active = $slides.first(),
			$prevBtn = $this.find( '.lsvr-wordbench-slider__nav-button--prev' ),
			$nextBtn = $this.find( '.lsvr-wordbench-slider__nav-button--next' ),
			$navigationButtons = $this.find( '.lsvr-wordbench-slider__nav-item-button' ),
			autoplay = $this.attr( 'data-autoplay' ) ? parseInt( $this.attr( 'data-autoplay' ) ) : 0,
			$next;

		// Set default active
		$active.addClass( 'lsvr-wordbench-slider__item--active' );

		// Set default style
		$this.addClass( 'lsvr-wordbench-slider--active-item-style-' + $active.data( 'style' ) );

		// Remove loading
		$this.removeClass( 'lsvr-wordbench-slider--loading' );

		// Slide action
		function slide( direction ) {

			// Slide to
			if ( direction === parseInt( direction, 10 ) ) {
				$next = $this.find( '.lsvr-wordbench-slider__item:nth-child( ' + ( direction + 1 ) + ' )' );
			}

			// Previous
			else if ( 'prev' === direction ) {

				if ( $active.prev().length > 0 ) {
					$next = $active.prev();
				} else {
					$next = $slides.last();
				}

			}

			// Next
			else {

				if ( $active.next().length > 0 ) {
					$next = $active.next();
				} else {
					$next = $slides.first();
				}

			}

			// With animation
			if ( $this.hasClass( 'lsvr-wordbench-slider--animated' ) && $.fn.lsvrWordbenchGetMediaQueryBreakpoint() > 768 ) {

				$this.addClass( 'lsvr-wordbench-slider--animation-in-progress' );

				// Start animation
				if ( $next.index() > $active.index() ) {
					$this.addClass( 'lsvr-wordbench-slider--animation-next' );
				} else {
					$this.addClass( 'lsvr-wordbench-slider--animation-prev' );
				}
				$next.addClass( 'lsvr-wordbench-slider__item--next lsvr-wordbench-slider__item--animate-in' );
				$active.addClass( 'lsvr-wordbench-slider__item--animate-out' );

				// Change slider style
				setTimeout( function() {

					$this.removeClass( 'lsvr-wordbench-slider--active-item-style-' + $active.data( 'style' ) );
					$this.addClass( 'lsvr-wordbench-slider--active-item-style-' + $next.data( 'style' ) );
					$this.find( '.lsvr-wordbench-slider__nav-item-button--active' ).removeClass( 'lsvr-wordbench-slider__nav-item-button--active' );
					$this.find( '.lsvr-wordbench-slider__nav-item:nth-child( ' + ( $next.index() + 1 ) + ' ) .lsvr-wordbench-slider__nav-item-button' ).addClass( 'lsvr-wordbench-slider__nav-item-button--active' );

				}, 500 );

				// Reset after animation ends
				setTimeout( function() {

					$next.removeClass( 'lsvr-wordbench-slider__item--next lsvr-wordbench-slider__item--animate-in' );
					$next.addClass( 'lsvr-wordbench-slider__item--active' );
					$active.removeClass( 'lsvr-wordbench-slider__item--active lsvr-wordbench-slider__item--animate-out' );
					$active = $next;
					$this.removeClass( 'lsvr-wordbench-slider--animation-in-progress lsvr-wordbench-slider--animation-next lsvr-wordbench-slider--animation-prev' );

				}, 1000 );

			}

			// Without animation
			else {

				$this.removeClass( 'lsvr-wordbench-slider--active-item-style-' + $active.data( 'style' ) );
				$this.addClass( 'lsvr-wordbench-slider--active-item-style-' + $next.data( 'style' ) );
				$this.find( '.lsvr-wordbench-slider__nav-item-button--active' ).removeClass( 'lsvr-wordbench-slider__nav-item-button--active' );
				$this.find( '.lsvr-wordbench-slider__nav-item:nth-child( ' + ( $next.index() + 1 ) + ' ) .lsvr-wordbench-slider__nav-item-button' ).addClass( 'lsvr-wordbench-slider__nav-item-button--active' );
				$next.addClass( 'lsvr-wordbench-slider__item--active' );
				$active.removeClass( 'lsvr-wordbench-slider__item--active' );
				$active = $next;

			}

		}

		// Click on dot
		$navigationButtons.each(function() {

			$(this).on( 'click', function() {
				if ( ! $(this).hasClass( 'lsvr-wordbench-slider__nav-item-button--active' ) && ! $this.hasClass( 'lsvr-wordbench-slider--animation-in-progress' ) ) {
					slide( $(this).parent().index() );
				}
			});

		});

		// Click on next
		$nextBtn.on( 'click', function() {
			if ( ! $this.hasClass( 'lsvr-wordbench-slider--animation-in-progress' ) ) {
				slide( 'next' );
			}
		});

		// Click on prev
		$prevBtn.on( 'click', function() {
			if ( ! $this.hasClass( 'lsvr-wordbench-slider--animation-in-progress' ) ) {
				slide( 'prev' );
			}
		});

		// Autoplay function
		var autoplayTimeout;
		function startAutoplay( delay ) {
			autoplayTimeout = setTimeout( function() {
				slide( 'next' );
				startAutoplay( delay );
			}, delay * 1000 );
		}

		// Set autoplay
		if ( autoplay > 0 ) {

			// Initial start
			startAutoplay( autoplay );

			// Pause on hover
			$this.on( 'mouseenter', function( e ) {
				clearTimeout( autoplayTimeout );
			});

			// Resume on leave
			$this.on( 'mouseleave', function( e ) {
				startAutoplay( autoplay );
			});

		}

	});


/* -----------------------------------------------------------------------------

	6. OTHER

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		MAGNIFIC POPUP
	------------------------------------------------------------------------- */

	if ( $.fn.magnificPopup ) {

		var js_strings = {
			'mp_tClose' : 'Close (Esc)',
			'mp_tLoading' : 'Loading...',
			'mp_tPrev' : 'Previous (Left arrow key)',
			'mp_tNext' : 'Next (Right arrow key)',
			'mp_image_tError' : 'The image could not be loaded.',
			'mp_ajax_tError' : 'The content could not be loaded.'
		};

		$.extend( true, $.magnificPopup.defaults, {
			tClose: js_strings.mp_tClose,
			tLoading: js_strings.mp_tLoading,
			gallery: {
				tPrev: js_strings.mp_tPrev,
				tNext: js_strings.mp_tNext,
				tCounter: '%curr% / %total%'
			},
			image: {
				tError: js_strings.mp_image_tError,
			},
			ajax: {
				tError: js_strings.mp_ajax_tError,
			}
		});

		// Init lightbox
		$( '.lsvr-open-in-lightbox' ).magnificPopup({
			type: 'image',
			removalDelay: 300,
			mainClass: 'mfp-fade',
			gallery: {
				enabled: true
			}
		});

	}

});
})(jQuery);

(function($){ "use strict";

/* -----------------------------------------------------------------------------

	8. PLUGINS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		FORM VALIDATION
	------------------------------------------------------------------------- */

	$.fn.lsvrWordbenchValidateForm = function() {

		function emailValid( email ) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}

		var $form = $(this),
			formValid = true;

		// Validate input
		var validateInput = function( input ) {

			var $input = input,
				value = $input.val(),
				placeholder = $input.data( 'placeholder' ) ? $input.data( 'placeholder' ) : false,
				inputValid = false;

			if ( value.trim() !== '' && ! ( placeholder && value === placeholder ) ) {

				// Email inputs
				if ( $input.hasClass( 'lsvr-form__field-input--email' ) ) {

					if ( ! emailValid( value ) ) {
						$input.addClass( 'lsvr-form__field-input--error' );
					}

					else {
						$input.removeClass( 'lsvr-form__field-input--error' );
						inputValid = true;
					}

				}

				// Select field
				else if ( $input.prop( 'tagName' ).toLowerCase() === 'select' ) {

					if ( value === null ) {
						$input.addClass( 'lsvr-form__field-input--error' );
					}

					else {
						$input.removeClass( 'lsvr-form__field-input--error' );
						inputValid = true;
					}

				}

				// Default field
				else {
					$input.removeClass( 'lsvr-form__field-input--error' );
					inputValid = true;
				}

			}
			else {
				$input.addClass( 'lsvr-form__field-input--error' );
			}

			return inputValid;

		};

		// Check required fields
		$form.find( '.lsvr-form__field-input--required:not([disabled])' ).each(function(){
			formValid = ! validateInput( $(this) ) ? false : formValid;
		});

		$form.find( '.lsvr-form__field-input--error' ).first().focus();

		return formValid;

	};

	/* -------------------------------------------------------------------------
		MEDIA QUERY BREAKPOINT
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrWordbenchGetMediaQueryBreakpoint ) {
		$.fn.lsvrWordbenchGetMediaQueryBreakpoint = function() {

			if ( $( '#lsvr-media-query-breakpoint' ).length < 1 ) {
				$( 'body' ).append( '<span id="lsvr-media-query-breakpoint" style="display: none;"></span>' );
			}
			var value = $( '#lsvr-media-query-breakpoint' ).css( 'font-family' );
			if ( typeof value !== 'undefined' ) {
				value = value.replace( "\"", "" ).replace( "\"", "" ).replace( "\'", "" ).replace( "\'", "" );
			}
			if ( isNaN( value ) ) {
				return $( window ).width();
			}
			else {
				return parseInt( value );
			}

		};
	}

	var lsvrWordbenchMediaQueryBreakpoint;
	if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint ) {
		lsvrWordbenchMediaQueryBreakpoint = $.fn.lsvrWordbenchGetMediaQueryBreakpoint();
		$(window).on( 'resize', function(){
			if ( $.fn.lsvrWordbenchGetMediaQueryBreakpoint() !== lsvrWordbenchMediaQueryBreakpoint ) {
				lsvrWordbenchMediaQueryBreakpoint = $.fn.lsvrWordbenchGetMediaQueryBreakpoint();
				$.event.trigger({
					type: 'lsvrWordbenchScreenTransition',
					message: 'Screen transition completed.',
					time: new Date()
				});
			}
		});
	}
	else {
		lsvrWordbenchMediaQueryBreakpoint = $(document).width();
	}

})(jQuery);

/* -----------------------------------------------------------------------------

	LSVR STYLE SWITCHER

----------------------------------------------------------------------------- */

(function($){ "use strict";
$(document).ready( function() {

	var colorSchemes = [ 'default', 'scheme2', 'scheme3', 'scheme4' ],
		path = 'assets/css/color-schemes/';

	// Prepare HTML
	var html = '<div class="lsvr-style-switcher"><div class="lsvr-style-switcher__inner">';
	html += '<button type="button" class="lsvr-style-switcher__toggle"><span class="lsvr-style-switcher__toggle-icon" aria-hidden="true"></span></button>';
	html += '<div class="lsvr-style-switcher__content">';
	html += '<ul class="lsvr-style-switcher__color-scheme-list">';
	for ( var i = 0; i < colorSchemes.length; i++ ) {
		html += '<li class="lsvr-style-switcher__color-scheme-item">';
		html += '<button type="button" class="lsvr-style-switcher__color-scheme-btn lsvr-style-switcher__color-scheme-btn--' + colorSchemes[ i ] + '" data-color-scheme="' + colorSchemes[ i ] + '"></button></li>';
	}
	html += '</ul></div></div></div>';
	$( 'body' ).append( html );

	// Set vars
	var $this = $( '.lsvr-style-switcher' ),
		$toggle = $this.find( '.lsvr-style-switcher__toggle' ),
		$colorSchemeItems = $( '.lsvr-style-switcher__color-scheme-item' );

	// Toggle switcher
	$toggle.on( 'click', function() {
		$this.toggleClass( 'lsvr-style-switcher--active' );
	});

	// Set default active
	$colorSchemeItems.first().addClass( 'lsvr-style-switcher__color-scheme-item--active' );

	// Switch schemes
	$( '.lsvr-style-switcher__color-scheme-btn' ).each( function() {
		$(this).on( 'click', function() {

			if ( ! $(this).parent().hasClass( 'lsvr-style-switcher__color-scheme-item--active' ) ) {

				// Load CSS
				if ( $( 'head #lsvr-style-switcher-color-scheme-css' ).length < 1 ) {
					$( 'head' ).append( '<link id="lsvr-style-switcher-color-scheme-css" rel="stylesheet" type="text/css" href="' + path + $(this).data( 'color-scheme' ) + '.css">' );
				}
				else {
					$( '#lsvr-style-switcher-color-scheme-css' ).attr( 'href', path + $(this).data( 'color-scheme' ) + '.css' );
				}

				// Set active
				$colorSchemeItems.filter( '.lsvr-style-switcher__color-scheme-item--active' ).removeClass( 'lsvr-style-switcher__color-scheme-item--active' );
				$(this).parent().addClass( 'lsvr-style-switcher__color-scheme-item--active' );

			}

		});
	});

});
})(jQuery);