# Narration script — DeepGrid Semi · Product Lines, fifteen SKUs explained

Authored against `storyboard-sku-explainer.md`, not generated from slide text.
Every block advances the argument; none of them read the slide aloud.

**Arc.** A law created the demand · one 28 nm die serves all fifteen products ·
here is each one, and what it is downstream of · here is what the portfolio
does as a whole · fund the silicon.

**Register.** Informative, low pitch, unhurried. 87 blocks, ~3,600 words,
roughly 21 minutes.

---

**01 · Cover**
Fifteen products. One chip. This is the long version — every SKU in the plan, what it physically is, how it runs on shared silicon, who pays for it, and what it contributes. Everything here is a management projection prepared for fundraising.

**02 · How to read this deck**
Each product gets the same four slides, in the same order: what it is, how it works, who buys it and why now, and how it fits. Four of them get two more, because a working simulator exists and you should watch it rather than take our word. Learn the pattern once and the next eighty slides navigate themselves.

**03 · Why now**
The demand is legislated, not forecast. Driver-drowsiness, blind-spot and lane-departure obligations land on new and existing commercial vehicles on fixed dates. About a million trucks a year fall in scope. For a fleet operator the question is not whether to buy — it is whose chip is inside when they do.

**04 · The move**
The whole plan is downstream of one 28 nanometre part, and the programme is deliberately gated. Prove the compute and radar blocks first. Then the full die. Then backend sign-off. The production mask — the largest single commitment — is only paid for once working silicon exists.

**05 · The silicon**
Here is the part itself. Thirty-two thousand seven hundred and sixty-eight multiply-accumulate units at six hundred megahertz, a hundred and two gigabytes a second of memory bandwidth, hardware softmax, and lockstep cores for the automotive safety path. The number that matters most: it fuses eleven sensor channels in eight point six milliseconds of a thirty-three millisecond frame. Seventy-four percent of the frame is left unused, and that headroom is why one die becomes fifteen products.

**06 · The portfolio**
All fifteen, ranked by revenue in the final year. Prices are held flat across six years, so growth comes from volume, not from price. Note how far the list ranges — fifty thousand rupees for a mirror unit, eighteen thousand for a bare die, several lakh for a truck kit. Same silicon, priced independently by the market it sells into.

**07 · Part one — Road autonomy**
Road autonomy is two-thirds of the plan: seven hundred and sixty-two crore, three SKUs. This is where the mandate acts, and where the concentration risk sits. Take these three carefully.

**08 · AD0 · What it is**
A replacement rear-view mirror with a display built in, four small body cameras and a loom. Fifty thousand rupees, fitted in an afternoon. It is the least sophisticated thing we make and it ships first, on current-generation hardware.

**09 · AD0 · How it works**
Four cameras cover the quarters a driver cannot see. The chip stitches them into a single surround view and watches the danger zone for anything entering it. The driver gets a stitched image and a directional chime. No braking, no steering — it informs, and that is the whole product.

**10 · AD0 · Who buys it**
No mandate applies here, which is exactly the point: it already sells on its own merits. Owners and small fleets buy it as an accessory, through fitment shops and accessory catalogues, for visibility and parking. Demand does not wait for a compliance date.

**11 · AD0 · How it fits**
Two hundred and seventy crore, twenty-four percent of group revenue, at eighty-nine percent gross margin. It carries the highest unit count of anything in the portfolio and the lowest fitment complexity — so it builds the channel reach that the harder products inherit later.

**12 · AD1 · What it is**
A self-driving retrofit kit for vehicles that never leave a building: a sensor head, a compute box, and a drive-by-wire interface. One lakh rupees. Fitted to forklifts and tugs a site already owns.

**13 · AD1 · How it works**
This is the first product where the silicon closes the loop instead of advising. Cameras and depth sensing read the aisle, the load and the people in it. The chip localises against a site map it holds onboard. A planner picks a path and a speed. Then drive-by-wire actually steers, accelerates and brakes. The vehicle drives; the driver is not there.

**14 · AD1 · Who buys it**
Warehouse and industrial operators, direct or through material-handling integrators. Inside a private site no homologation applies, so this is a commercial decision, not a regulatory one — which is why level-four behaviour ships here years before it is legal on a public road.

