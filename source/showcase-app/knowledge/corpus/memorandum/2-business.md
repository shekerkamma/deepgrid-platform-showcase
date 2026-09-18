# DeepGrid Semi — memorandum/2-business

All figures are management projections from DeepGrid's fundraising materials.

## An autonomous systems company that builds its own silicon

Deepgrid Semi sells complete, certified autonomy systems. It builds the six-chiplet die underneath them because owning the chip is the only way to ship those systems at a price the Indian market can pay. Founded and led by Aravind Prasad G (20 years, multiple exits — Evolgence IT Solutions, Deepgrid Datacentre, Evolgence Energy), with Ayaz Khan as silicon architecture lead. Incorporated in Telangana (CIN U62099TS2024PTC183631), operating from T-Hub Phase 2, Knowledge City, Hyderabad. Thirty-four people today, 541 in the FY2032 plan. Angels are domain operators, including DFT and semiconductor engineers backing the company personally. The order of markets is deliberate: commercial fleets are the mandate wedge and are live now; OEM design-in is the platform prize; defence and robotics is optionality on the same silicon that is already earning revenue. About 88% of planned revenue is systems and products ; roughly 5% is merchant silicon. Why now

## The demand is legislated, not forecast

India is putting ADAS into law for commercial vehicles function by function, each with its own standard and its own date. Read at the standards level — the version that survives diligence — the schedule is this: AEBS (AIS-162, CMVR 96(12)) binds new models 1 Jan 2027 and all models 1 Oct 2027; drowsiness, blind-spot, moving-off and lane-departure warning (AIS-184/186/187/188, CMVR 125Q and 98(6)) bind new models 1 Oct 2027 and all models 1 Jan 2028. The financial model sizes the reachable pool at ~500k new N2/N3 units a year plus a ~500k retrofit pool — 1.0M units . Four functions arriving on one clock is the commercial fact that matters. Every CV maker must source drowsiness, blind-spot, moving-off and lane-departure together, so a supplier that carries more than one of the four from a single perception core is materially easier to nominate than four separate suppliers. That, rather than any single function, is the design-in argument. Three further rules stack on top of the truck mandate. AIS-140 requires GPS and driver-behaviour monitoring on commercial fleets — the S100 chiplet carries that telematics interface natively, in every kit, at no added cost. AIS-004 puts LDWS, FCWS and LKAS on all new M-category vehicles, creating aftermarket retrofit pull for the ₹50,000 mirror. And post-2022 supply fragility has Indian OEMs actively seeking a domestic chip partner.

## ₹50,000 to ₹4 lakh, one common platform

Five configurations of the same silicon, from passive alerts to full driverless — and one upgrade path that keeps the hardware already sold. Recurring revenue sits on top of every rung: SaaS at ₹5K–₹25K per vehicle per year, Autonomous Truck DaaS at ₹2.5L/truck/yr (93% GM) , seaport AGV fleet ops at ₹45.3L/AGV/yr (92% GM) , and fleet-health SaaS through the H100 wearable at ₹8L/truck/yr. The plan has recurring revenue reaching ₹116 Cr by FY2032. The portfolio

## Six buyer routes off one bill of materials

The fifteen revenue lines reach market through genuinely different procurement motions — which is what keeps the concentration risk from being total.

## AD2 Smart Truck kit

Six cameras, two radars, LiDAR and drive-by-wire on an N2/N3 truck, certified to AIS-162/188. Fleet ROI under two years on insurance premium reduction alone.

## AD0 Smart Mirror

Replacement mirror with display, four body cameras, a loom and a 15-minute fitment. No mandate applies — it sells as an accessory through fitment shops today, and builds the channel the harder products inherit.

## AD1 Indoor autonomy

Forklifts and tugs a site already owns, retrofitted to drive themselves. Geofenced, ≤25 km/h, ±5 cm obstacle stop. No homologation inside a private site, so L4 ships years before it is legal on a road.

## Seaport AGV

The autonomous vehicle layer of container-terminal automation, sold as fleet operations rather than hardware. Electric, no fuel, 92% gross margin on the ops contract.

## D-HUMR defence

Humanoid, UGV and drone compute on the D100 secure enclave — AES-256, lockstep RISC-V, ECC SRAM. A sovereign procurement route that does not depend on the automotive mandate at all.

## T100 AI licence

The core itself, licensed to an OEM rather than sold as a part. Starts FY2029 because a licence needs a track record — the only line in the plan with no BOM whatsoever. FY2032 revenue line · ASP ₹ · Units · ₹ Cr · Sized demand pool · Road autonomy — ₹762 Cr · 67.5% · AD2 Smart Truck kit · 2,50,000 · 18,000 · 450.00 · 1.0M mandated N2/N3, new + retrofit · AD0 Smart Mirror · 50,000 · 54,000 · 270.00 · 360° surround-view, $3.09B (2025) · AD1 Indoor L4 kit · 1,00,000 · 4,200 · 42.00 · Warehouse autonomy, in $4.8B edge-AI · Silicon & compute — ₹194.3 Cr · 17.2% · Chipset OEM (ASIC die) · 18,000 · 30,000 · 54.00 · India ADAS chip, $2.29B (2024) · T100 AI licence · 1,00,00,000 · 50 · 50.00 · IP licensing, 90%+ margin · A100 compute box 4ch (PCIe) · 3,00,000 · 1,200 · 36.00 · Automotive edge-AI modules, $4.8B (2025) · A100 compute box 2ch · 1,60,000 · 1,800 · 28.80 · A100 compute box 1ch (M.2) · 85,000 · 3,000 · 25.50 · Fleet & mobility — ₹88.65 Cr · 7.9% · Autonomous TaaS · 66,00,000 · 100 · 66.00 · India trucking, 0.6–0.8M units/yr · Seaport AGV · 45,30,000 · 50 · 22.65 · Container terminals, $10.95B (2024) · Sensors & robotics — ₹83.5 Cr · 7.4% · Defence D-HUMR · 20,00,000 · 150 · 30.00 · Indian Army UGV / robotics · D100 drone SoC kit · 5,00,000 · 400 · 20.00 · India defence + commercial drone SoC · Thermal camera · 50,000 · 3,200 · 16.00 · Automotive thermal, $1.68B (2025) ·

## T100 AI licence

H100 driver-monitor wearable · 5,000 · 20,000 · 10.00 · DDAWS mandate + global DMS · 4D radar pod · 25,000 · 3,000 · 7.50 · 4D imaging radar, $2.75B (2025) · Total · — · 1,38,150 · 1,128.45 · No line exceeds 2% of its own pool · Original analysis · revenue concentration, FY2032 All fifteen lines at the same scale, sorted. The concentration the plan discloses in a sentence, drawn. The thirteen lines below the cut total ₹408.45 Cr — less than the truck kit alone. Diversification across four surfaces is real in engineering terms and thin in revenue terms, which is why the concentration flag sits first in the underwriting list. Read the capture percentages as runway rather than ceiling: most pools above are global while the near-term serviceable market is the India slice. One caveat is stated rather than hidden — the seaport pool is total port automation including cranes and software, and Deepgrid sells only the vehicle layer. The people

## A commercial founder and a standing silicon architect

R&D sits under named academic supervision: Dr. Ramesh Patel and Dr. M.V. Kartikeyan (IIT Tirupati, ANRF MAHA Drones secure-SDR consortium), Prof. C. Krishna Mohan (IIT Hyderabad, VIGIL lab — intelligent transportation and real-time edge AI), and Dr. K.T. Satyajith (IMJ Institute of Research). The company’s own note says each advisor’s formal engagement status should be confirmed before the data room opens.
