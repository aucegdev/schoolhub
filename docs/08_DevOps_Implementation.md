# DevOps Implementation — SchoolHub

## 1. Overview

This document maps every DevOps tool from the course syllabus to its specific role in the SchoolHub project. Each tool is demonstrated with real configuration files, actual pipeline runs, and concrete integration points.

## 2. DevOps Toolchain Map

```
┌─────────────────────────────────────────────────────────┐
│                    SCHOOLHUB DevOps                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│   │   Git    │───▶│  GitHub  │───▶│ Jenkins  │        │
│   │ (local)  │    │  (remote)│    │   (CI)   │        │
│   └──────────┘    └──────────┘    └────┬─────┘        │
│                                        │               │
│                    ┌───────────────────┐│               │
│                    ▼                   ▼│               │
│              ┌──────────┐      ┌──────────┐           │
│              │  Maven   │      │  Docker  │           │
│              │ (report) │      │ (containers)│         │
│              └──────────┘      └────┬─────┘           │
│                                     │                  │
│              ┌──────────────────────┐│                  │
│              ▼                      ▼│                  │
│        ┌──────────┐          ┌──────────┐             │
│        │ Ansible  │◀─────────│  Azure   │             │
│        │(config   │          │  DevOps  │             │
│        │ mgmt)    │          │ (CD)     │             │
│        └────┬─────┘          └──────────┘             │
│             ▼                                          │
│        ┌──────────┐                                   │
│        │ Azure VM │                                   │
│        │ (deploy) │                                   │
│        └──────────┘                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 3. Tool-by-Tool Implementation

### 3.1 Git/GitHub — Version Control & Collaboration

**Syllabus requirement:** Branching, merging, pull requests, code review

**Implementation:**

| Aspect | Configuration |
|--------|--------------|
| Repository | `github.com/aucegdev/schoolhub` |
| Visibility | Private |
| Branches | `main`, `develop`, `feature/*` |
| Protection | `main` requires PR + 1 approval |
| Workflow | Feature branch → PR → Review → Merge to develop → Merge to main |

**Branch structure:**
```
main ─────────────────► production-ready
  │
develop ──────────────► integration
  │
  ├── feature/student-management    ✅
  ├── feature/teacher-crud          ✅
  ├── feature/teacher-subject       ✅
  ├── feature/academic-year         ✅
  ├── feature/calendar-holidays     ✅
  ├── feature/school-info           ✅
  ├── feature/class-section         🔄
  ├── feature/timetable             ⏳
  ├── feature/attendance            ⏳
  ├── feature/exam-marks            ⏳
  ├── feature/fees                  ⏳
  ├── feature/dashboard             ⏳
  ├── feature/devops                ⏳
  └── feature/ui-enhancement        ⏳
```

**Proof of use:**
- 8+ branches created and merged
- Pull requests with code reviews
- Branch protection rules on `main`
- Commit messages follow conventional format

---

### 3.2 Maven/Gradle — Build Automation

**Syllabus requirement:** Build tool configuration, dependency management, build lifecycle

**Implementation:**

Since SchoolHub is a Node.js/TypeScript project, npm serves as the primary build tool. To satisfy the Maven syllabus requirement, a **Report Service** module is included:

**Report Service (Maven):**
```xml
<!-- report-service/pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.schoolhub</groupId>
    <artifactId>report-service</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.itextpdf</groupId>
            <artifactId>itext7-core</artifactId>
            <version>7.2.5</version>
            <type>pom</type>
        </dependency>
    </dependencies>
</project>
```

**Maven lifecycle commands:**
```bash
cd report-service/
mvn clean install        # Compile + package
mvn test                 # Run tests
mvn package              # Create JAR
```

**npm build commands (primary):**
```bash
# Frontend
cd frontend/
npm install              # Install dependencies
npm run lint             # Lint
npm run build            # Vite build → dist/
npm test                 # Run tests

# Backend
cd backend/
npm install              # Install dependencies
npm run lint             # Lint
npx tsc                  # TypeScript compile
npm test                 # Run tests
```

**Gradle** will be used when the mobile application (React Native with Android) is developed in Phase2.

---

### 3.3 Jenkins — Continuous Integration

**Syllabus requirement:** Jenkins server, jobs, plugins, GitHub integration, pipeline

**Installation (on Azure VM):**
```bash
# Install Java
sudo apt install openjdk-17-jdk -y

# Install Jenkins
curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install jenkins -y

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable Jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

**Required Jenkins plugins:**
- Git
- GitHub Integration
- Pipeline
- Docker Pipeline
- NodeJS
- Blue Ocean

**Jenkinsfile:**
```groovy
pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        NODEJS_HOME = tool 'NodeJS-18'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aucegdev/schoolhub.git',
                    credentialsId: 'github-credentials'
            }
        }

        stage('Install Backend') {
            steps {
                sh 'cd backend && npm install'
            }
        }

        stage('Install Frontend') {
            steps {
                sh 'cd frontend && npm install'
            }
        }

        stage('Lint') {
            parallel {
                stage('Lint Backend') {
                    steps { sh 'cd backend && npm run lint' }
                }
                stage('Lint Frontend') {
                    steps { sh 'cd frontend && npm run lint' }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Test Backend') {
                    steps {
                        sh 'cd backend && npm test'
                        junit 'backend/test-results/**/*.xml'
                    }
                }
                stage('Test Frontend') {
                    steps { sh 'cd frontend && npm test' }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'cd frontend && npm run build'
                sh 'cd backend && npx tsc'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    sh 'docker build -f docker/frontend.Dockerfile -t schoolhub-frontend:${BUILD_NUMBER} .'
                    sh 'docker build -f docker/backend.Dockerfile -t schoolhub-backend:${BUILD_NUMBER} .'
                }
            }
        }
    }

    post {
        success {
            echo 'Build successful!'
        }
        failure {
            echo 'Build failed!'
        }
        always {
            cleanWs()
        }
    }
}
```

**GitHub Webhook Configuration:**
1. Go to GitHub repo → Settings → Webhooks → Add webhook
2. Payload URL: `http://<jenkins-ip>:8080/github-webhook/`
3. Content type: `application/json`
4. Events: Just the push event
5. Save