**15 · AD1 · How it fits**
Forty-two crore, under four percent of revenue. Small in the model and large in the argument: it is the technical proof point for the road roadmap, running the same silicon in a place where it is allowed to make the decision.

**16 · AD1 · Proven in a simulator**
We built a drawable warehouse floor for this. You author the route, place workers, peer vehicles, trolleys and spills as obstacles, and run it. The alert policy is configurable — honk, voice, both, silent — because that is a site decision, not ours. And recovery is explicit: it reroutes after a set stuck-time.

**17 · AD1 · The simulator, running**
Here it is, actually running. Inbound put-away, then a pick run, then the peak-hour floor. Watch the safety ring travelling with the truck and gating its speed, and watch the sensor-fusion panel top right build the bird's-eye view. The third scenario is the one that decides whether a site can run this.

**18 · AD2 · What it is**
The Smart Truck kit — forward camera, radar, compute box, driver display and the harness that talks to the vehicle. Two and a half lakh rupees. This is the biggest single line in the plan and the one the mandate is written for.

**19 · AD2 · How it works**
Camera and radar watch the forward path and the blind quarters. The chip fuses both into one object list carrying range and closing speed. Collision, lane and blind-spot logic decide whether to warn. The driver is warned, and where the vehicle supports it, the brake interface is signalled. Radar matters here because closing speed is what a braking decision actually turns on.

**20 · AD2 · Who buys it**
Fleet operators and truck manufacturers, and the decision is compliance-led rather than discretionary. Retrofit through installers now; factory-fit is the longer, larger route. The buying question is which supplier, on what date.

**21 · AD2 · How it fits**
Four hundred and fifty crore — forty percent of group revenue from one SKU. That is the concentration to underwrite. It is also why the portfolio has a demand floor at all rather than a demand forecast.

**22 · AD2 · Proven in a simulator**
Three road profiles — market street, single-carriageway highway, and a deliberate stress test — run against the same perception stack. The vehicle model is real: five hundred and fifty kilograms, two point one metre wheelbase, tyre friction of nought point seven five. Steering angle and lateral acceleration are solved, not scripted.

**23 · AD2 · The simulator, running**
Watch the planner view in the centre. It redraws from the fused object list, not from an animation path. On the right, the perception rail names what it sees and how far away it is — a motorbike at twenty-six metres, an auto-rickshaw at thirty-eight. Three road profiles, one stack, nothing reloaded between them.

**24 · AD2 · G · Sensor coverage**
Before we leave the truck kit, look at the sensor layout it actually ships. Two towers retrofit above the existing mirrors, each with a thermal camera, a road camera and a hundred-and-twenty-degree side camera. Two cameras in the cab. Four-D radar front and rear. Watch the coverage cones sweep and overlap — the claim the layout makes is that no quarter of a heavy truck goes unobserved.

**25 · Part two — Silicon and compute**
Now the half of the business that sells the chip instead of the vehicle. A hundred and ninety-four crore across five SKUs, and the highest margins in the plan — because none of these need an installation crew.

**26 · Chipset OEM · What it is**
The bare die, in tray or reel, for a customer to place on their own board. Eighteen thousand rupees. No enclosure, no cables, no fitting — we ship silicon and a datasheet, and the customer does the rest.

**27 · Chipset OEM · How it works**
The customer's own sensors feed their own board. Our die does the perception compute inside their design. Their software decides what to do with the result, and their product ships with our silicon inside it. We supply one stage of someone else's chain.

**28 · Chipset OEM · Who buys it**
Manufacturers who want Indian-designed silicon and domestic supply rather than an imported part, and who have the engineering to integrate it. Procurement policy is often as decisive as specification here.

**29 · Chipset OEM · How it fits**
Fifty-four crore at ninety-four percent gross margin — the highest in the portfolio. Every rupee here arrives without installation capacity, warranty logistics or a fitment channel behind it.

**30 · Chipset · E · The compute**
And this is what the customer is actually buying, running. On the left, the flat eight-by-eight matrix as it works on the FPGA today: sixty-four multiply-accumulates a cycle, iterating the reduction in software. On the right, the cube on twenty-eight nanometre silicon, where that reduction becomes hardware depth and all eight layers fire at once. Watch the tile counters diverge — that gap is the eight-times figure, shown rather than claimed.

