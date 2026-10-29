# OpsPilot Ansible Environment Automation

This directory contains Ansible playbooks to automate repeatable host preparation and environment configuration tasks for OpsPilot.

## Features Automated
1. **Directory Structure Setup**: Creates `/opt/opspilot` and log directories with secure permissions.
2. **Container Runtime Tuning**: Installs and configures Docker log rotation (`daemon.json`) with max-size limits to prevent storage exhaustion during high-frequency testing.
3. **Kernel Parameters**: Configures sysctl networking settings required for Kubernetes pod bridging (`net.bridge.bridge-nf-call-iptables`, `net.ipv4.ip_forward`).
4. **Tool Verification**: Validates presence of `docker` and `kubectl`.

## Running the Playbook

### Dry-Run (Check Mode)
```bash
ansible-playbook -i inventory.ini playbook.yml --check
```

### Apply Locally
```bash
ansible-playbook -i inventory.ini playbook.yml
```

### Apply to Staging Nodes
```bash
ansible-playbook -i inventory.ini playbook.yml --limit staging
```
