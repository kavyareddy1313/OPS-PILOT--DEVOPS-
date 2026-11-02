# OpsPilot Ansible Environment Automation

This directory contains Ansible playbooks to automate repeatable host preparation and environment configuration tasks for OpsPilot.

## Features Automated
1. **Directory Structure Setup**: Creates `/opt/opspilot` and log directories with secure permissions.
2. **Container Runtime Tuning**: Installs and configures Docker log rotation (`daemon.json`) with max-size limits to prevent storage exhaustion during high-frequency testing.
3. **Kernel Parameters**: Configures sysctl networking settings required for Kubernetes pod bridging (`net.bridge.bridge-nf-call-iptables`, `net.ipv4.ip_forward`).
4. **Tool Verification**: Validates presence of `docker` and `kubectl`.

---

## 🛠️ Prerequisites & Installation

If Ansible is not yet installed on your system:

### macOS (Homebrew or Pip)
```bash
brew install ansible
# or
pip3 install ansible-core
```

### Ubuntu / Debian
```bash
sudo apt update && sudo apt install -y ansible
```

---

## ✅ How to Verify Ansible is Working

Follow this 4-step verification sequence inside the `ansible/` directory:

### Step 1: Verify Ansible CLI is installed
```bash
ansible --version
```
*Expected: Prints `ansible [core 2.x.x]` and Python version.*

### Step 2: Test Host Connectivity (Ping Test)
```bash
ansible -i inventory.ini local -m ping
```
*Expected Output:*
```json
localhost | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

### Step 3: Validate Playbook Syntax
```bash
ansible-playbook -i inventory.ini playbook.yml --syntax-check
```
*Expected Output:*
```text
playbook: playbook.yml
```
*(No syntax errors found).*

### Step 4: Dry-Run Simulation (Check Mode - Safe, no changes made)
```bash
ansible-playbook -i inventory.ini playbook.yml --check
```
*Expected Output:*
*Executes all tasks in test mode and displays task completion without modifying system files.*

---

## 🚀 Applying the Playbook

### Apply Locally (prompt for sudo password if modifying /opt or /etc)
```bash
ansible-playbook -i inventory.ini playbook.yml -K
```

### Apply to Staging Nodes
```bash
ansible-playbook -i inventory.ini playbook.yml --limit staging
```
