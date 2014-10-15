/**
 * Copyright 2014 IFELERE ifelere@gmail.com
 * Angular module with directive targeting rendering of collections
 * 
 * */
(function (angular) {
	var module = angular.module("it.collections", ["it.collections.templates"]);
	
	/**
	 * Utility function equivalent to underscore.js 'any' / 'some'
 	 * */
	var any = function (list, fn) {
		if (angular.isArray(list)) {
			for (var j = 0, len = list.length; j < len; j++) {
				if (fn(list[j], i) === true) {
					return true;
				}
			
			}
		}else if (angular.isObject(list)) {
			for (var p in list) {
				if (fn(list[p], p) === true) {
					return true;
				}
			}
		}
		return false;
	};
	
	var map = function (list, fn, ctx) {
		if (angular.isFunction(Array.prototype.map)) {
			return Array.prototype.map.call(list, fn);
		}
		var dest = [];
		angular.forEach(list, function (it, key) {
			if (ctx) {
				dest.push(fn.call(ctx, it, key));
			}else {
				dest.push(fn(it, key));
			}
		});
		return dest;
	};
	
	var pick = function (obj) {
		var result = {};
		for (var j = 1, len = arguments.length; j < len; j++) {
			var key = arguments[j];
			if (angular.isDefined(obj[key])) {
				result[key] = obj[key];
			}
		}
		return result;
	
	};
	
	var addClass = function (map, name) {
		if (angular.isDefined(map["class"])) {
			map["class"] += (" " + name);
		}else {
			map["class"] = name;
		}
	};
	
	// var indexOf = function (list, value, offset, len) {
		// if (angular.isUndefined(len)) {
			// len = list.length;
		// }
		// if (angular.isUndefined(offset)) {
			// offset = 0;
		// }
		// for (var j = offset; j < len; j++) {
			// if (list[j] === value) {
				// return j;
			// }
		// }
		// return -1;
	// };
	
	// var omit = function (obj) {
		// var result = {};
		// for (var p in obj) {
			// if (indexOf(arguments, p, 1) === -1) {
				// result[p] = obj[p];
			// }
		// }
		// return result;
	
	// };
	/**
	 * Object representing options for paging applied to angular-ui pager/pagination directives
	 * */
	module.constant("itPagingOptions", {
		style : 'pagination',
		paging : {
			/* The key of the map may be passed as attributes of the root directiving */
			"directionLinks" : {
				format : function (v) {
					return v === 'true';
				},
				attribute : 'pagingDirectionLinks',
				defaultValue : true
			},
			"boundaryLinks" : {
				format : function (v) {
					return v === 'true';
				},
				attribute : 'pagingBoundaryLinks',
				defaultValue : true
			},
			"nextText" : {
				attribute : 'pagingNextText',
				defaultValue : ">"
			},
			"previousText" : {
				attribute : 'pagingNextText',
				defaultValue : "<"
			},
			"firstText" : {
				attribute : 'pagingFirstText',
				defaultValue : "<<"
			},
			"lastText" : {
				attribute : 'pagingLastText',
				defaultValue : ">>"
			}
		},
		pageSizes : [10, 50, 100]
	});
	
	/**
	 * Constant object having general options for collection directive.
	 * It includes definitions for icon packs
	 * */
	module.constant("itCollectionOptions", {
		icons : {
			"default" : "fa",
			manual : {
				fa : function (name) {
					return "fa fa-" + name;
				},
				bs3 : function (name) {
					return "glyphicon glyphicon-" + name;
				}
			},
			packs : {
				fa : {
					sort : 'fa fa-sort',
					"sort-asc" : 'fa fa-sort-asc',
					"sort-desc" : 'fa fa-sort-desc',
					search : 'fa fa-search',
					edit : 'fa fa-pencil',
					"delete" : 'fa fa-trash',
					spinner : "fa fa-spinner",
					refresh : "fa fa-refresh"
				},
				bs3 : {
					sort : 'glyphicon glyphicon-sort',
					"sort-asc" : 'glyphicon glyphicon-sort-by-alphabet',
					"sort-desc" : 'glyphicon glyphicon-sort-by-alphabet-alt',
					search : 'glyphicon glyphicon-search',
					edit : 'glyphicon glyphicon-pencil',
					"delete" : 'glyphicon glyphicon-trash',
					spinner : "glyphicon glyphicon-refresh",
					refresh : "glyphicon glyphicon-refresh"
				}
			}
		}
		
		
	});
	
	/**
	 * Factory object to resolve an icon class to a full class depending on selected pack
	 * Returns an object with #pack(name:string) function.
	 * It transforms an icon class from say 'spinner' to an equivalent in 'font awesome' or 'glyphicon'
	 * */
	module.factory("itIconProvider", ['itCollectionOptions', function (options) {
		return {
			get : function (name) {
				var selected = options.icons["default"];
				var pack = options.icons.packs[selected];
				if (angular.isUndefined(pack)) {
					pack = options.icons.packs.fa;
					selected = "fa";
				}
				if (angular.isDefined(pack[name])) {
					return pack[name];
				}
				return options.icons.manual[selected](name);
			}
		};
	
	}]);
	
	/**
	 * A directive to translate an icon class to full class given a generic name and apply it to an element's css class property
	 * */
	module.directive("itIcon", ['itIconProvider', function (provider) {
		return function (scope, element, attrs) {
			var icon = provider.get(attrs.itIcon);
			element.removeClass(icon).addClass(icon);
		};
	}]);
	
	/**
	 * A map of resolved attribute names to view template html attributes
	 * */
	var attributeTranslations = {
		"itIf" : function (val) {
			return 'data-ng-if="' + val + '"';
		},
		"ngIf" : function (val) {
			return 'data-ng-if="' + val + '"';
		},
		"itShow" : function (val) {
			return 'data-ng-show="' + val + '"';
		},
		"itHide" : function (val) {
			return 'data-ng-hide="' + val + '"';
		},
		"ngRepeatEnd" : function () {
			return "data-ng-repeat-end=''";
		},
		"ngRepeatStart" : function (val) {
			return 'data-ng-repeat-start="' + val + '"';
		},
		"colClass" : function (val) {
			return 'class="' + val + '"';
		},
		"itClass" : function (val) {
			return 'class="' + val + '"';
		},
		"ngClass" : function (val) {
			return 'data-ng-class="' + val + '"';
		},
		"itNgClass" : function (val) {
			return 'data-ng-class="' + val + '"';
		},
		"itClick" : function (val) {
			return 'data-ng-click="' + val + '"';
		},
		"ngHide" : function (val) {
			return 'data-ng-hide="' + val + '"';
		},
		"ngClick" : function (val) {
			return 'data-ng-click="' + val + '"';
		},
		"ngRepeat" : function (val) {
			return 'data-ng-repeat="' + val + '"';
		},
		"ngStyle" : function (val) {
			return 'data-ng-style="' + val + '"';
		},
		"ngModel" : function (val) {
			return 'data-ng-model="' + val + '"';
		}
		
	};

	/**
	 * Extract named attributes from a hash
	 * @param hash {Object}
	 * @param name {param list} a list of names of attributes to look for in hash
	 * @return {String} a string of html attributes form like 'p1="v1"[ p2="v2"...]'
	 * */
	var extractAttributes = function (hash) {
		var attributes = '';
		for (var j = 1, len = arguments.length; j < len; j++) {
			var name = arguments[j];
			if (angular.isDefined(hash[name])) {
				if (angular.isDefined(attributeTranslations[name])) {
					attributes += (' ' + attributeTranslations[name](hash[name]));
				} else {
					attributes += (' ' + name + '="' + hash[name] + '"');
				}
			}
		}
		return attributes;
	};

	/**
	 * Pick standard attribute map from a source attribute map
	 * @param attr {Attribute, Object} a map that could come from a directive's '$attrs' argument
	 * @param extend {Object} [optional] an optional object to extend extraction with
	 * @return {Object}
	 * */
	var pickAttributes = function (attr, extend) {
		var o = pick(attr, 'itNgClass', 'itClass',
		'id', 'itClick', 'class', 'ngClass', 'style', "ngHide", "itHide",
		'ngStyle', 'sortable', 'property', 'sortObject', 'title', 'it-collection-body-item', 'tag', 'ngModel', 'model', 'colspan');
		if (extend) {
			angular.extend(o, extend);
		}
		return o;
	};

	/**
	 * Create 'wrapper' object which creates an element to wrap a content
	 * @param tag {String} the html tag that should be created
	 * @return {Object} an object having the attributes:
	 *		#open(options), #close(options)
	 * NOTE: Passing tag attribute to a directive's element overrides automatic tag choice for a presenter
	 * */
	var createWrapper = function (tag) {
		return {
			open : function (o) {
				return ('<' + tag + extractAttributes(o, 'itNgClass',
						'itClass', 'ngClick', 'itClick', 'ngClass', 'id', "ngHide", "itHide",
						'data-ng-repeat', 'ngRepeat', "ngRepeatEnd", "ngRepeatStart", 'class',
						'ng-repeat', 'title', 'tag', 'data-ng-options',
						'colspan', 'ng-options', 'it-collection-body-item', 'style', 'ngStyle', 'model', 'ngModel') + '>');
			},
			close : function () {
				return ('</' + tag + '>');
			}
		};
	};

	
	/**
	 * A class to encapsulate information about a collection item 'cell'.
	 * It also declares #render() function to render the contents of the cell in a parent context
	 * */
	var Cell = function () {};

	Cell.prototype = {
		/**
		 * Renders the content of a cell the actual content render is delegated to an instance of {ContentModel}
		 * @param options {Object} typically an attribute hash and data to be used by the content model
		 * @return {String}
		 * */
		render : function (options) {
			var str = '';
			if (this.wrapper) {
				str = this.wrapper.open(options);
			}
			str += this.content.render(options);
			if (this.wrapper) {
				str += this.wrapper.close(options);
			}
			return str;
		}
	};

	/**
	 * A class to encapsulate a collection of cells and group functions of the cells
	 * */
	var CellCollection = function () {
		this.__cells = [];
		this.addCell = function (cell, options) {
			this.__cells.push({
				cell : cell,
				options : options
			});
		};
		
		this.forEachCell = function (fn, ctx) {
			angular.forEach(this.__cells, fn, ctx || this);
		};

		this.getCellCount = function () {
			return this.__cells.length;
		};
		//Create wrappers for each cell if not set
		this.wrapCells = function (defaultTag) {
			angular.forEach(this.__cells, function (c) {
				if (angular.isUndefined(c.cell.wrapper)) {
					c.cell.wrapper = createWrapper(c.options.tag || defaultTag);
				}
			});
		};
		/**
		 * Sets the model name to use on each cell.	The model name is the context object for each 'row'. In this case the object present in 'ngRepeat'
		 * */
		this.setModelName = function (name) {
			angular.forEach(this.__cells, function (c) {
				c.cell.content.model = name;
			});
		};

		/**
		 * Renders this cell collection (including individual cells)
		 * */
		this.render = function (options) {
			var str = '';
			if (this.wrapper) {
				str = this.wrapper.open(options);
			}
			var self = this;
			angular.forEach(this.__cells, function (cellInfo) {
				if (angular.isUndefined(cellInfo.cell.wrapper) && self.cellWrapper) {
					cellInfo.cell.wrapper = self.cellWrapper;
				}
				str += cellInfo.cell.render(cellInfo.options);
			});
			if (this.wrapper) {
				str += this.wrapper.close(options);
			}
			return str;
		};
	};

	/**
	 * A abstract class that is actually
	 * */
	var ContentModel = function () {};

	ContentModel.prototype = {
		render : function () {}
	};
	
	
	/**
	 * A content model that renders data as-is without doing any transformation
	 * */
	var StaticContentModel = function () {};

	StaticContentModel.prototype = new ContentModel();
	StaticContentModel.constructor = StaticContentModel;
	StaticContentModel.prototype.render = function (options) {
		return options.data;
	};

	/**
	 * A content model that wraps data in angular interpolation expression
	 * */
	var InterpolateContentModel = function () {};

	InterpolateContentModel.prototype = new ContentModel();

	InterpolateContentModel.constructor = InterpolateContentModel;

	InterpolateContentModel.prototype.render = function (options) {
		if (this.model) {
			return "{{" + this.model + "." + options.data + "}}";
		}
		return "{{" + options.data + "}}";
	};

	/**
	 * A content model that passes the data string into 'ngBindHtml' expression
	 * */
	var HtmlContentModel = function () {};

	HtmlContentModel.prototype = new ContentModel();

	HtmlContentModel.prototype.render = function (options) {
		var tag = options.tag || 'span';
		if (this.model) {
			return ('<' + tag + ' data-ng-bind-html="' + this.model + "." + options.data + '"></' + tag + '>');
		}
		return ('<' + tag + ' data-ng-bind-html="' + options.data + '"></' + tag + '>');
	};

	/**
	 * A content model that passes the data string as @src attribute of ng-include tag
	 * To make it use an explicit object name to be used in the ng-include scope set @model attribute on the cells directive
	 * */
	var TemplateContentModel = function () {};
	TemplateContentModel.prototype = new ContentModel();
	TemplateContentModel.prototype.render = function (options) {
		if (!this.model) {
			throw new Error("The model name must be set");
		}
		var localModel = options.model || "model";
		//return 'localModel=' + localModel + '&amp;parent model=' + this.model + '&amp;template url=' + options.data;
		return '<ng-include data-ng-init="' + localModel + '=' + this.model + '" src="\'' + options.data + '\'"></ng-include>';
	};
	
	/**
	 * Directive to compile data for rows making up the header of a collection view
	 * Standard html attributes (class, id, ngClick ...) are passed through to resulting html element
	 * */
	module.directive("itHeaderRow", [function () {
				var Controller = function () {
					this.addCell = function (cell, options) {
						this.parent.addHeaderCell(cell, options, this.index);
					};
				};
				return {
					restrict : 'E',
					require : ["^itCollectionView", "itHeaderRow"],
					controller : Controller,
					compile : function () {
						return {
							pre : function (scope, element, att, ctrls) {
								ctrls[1].parent = ctrls[0];
								ctrls[1].index = ctrls[0].addHeader(att);
							}
						};
					}
				};
			}
		]);

	/**
	 * Directive to compile data for rows making up the body of a collection view
	 * Standard html attributes (class, id, ngClick ...) are passed through to resulting html element
	 * */
	module.directive("itBodyRow", [function () {
				var Controller = function () {
					this.addCell = function (cell, options) {
						this.parent.addRowCell(cell, options, this.index);
					};
				};
				return {
					restrict : 'E',
					require : ["^itCollectionView", "itBodyRow"],
					controller : Controller,
					compile : function () {
						return {
							pre : function (scope, element, att, ctrls) {
								ctrls[1].parent = ctrls[0];
								ctrls[1].index = ctrls[0].addRow(att);
							}
						};
					}
				};
			}
		]);
	/**
	 * Directive to render a cell whose content is rendered as-is. The developer is fully responsible for what is rendered.
	 * The item-model attribute can be used.
	 * The content of the cell is derived from the contents of this directive's class
	 * */
	module.directive("itCellStatic", [function () {
				return {
					restrict : 'E',
					require : ['?^itBodyRow', '?^itHeaderRow'], //add it to header or body
					compile : function () {
						return function (scope, element, att, ctrl) {
							var cell = new Cell();
							cell.content = new StaticContentModel();
							if (ctrl[0]) {
								ctrl[0].addCell(cell, pickAttributes(att, {
										data : element.html()
									}));
							} else if (ctrl[1]) {
								ctrl[1].addCell(cell, pickAttributes(att, {
										data : element.html()
									}));
							} else {
								throw new Error("header or body row now found");
							}
						};

					}
				};
			}
		]);
	/**
	 * Directive to render a cell whose content is rendered as-is. The developer is fully responsible for what is rendered.
	 * The item-model attribute can be used.
	 * The content of the cell is derived from the contents of this directive's class
	 * This actually does the same thing is itCellStatic. itCell seems more appropriate
	 * */
	module.directive("itCell", [function () {
				return {
					restrict : 'E',
					require : ['?^itBodyRow', '?^itHeaderRow'], //add it to header or body
					compile : function () {
						return function (scope, element, att, ctrl) {
							var cell = new Cell();
							cell.content = new StaticContentModel();
							if (ctrl[0]) {
								ctrl[0].addCell(cell, pickAttributes(att, {
										data : element.html()
									}));
							} else if (ctrl[1]) {
								ctrl[1].addCell(cell, pickAttributes(att, {
										data : element.html()
									}));
							} else {
								throw new Error("header or body row now found");
							}
						};

					}
				};
			}
		]);

	/**
	 * Renders simple bind expression on a model#attribute given as the text content of this directive's element
	 * */
	module.directive("itCellBind", [function () {
				return {
					restrict : 'E',
					require : ['?^itBodyRow', '?^itHeaderRow'], //add it to header or body
					compile : function () {
						return function (scope, element, att, ctrl) {
							var cell = new Cell();
							cell.content = new InterpolateContentModel();
							if (ctrl[0]) {
								ctrl[0].addCell(cell, pickAttributes(att, {
										data : element.text()
									}));
							} else if (ctrl[1]) {
								ctrl[1].addCell(cell, pickAttributes(att, {
										data : element.text()
									}));
							} else {
								throw new Error("header or body row not now found");
							}
						};

					}
				};
			}
		]);

	/**
	 * Renders ng-bind-html expression on a model#attribute given as the text content of this directive's element
	 * */
	module.directive("itCellHtml", [function () {
				return {
					restrict : 'E',
					require : ['?^itBodyRow', '?^itHeaderRow'], //add it to header or body
					compile : function () {
						return function (scope, element, att, ctrl) {
							var cell = new Cell();
							cell.content = new HtmlContentModel();
							if (ctrl[0]) {
								ctrl[0].addCell(cell, pickAttributes(att, {
										data : element.text()
									}));
							} else if (ctrl[1]) {
								ctrl[1].addCell(cell, pickAttributes(att, {
										data : element.text()
									}));
							} else {
								throw new Error("header or body row not now found");
							}

						};
					}
				};
			}
		]);
	/**
	 * Renders ng-include using the text content of this directive's element as the 'src' attribute.
	 * If model attribute is set then it is used as a local name for the ng-include scope
	 * */	
	module.directive("itCellTemplate", [function () {
				return {
					restrict : 'E',
					require : ['?^itBodyRow', '?^itHeaderRow'], //add it to header or body
					compile : function () {
						return function (scope, element, att, ctrl) {
							var cell = new Cell();
							cell.content = new TemplateContentModel();
							if (ctrl[0]) {
								ctrl[0].addCell(cell, pickAttributes(att, {
										data : element.text()
									}));
							} else if (ctrl[1]) {
								ctrl[1].addCell(cell, pickAttributes(att, {
										data : element.text()
									}));
							} else {
								throw new Error("header or body row not now found");
							}

						};
					}
				};
			}
		]);

	/**
	 * Controller class that coordinates generation of presentation models as well as paging and sorting of a collection.
	 * The actual collection view is delegated using #fetch() and #count() methods
	 * */
	var CollectionViewCtrl = function ($scope, $timeout, options, iconProvider, $interval) {
		this.headers = [];
		this.rows = [];

		var defaults = {
			pagination : "it-collection-pagination.html",
			pager : "it-collection-pager.html",
			searchControl : "it-collection-search-control.html"
		};
		var sortKey;
		
		$scope.reverSort = false;
		$scope.getSortClass = function (key) {
			if (key !== sortKey) {
				return "sorting";
			}
			if ($scope.reverSort) {
				return "sorting_desc";
			}
			return "sorting_asc";
		};
		
		$scope.command = function (name) {
			var obj = {$name : name};
			for (var j = 1, len = arguments.length; j < len; j++) {
				obj["$arg" + j] = arguments[j];
			}
			var r = $scope.execute(obj);
			if ('refresh' === r) {
				$scope.reLoad();
			}
		};
		
		$scope.changeSortKey = function (key) {
			if (key === sortKey) {
				$scope.reverSort = !$scope.reverSort;
			}
			sortKey = key;
		};
		
		$scope.getSortIconClass = function (key) {
			if (key !== sortKey) {
				return iconProvider.get("sort");
			}
			if ($scope.reverSort) {
				return iconProvider.get("sort-desc");
			}
			return iconProvider.get("sort-asc");
		};
		
		$scope.getSortKey = function (model) {
			if (sortKey) {
				return model[sortKey];
			}
			return '';
		};

		$scope.getSearchControlTemplateUrl = function () {
			if ($scope.searchControlTemplateUrl) {
				return $scope.searchControlTemplateUrl;
			}
			return defaults.searchControl;
		};

		$scope.getPagingControlsTemplateUrl = function () {
			if ($scope.pagingControlTemplateUrl) {
				return $scope.pagingControlTemplateUrl;
			}
			if ($scope.pagingStyle) {
				return defaults[$scope.pagingStyle];
			}
			return defaults.pagination;
		};

		this.addHeader = function (options) {
			var row = new CellCollection();
			this.headers.push({
				row : row,
				options : options
			});
			return this.headers.length - 1;
		};

		this.addHeaderCell = function (cell, options, index) {
			if (angular.isUndefined(index)) {
				index = 0;
			}
			if (this.headers.length <= index) {
				throw new Error("header doest not exist at " + index);
			}
			this.headers[index].row.addCell(cell, options);
		};

		this.addRow = function (options) {
			var row = new CellCollection();
			this.rows.push({
				row : row,
				options : options
			});
			return this.rows.length - 1;
		};

		this.addRowCell = function (cell, options, index) {
			if (angular.isUndefined(index)) {
				index = 0;
			}
			if (this.rows.length <= index) {
				throw new Error("row doest not exist at " + index);
			}
			this.rows[index].row.addCell(cell, options);
		};

		$scope.currentPage = 1;
		
		if (angular.isUndefined($scope.pageSize)) {
			$scope.pageSize = 10;
		}
		
		if (angular.isUndefined($scope.pageSizes)) {
			$scope.pageSizes = options.pageSizes;
		}
		var getOffset = function (page) {
			return (page - 1) * $scope.pageSize;
		};

		var filteredView = [];

		var suspendReload = false,
		scheduleReload = false;

		var onLoadCompleted = function () {
			suspendReload = false;
			$scope.loading = false;
			if (scheduleReload) {
				scheduleReload = false;
				$timeout(function() {
					$scope.reLoad(false);
				}, 400);
			}
		};

		var replaceList = function (list) {
			if (!angular.isArray(list)) {
				list = list.data; //assume list came from a response object of promise
			}
			filteredView.length = 0;
			Array.prototype.push.apply(filteredView, list);
			$scope.$empty = list.length === 0;
			onLoadCompleted();
		};

		$scope.loading = false;

		var loadData = function (page, q) {
			$scope.loading = true;
			var options = {
				offset : getOffset(page),
				skip : getOffset(page),
				limit : $scope.pageSize
			};
			if (q) {
				options.search = q;
			}

			var r = $scope.fetch({
					$options : options,
					$callback : function (list) {
						replaceList(list);
					}
				});
			if (r) {
				if (angular.isFunction(r.then)) {
					r.then(replaceList);
				} else if (angular.isArray(r)) {
					replaceList(r);
				}
			}

		};

		var refreshCount = function (q) {
			var r = $scope.count({
					$search : q,
					$callback : function (count) {
						$scope.totalCount = count;
						$scope.$empty = count === 0;
					}
				});
			if (r) {
				if (angular.isFunction(r.then)) {
					r.then(function (c) {
						//if c is from a promise response count may be present on #data attribute
						$scope.totalCount = c.data || c;
						$scope.$empty = c === 0;
					});
				} else if (angular.isNumber(r)) {
					$scope.totalCount = r;
					$scope.$empty = r === 0;
				}
			}

		};

		$scope.totalCount = 0;

		$scope.$data = function () {
			return filteredView;
		};

		var getCurrentSearch = function () {
			return $scope.query || $scope.q;
		};
		
		var searchImpl = function (query) {
			$scope.query = query;
			if ($scope.loading) {
				scheduleReload = true;
				return;
			}
			suspendReload = true;
			refreshCount(query);
			loadData($scope.currentPage, query);
		};
		

		$scope.search = function (query, delay) {
			if (delay !== false) {
				var time = parseInt($scope.searchDelayTimeout || "500", 10);
				$timeout(function () {
					searchImpl(query);
				}, time);
				return;
			}
			searchImpl(query);
		};

		$scope.onPageChanged = function (page) {
			if (angular.isDefined(page)) {
				$scope.currentPage = page;
			}
			if (suspendReload || $scope.loading) {
				return;
			}
			loadData($scope.currentPage, getCurrentSearch());
		};

		$scope.reLoad = function (resetPage) {
			if (suspendReload || $scope.loading) {
				if ($scope.loading) {
					scheduleReload = true;
				}
				return;
			}
			suspendReload = true; //suspend automatic loading
			if (resetPage) {
				$scope.currentPage = 1;
			}
			loadData($scope.currentPage, getCurrentSearch());
		};
		
		var refreshStarted = false;
		
		var intervalHandle;
		this.notifyComplete = function () {
			refreshCount(getCurrentSearch());
			loadData(1, getCurrentSearch());
			if (refreshStarted === false) {
				refreshStarted = true;
				if (angular.isDefined($scope.refreshInterval)) {
					intervalHandle = $interval(function() {
						if (!$scope.loading) {
							refreshCount();
							$scope.reLoad();
						}
					}, parseInt($scope.refreshInterval, 10));
					
					$scope.$watch("$destroy", function () {
						$interval.cancel(intervalHandle);
					});
				}
			}
		};
		
		$scope.getPagingInfoTemplateUrl = function () {
			return $scope.pagingInfoTemplateUrl || "it-current-page-info.html";
		};
	};
	
	module.controller("CollectionViewCtrl", ['$scope', '$timeout', 'itPagingOptions', 'itIconProvider', '$interval', CollectionViewCtrl]);
	
	/**
	 * factory function which creates a class that manages an array for paging/search/counting.
	 * 
	 * */
	module.factory("itArraySourceProvider", ['$filter', function ($filter)  {
		var objectMatch = function (obj, q) {
			return any(obj, function (value) {
				if (value) {
					if (angular.isString(value)) {
						return value.indexOf(q) >= 0;
					}
					return String(value).indexOf(q) >= 0;
				}
			});
		};
				
		var itemMatch = function (item, q) {
			if (!q) {
				return true;
			}
			if (angular.isString(item)) {
				return item.indexOf(q) >= 0;
			} else if (angular.isObject(item) && objectMatch(item, q)) {
				return true;
			} else {
				return String(item).indexOf(q) >= 0;
			}
			return false;
		};

		
		var Provider = function (source) {
			
			this.__source = source;
			
			this.fetch = function (options) {
				var list = this.__source;
				if (options.search) {
					list = $filter("filter")(list, function (s) {
						return itemMatch(s, options.search);
					});
				}
				if (options.limit > 0) {
					return list.slice(options.offset, options.limit + options.offset);
				}
				return list;
				
			};
			
			this.count = function (search) {
				if (search) {
					var c = 0;
					angular.forEach(this.__source, function (s) {
						if (itemMatch(s, search)) {
							c++;
						}
					});
					return c;
				}
				return this.__source.length;
			};

		};
	
	
		return {
			/**
			 * Gets an ArraySource that uses array argument as its base. This array is then paged/searched/counted
			 * @param list {Array}
			 * */
			create : function (list) {
				return new Provider(list);
			}
		};
	}]);
	
	/**
	 * A factory function that creates a source that fetches its data using $http service
	 * A count url can be passed using data-count-url attribute on the root directive
	 * A request is made to <url>?q=search&skip=<offet>&limit=<limit>
	 * 'count' request looks like <countUrl>?q=search if the url already has a query string then <countUrl>&q=search
	 * */
	module.factory("itHttpSourceProvider", ['$http', '$q', function ($http, $q)  {
		var Provider = function (url, countUrl) {
			this.url = url;
			this.countUrl = countUrl;
			
			this.fetch = function (options) {
				var params = {};
				if (options.limit > 0) {
					params.limit = options.limit;
					params.skip = options.offset;
				}
				if (options.search) {
					params.q = options.search;
				}
				var deferred = $q.defer();
				$http.get(this.url, {
					params : params
				}).success(function (data) {
					deferred.resolve(data);
				}).error(function (err) {
					deferred.reject(err);
				});
				return deferred.promise;
			};
			
			this.count = function (search) {
				var params = {};
				if (search) {
					params.q = search;
				}
				var deferred = $q.defer();
				$http.get(this.countUrl, {
					params : params
				}).success(function (data) {
					deferred.resolve(angular.isNumber(data) ? data : parseInt(data, 10));
				}).error(function (err) {
					deferred.reject(err);
				});
				return deferred.promise;
			};

		};
	
	
		return {
			/**
			 * Gets a HttpSource that fetches data using $http service
			 * @param url {String} the url.
			 * @param countUrl {String} the url fetch a count of data from server. If omitted then it is assumed that 'count' is available at url injected with '/count' segment
			 *
			 * The server has the responsible for paging. The server gets 'skip=s&limit=l' on the query
			 * */
			create : function (url, countUrl) {
				if (angular.isUndefined(countUrl) || countUrl.length === 0) {
					var idx = url.indexOf("?");
					if (idx === -1) {
						countUrl = url + "/count";
					} else {
						countUrl = url.replace(/\?/, '/count?');
					}
				}
				return new Provider(url, countUrl);
			}
		};
	}]);
	
	/**
	 * Creates present that renders in collection in an html table
	 * */
	module.factory("itTablePresenter", ['$templateCache', '$compile', '$q',
		function ($templateCache, $compile, $q) {
		
		var SortingColumnWrapper = function (property) {
			this.open = function () {
				return '<th class="sortable {{getSortClass(\'' + property + '\')}}" data-ng-click="changeSortKey(\'' + property + '\')">';
			};
			
			this.close = function () {
				return  '<i class="pull-right {{getSortIconClass(\'' + property + '\')}}"></i></th>';
			};
		};
		
		return {
			make : function (scope, attributes, controller, ngRepeat) {
				var deferred = $q.defer();
				
				scope.noHeader = controller.headers.length === 0;

				scope.columnCount = 1;

				if (controller.rows.length > 0) {
					scope.columnCount = controller.rows[0].row.getCellCount() || 1;
				}

				var wrapperElement = angular.element($templateCache.get("it-table-collection-view.html"));

				if (!scope.noHeader) {
					var tHead = wrapperElement.find("thead");
					angular.forEach(controller.headers, function (h) {
						h.row.wrapper = createWrapper("tr");
						h.row.forEachCell(function (info) {
							if (info.options.sortable !== 'false' && info.options.property) {
								info.cell.wrapper = new SortingColumnWrapper(info.options.property);
							}else {
								info.cell.wrapper = createWrapper(info.options.tag || 'th');
							}
						});
						tHead.append(angular.element(h.row.render(h.options)));
					});
				}

				var tbody = wrapperElement.find("tbody");
				var count = controller.rows.length;
				angular.forEach(controller.rows, function (r, index) {
					r.row.wrapper = createWrapper("tr");
					r.options.ngHide = "loading"; //hide this row when loading
					r.row.wrapCells("td");
					//var ngRepeat = itemModel + " in $data() | orderBy:getSortKey:reverSort";
					if (count === 1) {
						r.options.ngRepeat = ngRepeat;
					} else if (index === 0) {
						r.options.ngRepeatStart = ngRepeat;
					} else if (index === count - 1) {
						r.options.ngRepeatEnd = "";
					}
					tbody.append(angular.element(r.row.render(r.options)));
				});

				$compile(wrapperElement)(scope);
				deferred.resolve(wrapperElement);
				return deferred.promise;
			}
		};
	}]);
	
	/**
	 * Creates a presenter that renders a collection in a div block
	 * */
	module.factory("itCustomPresenter", ['$templateCache', '$compile', '$q', function ($templateCache, $compile, $q) {
		return {
			make : function (scope, attributes, controller, ngRepeat) {
				var deferred = $q.defer();
				
				scope.sortList = [];
				
				scope.noHeader = controller.headers.length === 0;

				scope.columnCount = 1;

				if (controller.rows.length > 0) {
					scope.columnCount = controller.rows[0].row.getCellCount() || 1;
				}

				var wrapperElement = angular.element($templateCache.get("it-custom-collection-view.html"));
				
				var getChild = function (parent, tag, match, cb) {
					parent.find(tag).each(function () {
						var child = angular.element(this);
						if (match(child) === true) {
							cb(child);
							return false;
						}
					});
				};

				if (!scope.noHeader) {
					getChild(wrapperElement,  "div", function (v) {
						return v.hasClass("collection-header");
					}, function (el) {
						angular.forEach(controller.headers, function (h) {
							if (h.options.sortable !== 'false' && h.options.property) {
								h.cell.wrapper = new SortingColumnWrapper(h.options.property);
							}
							h.row.wrapper = createWrapper(h.options.tag || 'div');
							el.append(angular.element(h.row.render(h.options)));
							
						});
					});
				}
				
				getChild(wrapperElement, "div", function (v) {
					return v.hasClass("collection-body");
				}, function (body) {
					var count = controller.rows.length;
					angular.forEach(controller.rows, function (r, index) {
						r.row.wrapper = createWrapper(r.options.tag || 'div');
						
						//var ngRepeat = itemModel + " in $data() | orderBy:getSortKey:reverSort";
						if (count === 1) {
							r.options.ngRepeat = ngRepeat;
						} else if (index === 0) {
							r.options.ngRepeatStart = ngRepeat;
						} else if (index === count - 1) {
							r.options.ngRepeatEnd = "";
						}
						body.append(angular.element(r.row.render(r.options)));
					});
				});
				$compile(wrapperElement)(scope);
				deferred.resolve(wrapperElement);
				return deferred.promise;
			}
		};
	}]);
	
	module.factory("itSortList", [function () {
		var toLabel = function (str) {
			str = str.replace((/([a-z])([0-9A-Z])/g), function (s, p1, p2) {
				return p1 + " " + p2;
			});
			return str.charAt(0).toUpperCase() + str.substring(1);
		};
		return {
			process : function ($scope, controller) {
				$scope.sortList = [];
				
				$scope.applySortInfo = function (info) {
					$scope.selectedSort = info;
					$scope.changeSortKey(info.property);
				};
				
				$scope.toggleOrder = function () {
					if ($scope.selectedSort) {
						$scope.changeSortKey($scope.selectedSort.property);
					}
				};
				
				angular.forEach(controller.headers, function (h) {
					if (angular.isDefined(h.options.sortList)) {
						var sortList;
						//if the info is an object or array then it is a json string
						if (/^[\{\[]/.test(h.options.sortList)) {
							sortList = angular.fromJson(h.options.sortList);
						}else {
							//else it is a comma-delimited string
							sortList = h.options.sortList.split(/\,\*/g);
						}
						
						angular.forEach(sortList, function (info, key) {
							if (angular.isNumber(key)) {
								$scope.sortList.push({property : info, label : toLabel(info)});
							}else {
								$scope.sortList.push({property : key, label : info});
							}
						});
					}
				});
			}
		};
	}]);
	/**
	 * Root directive. This directive accepts customization for the collection view e.g for paging, presenter type etc.
	 * Supported attributes are:
	 * data-source : {String, Array} if a string then the collection source is fetch using $http service. See itArraySourceProvider comments. This is the simplest usage
	 * data-fetch : {fn($options, $callback)} if source is missing then is responsible for fetching collection. The $options object has {offset, limit, search} attributes. The $callback may be used to deliver the result or return a promise or the actual array
	 * data-count : {fn($search, $callback)} if source is missing then this callback is used to get the count
	 * data-view-type : 'table' or 'custom' presenter type
	 * data-collection-class: the class to use on the presenter wrapper. If it is a table this can be 'table-bordered', for example. To achieve a bootstrap panel set this to 'panel'
	 * data-body-class : If the presenter is 'custom' and collection-class is 'panel' set this to 'panel-body' to achieve bootstrap panel body. For table presenter this becomes the class of the 'tbody' tag
	 * data-header-class: If the presenter is 'custom' and collection-class is 'panel' set this to 'panel-heading' to achieve bootstrap panel heading
	 * data-footer-class: If the presenter is 'custom' and collection-class is 'panel' set this to 'panel-footer' to achieve bootstrap panel footer
	 * data-collection-style : The style to use on the presenter wrapper,
	 * data-refresh-interval : If set the collection is refresh every set interval (if refresh of the whole collection is undesirable a better what is to use an array source with the refresh process takinng place in parent scope),
	 * paging-control-template-url : Set this if you want to use a custom paging controls. Make sure the controls call onPageChanged(pageNumber)
	 * search-control-template-url : Set this if you want a custom control for searching. Ensure that you either set ng-change="search(query)" or use ng-click="search(query)" to pass the search to the directive scope
	 * data-hide-search : true/false
	 * data-empty-message : If you want a custom 'empty' message,
	 * data-empty-template-url : If you want a template to be used to render 'empty',
	 * loading-message : If you want a custom 'loading' message,
	 * loading-template-url : If you want to use a template instead for display 'loading' status,
	 * data-paging-style : 'pagination' or 'pager',
	 * execute : A callback that gets generic commands fired from an event in the collection view. The command may trigger via any UI event like click. The expression to trigger the command must be: 'command(name, args)'. The execute callback then gets 'fn($name, $arg1[, $arg2, ....])' The number of 'argn' arguments depend on what is passed to 'command(name, args)'
	 * data-paging-info-class : The css class to use on the paging info element (i.e that shows ),
	 * hidePagingInfo : '@'
	 * */
	module.directive("itCollectionView", ['$http',
			'$filter', '$q', '$templateCache', 'itPagingOptions', '$injector', 'itSortList',
			function ($http, $filter, $q, $templateCache, pagingOptions, $injector, sortList) {
				
				var standardPresenters = {
					"default" : "itTablePresenter",
					table : "itTablePresenter",
					custom : "itCustomPresenter"
				};
				
				var sources = {
					"array" : function (list, scope, element, attr, cb) {
						$injector.invoke(["itArraySourceProvider", function (P) {
							var provider =  P.create(list);
							scope.fetch = function (o) {
								return provider.fetch(o.$options, o.$callback);
							};
						
							scope.count = function (o) {
								return provider.count(o.$search, o.$callback);
							};
							if (angular.isFunction(cb)) {
								cb();
							}
						}]);
					},
					"http" : function (url, scope, element, attr, cb) {
						$injector.invoke(["itHttpSourceProvider", function (P) {
							
							var provider =  P.create(url, attr.countUrl);
							
							scope.fetch = function (o) {
								return provider.fetch(o.$options, o.$callback);
							};
						
							scope.count = function (o) {
								return provider.count(o.$search, o.$callback);
							};
							if (angular.isFunction(cb)) {
								cb();
							}
						}]);
					
					
					}
				
				};

				var resolvePagingOptions = function (scope, att) {
					angular.forEach(pagingOptions.paging, function (obj, property) {
						var value;
						if (angular.isDefined(att[obj.attribute])) {
							value = att[obj.attribute];
							if (obj.format) {
								value = obj.format(value, scope);
							}
						}else if (angular.isDefined(obj.defaultValue)) {
							value = obj.defaultValue;
						}
						scope[property] = value;
					});
				};
				
				
				
				
				var tryUseSource = function (scope, element, att, controller) {
					//if source attribute is set replace all callbacks
					if (att.source) {
						scope.$watchCollection(function () {
							return scope.$parent.$eval(att.source);
						}, function (source) {
							if (angular.isString(source)) {
								sources.http(source, scope, element, att, function () {
									controller.notifyComplete();
								});
							
							}else if (angular.isArray(source)) {
								sources.array(source, scope, element, att, function () {
									controller.notifyComplete();
								});
							}
						});
					}
				};
				
				var renderContentHtml = function (scope, element, att, controller) {
					
					var viewType = att.viewType || "default";
					
					var ngRepeat = (att.itemModel || '$model') + " in $data() | orderBy:getSortKey:reverSort";

					scope.pagingStyle = att.pagingStyle || pagingOptions.style;
					
					var provider = standardPresenters[viewType] || viewType;
					
					angular.forEach(controller.rows, function (r) {
						r.options.ngHide = "loading"; 
						r.row.setModelName(att.itemModel || "$model");
						addClass(r.options, "it-collection-body-item");
					});
					
					
					$injector.invoke([provider, function (P) {
						P.make(scope, att, controller, ngRepeat)
						.then(function (root) {
							//look for an inject sort list
							sortList.process(scope, controller);
							element.replaceWith(root);
							controller.notifyComplete();
						});
					}]);
				};
				
				return {
					restrict : 'E',
					require : 'itCollectionView',
					scope : {
						fetch : '&',
						collectionClass : '@',
						collectionStyle : '@',
						pagingClass : '@',
						bodyClass : '@',
						headerClass : '@',
						hideSearch : '@',
						hideIfEmpty : '@',
						footerClass : '@',
						pagingMaxSize : '@',
						count : '&',
						refreshInterval : '@',
						pagingControlTemplateUrl : "@",
						searchControlTemplateUrl : '@',
						emptyMessage : '@',
						emptyTemplateUrl : '@',
						loadingMessage : '@',
						loadingTemplateUrl : '@',
						pagingStyle : '@',
						execute : '&',
						pagingInfoClass : '@',
						hidePagingInfo : '@'
					},
					controller : "CollectionViewCtrl",
					compile : function () {
						return function postLink(scope, element, att, controller) {
							if (angular.isDefined(att.pageSizes)) {
								scope.pageSizes = map(att.pageSizes.split(","), function (s) {
									return parseInt(s.replace(/(?:^\s+)|(?:\s+$)/, ''), 10);
								});
							}
							if (angular.isDefined(att.pageSize)) {
								scope.pageSize = parseInt(att.pageSize, 10);
							}
							resolvePagingOptions(scope, att);
							renderContentHtml(scope, element, att, controller);
							tryUseSource(scope, element, att, controller);
						};
					}
				};
			}
		]);
		
	angular.module("it.collections.templates", []).run(['$templateCache', function ($templateCache) {
		
		$templateCache.put("it-current-page-info.html", '<span class="pagingInfoClass" data-ng-hide="hidePagingInfo">'.concat(
			'Page {{currentPage}}/{{pageCount}} ({{totalCount}})',
		'</span>'));
		
		
		$templateCache.put("it-collection-search-control.html", '<div class="input-group">'.concat(
							'<input type="text" class="form-control" placeholder="search" data-ng-model="q" data-ng-change="search(q, true)" />',
								'<div class="input-group-addon">',
									'<i it-icon="search"></i>',
								'</div>',
						'</div>'));
						
						
		$templateCache.put("it-collection-pagination.html", '<pagination data-ng-model="currentPage"'.concat(
						'max-size="{{pagingMaxSize || 5}}" ',
						'class="pagingClass"',
						'total-items="totalCount" ',
						'items-per-page="pageSize" ',
						'previous-text="{{previousText}}" ',
						'next-text="{{nextText}}" ',
						'first-text="{{firstText}}" ',
						'num-pages="$parent.pageCount" ',
						'last-text="{{lastText}}" ',
						'direction-links="directionLinks" ',
						'boundary-links="boundaryLinks" ',
						'data-ng-change="onPageChanged(currentPage)"',
						'></pagination>'));
						
		$templateCache.put("it-collection-pager.html", '<pager data-ng-model="currentPage"'.concat(
				'total-items="totalCount" ',
				'class="pagingClass"',
				'previous-text="{{previousText}}" ',
				'num-pages="$parent.pageCount" ',
				'next-text="{{nextText}}" ',
				'items-per-page="pageSize" ',
				'data-ng-change="onPageChanged(currentPage)"',
				'></pager>'));
					
					
					
		$templateCache.put("it-table-collection-view.html", '<div class="it-collection-view-wrapper">'.concat(
					'<div id="it-collection-search-wrapper" data-ng-hide="hideSearch">',
						'<ng-include style="width: 270px;" class="pull-right" src="getSearchControlTemplateUrl()"> </ng-include>',
						'<ng-include class="pull-left" style="margin-right: 275px;" src="\'it-sort-list-template.html\'"></ng-include>',
						'<br class="clearfix"/>',
					'</div>',
					'<br class="clearfix" />',
					'<div class="table-responsive">',
						'<table class="table {{collectionClass || \'table-striped\'}}" style="{{collectionStyle}}">',
							'<thead data-ng-hide="noHeader" class="{{headerClass}}">',
							'</thead>',
							'<tfoot>',
								'<tr class="{{footerClass}}">',
									'<td colspan="{{columnCount}}">',
										'<div class="row">',
											'<div class="col-sm-3">',
												'<select data-ng-model="pageSize" ',
													'data-ng-options="sz for sz in pageSizes" ',
													'data-ng-change="reLoad(true)"></select>',
													' &nbsp; <span ng-include="getPagingInfoTemplateUrl()"></span>',
											'</div>',
											'<div class="col-sm-9 text-right">',
												'<ng-include src="getPagingControlsTemplateUrl()"></ng-include>',
											'</div>',
										'</div>',
									'</td>',
								'</tr>',
							'</tfoot>',
							'<tbody>',
								'<tr data-ng-if="loading">',
									'<td colspan="{{columnCount}}" class="text-center">',
										'<div data-ng-if="loadingTemplateUrl">',
											'<ng-include src="loadingTemplateUrl"><ng-include>',
										'</div>',
										'<span data-ng-if="!loadingTemplateUrl">',
											'<i it-icon="spinner" class="fa-spin fa-2x"></i> &nbsp;&nbsp;',
											'<em>{{loadingMessage || "loading &hellip;"}}</em>',
										'<span>',
									'</td>',
								'</td>',
								'<tr data-ng-if="$empty">',
									'<td colspan="{{columnCount}}" class="text-center">',
										'<em data-ng-if="!emptyTemplateUrl"><b>{{emptyMessage || "No record found"}}</b></em>',
										'<span data-ng-if="emptyTemplateUrl">',
											'<ng-include src="emptyTemplateUrl"></ng-include>',
										'</span>',
									'</td>',
								'</td>',
							'</tbody>',
						'</table>',
					'</div>',
				'</div>'));
				
			$templateCache.put("it-sort-list-template.html", '<div data-ng-show="sortList.length>0"><label>sort by </label>'.concat(
				'<select data-ng-model="sortInfo" data-ng-options="info as info.label for info in sortList" data-ng-change="applySortInfo(sortInfo)"></select>',
				' <a data-ng-show="selectedSort.property" href="javascript:void(0);" data-ng-click="toggleOrder()"><i class="{{getSortIconClass(selectedSort.property)}} fa-2x"></i></a>',
			'</div>'));
						
			$templateCache.put("it-custom-collection-view.html", '<div class="it-collection-view-wrapper">'.concat(
				'<div class="">',
					'<div class="{{collectionClass}}" style="{{collectionStyle}}">',
						'<div data-ng-hide="noHeader" class="{{headerClass}} collection-header">',
						'</div>',
						'<div class="{{bodyClass}}">',
							'<div id="it-collection-search-wrapper">',
								'<div>',
									'<ng-include data-ng-hide="hideSearch" style="width: 270px;" class="pull-right" src="getSearchControlTemplateUrl()"> </ng-include>',
									'<ng-include class="pull-left" style="margin-right: 275px;" src="\'it-sort-list-template.html\'"></ng-include>',
									'<br class="clearfix"/>',
								'</div>',
								'<br class="clearfix"/>',
							'</div>',
							'<div class="collection-body clearfix"></div>',
							'<div data-ng-if="loading">',
								'<div data-ng-if="loadingTemplateUrl">',
									'<ng-include src="loadingTemplateUrl"><ng-include>',
								'</div>',
								'<span data-ng-if="!loadingTemplateUrl">',
									'<i it-icon="spinner" class="fa-spin fa-2x"></i>&nbsp;&nbsp;',
									'<em>{{loadingMessage || "loading &hellip;"}}</em>',
								'<span>',
							'</div>',
							'<div data-ng-if="$empty">',
								'<p data-ng-if="!emptyTemplateUrl" class="text-center"><em><b>{{emptyMessage || "No record found"}}</b></em></p>',
								'<div data-ng-if="emptyTemplateUrl">',
									'<ng-include src="emptyTemplateUrl"></ng-include>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="{{footerClass}} collection-footer">',
							'<div class="row">',
								'<div class="col-sm-3">',
									'<select data-ng-model="pageSize" ',
										'data-ng-options="sz for sz in pageSizes" ',
										'data-ng-change="reLoad(true)"></select>',
										' &nbsp; <span ng-include="getPagingInfoTemplateUrl()"></span>',
								'</div>',
								'<div class="col-sm-9 text-right">',
									'<ng-include src="getPagingControlsTemplateUrl()"></ng-include>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>'));
	}]);
})(angular);