**31 · A100 one-channel · What it is**
The same die on an M.2 module: one camera channel, plus the software kit. Sized to drop into an enclosure and a sensor the customer already owns.

**32 · A100 one-channel · How it works**
One camera in, one perception stream out, over a standard module interface. It is the smallest configuration the part supports — and the point is that it is the same part, running less.

**33 · A100 one-channel · Who buys it**
Product teams who want the silicon and the toolchain but do not want to design a board around a bare die. It converts a semiconductor sale into a module sale for customers without a hardware team.

**34 · A100 one-channel · How it fits**
Twenty-five and a half crore, at eighty-nine percent margin. Modest on its own; it exists to make the silicon reachable by customers who would otherwise not buy at all.

**35 · A100 two-channel · What it is**
A board-level module with two camera inputs and the software kit. Twenty-five thousand rupees — the middle rung of the compute-box ladder, and the one that sells in the largest numbers of the three.

**36 · A100 two-channel · How it works**
Two channels is where fusion begins to matter — the moment you have to reconcile two views of the same scene into one object list. It is the first configuration that justifies purpose-built transformer hardware over a general-purpose processor.

**37 · A100 two-channel · Who buys it**
Systems that need more than a single view but not full surround coverage — reversing with side detection, a two-camera inspection rig, a small autonomous platform. Buyers who would find a four-channel card wasteful and a single channel insufficient.

**38 · A100 two-channel · How it fits**
Twenty-eight point eight crore. A step on a ladder rather than a destination — but the ladder is what lets one die address several price points at once.

**39 · A100 four-channel · What it is**
A PCIe card carrying the chip with four camera inputs, for a host system that provides the enclosure and the power. Fifty thousand rupees, and the largest configuration we sell as a component.

**40 · A100 four-channel · How it works**
Four channels demands the memory bandwidth the compute geometry was designed around. Each compute cube runs its own local memory access against a banked cache, which is what keeps utilisation high instead of starving on a single shared path. This is the configuration that shows why the die is built the way it is.

**41 · A100 four-channel · Who buys it**
Customers building full surround perception who want the compute inside their own architecture rather than in a box we supply — robotics platforms, industrial vehicles, and anyone who already has a host machine and needs to add sight to it.

**42 · A100 four-channel · How it fits**
Thirty-six crore, the largest of the three compute boxes. Together the A100 family is ninety crore of revenue that needs no vehicle, no installer and no homologation.

**43 · T100 licence · What it is**
Not hardware at all. A licence to the trained perception models and the toolchain, so a customer can run our software on their own platform. Priced per deployment, with nothing shipped in a box.

**44 · T100 licence · How it works**
The models are the accumulated result of running these sensors on Indian roads. A customer licences that, integrates it, and ships. There is no board, no bill of materials, and nothing to manufacture.

**45 · T100 licence · Who buys it**
Teams that want perception tuned for Indian road conditions — the traffic mix, the lane discipline, the light — without spending three years collecting the data to train it themselves. The dataset is the product here, not the code.

**46 · T100 licence · How it fits**
Fifty crore at ninety-four percent margin, and it starts later than everything else — in the 2029 financial year — because a licence needs a track record before anyone buys one. It is the only line in the plan with no bill of materials whatsoever.

**47 · Part three — Fleet and mobility**
Two SKUs, eighty-nine crore, and the highest revenue per unit anywhere in the portfolio. Here we stop selling a product and start selling the work the product does.

**48 · TaaS · What it is**
Not a sale. A vehicle we own and operate under contract, where the customer pays for the transport rather than the truck. The revenue per unit is the largest in the plan because we are booking the whole job.

**49 · TaaS · How it works**
The vehicle runs the same autonomy stack as the kit we sell. Fleet logic schedules it, routes it, and hands off to a remote operator when the situation exceeds what the vehicle should decide alone. The difference from AD2 is commercial, not technical.

**50 · TaaS · Who buys it**
Operators comparing cost per tonne-kilometre against a driven alternative — and increasingly comparing against driver availability rather than driver cost, because on many routes the constraint is finding a driver at all.

**51 · TaaS · How it fits**
Sixty-six crore. It is the line that shows what the technology is worth when we capture the operating margin instead of the hardware margin. It also carries operational risk the product lines do not: we own the asset and the uptime.

