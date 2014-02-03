// jQuery.scroller
// Mark Carr

// Dependencies for swipe events
// jQuery.event.swipe

var App = {};

;(function($, window, document){
	'use strict';

	var Scroller = this.Scroller = function(element, options){
		this.element = $(element);
		this.options = $.extend({}, this.options, options);

		this.initialise();
	};

	Scroller.prototype = {
		options: {
			next: 'next',
			previous: 'previous',
			thumbs: {
				evenFit: true,
				equalHeight: true
			},
			scrollAll: false
		},

		initialise: function(){
			this.current = 1;

			this.setElements();
			this.setUp();

			if(this.options.thumbs.evenFit){
				this.setThumbWidth();
			}

			if(this.options.thumbs.equalHeight){
				this.setThumbHeight();
			}

			this.setEvents();
			this.resize();
		},

		setElements: function(){
			this.$container =  this.element.find('.thumbs');
			this.$thumbsList = this.element.find('.thumbs ul');
			this.$thumbs = this.element.find('.thumbs li');
			this.$images = this.$thumbs.find('img');
		},

		setEvents: function(){
			var self = this;

			this.element.find('.' + this.options.next).on('click keypress', function(){
				if(!self.$thumbsList.is(':animated')) self.next();
			});

			this.element.find('.' + this.options.previous).on('click keypress', function(){
				if(!self.$thumbsList.is(':animated')) self.previous();
			});

			this.$container.on('swipeleft', function(){
				self.element.find('.' + self.options.next).trigger('click');
			});

			this.$container.on('swiperight', function(){
				self.element.find('.' + self.options.previous).trigger('click');
			});
		},

		setUp: function(){
			this.thumbPadding = {
				right: parseInt(this.$thumbs.css('padding-right'), 10)
			};
			this.containerWidth = this.$container.outerWidth() + this.thumbPadding.right;
			this.thumbsWidth = this.$thumbs.outerWidth();
			this.thumbsFit = parseInt(this.containerWidth / this.thumbsWidth, 10);
			this.scrollNumber = (this.options.scrollAll) ? this.thumbsFit : 1;
		},

		setThumbWidth: function(){
			var width = Math.floor(this.containerWidth / this.thumbsFit) + 'px';

			this.$thumbs.css('width', width);

			this.setUp();
		},

		setThumbHeight: function(){
			var self = this;

			this.$images.load(function(){
				self.equalHeight(self.$thumbs);
				self.$thumbs.find('a').css('height', 'auto');
				self.$thumbs.find('a').css('height', self.highest);
			});
		},

		equalHeight: function(element){
			var self = this;

			this.highest = 0;

			element.each(function() {
				var height = $(this).height();

				if(height > self.highest){
					self.highest = height;
				}
			});
		},

		next: function(){
			var visible = Math.ceil(this.$thumbs.length / this.scrollNumber);

			if((this.current < visible && this.current != visible)){
				this.nextPrevious(this.options.previous);
				this.current++;
			}

			if(this.current == visible) this.element.find('.' + this.options.next).addClass('disabled');
		},

		previous: function(){
			if(this.current > 1){
				this.nextPrevious(this.options.next);
				this.current--;
			}

			if(this.current === 1) this.element.find('.' + this.options.previous).addClass('disabled');
		},

		nextPrevious: function(direction){
			var modifier = (direction == this.options.next) ? 1 : -1,
				scrollWidth = this.scrollNumber * this.thumbsWidth;

			this.$thumbsList.animate({
				marginLeft: (-1 * (this.current-1) * scrollWidth) + (modifier * scrollWidth)
			}, 500);

			this.element.find('.' + direction).removeClass('disabled');
		},

		resize: function(){
			var self = this;

			$(window).on('resize', function(){
				self.setUp();
			});
		}
	};

	$.fn.scroller = function(options){
		new Scroller(this, options);
		return this;
	};

}).apply(App, [jQuery, window, document]);