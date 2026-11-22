import { ARSAEvent, ProjectItem, TeamMember, GalleryItem } from "@/types";

export const SEED_EVENTS: ARSAEvent[] = [
  {
    id: "evt-arduino-esp32-2026",
    slug: "arduino-esp32-iot-workshop",
    title: "Arduino & ESP32 IoT Prototyping Workshop",
    tagline: "Bridge the physical and digital world with microcontrollers, sensors, and cloud telemetry.",
    category: "Workshop",
    status: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    startDate: "2026-12-18T09:30:00.000Z",
    endDate: "2026-12-19T17:00:00.000Z",
    registrationDeadline: "2026-12-16T23:59:59.000Z",
    venue: "Robotics & Automation Lab (Room 304), JSPM RSCOE, Pune",
    fee: 299,
    teamSize: { min: 1, max: 2 },
    registrationMode: "inbuilt",
    isRegistrationOpen: true,
    description: `Dive deep into embedded systems hardware! In this intensive 2-day hands-on workshop organized by ARSA, participants will construct connected IoT sensor nodes from scratch using ESP32 DevKit and Arduino C++. 

You will work with real hardware components including ultrasonic transceivers, DHT22 environmental sensors, OLED I2C displays, and relay triggers. By the end of Day 2, each participant will configure a live cloud dashboard sending MQTT telemetry with remote motor actuations.

Hardware kits (ESP32 node, breadboard, sensor kit, jumper wires) are provided for each team during the workshop sessions. Certificate of completion recognized by JSPM RSCOE Dept. of Automation & Robotics.`,
    rules: [
      "Open to all engineering students across Pune University (FE to BE).",
      "Participants must carry at least one laptop per team with Arduino IDE 2.x pre-installed.",
      "Hardware kits will be issued at the start of Day 1 against student ID cards.",
      "100% attendance across both days is mandatory for certification."
    ],
    schedule: [
      { time: "Day 1 - 09:30 AM", activity: "Inauguration & Architecture of ESP32 / Dual-Core FreeRTOS", speaker: "Prof. S. R. Kulkarni" },
      { time: "Day 1 - 11:30 AM", activity: "Hands-on Sensor Interfacing (ADC, PWM, I2C Display)", speaker: "ARSA Tech Leads" },
      { time: "Day 1 - 02:00 PM", activity: "Actuator Control, Servo & Relay Switching Circuits", speaker: "Hardware Team" },
      { time: "Day 2 - 10:00 AM", activity: "Wi-Fi, HTTP REST APIs & MQTT Protocol Primer", speaker: "Guest Industry Expert" },
      { time: "Day 2 - 01:30 PM", activity: "Mini-Hack: Build a Cloud-Connected Remote Telemetry Node", speaker: "All Mentors" },
      { time: "Day 2 - 04:30 PM", activity: "Project Evaluation, Awards & Valedictory", speaker: "HOD Automation & Robotics" }
    ],
    prizes: [
      { position: "Top Prototyping Team", reward: "₹5,000 + Custom ESP32-S3 IoT Development Boards", description: "Awarded to the best working cloud telemetry prototype." },
      { position: "Runner Up Team", reward: "₹3,000 + Sensor Component Kits", description: "Awarded for exceptional circuit design and code quality." }
    ],
    faqs: [
      { question: "Do I need prior electronics or coding knowledge?", answer: "No prerequisite knowledge is required. We start from basic GPIO pinouts and C++ syntax before proceeding to advanced cloud integrations." },
      { question: "Is the hardware kit included in the registration fee?", answer: "Hardware kits are provided for use during the workshop. Winning and top teams will receive take-home development kits." },
      { question: "Will lunch and tea be provided?", answer: "Yes, high tea and refreshment coupons are included with the registration ticket." }
    ],
    organizers: [
      { name: "Atharva Joshi", role: "Technical Head, ARSA", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" },
      { name: "Sanika Deshmukh", role: "Event Lead", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" }
    ],
    featured: true,
    totalRegistrations: 48
  },
  {
    id: "evt-ros2-gazebo-2027",
    slug: "ros2-gazebo-bootcamp",
    title: "ROS2 + Gazebo Autonomous Navigation Bootcamp",
    tagline: "Master industrial robotics simulation, SLAM navigation, and TF transforms with ROS 2 Humble.",
    category: "Workshop",
    status: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    startDate: "2027-01-22T09:00:00.000Z",
    endDate: "2027-01-24T18:00:00.000Z",
    registrationDeadline: "2027-01-20T20:00:00.000Z",
    venue: "Advanced Simulation Center (Lab 402), JSPM RSCOE",
    fee: 450,
    teamSize: { min: 1, max: 3 },
    registrationMode: "inbuilt",
    isRegistrationOpen: true,
    description: `Robot Operating System (ROS 2) is the de-facto standard powering autonomous mobile robots, automated guided vehicles (AGVs), and robotic manipulators across modern robotics industries.

ARSA presents an intensive 3-Day Autonomous Navigation Bootcamp designed for robotics enthusiasts and engineers eager to transition from microcontrollers to enterprise-grade robot software architectures. You will build differential drive robots in URDF/Xacro, spawn them inside photorealistic Gazebo physics environments, map unfamiliar rooms with Cartographer SLAM, and program autonomous point-to-point path planning using Nav2.`,
    rules: [
      "Open to all engineering undergraduates and diploma students.",
      "Prerequisite: Basic familiarity with Python and Linux terminal commands.",
      "Laptops must meet recommended specs: Ubuntu 22.04 LTS (native or dual boot) or Docker with minimum 8GB RAM.",
      "Virtual machines with GPU acceleration will be assisted by ARSA tech volunteers prior to Day 1."
    ],
    schedule: [
      { time: "Day 1 - 09:30 AM", activity: "ROS2 Nodes, Topics, Services, Custom Msg Interfaces", speaker: "Robotics Research Faculty" },
      { time: "Day 1 - 02:00 PM", activity: "TF2 Coordinates, Robot Kinematics & URDF Modeling", speaker: "Lead Simulation Engineer" },
      { time: "Day 2 - 10:00 AM", activity: "Gazebo Ignition Simulation, Sensors & LiDAR integration", speaker: "ARSA Simulation Lead" },
      { time: "Day 2 - 02:30 PM", activity: "Real-time SLAM mapping with 2D LiDAR in Simulated Warehouse", speaker: "ARSA Tech Leads" },
      { time: "Day 3 - 09:30 AM", activity: "Nav2 Costmaps, Path Planners & Obstacle Avoidance", speaker: "Autonomous Systems Researcher" },
      { time: "Day 3 - 03:00 PM", activity: "Autonomous Maze Navigation Challenge & Demo", speaker: "Evaluation Jury" }
    ],
    prizes: [
      { position: "First Place - Fastest Autonomous Navigation", reward: "₹8,000 + Jetson Nano Developer Board", description: "Completed simulated obstacle course with zero collisions and optimal path cost." },
      { position: "Second Place", reward: "₹5,000 + Lidar Sensor Module", description: "Robust mapping and navigation implementation." }
    ],
    faqs: [
      { question: "What if I do not have Ubuntu installed?", answer: "ARSA organizes a pre-bootcamp installation drive on 20th January to configure dual-boot or Docker containers." },
      { question: "Is this workshop relevant for placements?", answer: "Yes, ROS 2 and Gazebo skills are among the most sought-after competencies by autonomous robotics and AGV recruiters." }
    ],
    organizers: [
      { name: "Pranav Patil", role: "Vice President & Robotics Lead", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" },
      { name: "Ananya Shinde", role: "Software Domain Lead", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" }
    ],
    featured: true,
    totalRegistrations: 62
  },
  {
    id: "evt-line-follower-2027",
    slug: "line-follower-roborace-competition",
    title: "Line Follower & Mesh Solver RoboRace",
    tagline: "High-speed line tracing, inverted junctions, and acute hairpin bends on an arena track.",
    category: "Competition",
    status: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
    startDate: "2027-02-14T08:30:00.000Z",
    endDate: "2027-02-14T19:00:00.000Z",
    registrationDeadline: "2027-02-10T18:00:00.000Z",
    venue: "Central Amphitheatre & Indoor Sports Arena, JSPM RSCOE",
    fee: 350,
    teamSize: { min: 2, max: 4 },
    registrationMode: "inbuilt",
    isRegistrationOpen: true,
    description: `The flagship robotics speed duel of RSCOE! ARSA invites college teams from across Maharashtra to pitch their custom-built line tracking robots against a precision multi-tiered arena. 

Featuring continuous black lines on high-contrast white terrain, 90-degree acute hairpins, broken dash segments, cross-junction loops, and a final speed-trap straightaway. Can your PID algorithm maintain stability at 3 meters per second? 

Arena specs adhere to national robotics standards. Sensors may be discrete IR phototransistors or integrated array bars (QTR-8A/8RC). On-site pit stops with soldering stations and calibration tracks provided for all registered teams.`,
    rules: [
      "Maximum robot dimensions: 25cm x 25cm x 20cm (L x W x H). Maximum weight: 1.5 kg.",
      "Robots must be 100% autonomous; wireless telemetry for tuning is allowed during pits but disabled during arena trials.",
      "Maximum voltage supplied to the bot must not exceed 12.6V (3S LiPo).",
      "Each team receives two qualifying run attempts; best time counts for round advancement.",
      "Human touch penalties add 5 seconds to overall trial runtime."
    ],
    schedule: [
      { time: "08:30 AM - 10:00 AM", activity: "Team Check-in, Dimension Weigh-in & Technical Scrutiny", speaker: "Technical Stewards" },
      { time: "10:15 AM - 01:00 PM", activity: "Qualifying Stage 1 - Curved Track & Speed Trap", speaker: "Track Officials" },
      { time: "01:00 PM - 02:00 PM", activity: "Lunch Break & Pit Maintenance", speaker: "Arena Open" },
      { time: "02:00 PM - 04:30 PM", activity: "Elimination Heats - Grid Inversion & Loop Track", speaker: "Track Officials" },
      { time: "05:00 PM - 06:30 PM", activity: "The Grand Finale - Head-to-Head Double Lane Race", speaker: "Grand Jury" },
      { time: "06:45 PM", activity: "Trophy Presentation & Cash Prize Distribution", speaker: "Principal, JSPM RSCOE" }
    ],
    prizes: [
      { position: "Champion - Fastest Line Tracer", reward: "₹15,000 Cash + Rolling Gold Trophy + Goodies", description: "Fastest clean arena run with zero penal touches." },
      { position: "First Runner-Up", reward: "₹10,000 Cash + Silver Plaque", description: "Second fastest aggregate circuit score." },
      { position: "Most Innovative Chassis Design", reward: "₹3,000 + Citation Certificate", description: "Recognizing outstanding mechanical damping and custom PCB integration." }
    ],
    faqs: [
      { question: "Can a team have members from different colleges?", answer: "Yes, inter-college cross teams are warmly welcomed. Carry valid college photo IDs." },
      { question: "Will testing tracks be available prior to official trials?", answer: "Yes, two identical calibration tracks will be accessible inside the pit zone starting 8:00 AM." },
      { question: "Can we use ready-to-run kits?", answer: "Commercial fully-assembled kits will incur a handicap deduction; custom chassis and student-etched PCBs receive innovation credits." }
    ],
    organizers: [
      { name: "Rohit Gaikwad", role: "Competition Lead", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" },
      { name: "Tanuja Kadam", role: "Registrations Coordinator", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" }
    ],
    featured: true,
    totalRegistrations: 74
  },
  {
    id: "evt-hackathon-2027",
    slug: "automate-it-hackathon",
    title: "Automate-It 36hr Hardware-Software Hackathon",
    tagline: "36 continuous hours of building smart cyber-physical systems for smart cities, agritech, and industrial automation.",
    category: "Hackathon",
    status: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    startDate: "2027-03-20T08:00:00.000Z",
    endDate: "2027-03-21T20:00:00.000Z",
    registrationDeadline: "2027-03-15T23:59:59.000Z",
    venue: "Main Auditorium & Innovation Incubation Wing, JSPM RSCOE",
    fee: 600,
    teamSize: { min: 2, max: 4 },
    registrationMode: "inbuilt",
    isRegistrationOpen: true,
    description: `Welcome to Pune's premier hardware-first hackathon! Unlike typical software-only hackathons, "Automate-It" bridges firmware, digital fabrication, computer vision, and real-time analytics into tangible, working cyber-physical prototypes.

Choose from 4 high-impact themes:
1. Smart Agricultural Automation & Drone Precision Monitoring
2. Industrial Automation & Predictive Vibration Analysis
3. Assistive Robotics & Prosthetics for Healthcare
4. Smart Sustainable Campus & Zero-Waste Resource Management

Access round-the-clock 3D printers, laser cutters, oscilloscope benches, and mentor guidance from leading robotics startups. Overnight accommodation, meals, midnight refreshments, and power grids provided.`,
    rules: [
      "Teams must formulate a functional prototype containing at least one physical actuator or sensor module.",
      "Codebases and CAD models must be initiated during the hackathon. Pre-existing public libraries are permitted.",
      "All repositories must be pushed to GitHub with public licenses by 04:00 PM on Day 2.",
      "Evaluation rubrics: Innovation (25%), Technical Complexity (25%), Hardware Viability (25%), Demo & Presentation (25%)."
    ],
    schedule: [
      { time: "Day 1 - 08:00 AM", activity: "Check-in, Breakfast & Workspace Allotment", speaker: "ARSA Organizing Team" },
      { time: "Day 1 - 09:30 AM", activity: "Opening Keynote & Problem Statement Release", speaker: "CTO, Robotics Engineering Cluster" },
      { time: "Day 1 - 10:00 AM", activity: "Hacking Begins (36-Hour Clock Starts)", speaker: "All Teams" },
      { time: "Day 1 - 04:00 PM", activity: "Mentorship Round 1 - Architecture & Feasibility Review", speaker: "Industry Mentors" },
      { time: "Day 1 - 11:30 PM", activity: "Midnight Tech Jam & Rapid Prototyping Blitz", speaker: "ARSA Team" },
      { time: "Day 2 - 09:00 AM", activity: "Mentorship Round 2 - Stress Testing & Integration", speaker: "Design Reviewers" },
      { time: "Day 2 - 04:00 PM", activity: "Soft Deadline - Code & CAD Repository Freeze", speaker: "Scrutiny Team" },
      { time: "Day 2 - 05:00 PM", activity: "Final Pitch Deck & Live Hardware Demos to Grand Jury", speaker: "Jury Panel" },
      { time: "Day 2 - 07:30 PM", activity: "Grand Award Ceremony & Incubation Grants", speaker: "Management & Guests" }
    ],
    prizes: [
      { position: "Grand Winner", reward: "₹30,000 Cash + Seed Incubation Support at RSCOE TBI", description: "Highest aggregate score across hardware complexity and market feasibility." },
      { position: "First Runner-Up", reward: "₹20,000 Cash + Prototyping Hardware Kits", description: "Outstanding engineering execution and design finish." },
      { position: "Special Social Impact Award", reward: "₹10,000 Cash + Mentorship Fast-Track", description: "Best solution addressing rural Indian agricultural or healthcare problems." }
    ],
    faqs: [
      { question: "Will 3D printing services be provided on-site?", answer: "Yes, ARSA has partnered with the campus MakerSpace to provide rapid PLA filament printing for verified CAD slices." },
      { question: "Is overnight stay permitted inside the campus?", answer: "Yes, secure designated rest zones and sanitization facilities are available for both male and female participants." }
    ],
    organizers: [
      { name: "Siddhesh Mane", role: "President, ARSA", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" },
      { name: "Riya Verma", role: "Logistics Lead", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" }
    ],
    featured: true,
    totalRegistrations: 91
  },
  {
    id: "evt-vision-yolo-2027",
    slug: "robovision-yolo-workshop",
    title: "RoboVision: OpenCV & YOLO Embedded Vision Workshop",
    tagline: "Teach machines to see: real-time object tracking, depth estimation, and optical inspection.",
    category: "Workshop",
    status: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    startDate: "2027-04-10T09:30:00.000Z",
    endDate: "2027-04-11T17:30:00.000Z",
    registrationDeadline: "2027-04-08T22:00:00.000Z",
    venue: "AI & Computer Vision Research Lab (Room 210), JSPM RSCOE",
    fee: 350,
    teamSize: { min: 1, max: 2 },
    registrationMode: "inbuilt",
    isRegistrationOpen: true,
    description: `Robots without computer vision are blind! Modern autonomous systems rely heavily on cameras to interpret unstructured real-world environments.

This 2-day practical masterclass immerses students into modern vision pipelines: OpenCV image transformations, feature matching, camera calibration, bounding box detection with YOLOv8, and model quantization for edge accelerators (Raspberry Pi, Jetson). 

You will build an end-to-end vision demo: an automated industrial conveyor belt sorting system that visually identifies defective manufactured components in real time.`,
    rules: [
      "Open to all engineering branches with an interest in Computer Vision & Artificial Intelligence.",
      "Bring a laptop with webcam and Python 3.10+ installed.",
      "Pre-configured Jupyter notebooks and Google Colab GPU runtimes will be provided."
    ],
    schedule: [
      { time: "Day 1 - 09:30 AM", activity: "Image Tensors, Color Spaces, Edge Detection & Contours in OpenCV", speaker: "Dr. K. M. Bagwan" },
      { time: "Day 1 - 01:30 PM", activity: "Color Tracking & Visual Servo Control Simulation", speaker: "ARSA Vision Team" },
      { time: "Day 2 - 10:00 AM", activity: "Modern Object Detection: YOLO Architecture & Custom Dataset Annotation", speaker: "Senior AI Engineer" },
      { time: "Day 2 - 02:00 PM", activity: "Deploying YOLO Models on Edge Devices with ONNX Runtime", speaker: "ARSA Tech Leads" },
      { time: "Day 2 - 04:30 PM", activity: "Project Showcase, Q&A and Certificates", speaker: "Organizing Committee" }
    ],
    prizes: [
      { position: "Top Vision Project", reward: "₹5,000 + Edge AI Camera Module", description: "Best real-time object tracking and sorting pipeline." }
    ],
    faqs: [
      { question: "Do I need an expensive GPU laptop?", answer: "No, heavy deep learning training steps will be demonstrated using free Google Colab cloud GPUs." }
    ],
    organizers: [
      { name: "Devendra Kulkarni", role: "AI & Vision Domain Lead", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" }
    ],
    featured: false,
    totalRegistrations: 38
  },
  {
    id: "evt-roboquest-obstacle-2027",
    slug: "roboquest-obstacle-challenge",
    title: "RoboQuest: All-Terrain Obstacle Course Challenge",
    tagline: "Conquer steep inclines, gravel pits, and dynamic obstacles with rugged mobile robots.",
    category: "Competition",
    status: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=1200&q=80",
    startDate: "2027-05-08T09:00:00.000Z",
    endDate: "2027-05-08T18:00:00.000Z",
    registrationDeadline: "2027-05-05T20:00:00.000Z",
    venue: "Main Playground & Outdoor Arena, JSPM RSCOE Campus",
    fee: 400,
    teamSize: { min: 2, max: 4 },
    registrationMode: "inbuilt",
    isRegistrationOpen: true,
    description: `The ultimate endurance test for mobile robotics! "RoboQuest" tests rugged chassis design, rocker-bogie suspensions, high-torque drivetrain calculations, and driver precision.

Bots will tackle a 40-meter custom outdoor obstacle track featuring 35-degree wooden bridge inclines, loose gravel beds, simulated water puddles, swinging pendulum obstacles, and low-friction tiles. Teams can deploy wired or wireless RF controllers. May the toughest robot survive!`,
    rules: [
      "Robot weight limit: 5.0 kg maximum (excluding controller).",
      "Maximum footprint: 40cm x 40cm x 35cm.",
      "Power source must be on-board electric batteries (Lead-acid, LiPo, LiFePO4). Max operating voltage: 24V.",
      "Internal combustion engines or pneumatic weapons are strictly prohibited.",
      "Each team is allotted 7 minutes to clear all 6 course obstacles."
    ],
    schedule: [
      { time: "09:00 AM - 10:30 AM", activity: "Safety Inspection, Weight & Voltage Verification", speaker: "Arena Marshals" },
      { time: "11:00 AM - 01:30 PM", activity: "Round 1 - Sand, Incline & Gravel Trials", speaker: "Track Officials" },
      { time: "02:30 PM - 05:00 PM", activity: "Round 2 - Dynamic Obstacles & Water Hazard Gauntlet", speaker: "Track Officials" },
      { time: "05:30 PM", activity: "Podium Ceremony & Trophy Distribution", speaker: "Dean of Student Affairs" }
    ],
    prizes: [
      { position: "First Place - All Terrain King", reward: "₹18,000 + Championship Trophy", description: "Fastest run with fewest obstacle penalties." },
      { position: "Second Place", reward: "₹10,000 + Plaque", description: "Runner up score." },
      { position: "Best Suspension & Drivetrain", reward: "₹4,000 + Certificate", description: "Best mechanical innovation." }
    ],
    faqs: [
      { question: "Is wireless control mandatory?", answer: "Both wireless (2.4GHz / Bluetooth) and wired tethered controls with 5m cable are permitted." },
      { question: "Are spare batteries permitted in the pit zone?", answer: "Yes, battery charging stations will be provided in the pit garage." }
    ],
    organizers: [
      { name: "Atharva Joshi", role: "Technical Head, ARSA", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" },
      { name: "Siddhesh Mane", role: "President, ARSA", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" }
    ],
    featured: false,
    totalRegistrations: 53
  },
  {
    id: "evt-robosoccer-2027",
    slug: "robosoccer-premier-league",
    title: "RoboSoccer Premier League: 3v3 Arena Clash",
    tagline: "High-speed omni-wheel bots, pneumatic kickers, and thrilling goals in an enclosed turf arena.",
    category: "Competition",
    status: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    startDate: "2027-02-27T09:00:00.000Z",
    endDate: "2027-02-28T18:00:00.000Z",
    registrationDeadline: "2027-02-22T23:59:59.000Z",
    venue: "Central Indoor Sports Complex, JSPM RSCOE",
    fee: 499,
    teamSize: { min: 3, max: 5 },
    registrationMode: "inbuilt",
    isRegistrationOpen: true,
    description: `Prepare for high-octane vehicular football! The ARSA RoboSoccer Premier League brings together custom-fabricated wheeled robots clashing on a 6m x 4m synthetic turf pitch.
    
Teams must field 3 active bots simultaneously (1 Goalkeeper, 1 Defender, 1 Striker). Bots can leverage 3-wheel or 4-wheel omni/mecanum drivetrains for instantaneous vector movements and spring-loaded or pneumatic solenoid kickers to blast the tennis ball into the back of the net.`,
    rules: [
      "Maximum dimensions per bot: 30cm x 30cm x 30cm. Maximum weight: 3.5 kg.",
      "Wireless control via 2.4GHz RF, Bluetooth, or ESP-NOW. Frequency allocation must be declared at scrutineering.",
      "Ball capture mechanisms cannot encompass more than 20% of the ball diameter.",
      "Match duration: two 5-minute halves with a 2-minute strategic pit intermission."
    ],
    schedule: [
      { time: "Day 1 - 09:00 AM", activity: "Bot Scrutineering, Weight Check & RF Pairings", speaker: "Referees" },
      { time: "Day 1 - 10:30 AM", activity: "Group Stage League Matches (Pool A & B)", speaker: "Arena Comm" },
      { time: "Day 2 - 10:00 AM", activity: "Knockout Quarter-Finals & Semi-Finals", speaker: "Arena Comm" },
      { time: "Day 2 - 04:00 PM", activity: "Grand Championship Final & Golden Boot Award", speaker: "Chief Guest" }
    ],
    prizes: [
      { position: "Champions Cup", reward: "₹20,000 + Gold Trophy + Medals", description: "Tournament winning squad." },
      { position: "Runners Up", reward: "₹12,000 + Silver Plaque", description: "Tournament runner up." },
      { position: "Best Striker Mechanism", reward: "₹3,500 + Citation", description: "Most powerful & precise ball firing module." }
    ],
    faqs: [
      { question: "Can we use ready-made RC toy cars?", answer: "No, all participating robots must be student-fabricated with custom chassis and motor drive electronics." },
      { question: "What is the ball specification?", answer: "Standard low-bounce pressurized tennis ball (approx. 6.7cm diameter)." }
    ],
    organizers: [
      { name: "Rohit Gaikwad", role: "Event Lead", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" },
      { name: "Pranav Patil", role: "Robotics Lead", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" }
    ],
    featured: true,
    totalRegistrations: 42
  },
  {
    id: "evt-micromouse-maze-2027",
    slug: "micromouse-autonomous-maze-challenge",
    title: "Micromouse Autonomous Maze Navigation Challenge",
    tagline: "Sub-second infrared wall sensing, flood-fill graph search, and blistering acceleration to the center cell.",
    category: "Competition",
    status: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80",
    startDate: "2027-03-06T09:30:00.000Z",
    endDate: "2027-03-06T18:00:00.000Z",
    registrationDeadline: "2027-03-02T20:00:00.000Z",
    venue: "Advanced Robotics Research Lab (Room 302), JSPM RSCOE",
    fee: 300,
    teamSize: { min: 1, max: 3 },
    registrationMode: "inbuilt",
    isRegistrationOpen: true,
    description: `Micromouse is the classical pinnacle of autonomous algorithmic robotics. Small self-contained robots navigate an unknown 16x16 cell labyrinth to discover the central destination cell in the shortest possible time.

The bot explores the maze during initial mapping passes, constructs an internal representation using modified Flood-Fill or Dijkstra graph algorithms, and executes a lightning-fast diagonal speed run. Precision sensor placement, wheel-encoder odometry, and gyro compensation are essential!`,
    rules: [
      "Robot footprint: Must fit within a 16cm x 16cm square. No height restrictions.",
      "Strictly autonomous; no remote communications permitted once placed in the starting corner.",
      "The robot must not damage, mark, or climb the maze walls.",
      "Maximum allotted arena exploration time: 10 minutes (maximum 5 speed run attempts)."
    ],
    schedule: [
      { time: "09:30 AM - 10:30 AM", activity: "Registration Scrutiny & Sensor Calibration Check", speaker: "Jury" },
      { time: "10:45 AM - 01:00 PM", activity: "Round 1: Maze Exploration & Mapping Trials", speaker: "Jury" },
      { time: "02:00 PM - 04:30 PM", activity: "Round 2: Center-Cell Speed Dash Shootout", speaker: "Jury" },
      { time: "05:00 PM", activity: "Prize Distribution & Technical Debrief", speaker: "Faculty Advisor" }
    ],
    prizes: [
      { position: "First Place - Speed Demon", reward: "₹12,000 + Rolling Trophy", description: "Fastest run from corner to center cell." },
      { position: "Second Place", reward: "₹8,000 + Plaque", description: "Second fastest clean center run." },
      { position: "Best Algorithmic Efficiency", reward: "₹2,500 + Certificate", description: "Fewest exploratory cell visits." }
    ],
    faqs: [
      { question: "What are the wall dimensions?", answer: "Walls are 50mm high and 12mm thick. The path between walls is 168mm wide with white tops and red wooden sides on black baseboards." },
      { question: "Can we use optical mouse sensors for odometry?", answer: "Yes, optical ground surface sensors, TOF sensors, and IR diode arrays are all allowed." }
    ],
    organizers: [
      { name: "Atharva Joshi", role: "Technical Head, ARSA", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" },
      { name: "Siddhesh Mane", role: "President, ARSA", phone: "+91 85955 15962", email: "arsa@jspmrscoe.edu.in" }
    ],
    featured: false,
    totalRegistrations: 29
  }
];

export const SEED_PROJECTS: ProjectItem[] = [
  {
    id: "proj-arsa-rover-1",
    title: "ARSA Autonomous Planetary Rover",
    team: "ARSA Member Projects",
    description: "Multi-terrain exploratory rover featuring a 6-wheel rocker-bogie suspension system, stereo vision obstacle avoidance, and a 4-DOF robotic manipulator arm designed for university rover competitions.",
    tags: ["ROS 2", "Rocker-Bogie", "Jetson Orin Nano", "Stereo Vision", "SolidWorks"],
    imageUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=1000&q=80",
    githubUrl: "https://github.com/arsa-jspmrscoe/arsa-rover-ros2",
    demoUrl: "https://youtube.com",
    featured: true,
    year: "2026-2027"
  },
  {
    id: "proj-amr-warehouse",
    title: "Warehouse Autonomous Mobile Robot (AMR)",
    team: "ARSA Member Projects",
    description: "Industrial grade 50kg payload differential drive AMR equipped with RPLiDAR A2, wheel encoders, and Cartographer SLAM for autonomous material transit in automated manufacturing plants.",
    tags: ["SLAM", "LiDAR", "Nav2", "ESP32 Motor Driver", "Python"],
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    githubUrl: "https://github.com/arsa-jspmrscoe/warehouse-amr",
    featured: true,
    year: "2026"
  },
  {
    id: "proj-quadruped-dog",
    title: "RoboCanine: 12-DOF Quadruped Biomimetic Robot",
    team: "ARSA Member Projects",
    description: "Twelve degree-of-freedom quadruped robot with custom brushless actuator modules and inverse kinematics gait generation simulating canine trot and crawl locomotion patterns.",
    tags: ["Biomimetics", "Inverse Kinematics", "C++", "3D Printing", "Teensy 4.1"],
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80",
    githubUrl: "https://github.com/arsa-jspmrscoe/robocanine-kinematics",
    featured: true,
    year: "2026"
  },
  {
    id: "proj-agro-drone",
    title: "Precision Agritech Autonomous Quadcopter",
    team: "ARSA Member Projects",
    description: "Hexacopter aerial platform capable of multispectral crop health NDVI imaging and targeted micro-fertilizer spraying with centimeter-accurate RTK GPS navigation.",
    tags: ["Pixhawk", "ArduPilot", "RTK-GPS", "Computer Vision", "NDVI"],
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80",
    githubUrl: "https://github.com/arsa-jspmrscoe/agritech-drone",
    featured: false,
    year: "2025-2026"
  }
];

export const SEED_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Dr. Sandeep R. Kulkarni",
    role: "Head of Department & Chief Patron",
    domain: "Department of Automation & Robotics",
    year: "Faculty Mentor",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://www.linkedin.com/company/arsa-rscoe",
    order: 1
  },
  {
    id: "tm-2",
    name: "Prof. Neha S. Patil",
    role: "Faculty Coordinator, ARSA",
    domain: "Department of Automation & Robotics",
    year: "Faculty Coordinator",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://www.linkedin.com/company/arsa-rscoe",
    order: 2
  },
  {
    id: "tm-3",
    name: "Siddhesh Mane",
    role: "President",
    domain: "Executive Leadership",
    year: "BE Automation & Robotics",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://www.linkedin.com/company/arsa-rscoe",
    order: 3
  },
  {
    id: "tm-4",
    name: "Pranav Patil",
    role: "Vice President",
    domain: "Executive & Robotics Lead",
    year: "BE Automation & Robotics",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://www.linkedin.com/company/arsa-rscoe",
    order: 4
  },
  {
    id: "tm-5",
    name: "Atharva Joshi",
    role: "Technical Head",
    domain: "Embedded Systems & Hardware",
    year: "TE Automation & Robotics",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://www.linkedin.com/company/arsa-rscoe",
    githubUrl: "https://github.com",
    order: 5
  },
  {
    id: "tm-6",
    name: "Ananya Shinde",
    role: "Software & Web Head",
    domain: "Full-Stack & Robotics Middleware",
    year: "TE Automation & Robotics",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://www.linkedin.com/company/arsa-rscoe",
    githubUrl: "https://github.com",
    order: 6
  },
  {
    id: "tm-7",
    name: "Rohit Gaikwad",
    role: "Event Management Head",
    domain: "Competitions & Operations",
    year: "TE Automation & Robotics",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://www.linkedin.com/company/arsa-rscoe",
    order: 7
  },
  {
    id: "tm-8",
    name: "Sanika Deshmukh",
    role: "Public Relations & Media Head",
    domain: "Outreach & Design",
    year: "SE Automation & Robotics",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "https://www.linkedin.com/company/arsa-rscoe",
    order: 8
  }
];

export const SEED_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "National RoboRace Championship Finals",
    eventTitle: "Line Follower & Mesh Challenge 2026",
    year: "2026",
    category: "Competition",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80",
    description: "Students fine-tuning PID gains during the final high-speed arena trials."
  },
  {
    id: "gal-2",
    title: "ESP32 Embedded Hands-on Lab Session",
    eventTitle: "IoT Prototyping Workshop 2025",
    year: "2025",
    category: "Workshop",
    imageUrl: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1000&q=80",
    description: "Over 80 students assembling microcontroller circuit nodes."
  },
  {
    id: "gal-3",
    title: "ARSA Rover Arena Trials",
    eventTitle: "All-Terrain Rover Testing",
    year: "2026",
    category: "Project",
    imageUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=1000&q=80",
    description: "Testing autonomous rocker-bogie traversal over boulder gradients."
  },
  {
    id: "gal-4",
    title: "Automate-It 24hr Hackathon Midnight Pitch",
    eventTitle: "Automate-It 2026",
    year: "2026",
    category: "Hackathon",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80",
    description: "Teams assembling hardware enclosures and soldering sensor breakout boards."
  },
  {
    id: "gal-5",
    title: "Robotic Arm Kinematics Demonstration",
    eventTitle: "Industrial Robotics Seminar",
    year: "2025",
    category: "Talk",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    description: "6-axis industrial arm live pick-and-place demonstration."
  },
  {
    id: "gal-6",
    title: "ARSA Annual Core Committee Inauguration",
    eventTitle: "ARSA Induction 2026",
    year: "2026",
    category: "Ceremony",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80",
    description: "Induction ceremony of the 2026-2027 student executive council."
  },
  {
    id: "gal-7",
    title: "RoboSoccer 3v3 Arena Match",
    eventTitle: "RoboSoccer League 2026",
    year: "2026",
    category: "Competition",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    description: "High-speed omni-wheel bots competing during elimination playoffs."
  },
  {
    id: "gal-8",
    title: "Micromouse Autonomous Maze Search",
    eventTitle: "Micromouse State Challenge 2026",
    year: "2026",
    category: "Competition",
    imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1000&q=80",
    description: "Micro-bot executing high-speed diagonal flood-fill maze runs."
  }
];

export const SEED_PAST_EVENTS = [
  {
    id: "past-evt-1",
    title: "RoboBlitz 2025: State-Level Autonomous RoboRace",
    date: "March 15, 2025",
    participants: 180,
    teams: 52,
    prizesDistributed: "₹35,000",
    winnerTeam: "Team Torque (COEP Pune)",
    runnerUpTeam: "Team AlphaBot (JSPM RSCOE)",
    posterUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80",
    summary: "Over 50 teams from across 18 engineering institutes competed on a 50-meter challenging terrain track with dynamic obstacle bridges."
  },
  {
    id: "past-evt-2",
    title: "Hands-on Industrial PLC & SCADA Masterclass",
    date: "September 28-29, 2025",
    participants: 95,
    teams: 45,
    prizesDistributed: "₹15,000",
    winnerTeam: "Batch A - Automation Stars",
    runnerUpTeam: "Batch B - Sensor Masters",
    posterUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    summary: "Two days of real Siemens and Allen-Bradley PLC ladder logic training with pneumatic cylinder simulation."
  },
  {
    id: "past-evt-3",
    title: "National Drone Grand Prix & Aerial Mapping",
    date: "January 10, 2026",
    participants: 120,
    teams: 34,
    prizesDistributed: "₹25,000",
    winnerTeam: "AeroDynasty (VIT Pune)",
    runnerUpTeam: "SkyHawks (JSPM RSCOE)",
    posterUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80",
    summary: "FPV drone racing through obstacle hoops followed by photogrammetry point-cloud mapping of the campus ground."
  },
  {
    id: "past-evt-4",
    title: "RoboQuest Terrain Challenge 2024",
    date: "November 18, 2024",
    participants: 140,
    teams: 38,
    prizesDistributed: "₹30,000",
    winnerTeam: "RoverX (PCCOE Pune)",
    runnerUpTeam: "TerrainTrek (JSPM RSCOE)",
    posterUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=1000&q=80",
    summary: "Rugged rocker-bogie bots tackled stone quarries, mud pits, and steep ramps in a timed trial."
  }
];
