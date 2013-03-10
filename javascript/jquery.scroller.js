// jQuery.scroller
// Mark Carr

// Dependencies for swipe events
// jQuery.event.swipe

;(function($, doc, win) {
	"use strict";

	function Widget(el, opts){
		this.$el  = $(el);

		this.opts = opts;

		this.$container =  this.$el.find('.thumbs');

		this.$thumbsList = this.$el.find('.thumbs ul');

		this.$thumbs = this.$el.find('.thumbs li');

		this.$current = 1;

		this.init();
	}

	Widget.prototype.init = function(){
		var self = this;
		
		this.$thumbsList.css('width', this.$thumbs.length*this.$thumbs.outerWidth());

		this.$el.find('.next').on('click keypress', function(){
			if(!self.$thumbsList.is(':animated')) self.next();
		});

		this.$el.find('.previous').on('click keypress', function(){
			if(!self.$thumbsList.is(':animated')) self.previous();
		});

		this.$container.on('swipeleft', function(){
			self.$el.find('.next').trigger('click');
		});

		this.$container.on('swiperight', function(){
			self.$el.find('.previous').trigger('click');
		});
	};

	Widget.prototype.next = function(){
		var containerWidth = this.$container.outerWidth()+parseInt(this.$thumbs.css('padding-right'), 10),
			visibleThumbs = parseInt(containerWidth/this.$thumbs.outerWidth(), 10),
			visible = Math.ceil(this.$thumbs.length/visibleThumbs);

		if((this.$current < visible && this.$current != visible)){
			this.$current++;
			this.$thumbsList.animate({marginLeft: parseInt(this.$thumbsList.css('margin-left'), 10)-visibleThumbs*this.$thumbs.outerWidth()}, 500);
			this.$el.find('.previous').removeClass('disabled');
		}

		if(this.$current == visible) this.$el.find('.next').addClass('disabled');
	};

	Widget.prototype.previous = function(){
		var containerWidth = this.$container.outerWidth()+parseInt(this.$thumbs.css('padding-right'), 10),
			visibleThumbs = parseInt(containerWidth/this.$thumbs.outerWidth(), 10);

		if(this.$current > 1){
			this.$current--;
			this.$thumbsList.animate({marginLeft: parseInt(this.$thumbsList.css('margin-left'), 10)+visibleThumbs*this.$thumbs.outerWidth()}, 500);
			this.$el.find('.next').removeClass('disabled');
		}

		if(this.$current === 1) this.$el.find('.previous').addClass('disabled');
	};

	$.fn.scroller = function(opts){
		return this.each(function(){
			new Widget(this, opts);
		});
	};

})(jQuery, document, window);