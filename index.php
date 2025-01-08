<?php
require_once 'config.php';
require_once 'router.php';

$router = new Router();

// Add routes
$router->addRoute('index', 'pages/home.php');
$router->addRoute('about', 'pages/about.php');
$router->addRoute('services', 'pages/services.php');
$router->addRoute('contact', 'pages/contact.php');
$router->addRoute('projects', 'pages/projects.php');
$router->addRoute('quote', 'pages/quote.php');

// Get the requested URL
$request_url = $_GET['url'] ?? 'index';

// Route to the appropriate file
$page = $router->route($request_url);

// Create pages directory if it doesn't exist
if (!file_exists('pages')) {
    mkdir('pages');
}

// Include the page
require_once $page;
?>
