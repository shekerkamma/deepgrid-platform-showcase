# Narration script — DeepGrid Semi · Product Portfolio, 104 slides

Authored, not auto-generated. 87 blocks carried over unchanged from
`narration-sku-explainer-87.md`; 17 new blocks written for the sensor-to-compute and
compute-and-data-movement sections and the far-horizon slide.

**Register.** Informative, low pitch, unhurried. Numbers spelled for speech.
The deck hedges its architecture claims deliberately; the narration must not overclaim past it.

---

**001 · Cover**  _(carried · old block 01)_
Fifteen products. One chip. This is the long version — every SKU in the plan, what it physically is, how it runs on shared silicon, who pays for it, and what it contributes. Everything here is a management projection prepared for fundraising.

**002 · How to read this deck**  _(carried · old block 02)_
Each product gets the same four slides, in the same order: what it is, how it works, who buys it and why now, and how it fits. Four of them get two more, because a working simulator exists and you should watch it rather than take our word. Learn the pattern once and the next eighty slides navigate themselves.

**003 · Why now**  _(carried · old block 03)_
The demand is legislated, not forecast. Driver-drowsiness, blind-spot and lane-departure obligations land on new and existing commercial vehicles on fixed dates. About a million trucks a year fall in scope. For a fleet operator the question is not whether to buy — it is whose chip is inside when they do.

**004 · The move**  _(carried · old block 04)_
The whole plan is downstream of one 28 nanometre part, and the programme is deliberately gated. Prove the compute and radar blocks first. Then the full die. Then backend sign-off. The production mask — the largest single commitment — is only paid for once working silicon exists.

**005 · The silicon**  _(carried · old block 05)_
Here is the part itself. Thirty-two thousand seven hundred and sixty-eight multiply-accumulate units at six hundred megahertz, a hundred and two gigabytes a second of memory bandwidth, hardware softmax, and lockstep cores for the automotive safety path. The number that matters most: it fuses eleven sensor channels in eight point six milliseconds of a thirty-three millisecond frame. Seventy-four percent of the frame is left unused, and that headroom is why one die becomes fifteen products.

**006 · The portfolio**  _(carried · old block 06)_
All fifteen, ranked by revenue in the final year. Prices are held flat across six years, so growth comes from volume, not from price. Note how far the list ranges — fifty thousand rupees for a mirror unit, eighteen thousand for a bare die, several lakh for a truck kit. Same silicon, priced independently by the market it sells into.

**007 · Part one — Road autonomy**  _(carried · old block 07)_
Road autonomy is two-thirds of the plan: seven hundred and sixty-two crore, three SKUs. This is where the mandate acts, and where the concentration risk sits. Take these three carefully.

**008 · AD0 · What it is**  _(carried · old block 08)_
A replacement rear-view mirror with a display built in, four small body cameras and a loom. Fifty thousand rupees, fitted in an afternoon. It is the least sophisticated thing we make and it ships first, on current-generation hardware.

**009 · AD0 · How it works**  _(carried · old block 09)_
Four cameras cover the quarters a driver cannot see. The chip stitches them into a single surround view and watches the danger zone for anything entering it. The driver gets a stitched image and a directional chime. No braking, no steering — it informs, and that is the whole product.

**010 · AD0 · Who buys it**  _(carried · old block 10)_
No mandate applies here, which is exactly the point: it already sells on its own merits. Owners and small fleets buy it as an accessory, through fitment shops and accessory catalogues, for visibility and parking. Demand does not wait for a compliance date.

**011 · AD0 · How it fits**  _(carried · old block 11)_
Two hundred and seventy crore, twenty-four percent of group revenue, at eighty-nine percent gross margin. It carries the highest unit count of anything in the portfolio and the lowest fitment complexity — so it builds the channel reach that the harder products inherit later.

