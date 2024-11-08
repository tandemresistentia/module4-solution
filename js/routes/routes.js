(function() {
    'use strict';
    
    angular
        .module('MenuApp')
        .config(RoutesConfig);
    
    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RoutesConfig($stateProvider, $urlRouterProvider) {
        
        // Redirect to home if no other URL matches
        $urlRouterProvider.otherwise('/');

        // Set up UI states
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.template.html'
            })
            .state('categories', {
                url: '/categories',
                template: '<categories categories="$resolve.categories"></categories>',
                resolve: {
                    categories: ['MenuDataService', function(MenuDataService) {
                        return MenuDataService.getAllCategories();
                    }]
                }
            })
            .state('items', {
                url: '/items/{categoryShortName}',
                template: '<items items="$resolve.items" category="$resolve.category"></items>',
                resolve: {
                    items: ['$stateParams', 'MenuDataService', 
                        function($stateParams, MenuDataService) {
                            return MenuDataService.getItemsForCategory($stateParams.categoryShortName)
                                .then(function(response) {
                                    return response.menu_items;
                                });
                    }],
                    category: ['$stateParams', 'MenuDataService',
                        function($stateParams, MenuDataService) {
                            return MenuDataService.getAllCategories()
                                .then(function(categories) {
                                    return categories.find(function(cat) {
                                        return cat.short_name === $stateParams.categoryShortName;
                                    });
                                });
                    }]
                }
            });
    }
})();
