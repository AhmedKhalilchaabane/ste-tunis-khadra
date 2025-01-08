<?php
class Router {
    private $routes = [];
    
    public function addRoute($url, $file) {
        $this->routes[$url] = $file;
    }
    
    public function route($url) {
        $url = trim($url, '/');
        if (empty($url)) {
            $url = 'index';
        }
        
        if (array_key_exists($url, $this->routes)) {
            return $this->routes[$url];
        }
        
        return '404.php';
    }
}
?>
