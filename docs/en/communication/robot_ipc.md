
# Inter-Process Communication

In robot software systems, inter-process communication is one of the most fundamental and most critical capabilities. A common practice is to directly adopt off-the-shelf communication frameworks such as ROS, DDS, or ZMQ. They are all mature and are all widely used in both industry and research.

However, if the system boundary is limited to the inside of a single robot body and does not consider multi-robot collaboration, remote control, or distributed computing, then although these frameworks can certainly be used, they are often not the optimal choice for communication inside the robot host. For this type of scenario, the more important goals are usually high-frequency communication, low latency, low jitter, fewer copies, predictable real-time behavior, and efficient sharing for high-bandwidth data.

This section first briefly introduces the design positioning of ROS, DDS, and ZMQ, and then explains why they are not entirely suitable for the specific problem of communication inside a robot host.

## 1. ROS: A Communication Framework for the Robot Ecosystem

More accurately speaking, ROS is not just a communication library, but a complete robot software ecosystem. It provides nodes, topics, services, actions, a parameter system, toolchains, debugging tools, visualization tools, and a large number of ready-made software packages, which greatly lowers the development barrier for complex robot systems. ROS 2 is built on DDS/RTPS, which provides middleware capabilities such as discovery, serialization, and transport. As a result, ROS 2 is more suitable for serving as a robot software integration framework rather than merely an in-host messaging channel.


<figure class="ros-figure">
	<img src="../../../images/ros2_arch.png" alt="ROS 2 architecture" />
	<figcaption>Typical software layering of ROS 2</figcaption>
</figure>

From an architectural perspective, ROS 2 inserts multiple abstraction layers between user code and the underlying DDS, including the client library, rcl, rmw, and the concrete DDS implementation. This design brings good portability and ecosystem compatibility, but it also means a longer in-host data path, more abstraction layers, more configuration options, and more potential serialization and scheduling overhead inside the system.


The main advantages of ROS are reflected in:

- Rapidly building complex robot systems
- Reusing mature ecosystems such as navigation, SLAM, MoveIt, and RViz
- Unified message interfaces and toolchains
- Convenient cross-module and cross-device integration
- Good support for R&D validation, system integration, and feature expansion


If the focus is only on communication inside the robot body, the issue with ROS is not that it cannot be used, but that it is not the lowest-cost or highest-performance option:

1. It has many abstraction layers. There are multiple layers of wrapping from a user node to the underlying transport, so the path is relatively long.
2. It emphasizes generality more than extreme low latency. ROS must accommodate cross-language, cross-process, cross-host, cross-platform, and ecosystem compatibility requirements, and these goals naturally increase system complexity.
3. It is not direct enough for high-frequency control loops. For high-frequency small messages such as IMU data, joint states, and control commands, or for large messages such as images, depth maps, and point clouds, in-host communication often prefers the shortest possible sharing path rather than a full communication stack designed for distributed systems.
4. Real-time optimization is costly. In industrial real-time scenarios, ROS 2 usually requires additional tuning through underlying DDS configuration, thread scheduling, CPU affinity, and similar techniques.

Therefore, ROS is better suited as a robot software ecosystem and system integration framework, rather than as the ultimate form of ultra-high-performance communication inside a robot host.

## 2. DDS: Data Middleware for Distributed Real-Time Systems

DDS (Data Distribution Service) is a data distribution middleware standard defined by OMG. It sits between the operating system and applications, shielding low-level network transport, discovery mechanisms, QoS management, protocol details, and data formats, so that applications running in different languages, on different operating systems, and on different hardware platforms can exchange data.


<figure class="ros-figure ros-figure--narrow">
	<img src="../../../images/dds1.png" alt="DDS middleware stack" />
	<figcaption>Layered view of DDS middleware</figcaption>
</figure>

DDS middleware is responsible for APIs, data types, serialization, QoS, buffering, filtering, sessions, reliability, discovery mechanisms, and more, while covering the operating system, network, and link layers underneath. This makes the design goal of DDS very clear: it is intended for heterogeneous, distributed, scalable, configurable real-time systems.


<figure class="ros-figure ros-figure--narrow">
	<img src="../../../images/dds2.png" alt="DDS domain and topics" />
	<figcaption>DDS domains, topics, and the reader-writer model</figcaption>
</figure>

DDS uses a data-centric model, sharing data through topics, DataWriters, DataReaders, QoS, and filters, and it also provides dynamic discovery so participants may be on the same machine or distributed across different nodes on the network.

From this perspective, DDS is particularly strong at:

- Automatic discovery of distributed nodes
- Cross-machine, cross-language, and cross-platform communication
- Rich QoS policies
- Scalability for complex systems
- A unified data distribution model


The issue with DDS is not poor performance. On the contrary, it was originally designed for low-latency, highly reliable, real-time systems. But for communication inside a single robot host, DDS is often more capable than necessary:

