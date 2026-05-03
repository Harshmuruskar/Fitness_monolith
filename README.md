Fitness Tracker Application
A comprehensive Fitness Tracker application built with Java and Spring Boot. This project demonstrates building a production-ready REST API with secure authentication, activity tracking, and AI-powered recommendations.

Project Overview
This application serves as a backend platform for tracking user fitness activities and providing personalized recommendations. It covers the full lifecycle of development from database design to cloud deployment.

Key Features
User Authentication & Authorization: Implements secure Spring Security with JWT (JSON Web Token) for stateless authentication.
Role-Based Access Control (RBAC): Manages user permissions effectively.
REST API Development: Follows industry best practices with DTO patterns and input validation using Spring Boot Bean Validation.
Database Integration: Uses Spring Data JPA and Hibernate to interact with MySQL (and PostgreSQL for cloud deployment).
API Documentation: Integrated with Swagger/OpenAPI for automatic API documentation (available at /swagger-ui.html).
Dockerization: Fully containerized using Docker for easy deployment and scalability.

Technical Stack
Framework: Spring Boot
Language: Java 21
Database: MySQL / PostgreSQL
Security: Spring Security, JWT, BCrypt
Documentation: Swagger/OpenAPI
Containerization: Docker


Setup Instructions
Clone the repository: git clone
Configuration: Configure your database settings in application.properties (or use environment variables).

Build: Use Maven to build the project.

Run: Execute the application using your IDE or the Docker command: docker run -p 8080:8080