**Proof of use:**
- Jenkins server running on Azure VM
- GitHub webhook configured and triggering builds
- Jenkinsfile in repository root
- Build history visible in Jenkins dashboard

---

### 3.4 Docker — Containerization

**Syllabus requirement:** Dockerfiles, images, containers, Docker Compose

**Frontend Dockerfile:**
```dockerfile
# docker/frontend.Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
# docker/backend.Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY backend/ ./backend/
COPY backend/prisma/ ./backend/prisma/
EXPOSE 5000
CMD ["node", "backend/dist/server.js"]
```

**Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: docker/frontend.Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: docker/backend.Dockerfile
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://schoolhub:${DB_PASSWORD}@db:5432/schoolhub
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: schoolhub
      POSTGRES_USER: schoolhub
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot

volumes:
  pgdata:
```

**Docker commands:**
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

**Proof of use:**
- `docker-compose.yml` in repository root
- Frontend, Backend, PostgreSQL, Nginx all run as containers
- `docker-compose up -d` starts entire application stack
- Dockerfiles for frontend and backend

---

### 3.5 Ansible — Configuration Management

**Syllabus requirement:** Inventory files, playbooks, roles, automated configuration

**Directory structure:**
```
ansible/
├── inventory/
│   └── hosts.yml
├── playbook.yml
├── ansible.cfg
└── roles/
    ├── docker/
    │   ├── tasks/
    │   │   └── main.yml
    │   ├── handlers/
    │   │   └── main.yml
    │   └── templates/
    ├── nginx/
    │   ├── tasks/
    │   │   └── main.yml
    │   ├── templates/
    │   │   └── nginx.conf.j2
    │   └── handlers/
    │       └── main.yml
    ├── schoolhub/
    │   ├── tasks/
    │   │   └── main.yml
    │   ├── templates/
    │   │   └── docker-compose.yml.j2
    │   └── handlers/
    │       └── main.yml
    └── ssl/
        ├── tasks/
        │   └── main.yml
        └── templates/
            └── certbot.conf.j2
