<div align="center">

# 🚀 OpsPilot
### Automated Deployment, Real-Time Observability & Self-Healing SRE Platform

[![CI/CD Pipeline](https://github.com/kavyareddy1313/OPS-PILOT--DEVOPS-/actions/workflows/ci.yml/badge.svg)](https://github.com/kavyareddy1313/OPS-PILOT--DEVOPS-/actions)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)](docker-compose.yml)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?style=flat&logo=kubernetes&logoColor=white)](k8s/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Scraping-E6522C?style=flat&logo=prometheus&logoColor=white)](monitoring/prometheus/)
[![Grafana](https://img.shields.io/badge/Grafana-Dashboards-F46800?style=flat&logo=grafana&logoColor=white)](monitoring/grafana/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=nodedotjs&logoColor=white)](backend/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](frontend/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<p align="center">
  <strong>An autonomous Site Reliability Engineering (SRE) control plane that monitors workload health probes, detects runtime anomalies, and automatically executes zero-downtime rollbacks when policies are breached.</strong>
</p>

</div>

---

## 📌 At a Glance

OpsPilot bridges the gap between CI/CD deployment pipelines and automated production incident mitigation:

- **Autonomous Self-Healing**: Continuously monitors container readiness and liveness probes. When consecutive failures breach the policy threshold (>= 3 fails), OpsPilot autonomously rolls back traffic to the last verified release without human intervention.
- **Chaos Engineering Lab**: Built-in interactive failure simulation to inject simulated HTTP 500 probe panics, 85% database 5xx error spikes, and 1200ms artificial latencies to test resilience.
- **Full Observability Stack**: Pre-configured Prometheus metrics scraper (`/metrics`) and tailored Grafana visual dashboards tracking request rates, latencies, and active release timelines.
- **Dual Light/Dark Modern UI**: Clean, developer-friendly dashboard with real-time telemetry, pod replica status, and streaming console logs.
- **Production Kubernetes & Ansible**: Declarative Kubernetes manifests with `RollingUpdate` strategies, alongside Ansible playbooks for host provisioning and Docker daemon tuning.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Clients["Users & SRE Engineers"]
        Operator["👩‍💻 DevOps / SRE Operator"]
    end

    subgraph Frontend["Frontend Console (:3000)"]
        UI["OpsPilot React Dashboard\n(Vite + Lucide Icons + Clean UI)"]
    end

    subgraph ControlPlane["Control Plane (:5001)"]
        API["Express REST API"]
        PolicyEngine["Policy & Recovery Engine\n(Probe Evaluator + Auto-Rollback)"]
        PromRegistry["Prometheus Metrics Exporter (/metrics)"]
        Postgres["PostgreSQL / Resilient Datastore"]
    end

    subgraph Workload["Target Monitored Workload (:5002)"]
        DemoService["Target Microservice (demo-service)\n(Orders API + Fault Injection Engine)"]
    end

    subgraph Observability["Observability Stack"]
        Prometheus["Prometheus Server (:9090)"]
        Grafana["Grafana Dashboards (:3001)"]
    end

    Operator -->|Manage & Monitor| UI
    UI -->|REST API / Polling| API
    PolicyEngine -->|Active Health Probes (5s loop)| DemoService
    PolicyEngine -->|Trigger Autonomous Rollback| API
    API -->|Deployments & Audit Records| Postgres
    Prometheus -->|Scrape Metrics| PromRegistry
    Prometheus -->|Scrape Metrics| DemoService
    Grafana -->|Visualize Dashboards| Prometheus
```

---

## ⚡ Quick Start (Run Locally in 30 Seconds)

Ensure you have [Docker](https://www.docker.com/) installed and running, then execute:

```bash
# Clone the repository
git clone https://github.com/kavyareddy1313/OPS-PILOT--DEVOPS-.git
cd OPS-PILOT--DEVOPS-

# Start the complete 6-container stack
docker compose up --build -d
```

### 🌐 Access Platform Services

| Component | URL | Credentials | Purpose |
|---|---|---|---|
| **OpsPilot Dashboard** | [`http://localhost:3000`](http://localhost:3000) | — | Main SRE & Deployment Console |
| **OpsPilot Control API** | [`http://localhost:5001`](http://localhost:5001) | — | REST Control Plane & Metrics |
| **Demo Microservice** | [`http://localhost:5002`](http://localhost:5002) | — | Monitored Target Application |
| **Grafana Dashboards** | [`http://localhost:3001`](http://localhost:3001) | `admin` / `admin` | Telemetry & Performance Charts |
| **Prometheus** | [`http://localhost:9090`](http://localhost:9090) | — | Metrics Scraper & PromQL Engine |
| **PostgreSQL** | `localhost:5432` | `opspilot_user` | Relational Persistence Store |

---

## 🧪 Self-Healing Recovery Walkthrough

Experience automated policy-driven self-healing in 3 simple steps:

1. **Open the Dashboard**: Navigate to [`http://localhost:3000`](http://localhost:3000) (Active release is `v1.0.2` with `100% Operational` status).
2. **Inject a Failure**: Open the **Chaos & Self-Healing Lab** tab and click **"Simulate Probe Failure"** (this forces `/healthz` to return HTTP 500).
3. **Observe Autonomous Recovery**:
   - The Policy Engine detects 3 consecutive health probe failures.
   - An incident ticket (`INC-xxxx`) is logged with root cause diagnostics.
   - The engine automatically executes a rollback to verified release `v1.0.1`.
   - Traffic is switched, fault state is cleared, and workload returns to `HEALTHY` within seconds.

---

## 📁 Repository Structure

```
OPS-PILOT--DEVOPS-/
├── frontend/               # React 18 + Vite clean SRE dashboard (Light & Dark themes)
├── backend/                # Express API, recovery policy engine & Prometheus exporter
├── demo-app/               # Monitored microservice with chaos fault-injection switches
├── k8s/                    # Production Kubernetes manifests (00-namespace to 06-grafana)
├── monitoring/             # Prometheus scrape configs & Grafana pre-provisioned dashboards
├── ansible/                # Playbooks for host directory provisioning & Docker daemon tuning
├── .github/workflows/      # Automated CI/CD test and build validation pipeline
└── docker-compose.yml      # Single-command orchestration for the complete stack
```

---

## 💻 Local Development & Testing

Run individual services locally without Docker:

```bash
# 1. Start the target microservice
cd demo-app && npm install && npm run dev     # Port 5002

# 2. Start the backend control plane
cd backend && npm install && npm run dev      # Port 5001

# 3. Start the frontend dashboard
cd frontend && npm install && npm run dev     # Port 3000
```

### Run Automated Tests

```bash
# Run backend API & policy engine integration tests
npm run test:backend

# Run demo service unit tests
npm run test:demo
```

---

## ☸️ Kubernetes Deployment

Deploy OpsPilot into an existing Kubernetes cluster:

```bash
# Deploy in sequential order
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-postgres.yaml
kubectl apply -f k8s/02-demo-app.yaml
kubectl apply -f k8s/03-opspilot-api.yaml
kubectl apply -f k8s/04-opspilot-frontend.yaml
kubectl apply -f k8s/05-prometheus-config.yaml
kubectl apply -f k8s/06-grafana.yaml

# Verify all pods are running
kubectl get pods -n opspilot-prod
```

---

## 🔧 Ansible Node Configuration

Automate host preparation and Docker log rotation:

```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml --check    # Dry-run
ansible-playbook -i inventory.ini playbook.yml            # Apply configuration
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
<br />
Developed by **Kavya Sri Reddy**.
