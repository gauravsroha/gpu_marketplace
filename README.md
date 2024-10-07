# gpuX
A marketplace for users to find a great deal on buying and selling gpus.


## Prerequisites

Before running this project, make sure you have the following installed:
- [Docker](https://www.docker.com/get-started) (Desktop app recommended)

  

## Getting Started

1. Clone the repository:  
  git clone https://github.com/gauravsroha/gpu_marketplace.git  
  cd gpu_marketplace

2. Build and start the Docker containers:  
bashCopydocker compose up --build  
This command will:  
a. Build the React frontend  
b. Build the Django backend  
c. Start the PostgreSQL database  
d. Run both frontend and backend servers  
e. Mount the local directory for development  


4. Access the application:  
Frontend (React): http://localhost:3000  
Backend (Django): http://localhost:8000  
Admin interface: http://localhost:8000/admin  

5. Services  
The application runs three main services:  
React Frontend (Port 3000)
Django Backend (Port 8000)
PostgreSQL Database (Port 5432)


# Start containers:
docker compose up


# Stop containers:    
docker compose down

# Make migrations  
docker compose exec web python gpu_marketplace/manage.py makemigrations

# Apply migrations  
docker compose exec web python gpu_marketplace/manage.py migrate

# Create superuser  
docker compose exec web python gpu_marketplace/manage.py createsuperuser  



Make sure ports 3000, 8000, and 5432 are not in use
Modify ports in docker-compose.yml if needed


# Technology Stack

React (Frontend)  
Django 5.1.1 (Backend)  
Python 3.12.6  
PostgreSQL 13  
Docker & Docker Compose  
Node.js 14 (for frontend build)  

# Contact
Name - @gauravsroha  
Project Link: https://github.com/gauravsroha/gpu_marketplace
