 define(function(require, exports, module) {
	var $ = require('$'),
		Widget = require('widget'),

		LEFT = 'left',
		RIGHT = 'right',
		CENTER = 'center',
		TOP = 'top',
		BOTTOM = 'bottom',
		MIDDLE = 'middle',
		SLIDE = 'slide',
		FADE = 'fade',

		ATTRS = {},
		GhostPanel;

	/**
	 * 相对元素
	 */
	ATTRS['relativeElement'] = {
		value: null
	};

	/**
	 * 水平位置
	 */
	ATTRS['horizontal'] = {
		value: CENTER,

		// 保证只能输入 left, right 和 center, 默认为 center
		getter: function(val) {
			if(val !== LEFT && val !== RIGHT && val !== CENTER) {
				val = CENTER;
			}
			return val;
		}
	};

	/**
	 * 垂直位置
	 */
	ATTRS['vertical'] = {
		value: MIDDLE,

		// 保证只能输入 top, bottom 和 middle, 默认为 middle
		getter: function(val) {
			if(val !== TOP && val !== BOTTOM && val !== MIDDLE) {
				val = MIDDLE;
			}
			return val;
		}
	};

	/**
	 * 水平距离
	 */
	ATTRS['horizontalMargin'] = {
		value: 0
	};

	/**
	 * 垂直距离
	 */
	ATTRS['verticalMargin'] = {
		value: 0
	};

	/**
	 * 隐藏面板的滚动区域
	 */
	ATTRS['hideRegion'] = {
		value: {
			top: 0,
			bottom: 0
		},

		// 补全
		getter: function(val) {
			if(!val.top) {
				val.top = 0;
			}
			if(!val.bottom) {
				val.bottom = 0;
			}
			return val;
		}
	};

	/**
	 * 是否一直在窗口内, 如果在窗口外则将节点迁移到窗口内
	 */
	ATTRS['inner'] = {
		value: false
	};

	/**
	 * IE6 上的跟随效果
	 */
	ATTRS['ie6Effect'] = {
		value: FADE,

		// 保证只能输入 fade 和 slide, 默认为 fade
		getter: function(val) {
			if(val !== FADE && val !== SLIDE) {
				val = FADE;
			}
			return val;
		}
	};

	/**
	 * 固定在特定位置上, 幽灵一样跟随页面的面板
	 *
	 * @extends Widget
	 */
	GhostPanel = Widget.extend({
		propsInAttrs: ['element'],
		attrs: ATTRS,

		threadId: null, // 线程 ID
		panel: null, // 跟随页面的面板
		isIE6: /MSIE 6/i.test(navigator.userAgent), // 是否是 IE6

		/**
		 * setup 方法
		 */
		setup: function(args) {
			var _self = this;

			// 跟随页面的面板
			this.panel = this.element;

			// 滚动屏幕, 修改节点位置和显示状态
			$(window).bind('scroll.ghostPanel', function() {
				_self._scrollScreen();
			});

			// 改变屏幕尺寸, 修改节点位置
			$(window).bind('resize.ghostPanel', function() {
				_self._resizeWindow();
			});

			// 初始化面板
			this._initPanel();
		},

		/**
		 * 销毁本对象
		 */
		destory: function() {
			$(window).unbind('scroll.ghostPanel');
			$(window).unbind('resize.ghostPanel');
			GhostPanel.superclass.destroy();
		},

		/**
		 * 初始化跟随面板
		 */
		_initPanel: function() {
			// 面板定位方式，IE6（不支持 position:fixed）的样式
			if(this.isIE6) {
				this.panel.css('position', 'absolute');
			} else {
				this.panel.css('position', 'fixed');
			}

			// 如果面板的父节点不存在，说明这个面板不在页面上，将面板插放到页面底部
			if(this.panel.parent().length === 0) {
				this.panel.appendTo($('body')).css('visibility', 'hidden');
			}

			this._scrollScreen();
		},

		/**
		 * 修改节点位置和显示状态
		 */
		_scrollScreen: function() {
			var hideRegion = this.get('hideRegion'); // 隐藏区域
			var scrollTop = $(document).scrollTop(); // 滚动距离
			var viewportHeight = $(window).height(); // 视图高度
			var pageHeight = $(document).height(); // 页面高度

			// 当节点进入隐藏区域, 隐藏面板
			if(hideRegion.top > scrollTop || hideRegion.bottom > pageHeight - viewportHeight - scrollTop) {
				clearTimeout(this.threadId);
				this.panel.css('visibility', 'hidden');
				return;
			}

			// 在隐藏区域之外, IE6 中修改节点在页面中的位置, 并显示节点
			if(this.isIE6) {
				var _self = this;
				var effect = this.get('ie6Effect');

				clearTimeout(this.threadId);

				// 如果是淡入淡出效果, 滚动页面时隐藏跟随面板
				if(effect === FADE) {
					this.panel.css('visibility', 'hidden');
				}

				// 设定跟随页面的面板位置
				this.threadId = setTimeout(function() {
					// 新位置的 CSS
					var css = {
						'left': $(document).scrollLeft() + _self._getHorizontalPos(_self.panel) + 'px',
						'top': $(document).scrollTop() + _self._getVerticalPos(_self.panel) + 'px',
						'visibility': 'visible'
					};

					// 如果本来是隐藏的或使用淡入淡出效果, 淡入显示
					if(effect === FADE || _self.panel.is(':hidden') || _self.panel.css('visibility') === 'hidden') {
						css.opacity = 0;
						_self.panel.css(css).animate({'opacity': 1});
					} else {
						_self.panel.animate(css, 800);
					}
				}, 400);

			// 在隐藏区域之外, 其他浏览器显示节点
			} else {
				var css = {
					'left': this._getHorizontalPos(this.panel) + 'px',
					'top': this._getVerticalPos(this.panel) + 'px',
					'visibility': 'visible'
				};

				if(this.panel.css('visibility') === 'hidden') {
					css.opacity = 0;
					this.panel.css(css).animate({'opacity': 1});
				} else {
					this.panel.css(css);
				}
			}
		},

		/**
		 * 修改节点位置
		 */
		_resizeWindow: function() {
			var left = this._getHorizontalPos(this.panel);
			var top = this._getVerticalPos(this.panel);

			// IE6 中使用到页面顶部的距离取代
			if(this.isIE6) {
				left += $(document).scrollLeft();
				top += $(document).scrollTop();
			}

			this.panel.css({
				'left': left + 'px',
				'top': top + 'px'
			});
		},

		/**
		 * 返回水平位置
		 *
		 * @param {jquery object} element 跟随页面的面板.
		 */
		_getHorizontalPos: function(element) {
			// 对照页面对象, 水平位置和水平距离
			var relativeElement = $(this.get('relativeElement'));
			var horizontal = this.get('horizontal');
			var horizontalMargin = this.get('horizontalMargin');

			// 参照物到左边距离
			var relativeLeft = relativeElement.offset().left;

			// 跟随页面的面板到窗口左边的位置
			var left = 0;

			// 在参照物左方
			if(relativeElement.length === 1 && horizontal === LEFT) {
				// 在参照物内, 参照物左边 + 距离
				if(horizontalMargin > 0) {
					left = relativeLeft + Math.abs(horizontalMargin);
				// 在参照物外, 参照物左边 - 节点宽度 - 距离
				} else {
					left = relativeLeft - element.outerWidth() - Math.abs(horizontalMargin);
				}
				// 如果只显示在窗口内部, 调整其到窗口距离
				if(this.get('inner')) {
					// 距离
					var minLeft = Math.abs(horizontalMargin);
					if(left < minLeft) {
						left = minLeft;
					}
				}

			// 在参照物右方
			} else if(relativeElement.length === 1 && horizontal === RIGHT) {
				// 在参照物内, 参照物左边 + 参照物宽度 - 节点宽度 - 距离
				if(horizontalMargin > 0) {
					left = relativeLeft + relativeElement.outerWidth() - element.outerWidth() - Math.abs(horizontalMargin);
				// 在参照物外, 参照物左边 + 参照物宽度 + 距离
				} else {
					left = relativeLeft + relativeElement.outerWidth() + Math.abs(horizontalMargin);
				}

				// 如果只显示在窗口内部, 调整其到窗口距离
				if(this.get('inner')) {
					// 窗口宽度 - 节点宽度 - 距离
					var maxLeft = $(window).width() - element.outerWidth() - Math.abs(horizontalMargin);
					if(left > maxLeft) {
						left = maxLeft;
					}
				}

			// 在窗口左方
			} else if(horizontal === LEFT) {
				// 到窗口距离
				left = Math.abs(horizontalMargin);

			// 在窗口右方
			} else if(horizontal === RIGHT) {
				// 窗口宽度 - 节点宽度 - 距离
				left = $(window).width() - element.outerWidth() - Math.abs(horizontalMargin);

			// 在窗口水平居中
			} else {
				var left = ($(window).width() - element.outerWidth()) / 2 + horizontalMargin;
			}

			// 相对位置父节点的位移
			if(this.isIE6) {
				return left - element.offsetParent().offset().left;
			}
			return left;
		},

		/**
		 * 返回垂直位置
		 *
		 * @param {jquery object} element 跟随页面的面板.
		 */
		_getVerticalPos: function(element) {
			// 垂直位置和垂直距离
			var vertical = this.get('vertical');
			var verticalMargin = this.get('verticalMargin');

			// 相对位置父节点的位移
			var offsetTop = 0;
			if(this.isIE6) {
				offsetTop = element.offsetParent().offset().top;
			}

			// 在窗口垂直居中
			if(vertical === MIDDLE) {
				return ($(window).height() - element.outerHeight()) / 2 + verticalMargin - offsetTop;
			}

			// 如果只显示在窗口内部, 则距离不可能为负
			if(this.get('inner')) {
				verticalMargin = Math.abs(verticalMargin);
			}

			// 在窗口下方
			if(vertical === BOTTOM) {
				return $(window).height() - element.outerHeight() - verticalMargin - offsetTop;
			}

			// 在窗口上方
			return verticalMargin - offsetTop;
		}
	});

	module.exports = GhostPanel;
});
