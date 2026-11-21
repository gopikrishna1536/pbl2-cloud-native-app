# Cloud-Native Microservices & Kubernetes Orchestration

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28%2B-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](https://prometheus.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A production-grade cloud-native microservice architecture demonstrating Kubernetes orchestration, zero-downtime rolling deployments, automated Horizontal Pod Autoscaling (HPA), Prometheus metrics scraping, and strict container security standards.

---

## 🏛️ Architecture & Kubernetes Topology

```
┌────────────────────────────────────────────────────────┐
│             Kubernetes Ingress Controller              │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              ClusterIP Service (Port 80)               │
└───────────────────────────┬────────────────────────────┘
                            │ Traffic load-balancing
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌─────────────────┐┌─────────────────┐┌─────────────────┐
│ Pod 1 (Node.js) ││ Pod 2 (Node.js) ││ Pod 3 (Node.js) │
│ • /healthz (Live)││ • /healthz (Live)││ • /healthz (Live)│
│ • /readyz (Ready)││ • /readyz (Ready)││ • /readyz (Ready)│
│ • /metrics (Prom)││ • /metrics (Prom)││ • /metrics (Prom)│
└─────────────────┘└─────────────────┘└─────────────────┘
         ▲                  ▲                  ▲
         └──────────────────┴──────────────────┘
                 Horizontal Pod Autoscaler (HPA)
                 (Auto-scales 2 to 10 replicas on CPU >75%)
```

---

## ✨ Cloud-Native Patterns & Features

- **Kubernetes Liveness (`/healthz`) & Readiness (`/readyz`) Probes:** Ensures kubelet isolates failing containers and prevents traffic routing until the service is fully initialized.
- **Graceful Termination Lifecycle:** Traps `SIGTERM` and `SIGINT` signals, immediately switches `/readyz` to `503`, and drains active in-flight requests before container exit.
- **Prometheus Observability (`/metrics`):** Emits standardized metrics including `http_requests_total`, `process_uptime_seconds`, and heap memory consumption.
- **Multi-Stage Docker Image:** Multi-stage build producing an optimized image running under a non-root `node` user to meet Pod Security Standards.
- **Horizontal Pod Autoscaling (HPA):** Elastic scaling based on real-time CPU utilization metrics.

---

## 📂 Project Structure

```
pbl2-cloud-native-app/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions pipeline (tests & K8s dry-run validation)
├── k8s/
│   ├── deployment.yaml            # 3-replica rolling update deployment with probes & resource limits
│   ├── service.yaml               # ClusterIP service definition
│   ├── configmap.yaml             # Externalized environment configuration
│   └── hpa.yaml                   # Autoscaler (2-10 replicas, CPU >75%)
├── src/
│   └── server.js                  # Microservice implementation with graceful shutdown & metrics
├── tests/
│   └── server.test.js             # Automated unit and probe integration tests
├── Dockerfile                     # Multi-stage container build with non-root user
├── docker-compose.yml             # Local multi-container test harness
├── package.json                   # Project metadata
└── README.md                      # Documentation
```

---

## 🚀 Deployment Instructions

### 1. Local Testing with Docker Compose
```bash
docker-compose up -d --build
curl http://localhost:8080/healthz
curl http://localhost:8080/metrics
```

### 2. Deploying to Kubernetes (Minikube / EKS / GKE)
```bash
# Apply ConfigMap
kubectl apply -f k8s/configmap.yaml

# Deploy microservice
kubectl apply -f k8s/deployment.yaml

# Expose internal ClusterIP service
kubectl apply -f k8s/service.yaml

# Enable Horizontal Pod Autoscaler
kubectl apply -f k8s/hpa.yaml

# Inspect rolling pods
kubectl get pods -l app=cloud-native-app -w
```

---

## 🧪 Automated Testing
```bash
npm test
```

---

## 📄 License
MIT License.
