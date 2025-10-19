<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/services', 'Home::services');
$routes->get('/process', 'Home::process');
$routes->get('/portfolio', 'Home::portfolio');
$routes->get('/about', 'Home::about');
$routes->get('/contact', 'Home::contact');
$routes->post('/contact', 'Home::submitContact');
