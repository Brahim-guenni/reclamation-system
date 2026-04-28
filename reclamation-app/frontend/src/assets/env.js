(function(window) {
  window.__env = window.__env || {};
  // Default — overridden by Kubernetes ConfigMap per environment
  window.__env.apiUrl = 'http://localhost:8082/api';
}(this));
