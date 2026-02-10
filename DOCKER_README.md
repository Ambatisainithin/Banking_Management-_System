# Banking System - Docker Deployment

## Prerequisites
- Docker Desktop installed and running
- At least 4GB RAM allocated to Docker

## Quick Start

### 1. Build and Run All Services
```bash
cd "front and back"
docker-compose up -d --build
```

### 2. Check Status
```bash
docker-compose ps
```

### 3. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **MySQL**: localhost:3307 (user: root, password: root123)

## Login Credentials

| User | Email | Password |
|------|-------|----------|
| Admin | admin@bestbank.com | admin123 |
| Customer 1 (Amitkumar) | 1@bestbank.com | pass123 |
| Customer 2 (Priya) | 2@bestbank.com | pass123 |
| Customer 3 (Rahul) | 3@bestbank.com | pass123 |

## Docker Commands

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Reset Database)
```bash
docker-compose down -v
```

### Rebuild Specific Service
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### View Container Logs
```bash
docker logs banking-backend
docker logs banking-frontend
docker logs banking-mysql
```

### Access MySQL Container
```bash
docker exec -it banking-mysql mysql -u root -proot123 banking_system
```

### Access Backend Container Shell
```bash
docker exec -it banking-backend sh
```

## Troubleshooting

### Backend won't start
1. Check if MySQL is healthy: `docker-compose ps`
2. View backend logs: `docker-compose logs backend`
3. Ensure MySQL has finished initializing (wait 30-60 seconds)

### Frontend shows blank page
1. Check if backend is running: `curl http://localhost:8080/api/customer`
2. View frontend logs: `docker-compose logs frontend`
3. Clear browser cache and refresh

### Database connection issues
1. Ensure MySQL container is healthy
2. Check credentials match in docker-compose.yml
3. Try restarting: `docker-compose restart backend`

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │────▶│     MySQL       │
│  (Nginx:80)     │     │  (Spring:8080)  │     │    (3306)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     Angular              Spring Boot             MySQL 8.0
```

## Service Ports

| Service | Internal Port | External Port |
|---------|---------------|---------------|
| Frontend | 80 | 80 |
| Backend | 8080 | 8080 |
| MySQL | 3306 | 3307 |