**012 · AD1 · What it is**  _(carried · old block 12)_
A self-driving retrofit kit for vehicles that never leave a building: a sensor head, a compute box, and a drive-by-wire interface. One lakh rupees. Fitted to forklifts and tugs a site already owns.

**013 · AD1 · How it works**  _(carried · old block 13)_
This is the first product where the silicon closes the loop instead of advising. Cameras and depth sensing read the aisle, the load and the people in it. The chip localises against a site map it holds onboard. A planner picks a path and a speed. Then drive-by-wire actually steers, accelerates and brakes. The vehicle drives; the driver is not there.

**014 · AD1 · Who buys it**  _(carried · old block 14)_
Warehouse and industrial operators, direct or through material-handling integrators. Inside a private site no homologation applies, so this is a commercial decision, not a regulatory one — which is why level-four behaviour ships here years before it is legal on a public road.

**015 · AD1 · How it fits**  _(carried · old block 15)_
Forty-two crore, under four percent of revenue. Small in the model and large in the argument: it is the technical proof point for the road roadmap, running the same silicon in a place where it is allowed to make the decision.

**016 · AD1 · Proven in a simulator**  _(carried · old block 16)_
We built a drawable warehouse floor for this. You author the route, place workers, peer vehicles, trolleys and spills as obstacles, and run it. The alert policy is configurable — honk, voice, both, silent — because that is a site decision, not ours. And recovery is explicit: it reroutes after a set stuck-time.

**017 · AD1 · The simulator, running**  _(carried · old block 17)_
Here it is, actually running. Inbound put-away, then a pick run, then the peak-hour floor. Watch the safety ring travelling with the truck and gating its speed, and watch the sensor-fusion panel top right build the bird's-eye view. The third scenario is the one that decides whether a site can run this.

**018 · AD2 · What it is**  _(carried · old block 18)_
The Smart Truck kit — forward camera, radar, compute box, driver display and the harness that talks to the vehicle. Two and a half lakh rupees. This is the biggest single line in the plan and the one the mandate is written for.

**019 · AD2 · How it works**  _(carried · old block 19)_
Camera and radar watch the forward path and the blind quarters. The chip fuses both into one object list carrying range and closing speed. Collision, lane and blind-spot logic decide whether to warn. The driver is warned, and where the vehicle supports it, the brake interface is signalled. Radar matters here because closing speed is what a braking decision actually turns on.

**020 · AD2 · Who buys it**  _(carried · old block 20)_
Fleet operators and truck manufacturers, and the decision is compliance-led rather than discretionary. Retrofit through installers now; factory-fit is the longer, larger route. The buying question is which supplier, on what date.

**021 · AD2 · How it fits**  _(carried · old block 21)_
Four hundred and fifty crore — forty percent of group revenue from one SKU. That is the concentration to underwrite. It is also why the portfolio has a demand floor at all rather than a demand forecast.

**022 · AD2 · Proven in a simulator**  _(carried · old block 22)_
Three road profiles — market street, single-carriageway highway, and a deliberate stress test — run against the same perception stack. The vehicle model is real: five hundred and fifty kilograms, two point one metre wheelbase, tyre friction of nought point seven five. Steering angle and lateral acceleration are solved, not scripted.

**023 · AD2 · The simulator, running**  _(carried · old block 23)_
Watch the planner view in the centre. It redraws from the fused object list, not from an animation path. On the right, the perception rail names what it sees and how far away it is — a motorbike at twenty-six metres, an auto-rickshaw at thirty-eight. Three road profiles, one stack, nothing reloaded between them.

**024 · Sensor to compute · Eleven inputs**  _(NEW)_
Before the silicon section, look at what the truck kit actually hands the compute. Seven colour cameras — road left and right, side left and right, a dashcam, a driver-monitoring camera and a rear camera. Two thermal cameras, one in each mirror tower. Radar at both ends for range and relative motion. Eleven configured inputs arriving at one in-cab processor, and one perception platform leaving it. For the fleet operator the installation is a single application, not eleven integrations.