1. It pays extra complexity for distributed-system problems. Designs such as dynamic discovery, QoS negotiation, cross-platform compatibility, and network protocol adaptation are valuable in distributed environments, but inside a single machine they are often not core requirements.
2. Its configuration and tuning costs are relatively high. Topics, QoS, reliability policies, history caches, filter rules, and discovery mechanisms all increase the cost of understanding and maintaining the system.
3. The communication path is not short enough. If the data producer and consumer are on the same machine, many network abstractions, protocol semantics, and generic middleware layers can actually be simplified or bypassed entirely.
4. It is not necessarily the best fit for large shared datasets. For large data such as images, depth maps, and point clouds, the ideal in-host approach is often to share a single memory region that multiple consumers can read directly, rather than asking a general middleware stack to carry as much data-distribution semantics as possible.

Therefore, DDS is powerful, but the problem it solves is distributed real-time data distribution, not shortest-path data sharing inside a single robot host.

## 3. ZMQ: A Lightweight Message Transport Library

Compared with ROS and DDS, ZMQ (ZeroMQ) is much lighter. Essentially, it is a high-performance message transport library that provides multiple communication patterns, such as request/reply, publish/subscribe, push/pull, and dealer/router.

The advantages of ZMQ are its simple interface, easy deployment, and low barrier to getting started. In engineering practice, it is very suitable for quickly building communication prototypes between modules. For many utility programs, edge modules, gateway modules, and even some backend systems, ZMQ is a very practical choice.

The advantages of ZMQ are:

- A simple API
- No strong coupling to the robot ecosystem
- Support for multiple socket patterns
- Good for rapid development and module decoupling
- Convenient across both processes and hosts

If the target is limited to high-frequency real-time communication inside the robot host, ZMQ also has clear limitations:

1. At its core, it is still a message transport model. It is good at sending messages, but not at letting multiple consumers share one large memory region.
2. It is not ideal for large-data sharing. Large data blocks such as images, depth maps, and point clouds are better suited to zero-copy shared-memory access than to frequent message transfers.
3. It lacks data semantics oriented toward robot real-time control. It does not provide a complete data model and QoS like DDS, nor a ready-made robot ecosystem like ROS. If you want to build a complex robot data bus, many capabilities still need to be added by yourself.
4. Real-time behavior is still affected by the message-queue path. For high-frequency small control packets, it is not necessarily more direct than a shared-memory plus lock-free queue solution designed specifically for a single-machine scenario.

Therefore, ZMQ is suitable as a general engineering communication tool, but it is not naturally the right high-performance data-sharing middleware for communication inside a robot host.

## 4. The Shared Problem of These Three Types of Solutions

From the perspective of communication inside a robot host, ROS, DDS, and ZMQ have one thing in common: they all model the problem primarily as message passing.

This way of thinking is very reasonable in distributed systems, because nodes may live in different processes, on different machines, or in different network environments, so communication naturally needs unified abstractions, serialization, discovery, routing, QoS, or buffering mechanisms. But if the system runs only inside a single robot body, many things become much simpler:

- Both communicating parties run on the same machine
- Address spaces are isolated, but physical memory sharing is achievable
- No cross-network discovery is needed
- There is no need to pay extra abstraction costs for heterogeneous platforms and remote nodes
- A large amount of data is actually better suited to shared access than message sending

In this scenario, the more reasonable core goals of in-host communication are usually:

- Fewer copies
- Low latency
- Low jitter
- Fixed overhead
- High bandwidth
- Easy worst-case analysis

And these goals are usually closer to design ideas such as shared memory, lock-free queues, preallocated buffers, and fixed-topology communication.

## 5. Why We Chose to Build Robot-IPC Ourselves

Based on the analysis above, we did not directly choose ROS, DDS, or ZMQ as the final solution for communication inside the robot host. Instead, we designed a lighter communication middleware: Robot-IPC.

The design assumptions of Robot-IPC are very clear:

- It serves only inside a single robot body
- It does not take responsibility for cross-machine distributed communication
- It does not aim to provide the full capabilities of a general-purpose message middleware
- It prioritizes the performance of control paths and high-bandwidth data paths

Therefore, Robot-IPC uses shared memory as its core communication mechanism and is designed around the typical data flows inside a robot body, such as:

- High-frequency small messages: IMU, joint states, control commands
- High-bandwidth messages: images, depth maps, point clouds
- Shared access by multiple consumers: localization, navigation, control, and visualization all reading the same data

Compared with general distributed frameworks, such a design avoids unnecessary protocol layers, discovery mechanisms, and generic abstractions, shortens the data path as much as possible, and thereby achieves lower latency, higher bandwidth, and more stable in-host communication performance.


## References

- Intel ECI, Robot Operating System Software: https://eci.intel.com/docs/2.5/components/ros.html
- Twin Oaks Computing, DDS Brochure: https://www.twinoakscomputing.com/datasheets/DDS-Brochure.pdf