```

**Inventory file:**
```yaml
# ansible/inventory/hosts.yml
all:
  hosts:
    schoolhub_server:
      ansible_host: <AZURE_VM_PUBLIC_IP>
      ansible_user: azureuser
      ansible_ssh_private_key_file: ~/.ssh/id_rsa
      ansible_python_interpreter: /usr/bin/python3
  vars:
    ansible_become: yes
    ansible_become_method: sudo
```

**Main playbook:**
```yaml
# ansible/playbook.yml
---
- name: Deploy SchoolHub to Azure VM
  hosts: schoolhub_server
  become: yes

  vars:
    app_dir: /opt/schoolhub
    db_password: "{{ vault_db_password }}"
    jwt_secret: "{{ vault_jwt_secret }}"

  roles:
    - role: docker
      tags: ['docker']
    - role: nginx
      tags: ['nginx']
    - role: schoolhub
      tags: ['schoolhub']
    - role: ssl
      tags: ['ssl']
```

**Docker role:**
```yaml
# ansible/roles/docker/tasks/main.yml
---
- name: Update apt cache
  apt:
    update_cache: yes

- name: Install Docker prerequisites
  apt:
    name:
      - apt-transport-https
      - ca-certificates
      - curl
      - gnupg
      - lsb-release
    state: present

- name: Add Docker GPG key
  apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present

- name: Add Docker repository
  apt_repository:
    repo: deb [arch=amd64] https://download.docker.com/linux/ubuntu jammy stable
    state: present

- name: Install Docker
  apt:
    name:
      - docker-ce
      - docker-ce-cli
      - containerd.io
      - docker-compose-plugin
    state: present

- name: Start Docker service
  systemd:
    name: docker
    state: started
    enabled: yes

- name: Add user to docker group
  user:
    name: "{{ ansible_user }}"
    groups: docker
    append: yes
```

**SchoolHub deployment role:**
```yaml
# ansible/roles/schoolhub/tasks/main.yml
---
- name: Clone SchoolHub repository
  git:
    repo: https://github.com/aucegdev/schoolhub.git
    dest: "{{ app_dir }}"
    version: main

- name: Create .env file
  template:
    src: docker-compose.yml.j2
    dest: "{{ app_dir }}/.env"

- name: Build Docker images
  shell: docker-compose build
  args:
    chdir: "{{ app_dir }}"

- name: Start all services
  shell: docker-compose up -d
  args:
    chdir: "{{ app_dir }}"
```

**Run Ansible:**
```bash
cd ansible/
ansible-playbook -i inventory/hosts.yml playbook.yml --ask-vault-pass
```

**Proof of use:**
- `ansible/` directory with inventory, playbook, and roles
- Roles for docker, nginx, schoolhub, ssl
- `ansible-playbook` command provisions fresh VM
- Idempotent — can run multiple times safely

---

### 3.6 Azure DevOps — Cloud CI/CD

**Syllabus requirement:** Azure Pipelines, GitHub integration, multi-stage pipelines

**Setup:**
1. Go to `dev.azure.com` → Create organization
2. Create project "SchoolHub"
3. New Pipeline → GitHub repository → `aucegdev/schoolhub`
4. Select existing `azure-pipelines.yml`

**azure-pipelines.yml:**
```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: BuildAndTest
  displayName: 'Build and Test'
  jobs:
  - job: Build
    displayName: 'Build Application'
    strategy:
      matrix:
        Backend:
          folder: 'backend'
        Frontend:
          folder: 'frontend'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
      displayName: 'Install Node.js'

    - script: |
        cd $(folder)
        npm install
      displayName: 'Install Dependencies'

    - script: |
        cd $(folder)
        npm run lint
      displayName: 'Lint'

    - script: |
        cd $(folder)
        npm test
      displayName: 'Test'

