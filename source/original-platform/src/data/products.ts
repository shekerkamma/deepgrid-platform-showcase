export interface Product {
  id: string;
  name: string;
  slideTitle: string;
  price: string;
  description: string;
  signalChain: string[];
  revenue: string;
  revenueNum: number;
  margin: string;
  share: string;
  firstRevenue: string;
  units: string;
  category: 'Road Autonomy' | 'Silicon & Compute' | 'Fleet & Mobility' | 'Sensors & Robotics';
  segment: string;
  domain: string;
  role: string;
  dependsOn: string;
  slideNum: number;
  hasSimulator?: boolean;
  simulatorId?: string;
}

export const products: Product[] = [
  {
    id: 'ad2',
    name: 'Smart Truck (AD2 kit)',
    slideTitle: 'AD2 SMART TRUCK',
    price: '₹2,50,000',
    description: 'Forward camera, radar, compute box, driver display and the harness that talks to the vehicle. The biggest single line in the plan and the one the mandate is written for.',
    signalChain: [
      'Camera and radar watch the forward path and the blind quarters',
      'SoC2 fuses both into one object list carrying range and closing speed',
      'Collision, lane and blind-spot logic decides whether to warn',
      'Driver is warned; where vehicle supports it, brake interface is signalled'
    ],
    revenue: '₹450 Cr', revenueNum: 450, margin: '89%', share: '39.9%',
    firstRevenue: 'FY2027', units: '18,000 @ FY32',
    category: 'Road Autonomy', segment: 'Systems', domain: 'Outdoor',
    role: 'Forty percent of group revenue from one SKU. That is the concentration to underwrite — also why the portfolio has a demand floor rather than a forecast.',
    dependsOn: 'AIS-mandate compliance, installation channel capacity, and radar verification milestones.',
    slideNum: 18,
    hasSimulator: true, simulatorId: 'adas',
  },
  {
    id: 'ad0',
    name: 'AD0 Smart Mirror',
    slideTitle: 'AD0 SMART MIRROR',
    price: '₹50,000',
    description: 'A replacement rear-view mirror with an integrated display, four body cameras and a wiring loom. Fitted in an afternoon — the least sophisticated thing we make, and it ships first.',
    signalChain: [
      'Four cameras cover the vehicle\'s blind quarters',
      'SoC2 stitches the views into one 360° surround image',
      'Proximity and motion logic flags anything entering the danger zone',
      'Driver sees the stitched view and hears a directional alert'
    ],
    revenue: '₹270 Cr', revenueNum: 270, margin: '89%', share: '23.9%',
    firstRevenue: 'FY2027', units: '54,000 @ FY32',
    category: 'Road Autonomy', segment: 'Systems', domain: 'Outdoor',
    role: 'Volume ramp of the portfolio: highest unit count and lowest fitment complexity — scales channel reach that harder products inherit.',
    dependsOn: 'Distribution reach and price holding at ₹50k. Runs on current-generation hardware — not gated on the ASIC.',
    slideNum: 8,
  },
  {
    id: 'taas',
    name: 'Autonomous TaaS',
    slideTitle: 'AUTONOMOUS TAAS',
    price: '₹66.00 L',
    description: 'Transport-as-a-Service: contracted autonomous operations — DeepGrid provides the vehicle, stack and driver replacement as a metered service.',
    signalChain: [
      'Route plan set by fleet management system',
      'SoC2 handles full perception and planning stack',
      'Vehicle drives autonomously within geofenced route',
      'Fleet dashboard monitors all units in real time'
    ],
    revenue: '₹66 Cr', revenueNum: 66, margin: '89%', share: '5.8%',
    firstRevenue: 'FY2028', units: '100 @ FY32',
    category: 'Fleet & Mobility', segment: 'Services', domain: 'Outdoor',
    role: 'Highest revenue per unit we sell. Proof that the same silicon running in a kit can run an entire operation.',
    dependsOn: 'Regulatory clearance for autonomous operation in controlled corridors.',
    slideNum: 42,
  },
  {
    id: 'chipset',
    name: 'Chipset OEM B2B',
    slideTitle: 'CHIPSET OEM',
    price: '₹18,000',
    description: 'The bare die, in tray or reel, for a customer to place on their own board. No enclosure, no cables, no fitting — silicon and a datasheet.',
    signalChain: [
      'Customer\'s own sensors feed their own board',
      'Our die does the perception compute inside their design',
      'Their software decides what to do with the result',
      'Their product ships with our silicon inside it'
    ],
    revenue: '₹54 Cr', revenueNum: 54, margin: '94%', share: '4.8%',
    firstRevenue: 'FY2028', units: '30,000 @ FY32',
    category: 'Silicon & Compute', segment: 'Components', domain: 'Any',
    role: 'Fifty-four crore at ninety-four percent gross margin — the highest in the portfolio. Every rupee arrives without installation capacity or warranty logistics.',
    dependsOn: 'ASIC tapeout completion and qualification.',
    slideNum: 26,
  },
  {
    id: 't100',
    name: 'T100 AI Licence',
    slideTitle: 'T100 SOFTWARE LICENCE',
    price: '₹100.00 L',
    description: 'Indian road perception models, toolchain and continuous model updates licensed to third-party compute platforms.',
    signalChain: [
      'Customer integrates perception SDK on their hardware',
      'Models trained on Indian road conditions run inference',
      'Continuous model updates delivered via licence subscription',
      'Customer product ships with DeepGrid perception layer'
    ],
    revenue: '₹50 Cr', revenueNum: 50, margin: '94%', share: '4.4%',
    firstRevenue: 'FY2029', units: '50 @ FY32',
    category: 'Silicon & Compute', segment: 'Software', domain: 'Any',
    role: 'Pure software revenue at 94% margin. Converts the IP investment in Indian road models into a recurring stream independent of hardware.',
    dependsOn: 'Maturity of the Indian road perception stack — starts FY29.',
    slideNum: 36,
  },
  {
    id: 'ad1',
    name: 'AD1 Indoor L4 Kit',
    slideTitle: 'AD1 INDOOR L4 KIT',
    price: '₹1,00,000',
    description: 'Self-driving retrofit kit for indoor vehicles: sensor head, compute box and drive-by-wire interface. Fitted to forklifts and tugs a site already owns.',
    signalChain: [
      'Cameras and depth sensing read the aisle, load and people',
      'SoC2 localises the vehicle against a site map it holds onboard',
      'Planner picks a path and a speed for the geofenced route',
      'Drive-by-wire interface issues steer, throttle and brake'
    ],
    revenue: '₹42 Cr', revenueNum: 42, margin: '89%', share: '3.7%',
    firstRevenue: 'FY2028', units: '4,200 @ FY32',
    category: 'Road Autonomy', segment: 'Systems', domain: 'Indoor',
    role: 'Where L4 behaviour ships years before it is legal on a public road — the technical proof point for the road roadmap.',
    dependsOn: 'Site mapping and commissioning throughput — services capacity rather than product.',
    slideNum: 12,
    hasSimulator: true, simulatorId: 'forklift',
  },
  {
    id: 'a100-4',
    name: 'A100 Compute Box 4ch PCIe',
    slideTitle: 'A100 4-CHANNEL',
    price: '₹3,00,000',
    description: 'Four-channel PCIe compute card for multi-camera deployments — industrial inspection, security and infrastructure monitoring.',
    signalChain: [
      'Up to four camera feeds enter via PCIe interface',
      'SoC2 runs parallel perception on all four channels',
      'Object lists and alerts output to host system',
      'Customer software consumes structured perception data'
    ],
    revenue: '₹36 Cr', revenueNum: 36, margin: '89%', share: '3.2%',
    firstRevenue: 'FY2028', units: '1,200 @ FY32',
    category: 'Silicon & Compute', segment: 'Modules', domain: 'Any',
    role: 'The highest-capacity compute form factor — serves customers who need multi-camera perception without building their own board.',
    dependsOn: 'ASIC tapeout and PCIe interface validation.',
    slideNum: 34,
  },
  {
    id: 'dhumr',
    name: 'Defence D-HUMR',
    slideTitle: 'DEFENCE D-HUMR',
    price: '₹20,00,000',
    description: 'Defence-grade unmanned ground reconnaissance platform. Hardened compute, encrypted comms and ruggedised sensor suite.',
    signalChain: [
      'Ruggedised camera and thermal sensors scan terrain',
      'SoC2 runs perception with military-grade encryption',
      'Autonomous navigation in GPS-denied environments',
      'Secure data relay to command post'
    ],
    revenue: '₹30 Cr', revenueNum: 30, margin: '68%', share: '2.7%',
    firstRevenue: 'FY2027', units: '150 @ FY32',
    category: 'Sensors & Robotics', segment: 'Systems', domain: 'Outdoor',
    role: 'Highest price point in the portfolio — opens defence procurement channel and validates ruggedised silicon.',
    dependsOn: 'Defence procurement cycle and security clearances.',
    slideNum: 56,
    hasSimulator: true, simulatorId: 'sentinel',
  },
  {
    id: 'a100-2',
    name: 'A100 Compute Box 2ch',
    slideTitle: 'A100 2-CHANNEL',
    price: '₹1,60,000',
    description: 'Dual-channel compute board for stereo vision and dual-camera applications.',
    signalChain: ['Two camera inputs', 'Dual-stream perception', 'Fused output', 'Host integration'],
    revenue: '₹28.8 Cr', revenueNum: 28.8, margin: '89%', share: '2.5%',
    firstRevenue: 'FY2028', units: '1,800 @ FY32',
    category: 'Silicon & Compute', segment: 'Modules', domain: 'Any',
    role: 'Mid-tier compute module serving stereo vision applications.',
    dependsOn: 'ASIC tapeout.',
    slideNum: 32,
  },
  {
    id: 'a100-1',
    name: 'A100 Compute Box 1ch M.2',
    slideTitle: 'A100 1-CHANNEL',
    price: '₹85,000',
    description: 'Single-channel M.2 module — the smallest configuration the part supports. Same die, running less.',
    signalChain: ['One camera in', 'One perception stream out', 'Standard M.2 interface', 'Drop-in to existing enclosure'],
    revenue: '₹25.5 Cr', revenueNum: 25.5, margin: '89%', share: '2.3%',
    firstRevenue: 'FY2028', units: '3,000 @ FY32',
    category: 'Silicon & Compute', segment: 'Modules', domain: 'Any',
    role: 'Entry-level compute module — lowest-cost path to adding DeepGrid perception to an existing product.',
    dependsOn: 'ASIC tapeout.',
    slideNum: 31,
  },
  {
    id: 'agv',
    name: 'Seaport AGV',
    slideTitle: 'SEAPORT AGV',
    price: '₹45,30,000',
    description: 'Autonomous container yard vehicle — 7cm open positioning, 22cm under crane. Moves containers between quay crane and yard block.',
    signalChain: [
      'GPS-RTK and vision provide centimetre-level localisation',
      'SoC2 plans path through dynamic yard traffic',
      'Autonomous steer/throttle/brake in open and under-crane zones',
      'Yard management system dispatches and monitors fleet'
    ],
    revenue: '₹22.6 Cr', revenueNum: 22.6, margin: '89%', share: '2.0%',
    firstRevenue: 'FY2028', units: '50 @ FY32',
    category: 'Fleet & Mobility', segment: 'Systems', domain: 'Outdoor',
    role: 'Second-highest revenue per unit after TaaS — validates the silicon in port infrastructure.',
    dependsOn: 'Port authority partnerships and certification.',
    slideNum: 46,
    hasSimulator: true, simulatorId: 'yard',
  },
  {
    id: 'd100',
    name: 'D100 Drone SoC Kit',
    slideTitle: 'D100 DRONE SOC',
    price: '₹5,00,000',
    description: 'Aerial inspection and surveillance compute kit — same SoC2 in a drone-optimised form factor.',
    signalChain: ['Gimbal camera + thermal sensor', 'SoC2 runs airborne perception', 'Object detection and tracking', 'Telemetry relay to ground station'],
    revenue: '₹20 Cr', revenueNum: 20, margin: '68%', share: '1.8%',
    firstRevenue: 'FY2028', units: '400 @ FY32',
    category: 'Sensors & Robotics', segment: 'Modules', domain: 'Aerial',
    role: 'Opens aerial perception as a silicon market — same die, different firmware.',
    dependsOn: 'Drone regulation and form-factor development.',
    slideNum: 58,
  },
  {
    id: 'thermal',
    name: 'Thermal Camera Pod',
    slideTitle: 'THERMAL CAMERA',
    price: '₹50,000',
    description: 'LWIR thermal camera sensor module for night and monsoon conditions — the perception layer that cameras alone cannot provide.',
    signalChain: ['LWIR sensor captures thermal scene', 'SoC2 fuses thermal with visible camera', 'Enhanced detection in low/no visibility', 'Alert output to vehicle safety system'],
    revenue: '₹16 Cr', revenueNum: 16, margin: '50%', share: '1.4%',
    firstRevenue: 'FY2027', units: '3,200 @ FY32',
    category: 'Sensors & Robotics', segment: 'Components', domain: 'Outdoor',
    role: 'The perception layer that enables night and monsoon operation — differentiator for the Smart Truck kit.',
    dependsOn: 'LWIR sensor sourcing and calibration pipeline.',
    slideNum: 60,
  },
  {
    id: 'h100',
    name: 'H100 Driver Monitor',
    slideTitle: 'H100 DRIVER MONITOR',
    price: '₹5,000',
    description: 'In-cabin driver monitoring unit — drowsiness, distraction and seatbelt detection. Mandate-listed safety function.',
    signalChain: ['IR camera watches driver face', 'SoC2 runs drowsiness/distraction model', 'Alert escalation chain triggered', 'Event log for fleet compliance'],
    revenue: '₹10 Cr', revenueNum: 10, margin: '50%', share: '0.9%',
    firstRevenue: 'FY2027', units: '20,000 @ FY32',
    category: 'Sensors & Robotics', segment: 'Components', domain: 'Indoor',
    role: 'Highest volume sensor SKU — mandate requires it in every commercial vehicle.',
    dependsOn: 'Mandate enforcement timeline.',
    slideNum: 62,
  },
  {
    id: 'radar',
    name: '4D Radar Pod',
    slideTitle: '4D RADAR POD',
    price: '₹25,000',
    description: '4D imaging radar module providing range, velocity, azimuth and elevation — the sensor that camera-only ADAS cannot replace.',
    signalChain: ['4D radar scans forward scene', 'Range + velocity + angle data output', 'SoC2 fuses radar with camera object list', 'Closing-speed data enables braking decisions'],
    revenue: '₹7.5 Cr', revenueNum: 7.5, margin: '50%', share: '0.7%',
    firstRevenue: 'FY2027', units: '3,000 @ FY32',
    category: 'Sensors & Robotics', segment: 'Components', domain: 'Outdoor',
    role: 'Radar matters because closing speed is what a braking decision actually turns on — camera alone cannot measure it.',
    dependsOn: 'Radar block verification on the ASIC.',
    slideNum: 64,
  },
];
