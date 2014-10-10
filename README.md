ifraytek-angular-collection-view
================================

Pure AngularJS directive for data tables

For developers, like me, that have found jquery datatable based solution (even with angular-directive wrapper) not good enough may like this. I found myself doing a fair amount of hacking to enjoy the full benefit of angularjs when I use them; like often adding "fnRowCallback" handlers to inject a template and using scope object equivalents to achieve dound-data changes, and in that context doing manual dom transversal to look for a target element and inject my templates. Perharps I am was doing it correctly. This inspired this module. This is a pure angularjs code and normal ng-repeat. The design is based on an abstract collection view hence that tags in this module do not have 'td's or 'table' for that matter. For now only 'table' collection view is supported but it can easily be extended to support other types of list views. 
