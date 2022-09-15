# Develop Microservices

Services will host the independent and completely loose coupled microservices. They will never communicate with any other microservice. They can connect to a message bus for pub/sub. They do connect to their own DB.

Facades will host the aggregator microservices. They are responsible for implementing Aggregator pattern in microservices architecture. It follows the pattern described here from Loopback team. They never connect to any DB. They only communicate with other microservices and aggregate data from them. They can connect to a message bus for pub/sub.