**025 · Sensor to compute · The compute box, running**  _(NEW)_
And here it is moving. Watch the eleven channels converge on the die, and one AD2 stream leave it. The bar underneath is the frame budget: eight point six milliseconds against thirty-three point three. Treat that as an architecture illustration — the next two slides set out exactly what would have to be measured before it becomes a claim.

**026 · Sensor to compute · Each sensor's job**  _(NEW)_
The eleven are not redundancy. Each tower carries a road camera, a hundred-and-twenty-degree side camera and a thermal camera, so the same quarter is seen three ways in different physics. Radar covers both ends, where cameras are weakest in rain and glare. Inside the cab the dashcam records and the driver-monitoring camera watches the driver — different tasks on different data. What stays open is calibration, occlusion, mounting, and the final sensor list.

**027 · AD2 · G · Sensor coverage**  _(carried · old block 24)_
Before we leave the truck kit, look at the sensor layout it actually ships. Two towers retrofit above the existing mirrors, each with a thermal camera, a road camera and a hundred-and-twenty-degree side camera. Two cameras in the cab. Four-D radar front and rear. Watch the coverage cones sweep and overlap — the claim the layout makes is that no quarter of a heavy truck goes unobserved.

**028 · Sensor to compute · Define the measurement**  _(NEW)_
This is the discipline that number still needs. Thirty-three point three milliseconds is about thirty frames a second. Eight point six of them is the processing claim, which leaves roughly twenty-four point seven — but that is budget subtraction, not measured headroom. Three things have to be fixed before it is a claim: which acquisition, inference and fusion stages sit inside the measurement, the precision and sustained rate, and the worst case rather than the average.

**029 · Sensor to compute · Prove it in stages**  _(NEW)_
The proving is staged, because the stages answer different questions. An FPGA demonstration exercises the software, the interfaces and prototype compute. ASIC verification checks scaled compute, memory, clock, power and area together — none of which an FPGA can tell you. Vehicle qualification tests thermal behaviour, the safety path and real operating conditions. Confidence should track the evidence at each stage rather than run ahead of it.

**030 · Sensor to compute · The ladder, running**  _(NEW)_
That staging already has a history. Nine steps, and five of them are silicon: each rung added one block and then measured the frame rate that followed. Watch the bars fill as it climbs. SoC2 is what this raise funds — thirty-two thousand seven hundred and sixty-eight multiply-accumulates at six hundred megahertz, tapeout in the fourth quarter of twenty twenty-six. The frame rates are management figures, not third-party benchmarks.

**031 · Part two — Silicon and compute**  _(carried · old block 25)_
Now the half of the business that sells the chip instead of the vehicle. A hundred and ninety-four crore across five SKUs, and the highest margins in the plan — because none of these need an installation crew.

**032 · Chipset OEM · What it is**  _(carried · old block 26)_
The bare die, in tray or reel, for a customer to place on their own board. Eighteen thousand rupees. No enclosure, no cables, no fitting — we ship silicon and a datasheet, and the customer does the rest.

**033 · Chipset OEM · How it works**  _(carried · old block 27)_
The customer's own sensors feed their own board. Our die does the perception compute inside their design. Their software decides what to do with the result, and their product ships with our silicon inside it. We supply one stage of someone else's chain.

**034 · Chipset OEM · Who buys it**  _(carried · old block 28)_
Manufacturers who want Indian-designed silicon and domestic supply rather than an imported part, and who have the engineering to integrate it. Procurement policy is often as decisive as specification here.

**035 · Chipset OEM · How it fits**  _(carried · old block 29)_
Fifty-four crore at ninety-four percent gross margin — the highest in the portfolio. Every rupee here arrives without installation capacity, warranty logistics or a fitment channel behind it.

