# OpsPilot 🚀
### Automated Deployment, Continuous Health Monitoring & Self-Healing Policy Recovery Platform

[![CI/CD Pipeline](https://github.com/kavyareddy1313/opspilot/actions/workflows/ci.yml/badge.svg)](https://github.com/kavyareddy1313/opspilot/actions)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](docker-compose.yml)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?logo=kubernetes&logoColor=white)](k8s/)
[![Prometheus](https://img.shields.io/badge/Metrics-Prometheus-E6522C?logo=prometheus&logoColor=white)](monitoring/prometheus)
[![Grafana](https://img.shields.io/badge/Dashboard-Grafana-F46800?logo=grafana&logoColor=white)](monitoring/grafana)

OpsPilot is a cloud-native Site Reliability Engineering (SRE) and deployment orchestration platform designed to automate zero-downtime releases, perform real-time health verification, and autonomously execute self-healing rollbacks when anomalies or failure thresholds are breached.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Users & SREs
        DevOps["👩‍💻 DevOps / SRE Operator"]
    end

    subgraph "Frontend Layer (:3000)"
        UI["OpsPilot React Dashboard\n(Vite + Lucide + CSS Glassmorphism)"]
    end

    subgraph "Control Plane (:5001)"
        API["OpsPilot Express REST API"]
        PolicyEngine["Policy & Recovery Engine\n(Probe Evaluator + Auto-Rollback)"]
        PromRegistry["Prometheus Exporter (/metrics)"]
        DBStore["PostgreSQL / In-Memory Resilient Store"]
    end

    subgraph "Workload Layer (:5002)"
        DemoService["Target Microservice (demo-service)\n(Orders API + Fault Injection Engine)"]
    end

    subgraph "Observability Stack"
        Prometheus["Prometheus Server (:9090)"]
        Grafana["Grafana Dashboards (:3001)"]
    end

    DevOps -->|Inspect & Control| UI
    UI -->|REST / Polling| API
    PolicyEngine -->|Active Health Probes (5s)| DemoService
    PolicyEngine -->|Trigger Rollback| API
    API -->|Persist Deployments & Incidents| DBStore
    Prometheus -->|Scrape /metrics| PromRegistry
    Prometheus -->|Scrape /metrics| DemoService
    Grafana -->|Query Metrics| Prometheus
```

---

## ✨ Key Features

1. **Autonomous Policy Recovery Engine**:
   - Continuously evaluates workload liveness and readiness probe responses.
   - Detects consecutive probe failures, 5xx error spikes, and crash loops.
   - Automatically executes rollback to the last known-good release within seconds, minimizing Mean Time to Recovery (MTTR).

2. **Controlled Failure Simulation Lab**:
   - One-click fault injection to simulate real-world chaos scenarios:
     - **Probe Degradation**: Forces `/healthz` to return HTTP 500 to test automated threshold alerts and auto-rollbacks.
     - **5xx Error Spike**: Simulates upstream database connection pool exhaustion (85% failure rate).
     - **Artificial Latency**: Injects 1,500ms request delays to test timeout resilience.
     - **CrashLoopBackOff**: Simulates fatal unhandled runtime panics.

3. **Full-Stack Observability**:
   - Pre-configured **Prometheus** scraper gathering default runtime and custom application metrics.
   - Custom **Grafana** dashboard (`opspilot-overview.json`) tracking request volume, error rates, latencies, active releases, and incident timelines.

4. **Production-Ready Kubernetes Manifests**:
   - Declarative manifests in `k8s/` implementing zero-downtime `RollingUpdate` strategies, container resource requests/limits, readiness/liveness probes, ConfigMaps, Secrets, and NodePort/ClusterIP services.

5. **Ansible Host Automation**:
   - Playbook in `ansible/` for host directory provisioning, Docker log rotation (`daemon.json` tuning), and kernel network parameter configuration (`net.bridge.bridge-nf-call-iptables`, `net.ipv4.ip_forward`).

6. **Interactive Real-Time Dashboard**:
   - Real-time metrics ribbon (MTTR, Success Rate, Deployments, Replicas).
   - Multi-tab management: Releases, Health & Metrics, Incidents & Policies, Simulation Lab, Audit Trail, and Live Console Logs.

---

## 📂 Repository Structure

```
opspilot-project/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions automated test & lint pipeline
├── ansible/
│   ├── ansible.cfg                # Ansible defaults
│   ├── inventory.ini              # Target host inventory
│   ├── playbook.yml               # Node prep, kernel tuning & Docker log policy
│   └── README.md                  # Ansible playbook execution instructions
├── backend/
│   ├── Dockerfile                 # Backend API container definition
│   ├── package.json               # Backend dependencies (Express, pg, prom-client)
│   ├── src/
│   │   ├── app.js                 # Express app configuration & middleware
│   │   ├── server.js              # Server entrypoint & background health loop
│   │   ├── config/db.js           # PostgreSQL connection & resilient in-memory fallback
│   │   ├── controllers/           # API controllers for deployments, incidents, metrics, logs
│   │   ├── db/                    # SQL schema and seed files
│   │   ├── metrics/               # Prometheus metric declarations
│   │   ├── routes/apiRoutes.js    # REST endpoint definitions
│   │   └── services/recoveryEngine.js # Health probe monitoring & rollback orchestrator
│   └── test/api.test.js           # Node.js native test suite for backend API
├── demo-app/
│   ├── Dockerfile                 # Target microservice container definition
│   ├── package.json               # Microservice dependencies
│   ├── src/index.js               # Service endpoints, Prometheus counters & fault simulation
│   └── test/demo.test.js          # Unit tests for demo service
├── frontend/
│   ├── Dockerfile                 # Multi-stage production container build (Vite + Nginx)
│   ├── nginx.conf                 # Nginx reverse proxy configuration
│   ├── package.json               # Frontend dependencies (React 18, Vite, Lucide)
│   ├── vite.config.js             # Vite configuration with API proxy
│   └── src/
│       ├── App.jsx                # Main dashboard component
│       ├── components/            # Tabs and modal dialog components
│       └── services/api.js        # Axios/Fetch client for OpsPilot API
├── k8s/
│   ├── 00-namespace.yaml          # opspilot-prod namespace
│   ├── 01-postgres.yaml           # PostgreSQL deployment, secret & service
│   ├── 02-demo-app.yaml           # Demo microservice deployment with health probes
│   ├── 03-opspilot-api.yaml       # OpsPilot API control plane
│   ├── 04-opspilot-frontend.yaml  # OpsPilot web dashboard
│   ├── 05-prometheus-config.yaml  # Prometheus ConfigMap and Deployment
│   └── 06-grafana.yaml            # Grafana visual dashboards
├── monitoring/
│   ├── grafana/                   # Grafana datasources and dashboard definitions
│   └── prometheus/prometheus.yml  # Prometheus scrape configuration
├── docker-compose.yml             # Single-command local deployment stack
└── .gitignore                     # Ignored files and directories
```

---

## ⚡ Quick Start with Docker Compose

Deploy the entire end-to-end stack locally with a single command:

```bash
docker compose up --build -d
```

### Access Platform Components:

| Service | URL | Default Credentials | Description |
|---|---|---|---|
| **OpsPilot Dashboard** | `http://localhost:3000` | — | Interactive web console |
| **OpsPilot API** | `http://localhost:5001` | — | REST Control Plane & Metrics |
| **Demo Microservice** | `http://localhost:5002` | — | Monitored application |
| **Prometheus** | `http://localhost:9090` | — | Telemetry scraper & PromQL query engine |
| **Grafana** | `http://localhost:3001` | `admin` / `admin` | Real-time monitoring dashboards |

---

## 💻 Local Development Setup

If you prefer running services outside of Docker:

### 1. Start the Demo Service
```bash
cd demo-app
npm install
npm run dev
# Running on http://localhost:5002
```

### 2. Start the Backend API & Recovery Engine
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5001 (automatically falls back to in-memory store if Postgres is unavailable)
```

### 3. Start the Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 🧪 Running Automated Tests

Run backend integration and endpoint verification tests:
```bash
cd backend
npm test
```

Run demo microservice unit tests:
```bash
cd demo-app
npm test
```

---

## ☸️ Deploying to Kubernetes

Apply manifests in sequential order:

```bash
# 1. Create dedicated namespace
kubectl apply -f k8s/00-namespace.yaml

# 2. Deploy database
kubectl apply -f k8s/01-postgres.yaml

# 3. Deploy target workload
kubectl apply -f k8s/02-demo-app.yaml

# 4. Deploy OpsPilot control plane & frontend
kubectl apply -f k8s/03-opspilot-api.yaml
kubectl apply -f k8s/04-opspilot-frontend.yaml

# 5. Deploy observability stack
kubectl apply -f k8s/05-prometheus-config.yaml
kubectl apply -f k8s/06-grafana.yaml

# Verify pod status
kubectl get pods -n opspilot-prod
```

---

## 🔧 Ansible Host Preparation

Prepare production nodes and tune Docker/kernel networking parameters:

```bash
cd ansible
# Perform dry-run
ansible-playbook -i inventory.ini playbook.yml --check

# Apply host tuning
ansible-playbook -i inventory.ini playbook.yml
```

---

## 🛡️ Self-Healing Demonstration Scenario

1. Open the OpsPilot dashboard at `http://localhost:3000`.
2. Navigate to the **Failure Simulation Lab** tab.
3. Click **"Simulate Probe Failure"** (causes `/healthz` to return HTTP 500).
4. Watch the **Real-Time Orchestrator Logs** tab:
   - OpsPilot detects 3 consecutive health probe failures.
   - An incident ticket (`INC-xxxx`) is automatically registered.
   - The Policy Engine initiates an automated rollback to the last verified release (`v1.0.1`).
   - Active traffic is switched, fault state is cleared, and MTTR is recorded.
   - System returns to `HEALTHY` with zero operator intervention needed.

---

## 📄 License
MIT License. Created by Kavya Sri Reddy.