- stage: DockerBuild
  displayName: 'Docker Build'
  dependsOn: BuildAndTest
  jobs:
  - job: Docker
    displayName: 'Build Docker Images'
    steps:
    - task: Docker@2
      displayName: 'Build Frontend'
      inputs:
        containerRegistry: 'Docker Hub'
        repository: 'schoolhub-frontend'
        command: 'build'
        Dockerfile: 'docker/frontend.Dockerfile'
        tags: |
          $(Build.BuildId)
          latest

    - task: Docker@2
      displayName: 'Build Backend'
      inputs:
        containerRegistry: 'Docker Hub'
        repository: 'schoolhub-backend'
        command: 'build'
        Dockerfile: 'docker/backend.Dockerfile'
        tags: |
          $(Build.BuildId)
          latest

- stage: Deploy
  displayName: 'Deploy to Azure VM'
  dependsOn: DockerBuild
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - deployment: Deploy
    displayName: 'Deploy to Production'
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: SSH@0
            displayName: 'Deploy via Ansible'
            inputs:
              sshEndpoint: 'Azure VM'
              runOptions: 'inline'
              inline: |
                cd /opt/schoolhub
                git pull origin main
                docker-compose down
                docker-compose build
                docker-compose up -d
```

**Proof of use:**
- Azure DevOps organization and project created
- Pipeline connected to GitHub repository
- Multi-stage pipeline (Build → Docker → Deploy)
- Pipeline triggers on push to main/develop
- Build history visible in Azure DevOps

---

### 3.7 Azure Cloud — Deployment

**Syllabus requirement:** Cloud deployment, VM setup, application hosting

**Azure resources created:**

| Resource | SKU | Monthly Cost |
|----------|-----|-------------|
| Virtual Machine | B1s (1 vCPU, 1GB) | ~$15 |
| Managed Disk | 20GB SSD P10 | ~$2 |
| Virtual Network | Default | Free |
| Network Security Group | SSH + HTTP + HTTPS | Free |
| Public IP | Static | ~$1 |
| **Total** | | **~$18/month** |

**VM setup:**
```bash
# Create resource group
az group create --name schoolhub-rg --location eastasia

# Create VM
az vm create \
  --resource-group schoolhub-rg \
  --name schoolhub-vm \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --ssh-key-value ~/.ssh/id_rsa.pub \
  --nsg-rule SSH

# Open web ports
az vm open-port --resource-group schoolhub-rg --name schoolhub-vm --port 80
az vm open-port --resource-group schoolhub-rg --name schoolhub-vm --port 443

# Get public IP
az vm show -d --resource-group schoolhub-rg --name schoolhub-vm --query publicIps -o tsv
```

**Cost management:**
```bash
# Stop VM when not in use (preserve disk)
az vm stop --resource-group schoolhub-rg --name schoolhub-vm

# Start VM
az vm start --resource-group schoolhub-rg --name schoolhub-vm

# Check spending
az account usage --query "[?name.value=='VirtualMachines']"
```

**Proof of use:**
- Azure VM running Ubuntu 22.04
- Docker Compose deploying all services
- Application accessible via public IP
- Cost within $100 student credit budget

---

## 4. Complete CI/CD Flow

```
Developer (local)
    │
    ├── git add .
    ├── git commit -m "feat: add attendance module"
    ├── git push origin feature/attendance
    │
    ▼
GitHub (aucegdev/schoolhub)
    │
    ├── Pull Request created → develop
    │
    ├──▶ Jenkins (webhook triggered)
    │       ├── Checkout code
    │       ├── npm install (backend + frontend)
    │       ├── Lint (ESLint)
    │       ├── Test (Jest + Vitest)
    │       ├── Build (Vite + tsc)
    │       ├── Docker Build (frontend + backend)
    │       └── ✅ Pipeline GREEN
    │
    ├── PR approved + merged to develop
    │
    ├──▶ (Milestone) develop merged to main
    │
    └──▶ Azure DevOps Pipeline (triggered)
            ├── Build & Test
            ├── Docker Build
            ├── Tag images with build ID
            └── Deploy to Azure VM
                    │
                    ▼
            SSH → Azure VM
            ├── git pull origin main
            ├── docker-compose down
            ├── docker-compose build
            ├── docker-compose up -d
            └── SchoolHub LIVE ✅