**036 · Compute and data · Compute waits**  _(NEW)_
Now the half of the business that sells the chip itself, and the problem that shapes it. Eight processing cores behind one dispatch point: the cores are not the constraint, the queue is. Give each core its own address generation and its own transfers and they proceed independently — though parallel requests still compete for finite service capacity. The four-hundred-and-seventy to eighty-five millisecond figure is a proposal awaiting testbench evidence, and the deck says so on the slide.

**037 · Compute and data · Shared engine, running**  _(NEW)_
Watch the two run side by side. On the left, one data engine and seven cores waiting their turn. On the right, the same silicon with an engine per core. The utilisation columns are the whole point — short and flat on the left, filled and held on the right. Illustrative dispatch, not a measured application speedup.

**038 · Compute and data · Inside one local DMA**  _(NEW)_
What actually sits inside one of those local engines. A descriptor names the transfer parameters and the data layout. A three-level address engine walks the tensor without asking a central dispatcher for every step. A read FIFO absorbs the gap between when memory serves and when compute consumes. The cost is roughly six hundred lookup tables each — about four thousand eight hundred for eight — plus arbitration logic and the firmware to drive it.

**039 · Compute and data · Placement is a choice**  _(NEW)_
Step back from our own design and the useful comparison is not who has a DMA. It is who schedules the movement, where the data sits, and what has to cross the chip. A shared engine schedules for several cores. Local controllers issue requests nearer the compute they serve, so more data stays local — and then software carries the burden of mapping and coordinating it. The outcome is decided by workload results, compiler mapping and implementation IP, not by the data mover alone.

**040 · Compute and data · The memory spectrum**  _(NEW)_
Six chips, six answers to that question. From our own shared-DMA arrangement today, through Mobileye's VLIW cores on a shared level-two cache and NVIDIA's brute-force parallelism, out to Tesla's Dojo, where every core holds private SRAM and the die carries no DRAM at all. Per-core DMA against a shared level-two cache sits in the middle, and that middle is where most of the industry already is. Vendor figures here come from public sources.

**041 · Compute and data · Eight layers**  _(NEW)_
This is where the eight-times figure comes from, stated carefully. Sixty-four multiply-accumulate positions process the reduction depth across iterations. Five hundred and twelve positions express that depth in hardware instead. Compare the same K-equals-eight tile at the same precision and the arithmetic ratio is eight. It is an idealised comparison — pipeline fill, tensor shapes, data reuse and memory delivery all still apply.

**042 · Chipset · E · The compute**  _(carried · old block 30)_
And this is what the customer is actually buying, running. On the left, the flat eight-by-eight matrix as it works on the FPGA today: sixty-four multiply-accumulates a cycle, iterating the reduction in software. On the right, the cube on twenty-eight nanometre silicon, where that reduction becomes hardware depth and all eight layers fire at once. Watch the tile counters diverge — that gap is the eight-times figure, shown rather than claimed.

**043 · Compute and data · A stronger data path**  _(NEW)_
Which is what the section has been building to. More arithmetic increases the demand for data; it does not satisfy it. Independent controllers remove one serialisation point, but memory mapping and arbitration still decide which requests complete. Compute geometry, data movement and physical implementation are one design problem, not three. Measure useful work — peak TOPS on its own says nothing about utilisation.

**044 · Compute and data · Follow one tile**  _(NEW)_
Follow a single tile end to end. External memory feeds the shared on-chip storage. Eight banks serve requests according to mapping and arbitration. Fifty-six local movers each supply their own compute cube. The figure quoted here — fifty-six times five hundred and twelve multiply-accumulates, at six hundred megahertz, times two operations — is an arithmetic peak, and the slide is explicit that it is not a benchmark.

**045 · Compute and data · A hot bank**  _(NEW)_
And here is the failure mode, with the workload held constant. Spread evenly, fifty-six requests give seven per bank. Collide them all onto bank zero and seven banks sit idle while the array stalls. Spread the addresses again and the capacity returns. What decides which of those you get is tensor layout, address hashing, arbitration and compiler scheduling — and the request counts here are a controlled illustration, not measured utilisation.

