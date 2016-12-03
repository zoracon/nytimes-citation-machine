$(function() {

	'use strict';

	var nyTimes = {
		initialize : function(){
			//
		},

		copy : function(){
			//
		}
	};

	$( 'form' ).submit(function( event ) {

		nyTimes.searchTerm = $('input[name="search"]').val();

		var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		url += '?' + $.param({
		  'q': nyTimes.searchTerm,
		  'api-key': "3167c94b938a48a3aa68b24828262a34"
		});

		$.ajax({
			url: url,
			method: 'GET',
		}).done(function(result) {

			$( '.citation-container' ).empty();

			var results = result.response.docs;

			$.each(results, function(index, val) {

				// Grab Data
				var title      = val.headline.main +' ';
				var pubDate    = ' ( ' + val.pub_date + ' ) .';
				var webUrl     = val.web_url;
				var source     = val.source;

				var firstName  = '';
				var middleName = '';
				var lastName   = '';

				if( val.byline ) {
					if( val.byline.original ) {

						if( val.byline.person[0].firstname ) {
							firstName = val.byline.person[0].firstname + '. ';
						}

						if( val.byline.person[0].middlename ) {
							middleName =  val.byline.person[0].middlename;
						}

						if ( val.byline.person[0].lastname ) {
							lastName =  val.byline.person[0].lastname+', ';
						}
					}
				}

				// Create Elements
				var copyButton = $('<button>')
					.addClass('btn')
					.addClass('copy-action')
					.text('copy!');

				var link = $('<a>')
					.attr( 'target', '_blank' )
					.attr( 'href', webUrl )
					.text( ' ' + webUrl) ;

				var $citationBlock = $('<div>')
					.addClass( 'citation-container' )
					.append( $('<div>')
						.attr('id', 'citation')
						.text( lastName + firstName + middleName + pubDate + title )
						.append( link )
					)
					.append(copyButton);

				$('body').append( $citationBlock );

				$('.copy-action').off().on('click', function(event) {
					event.preventDefault();

					// Dynamic Class
					function makeid()
					{
					    var text = "";
					    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

					    for( var i=0; i < 5; i++ )
					        text += possible.charAt(Math.floor(Math.random() * possible.length));

					    return text;
					}

					var rand = makeid();
					var citationElement = $(this).prev('#citation');
					$( citationElement ).addClass( rand );

					// Set Up clipboard
					var elementSelector = $( citationElement )[0].classList[0];
					var elementSelectorFormatted = '.' + elementSelector;

					$( this ).attr('data-clipboard-target', elementSelectorFormatted);

					var clipboard = new Clipboard( '.btn' );

				});
			});
		}).fail(function(err) {
			throw err;
		});

		event.preventDefault();
	});
});