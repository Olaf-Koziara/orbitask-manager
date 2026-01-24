.PHONY: help up down build rebuild logs shell test clean health backup restore prod

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

help:
	@echo "$(BLUE)Orbitask Docker Management$(NC)"
	@echo ""
	@echo "$(GREEN)Services:$(NC)"
	@echo "  make up              Start all services"
	@echo "  make down            Stop all services"
	@echo "  make rebuild         Rebuild and restart services"
	@echo "  make status          Show running services"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@echo "  make logs            View all logs"
	@echo "  make logs-backend    View backend logs"
	@echo "  make logs-frontend   View frontend logs"
	@echo "  make shell-backend   Connect to backend shell"
	@echo "  make shell-frontend  Connect to frontend shell"
	@echo "  make test            Run all tests"
	@echo "  make test-backend    Run backend tests"
	@echo "  make test-frontend   Run frontend tests"
	@echo ""
	@echo "$(GREEN)Maintenance:$(NC)"
	@echo "  make clean           Stop and remove containers"
	@echo "  make clean-all       Remove containers and volumes"
	@echo "  make health          Check service health"
	@echo "  make backup          Backup MongoDB"
	@echo "  make restore         Restore MongoDB"
	@echo ""
	@echo "$(GREEN)Production:$(NC)"
	@echo "  make prod            Start with production config"
	@echo "  make prod-logs       View production logs"
	@echo "  make k8s-deploy      Deploy to Kubernetes"
	@echo ""

up:
	@echo "$(BLUE)Starting services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Services started$(NC)"
	@docker-compose ps

down:
	@echo "$(BLUE)Stopping services...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Services stopped$(NC)"

build:
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ Build complete$(NC)"

rebuild:
	@echo "$(BLUE)Rebuilding services...$(NC)"
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "$(GREEN)✓ Services rebuilt$(NC)"

status:
	@echo "$(BLUE)Service Status:$(NC)"
	@docker-compose ps

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

test:
	@echo "$(BLUE)Running tests...$(NC)"
	docker-compose exec backend npm test
	docker-compose exec frontend npm test:run

test-backend:
	@echo "$(BLUE)Testing backend...$(NC)"
	docker-compose exec backend npm test

test-frontend:
	@echo "$(BLUE)Testing frontend...$(NC)"
	docker-compose exec frontend npm test:run

clean:
	@echo "$(BLUE)Cleaning up containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Cleaned$(NC)"

clean-all:
	@echo "$(RED)Removing containers and volumes...$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "$(GREEN)✓ All cleaned$(NC)"; \
	fi

health:
	@echo "$(BLUE)Health Check:$(NC)"
	@echo "Frontend: $$(curl -s http://localhost/health || echo 'DOWN')"
	@echo "Backend: $$(curl -s http://localhost:5000/health || echo 'DOWN')"

backup:
	@echo "$(BLUE)Backing up MongoDB...$(NC)"
	@mkdir -p backups
	docker-compose exec -T mongodb mongodump \
		--uri="mongodb://admin:$${MONGO_ROOT_PASSWORD}@localhost:27017/orbitask?authSource=admin" \
		--out=./backups/$$(date +%Y%m%d_%H%M%S)
	@echo "$(GREEN)✓ Backup complete$(NC)"

restore:
	@echo "$(BLUE)Enter backup directory path:$(NC)"
	@read backup_path; \
	docker-compose exec -T mongodb mongorestore \
		--uri="mongodb://admin:$${MONGO_ROOT_PASSWORD}@localhost:27017" \
		$$backup_path
	@echo "$(GREEN)✓ Restore complete$(NC)"

prod:
	@echo "$(BLUE)Starting production environment...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Production services started$(NC)"

prod-logs:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

k8s-deploy:
	@echo "$(BLUE)Deploying to Kubernetes...$(NC)"
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/deployment.yaml
	@echo "$(GREEN)✓ Deployed to Kubernetes$(NC)"
	kubectl get all -n orbitask

k8s-logs:
	kubectl logs -f -n orbitask -l app=orbitask-backend

k8s-delete:
	@echo "$(RED)Deleting Kubernetes resources...$(NC)"
	kubectl delete -f k8s/deployment.yaml
	kubectl delete ns orbitask

.DEFAULT_GOAL := help