**046 · Compute and data · Freeze, then measure**  _(NEW)_
So the honest close to this section. A production advantage is demonstrated by the whole platform, never by a multiplier count. Freeze the core count, the precision, the clock and the bandwidth. Then measure sustained throughput and worst-case latency on representative tensors, with power, area, safety architecture and silicon status recorded beside them. Arithmetic peaks at six hundred megahertz are not measured application throughput, and this deck does not offer them as such.

**047 · A100 one-channel · What it is**  _(carried · old block 31)_
The same die on an M.2 module: one camera channel, plus the software kit. Sized to drop into an enclosure and a sensor the customer already owns.

**048 · A100 one-channel · How it works**  _(carried · old block 32)_
One camera in, one perception stream out, over a standard module interface. It is the smallest configuration the part supports — and the point is that it is the same part, running less.

**049 · A100 one-channel · Who buys it**  _(carried · old block 33)_
Product teams who want the silicon and the toolchain but do not want to design a board around a bare die. It converts a semiconductor sale into a module sale for customers without a hardware team.

**050 · A100 one-channel · How it fits**  _(carried · old block 34)_
Twenty-five and a half crore, at eighty-nine percent margin. Modest on its own; it exists to make the silicon reachable by customers who would otherwise not buy at all.

**051 · A100 two-channel · What it is**  _(carried · old block 35)_
A board-level module with two camera inputs and the software kit. Twenty-five thousand rupees — the middle rung of the compute-box ladder, and the one that sells in the largest numbers of the three.

**052 · A100 two-channel · How it works**  _(carried · old block 36)_
Two channels is where fusion begins to matter — the moment you have to reconcile two views of the same scene into one object list. It is the first configuration that justifies purpose-built transformer hardware over a general-purpose processor.

**053 · A100 two-channel · Who buys it**  _(carried · old block 37)_
Systems that need more than a single view but not full surround coverage — reversing with side detection, a two-camera inspection rig, a small autonomous platform. Buyers who would find a four-channel card wasteful and a single channel insufficient.

**054 · A100 two-channel · How it fits**  _(carried · old block 38)_
Twenty-eight point eight crore. A step on a ladder rather than a destination — but the ladder is what lets one die address several price points at once.

**055 · A100 four-channel · What it is**  _(carried · old block 39)_
A PCIe card carrying the chip with four camera inputs, for a host system that provides the enclosure and the power. Fifty thousand rupees, and the largest configuration we sell as a component.

**056 · A100 four-channel · How it works**  _(carried · old block 40)_
Four channels demands the memory bandwidth the compute geometry was designed around. Each compute cube runs its own local memory access against a banked cache, which is what keeps utilisation high instead of starving on a single shared path. This is the configuration that shows why the die is built the way it is.

**057 · A100 four-channel · Who buys it**  _(carried · old block 41)_
Customers building full surround perception who want the compute inside their own architecture rather than in a box we supply — robotics platforms, industrial vehicles, and anyone who already has a host machine and needs to add sight to it.

**058 · A100 four-channel · How it fits**  _(carried · old block 42)_
Thirty-six crore, the largest of the three compute boxes. Together the A100 family is ninety crore of revenue that needs no vehicle, no installer and no homologation.

**059 · T100 licence · What it is**  _(carried · old block 43)_
Not hardware at all. A licence to the trained perception models and the toolchain, so a customer can run our software on their own platform. Priced per deployment, with nothing shipped in a box.

**060 · T100 licence · How it works**  _(carried · old block 44)_
The models are the accumulated result of running these sensors on Indian roads. A customer licences that, integrates it, and ships. There is no board, no bill of materials, and nothing to manufacture.

