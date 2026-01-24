#!/bin/bash
# Orbitask Docker Utility Script
# Quick commands for Docker operations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="orbitask-manager"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

function print_header() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

function print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

function print_error() {
  echo -e "${RED}✗ $1${NC}"
}

function print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

# Main commands
case "${1}" in
  up)
    print_header "Starting Orbitask Services"
    docker-compose up -d
    print_success "Services started"
    docker-compose ps
    ;;

  down)
    print_header "Stopping Orbitask Services"
    docker-compose down
    print_success "Services stopped"
    ;;

  logs)
    SERVICE="${2:-}"
    if [ -z "$SERVICE" ]; then
      docker-compose logs -f
    else
      docker-compose logs -f "$SERVICE"
    fi
    ;;

  build)
    print_header "Building Docker Images"
    docker-compose build --no-cache
    print_success "Build completed"
    ;;

  rebuild)
    SERVICE="${2:-}"
    print_header "Rebuilding Services"
    if [ -z "$SERVICE" ]; then
      docker-compose down -v
      docker-compose up -d --build
    else
      docker-compose build --no-cache "$SERVICE"
      docker-compose up -d "$SERVICE"
    fi
    print_success "Rebuild completed"
    ;;

  status)
    print_header "Service Status"
    docker-compose ps
    ;;

  health)
    print_header "Health Check"
    print_info "Backend: $(curl -s http://localhost:5000/health || echo 'DOWN')"
    print_info "Frontend: $(curl -s http://localhost/health || echo 'DOWN')"
    ;;

  shell)
    SERVICE="${2:-backend}"
    print_info "Connecting to $SERVICE shell"
    docker-compose exec "$SERVICE" sh
    ;;

  test)
    SERVICE="${2:-backend}"
    print_header "Running Tests for $SERVICE"
    if [ "$SERVICE" = "backend" ]; then
      docker-compose exec backend npm test
    elif [ "$SERVICE" = "frontend" ]; then
      docker-compose exec frontend npm test:run
    fi
    ;;

  clean)
    print_header "Cleaning Up"
    read -p "Remove volumes? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker-compose down -v
      print_success "Cleaned up with volumes"
    else
      docker-compose down
      print_success "Cleaned up"
    fi
    ;;

  backup)
    print_header "Backing Up MongoDB"
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    docker-compose exec -T mongodb mongodump \
      --uri="mongodb://admin:${MONGO_ROOT_PASSWORD}@localhost:27017/orbitask?authSource=admin" \
      --out="$BACKUP_DIR"
    print_success "Backup created at $BACKUP_DIR"
    ;;

  restore)
    BACKUP_DIR="${2:-.}"
    print_header "Restoring MongoDB"
    docker-compose exec -T mongodb mongorestore \
      --uri="mongodb://admin:${MONGO_ROOT_PASSWORD}@localhost:27017" \
      "$BACKUP_DIR"
    print_success "Restore completed"
    ;;

  prod)
    print_header "Starting Production Configuration"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    print_success "Production services started"
    ;;

  logs-prod)
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f "${2:-}"
    ;;

  *)
    print_header "Orbitask Docker Management"
    echo "Usage: ./docker.sh [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  up              Start all services"
    echo "  down            Stop all services"
    echo "  logs [service]  View logs (all or specific service)"
    echo "  build           Build Docker images"
    echo "  rebuild [svc]   Rebuild images and services"
    echo "  status          Show running services"
    echo "  health          Check service health"
    echo "  shell [svc]     Connect to service shell (default: backend)"
    echo "  test [svc]      Run tests (backend or frontend)"
    echo "  clean           Remove containers (optionally with volumes)"
    echo "  backup          Backup MongoDB database"
    echo "  restore [path]  Restore MongoDB from backup"
    echo "  prod            Start with production configuration"
    echo "  logs-prod       View production logs"
    echo ""
    echo "Examples:"
    echo "  ./docker.sh up"
    echo "  ./docker.sh logs backend"
    echo "  ./docker.sh shell frontend"
    echo "  ./docker.sh test backend"
    ;;
esac