**52 · Seaport AGV · What it is**
An autonomous container-yard vehicle working inside a port perimeter. A controlled site, but not an easy one: heavy equipment overhead, tight lanes between stacks, and real consequences for a positioning error.

**53 · Seaport AGV · How it works**
Under a quay crane, satellite positioning degrades exactly where precision matters most. Sensor fusion on our silicon holds seven centimetres in the open and twenty-two under the crane, where satellite alone falls away. That positioning is what makes crane-synchronised dispatch possible at all.

**54 · Seaport AGV · Who buys it**
Terminal operators, measured on throughput and labour cost inside a geofenced site. No public-road homologation applies, so adoption is limited by operational confidence rather than regulation.

**55 · Seaport AGV · How it fits**
Twenty-two and a half crore. Read its market share differently from the others: the sized pool is total port automation including cranes and software, and we sell only the vehicle layer.

**56 · Seaport AGV · Proven in a simulator**
A working twin of a container terminal, built to prove the three things the programme asks for: that positioning holds where satellite fails, that routing copes with congestion, and that scheduling collapses crane idle time. It runs in shadow mode first — advising the terminal before it is given control.

**57 · Seaport AGV · The simulator, running**
Quay discharge, then the container canyon, then peak mixed traffic. Watch the two confidence bars diverge as the vehicle enters the canyon — satellite drops, fusion holds. The trial panel on the right carries the numbers: seven centimetres open, twenty-two under crane, nine percent error on arrival time.

**58 · Part four — Sensors and robotics**
Five SKUs, eighty-three and a half crore. Two purposes: sensors that make the main products work in conditions where cameras fail, and robotics platforms that put the same silicon into a second market cycle.

**59 · Thermal camera · What it is**
A bolt-on long-wave infrared pod with its own lens and heater, feeding the compute box. Forty thousand rupees. It is an accessory to the systems above it, not a standalone product.

**60 · Thermal camera · How it works**
It reads emitted heat rather than reflected light, so a person or an animal separates from the background in the dark, through glare, dust and smoke. The chip runs detection on the thermal image alongside the visible one. This is the channel that keeps working when the others stop.

**61 · Thermal camera · Who buys it**
Fleets running at night and through the monsoon, where camera-only detection degrades sharply. It is sold as an upgrade to a system already fitted, which makes it a second sale into an existing customer rather than a new acquisition.

**62 · Thermal camera · How it fits**
Sixteen crore at fifty percent gross margin — half the group average, because a sensor carries real component cost. Its job is to raise the capability of the products around it, not to carry the plan.

**63 · 4D radar · What it is**
A sealed radar pod, mounted forward or on a corner, feeding the same compute box. Twenty-five thousand rupees, and weatherproof by design because it has to work in the conditions that defeat everything else.

**64 · 4D radar · How it works**
It illuminates the scene and reads the returns, and the radar block on the die turns those returns into range, velocity and angle. Tracks are held across frames, including through rain and dust. Radar supplies closing speed — the one quantity a camera estimates and a radar measures.

**65 · 4D radar · Who buys it**
Operations where weather and dust defeat cameras — and any application where a braking decision has to be defensible afterwards, because a measured closing speed stands up where an estimated one does not.

**66 · 4D radar · How it fits**
Seven and a half crore — the smallest line in the plan. It is here because the flagship product needs it, not because it is a business on its own.

**67 · H100 wearable · What it is**
A wrist-worn band with on-body sensors and a radio link to the vehicle. Fifteen hundred rupees. It is driver monitoring without a camera pointed at the driver's face — the same obligation, answered a different way.

**68 · H100 wearable · How it works**
The band reads pulse and movement continuously, the vehicle correlates that with how the vehicle is being driven, and fatigue is flagged before it becomes a lane departure. It measures the driver directly rather than inferring from the road.

**69 · H100 wearable · Who buys it**
Fleets meeting driver-drowsiness obligations that want a lower-intrusion option than an in-cab camera. Driver acceptance is a genuine adoption factor, and a wristband clears it more easily.

**70 · H100 wearable · How it fits**
Ten crore at fifty percent margin. A hedge on how the drowsiness requirement is satisfied in practice, on a portfolio that otherwise answers it with a camera.