**061 · T100 licence · Who buys it**  _(carried · old block 45)_
Teams that want perception tuned for Indian road conditions — the traffic mix, the lane discipline, the light — without spending three years collecting the data to train it themselves. The dataset is the product here, not the code.

**062 · T100 licence · How it fits**  _(carried · old block 46)_
Fifty crore at ninety-four percent margin, and it starts later than everything else — in the 2029 financial year — because a licence needs a track record before anyone buys one. It is the only line in the plan with no bill of materials whatsoever.

**063 · Part three — Fleet and mobility**  _(carried · old block 47)_
Two SKUs, eighty-nine crore, and the highest revenue per unit anywhere in the portfolio. Here we stop selling a product and start selling the work the product does.

**064 · TaaS · What it is**  _(carried · old block 48)_
Not a sale. A vehicle we own and operate under contract, where the customer pays for the transport rather than the truck. The revenue per unit is the largest in the plan because we are booking the whole job.

**065 · TaaS · How it works**  _(carried · old block 49)_
The vehicle runs the same autonomy stack as the kit we sell. Fleet logic schedules it, routes it, and hands off to a remote operator when the situation exceeds what the vehicle should decide alone. The difference from AD2 is commercial, not technical.

**066 · TaaS · Who buys it**  _(carried · old block 50)_
Operators comparing cost per tonne-kilometre against a driven alternative — and increasingly comparing against driver availability rather than driver cost, because on many routes the constraint is finding a driver at all.

**067 · TaaS · How it fits**  _(carried · old block 51)_
Sixty-six crore. It is the line that shows what the technology is worth when we capture the operating margin instead of the hardware margin. It also carries operational risk the product lines do not: we own the asset and the uptime.

**068 · Seaport AGV · What it is**  _(carried · old block 52)_
An autonomous container-yard vehicle working inside a port perimeter. A controlled site, but not an easy one: heavy equipment overhead, tight lanes between stacks, and real consequences for a positioning error.

**069 · Seaport AGV · How it works**  _(carried · old block 53)_
Under a quay crane, satellite positioning degrades exactly where precision matters most. Sensor fusion on our silicon holds seven centimetres in the open and twenty-two under the crane, where satellite alone falls away. That positioning is what makes crane-synchronised dispatch possible at all.

**070 · Seaport AGV · Who buys it**  _(carried · old block 54)_
Terminal operators, measured on throughput and labour cost inside a geofenced site. No public-road homologation applies, so adoption is limited by operational confidence rather than regulation.

**071 · Seaport AGV · How it fits**  _(carried · old block 55)_
Twenty-two and a half crore. Read its market share differently from the others: the sized pool is total port automation including cranes and software, and we sell only the vehicle layer.

**072 · Seaport AGV · Proven in a simulator**  _(carried · old block 56)_
A working twin of a container terminal, built to prove the three things the programme asks for: that positioning holds where satellite fails, that routing copes with congestion, and that scheduling collapses crane idle time. It runs in shadow mode first — advising the terminal before it is given control.

**073 · Seaport AGV · The simulator, running**  _(carried · old block 57)_
Quay discharge, then the container canyon, then peak mixed traffic. Watch the two confidence bars diverge as the vehicle enters the canyon — satellite drops, fusion holds. The trial panel on the right carries the numbers: seven centimetres open, twenty-two under crane, nine percent error on arrival time.

**074 · Part four — Sensors and robotics**  _(carried · old block 58)_
Five SKUs, eighty-three and a half crore. Two purposes: sensors that make the main products work in conditions where cameras fail, and robotics platforms that put the same silicon into a second market cycle.

**075 · Thermal camera · What it is**  _(carried · old block 59)_
A bolt-on long-wave infrared pod with its own lens and heater, feeding the compute box. Forty thousand rupees. It is an accessory to the systems above it, not a standalone product.