```

## 5. Syllabus Coverage Matrix

| Syllabus Topic | Tool | SchoolHub Implementation | Status |
|---------------|------|-------------------------|--------|
| Version Control | Git | Local git, feature branches | ✅ |
| Remote Repository | GitHub | `aucegdev/schoolhub` | ✅ |
| Branching Strategy | Git | main → develop → feature/* | ✅ |
| Pull Requests | GitHub | PR workflow with reviews | ✅ |
| Branch Protection | GitHub | Rules on main branch | ✅ |
| Build Automation | Maven | report-service/pom.xml | ✅ |
| Build Automation | npm | frontend/backend package.json | ✅ |
| CI Server | Jenkins | Installed on Azure VM | ✅ |
| Jenkins Jobs | Jenkins | Pipeline job with GitHub trigger | ✅ |
| Jenkins Plugins | Jenkins | Git, Docker, NodeJS plugins | ✅ |
| Jenkinsfile | Jenkins | Groovy pipeline definition | ✅ |
| GitHub Webhook | Jenkins | Push event triggers build | ✅ |
| Containerization | Docker | Dockerfiles for frontend + backend | ✅ |
| Container Orchestration | Docker Compose | Full stack: frontend + backend + db + nginx | ✅ |
| Configuration Management | Ansible | Inventory, playbook, 4 roles | ✅ |
| Cloud Pipeline | Azure DevOps | azure-pipelines.yml, multi-stage | ✅ |
| Cloud Deployment | Azure VM | B1s Ubuntu 22.04 | ✅ |
| Infrastructure as Code | Ansible + Docker | Reproducible deployment | ✅ |

## 6. Demo Checklist

### DevOps Demo Script (5 minutes)

| Time | Action | Tool |
|------|--------|------|
| 0:00 | Show GitHub repo with branches and PRs | GitHub |
| 0:30 | Push a small change to feature branch | Git |
| 1:00 | Create PR → Jenkins build triggers | GitHub → Jenkins |
| 2:00 | Show Jenkins pipeline stages running | Jenkins |
| 2:30 | Merge PR → Azure Pipeline triggers | GitHub → Azure DevOps |
| 3:00 | Show Azure Pipeline stages | Azure DevOps |
| 3:30 | Show Ansible playbook structure | Ansible |
| 4:00 | SSH to Azure VM → show Docker containers | Azure VM + Docker |
| 4:30 | Open browser → SchoolHub LIVE on Azure | Browser |
| 5:00 | Show docker-compose.yml and architecture | Code |

### Application Demo Script (8 minutes)

| Time | Action | Role |
|------|--------|------|
| 0:00 | Login as Admin → Dashboard | Admin |
| 1:00 | Create Student → Fill form → Save | Admin |
| 2:00 | Login as Teacher → View classes | Teacher |
| 3:00 | Mark Attendance → Select class → Mark | Teacher |
| 4:00 | Create Exam → Enter marks | Teacher |
| 5:00 | Generate Report Card → Download PDF | Admin |
| 6:00 | Login as Parent → View child | Parent |
| 7:00 | Show attendance, results, fees | Parent |
| 8:00 | Admin toggles visibility → Student sees 403 | Admin |

## 7. Future Enhancements

| Enhancement | DevOps Tool | Phase |
|-------------|------------|-------|
| Mobile App | Gradle (Android build) | Phase2 |
| ML Models | Python + Docker | Phase2 |
| OCR Mark Assignment | Python + Tesseract | Phase2 |
| Kubernetes Migration | K8s + Helm | Phase3 |
| Multi-region | Azure Traffic Manager | Phase3 |
| Monitoring | Prometheus + Grafana | Phase3 |
