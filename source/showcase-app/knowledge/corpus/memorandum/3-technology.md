# DeepGrid Semi — memorandum/3-technology

All figures are management projections from DeepGrid's fundraising materials.

## Six chiplets, one 57 mm² die, six independent revenue lines

This is the asset the round buys. Each chiplet is a separate business, and replicating the set would take six tapeouts. 32,768 MACs at 600 MHz gives a derived 39.3 TOPS INT8 — architecture arithmetic, not a silicon measurement — with 102.4 GB/s of LPDDR5 bandwidth. The headroom is the product strategy: a drone stack, a wearable, a port AGV and a licensable core all fit inside the frame the truck kit leaves empty. PrimeSoC returned FEASIBLE on the architecture in March 2026. Two claims underneath that are worth separating from the TOPS number, because they are the ones competitors cannot patch around. Batch-dispatch firmware (Patent 1) decouples inference from RISC-V host supervision, keeping the ALU active far longer per cycle — the company’s answer to why headline TOPS on competing parts does not translate into delivered frames. And the R100’s 12-bit native radar ADC preserves dynamic range that every competitor re-quantises to INT16, which is what buys detection sensitivity in monsoon and fog. What it sees

## Two retrofit mirror towers, and no blind spot left on the vehicle

The physical product is a pair of replacement mirror towers plus in-cab cameras and front/rear 77 GHz radar. It installs in 15–35 minutes, needs no separate sensor sourcing, and the same mirror is reused at every rung of the upgrade ladder — which is where the customer-retention argument comes from: switching away means losing the India-trained model. Proof of execution

## Concept through validated silicon — what is already done

Revenue Institutional defence revenue earned on FPGA hardware before ASIC exists. The memorandum states ₹1 Cr; the company’s own claim controls substantiate ₹23.01L delivered with ₹78.39L at L1 stage rather than awarded — and in a separate legal entity. Use the delivered figure (see Underwriting). Measured YOLOv11n at 40 fps on an Artix-7 200T — 3.97M parameters, 263 layers, 80 classes, 24.8 ms latency, at full L2+ ADAS spec. Not simulated. Silicon Six RTL designs tapeout-ready and a prior 130 nm tapeout completed at SkyWater. R100 radar RTL replaces the TI AWR2243 DSP entirely. IP 15 provisional patents filed March 2026 (IN2026/DGR/001–015), covering batch-dispatch firmware, 12-bit native radar and the health processor. Foundry Muse/GSME MPW contracted — ~$630K shuttle, 79-day fab cycle, 96.7% predicted yield. PrimeSoC feasibility reports and the RTL→GDS physical design plan are filed. Supply chain Manufacturing partners engaged and contracted — EmbeddedIoT (Hyderabad) for PCBA and QFN-128 packaging, Sulakshna for 6-layer automotive PCBs. Far horizon

## The option the business buys you, deliberately not funded by this round

SoC4-A is the next-generation part: 1,024 tiles on a finer node, packaged four to a 4U liquid-cooled chassis for 16.76 PFLOPS FP4 peak and ~12 PFLOPS sustained at 1,120 W, with 256 GB of LPDDR5X. The pitch is sovereign AI inference — on-premise compute for Indian and GCC government, telecom and BFSI buyers whose data cannot leave the jurisdiction — plus robotaxi fleet compute and telecom edge. Two reasons it belongs in an investor summary and not in the plan. It is funded from operating profit , not from this round — the model already carries a SoC4 5 nm tapeout programme as an expense line growing to ₹169 Cr by FY2032. And it is the clearest statement of what the company thinks it is: not an ADAS supplier that happens to own a die, but a design team that can aim the same architecture at a different market without starting over. Price it as optionality. SoC2 is the business; this is the option the business buys you.