**076 · Thermal camera · How it works**  _(carried · old block 60)_
It reads emitted heat rather than reflected light, so a person or an animal separates from the background in the dark, through glare, dust and smoke. The chip runs detection on the thermal image alongside the visible one. This is the channel that keeps working when the others stop.

**077 · Thermal camera · Who buys it**  _(carried · old block 61)_
Fleets running at night and through the monsoon, where camera-only detection degrades sharply. It is sold as an upgrade to a system already fitted, which makes it a second sale into an existing customer rather than a new acquisition.

**078 · Thermal camera · How it fits**  _(carried · old block 62)_
Sixteen crore at fifty percent gross margin — half the group average, because a sensor carries real component cost. Its job is to raise the capability of the products around it, not to carry the plan.

**079 · 4D radar · What it is**  _(carried · old block 63)_
A sealed radar pod, mounted forward or on a corner, feeding the same compute box. Twenty-five thousand rupees, and weatherproof by design because it has to work in the conditions that defeat everything else.

**080 · 4D radar · How it works**  _(carried · old block 64)_
It illuminates the scene and reads the returns, and the radar block on the die turns those returns into range, velocity and angle. Tracks are held across frames, including through rain and dust. Radar supplies closing speed — the one quantity a camera estimates and a radar measures.

**081 · 4D radar · Who buys it**  _(carried · old block 65)_
Operations where weather and dust defeat cameras — and any application where a braking decision has to be defensible afterwards, because a measured closing speed stands up where an estimated one does not.

**082 · 4D radar · How it fits**  _(carried · old block 66)_
Seven and a half crore — the smallest line in the plan. It is here because the flagship product needs it, not because it is a business on its own.

**083 · H100 wearable · What it is**  _(carried · old block 67)_
A wrist-worn band with on-body sensors and a radio link to the vehicle. Fifteen hundred rupees. It is driver monitoring without a camera pointed at the driver's face — the same obligation, answered a different way.

**084 · H100 wearable · How it works**  _(carried · old block 68)_
The band reads pulse and movement continuously, the vehicle correlates that with how the vehicle is being driven, and fatigue is flagged before it becomes a lane departure. It measures the driver directly rather than inferring from the road.

**085 · H100 wearable · Who buys it**  _(carried · old block 69)_
Fleets meeting driver-drowsiness obligations that want a lower-intrusion option than an in-cab camera. Driver acceptance is a genuine adoption factor, and a wristband clears it more easily.

**086 · H100 wearable · How it fits**  _(carried · old block 70)_
Ten crore at fifty percent margin. A hedge on how the drowsiness requirement is satisfied in practice, on a portfolio that otherwise answers it with a camera.

**087 · D-HUMR · What it is**  _(carried · old block 71)_
An unmanned ground vehicle for defence logistics and reconnaissance. It is the only line in the portfolio selling to a government customer, and the only one whose buying cycle is measured in years rather than quarters.

**088 · D-HUMR · How it works**  _(carried · old block 72)_
The same fusion stack, pointed outward instead of forward. Radar, thermal and camera tracks along a perimeter are classified individually, then correlated — so a vehicle loitering on an access road and a person approaching the fence stop being two unrelated contacts.

**089 · D-HUMR · Who buys it**  _(carried · old block 73)_
Defence procurement, for tasks where sending a vehicle is preferable to sending people. Qualification is long and the cycles are slow — but once a platform is in, it is very hard to displace.

**090 · D-HUMR · How it fits**  _(carried · old block 74)_
Thirty crore at sixty-eight percent margin. Its real value is strategic: a sovereign customer, a separate procurement route, and a use case that does not depend on the automotive mandate at all.

**091 · D-HUMR · Proven in a simulator**  _(carried · old block 75)_
A live perimeter console. It correlates a vehicle track with a human track into one threat, escalates it along a timed ladder from loiter to approach to breach risk, and hands the target to ground sensors, a patrol drone or a sea buoy. The feature that matters is the restraint: benign tracks are held and never escalated, because false-alarm rate is what gets a perimeter system switched off.

