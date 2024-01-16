@description('The name of the function app that you wish to create')
param appName string = 'fnapp-rbeerma-shoppinglistapi'

@description('Storage account type')
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
])
param storageAccountType string = 'Standard_LRS'

@description('Location for all resources')
param location string = resourceGroup().location

@description('Location for Application Insights')
param appInsightsLocation string

@description('The language worker runtime to load in the function app')
@allowed([
  'node'
])
param runtime string = 'node'
