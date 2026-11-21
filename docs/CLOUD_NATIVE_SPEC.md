# Cloud-Native Microservice Architecture Specifications

Enterprise reliability and observability architecture for `pbl2-cloud-native-app`.

## Microservice Resiliency Building Blocks
1. **Liveness & Readiness Probes**: Kubernetes-native `/healthz` and `/readyz` endpoints validating container runtime state.
2. **Prometheus Metrics**: Scrapeable metrics on `/metrics` tracking request latency histograms and error counters.
3. **W3C Distributed Tracing**: Trace context propagation across upstream gateways and downstream microservices.
4. **Circuit Breakers**: Failure-rate tripped circuit breakers preventing cascading outages in distributed topologies.