**71 · D-HUMR · What it is**
An unmanned ground vehicle for defence logistics and reconnaissance. It is the only line in the portfolio selling to a government customer, and the only one whose buying cycle is measured in years rather than quarters.

**72 · D-HUMR · How it works**
The same fusion stack, pointed outward instead of forward. Radar, thermal and camera tracks along a perimeter are classified individually, then correlated — so a vehicle loitering on an access road and a person approaching the fence stop being two unrelated contacts.

**73 · D-HUMR · Who buys it**
Defence procurement, for tasks where sending a vehicle is preferable to sending people. Qualification is long and the cycles are slow — but once a platform is in, it is very hard to displace.

**74 · D-HUMR · How it fits**
Thirty crore at sixty-eight percent margin. Its real value is strategic: a sovereign customer, a separate procurement route, and a use case that does not depend on the automotive mandate at all.

**75 · D-HUMR · Proven in a simulator**
A live perimeter console. It correlates a vehicle track with a human track into one threat, escalates it along a timed ladder from loiter to approach to breach risk, and hands the target to ground sensors, a patrol drone or a sea buoy. The feature that matters is the restraint: benign tracks are held and never escalated, because false-alarm rate is what gets a perimeter system switched off.

**76 · D-HUMR · The simulator, running**
Coordinated intrusion, then perimeter patrol, then a maritime approach. Watch two separate tracks fuse into one threat, and watch the escalation ladder on the right fill in — the operator sees intent forming rather than an alarm at the breach. The console states its reasoning in words.

**77 · D100 drone · What it is**
A flight-capable compute and perception kit sold to airframe builders. It is the smallest and lightest configuration of the same silicon, constrained by weight and power rather than by cost.

**78 · D100 drone · How it works**
Cameras and an inertial unit read the scene and the airframe's own motion. The chip holds position and detects obstacles onboard, so the aircraft is not dependent on a radio link to stay safe. The flight controller executes.

**79 · D100 drone · Who buys it**
Airframe builders with onboard autonomy requirements — inspection, survey, and any mission flown where the radio link cannot be relied upon. They buy compute, not aircraft, and they build the rest themselves.

**80 · D100 drone · How it fits**
Twenty crore. Treat it as optionality rather than base case: the same die, in a market with a different cycle and different buyers, entered without designing new silicon to get there.

**81 · Part five — Portfolio economics**
Fifteen products explained. Now what they do together — concentration, timing, where the autonomy actually runs, where the margin is, and how much of each market we are assuming we win.

**82 · Concentration**
Be clear about this: two SKUs carry sixty-four percent. The truck kit and the smart mirror are the same product family sold to overlapping buyers, so a certification delay or an installation bottleneck hits seven hundred and twenty crore at once — more than the other thirteen SKUs combined. That is the single largest risk in the plan.

**83 · Sequencing**
Six SKUs earn revenue in the 2027 financial year, nine more in 2028. The 2027 revenue is one point seven crore across six products, on current-generation hardware — deliberately small. The ramp switches on when production silicon reaches market, and the licence line starts later still. The shape of this plan is gated by the chip, which is what the round funds.

**84 · Where autonomy runs**
Eighty-six percent of revenue runs outdoors, where public-road rules and homologation apply. Six percent runs indoors, geofenced, where level four ships years earlier on identical silicon. Eight percent is pure compute with no vehicle exposure at all. Same chip, three very different regulatory positions.

**85 · Margin**
Volume and margin sit in different places, and that is the useful thing on this slide. Systems are eighty-three percent of revenue, so group economics track systems. But the marginal rupee is worth most in semiconductors at ninety-four percent, and those lines need no installation capacity. Growth in the silicon SKUs improves group margin without adding operational load.

**86 · Headroom**
No SKU in this plan assumes we win its market. Every line sits under two percent of its own sized demand pool, and most pools are global while our addressable market is the India slice — so the real share is higher than shown. Read the port line differently: that pool is total port automation, and we sell only the vehicle layer.

**87 · The ask**
Fifteen products, one tapeout. The demand is legislated, the margin sits in silicon that needs no installation capacity, and no line in the plan requires us to win its market. Release the capital against silicon, certification and paying customers — not against the forecast. The portfolio is not fifteen bets. It is one bet, fifteen times over.
