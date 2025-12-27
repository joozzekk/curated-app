export enum RouteNames {
  Home = 'home',
  Garments = 'garments',
  OutfitPlanner = 'outfit-planner',
  Settings = 'settings',
}

export enum RoutePaths {
  Home = '/',
  Garments = '/garments',
  OutfitPlanner = '/outfit-planner',
  Settings = '/settings',
}

export interface AppRoute {
  name: RouteNames
  path: RoutePaths
}