**092 · D-HUMR · The simulator, running**  _(carried · old block 76)_
Coordinated intrusion, then perimeter patrol, then a maritime approach. Watch two separate tracks fuse into one threat, and watch the escalation ladder on the right fill in — the operator sees intent forming rather than an alarm at the breach. The console states its reasoning in words.

**093 · D100 drone · What it is**  _(carried · old block 77)_
A flight-capable compute and perception kit sold to airframe builders. It is the smallest and lightest configuration of the same silicon, constrained by weight and power rather than by cost.

**094 · D100 drone · How it works**  _(carried · old block 78)_
Cameras and an inertial unit read the scene and the airframe's own motion. The chip holds position and detects obstacles onboard, so the aircraft is not dependent on a radio link to stay safe. The flight controller executes.

**095 · D100 drone · Who buys it**  _(carried · old block 79)_
Airframe builders with onboard autonomy requirements — inspection, survey, and any mission flown where the radio link cannot be relied upon. They buy compute, not aircraft, and they build the rest themselves.

**096 · D100 drone · How it fits**  _(carried · old block 80)_
Twenty crore. Treat it as optionality rather than base case: the same die, in a market with a different cycle and different buyers, entered without designing new silicon to get there.

**097 · Part five — Portfolio economics**  _(carried · old block 81)_
Fifteen products explained. Now what they do together — concentration, timing, where the autonomy actually runs, where the margin is, and how much of each market we are assuming we win.

**098 · Concentration**  _(carried · old block 82)_
Be clear about this: two SKUs carry sixty-four percent. The truck kit and the smart mirror are the same product family sold to overlapping buyers, so a certification delay or an installation bottleneck hits seven hundred and twenty crore at once — more than the other thirteen SKUs combined. That is the single largest risk in the plan.

**099 · Sequencing**  _(carried · old block 83)_
Six SKUs earn revenue in the 2027 financial year, nine more in 2028. The 2027 revenue is one point seven crore across six products, on current-generation hardware — deliberately small. The ramp switches on when production silicon reaches market, and the licence line starts later still. The shape of this plan is gated by the chip, which is what the round funds.

**100 · Where autonomy runs**  _(carried · old block 84)_
Eighty-six percent of revenue runs outdoors, where public-road rules and homologation apply. Six percent runs indoors, geofenced, where level four ships years earlier on identical silicon. Eight percent is pure compute with no vehicle exposure at all. Same chip, three very different regulatory positions.

**101 · Margin**  _(carried · old block 85)_
Volume and margin sit in different places, and that is the useful thing on this slide. Systems are eighty-three percent of revenue, so group economics track systems. But the marginal rupee is worth most in semiconductors at ninety-four percent, and those lines need no installation capacity. Growth in the silicon SKUs improves group margin without adding operational load.

**102 · Headroom**  _(carried · old block 86)_
No SKU in this plan assumes we win its market. Every line sits under two percent of its own sized demand pool, and most pools are global while our addressable market is the India slice — so the real share is higher than shown. Read the port line differently: that pool is total port automation, and we sell only the vehicle layer.

**103 · Far horizon · SoC4-A**  _(NEW)_
One more part, and deliberately not the one this raise funds. SoC4-A is the far horizon: one thousand and twenty-four tiles on a four-nanometre process, four petaflops at FP4, assembled from published, silicon-proven blocks from the open PULP platform. It is optionality that sits outside this plan. SoC2 is the business; this is the option the business buys you.

**104 · The ask**  _(carried · old block 87)_
Fifteen products, one tapeout. The demand is legislated, the margin sits in silicon that needs no installation capacity, and no line in the plan requires us to win its market. Release the capital against silicon, certification and paying customers — not against the forecast. The portfolio is not fifteen bets. It is one bet, fifteen times over.
