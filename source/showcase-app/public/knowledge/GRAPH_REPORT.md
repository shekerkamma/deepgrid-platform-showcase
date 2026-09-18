# Graph Report - knowledge  (2026-09-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 237 nodes · 235 edges · 42 communities (18 shown, 24 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.85)
- Token cost: 1,779 input · 444 output

## Graph Freshness
- Built from commit: `91b5406a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Automotive Safety Chiplet Partnerships
- Commercial Vehicle ADAS Standards
- Market Strategy and Competitor Analysis
- SoC2 Compute Hardware Modules
- Multi-Sensor Edge Perception Hardware
- Autonomous Vehicle Solutions Ecosystem
- Corporate Governance and Tapeout
- Fundraising and Commercialization Strategy
- Chiplet Architecture and Processors
- Autonomous Fleet Compute Infrastructure
- Regulatory Compliance and Financials
- Go-To-Market Tapeout Planning
- Full-Stack Autonomous Business Units
- SoC Semiconductor Design Partnerships
- Automotive Safety Mandate Compliance
- FPGA to ASIC Silicon Tapeout
- Fundraising and Business Model
- MoRTH Vehicle Safety Notifications
- Financial Sensitivity and Forecasting
- Defence and Military Collaboration
- AI Data Center Hardware
- Executive Engineering Personnel
- Tier-1 ADAS Partnerships
- Indoor AMR Simulation
- Autonomous Freight Mobility
- Hardware Manufacturing Partners
- Gahan AI Entity
- Incumbent Automotive Tier-1s
- Vehicle Gateway Chiplet
- Radar Signal Processing RTL
- Driver Monitoring Hardware
- Autonomous Fleet Services
- Automotive Semiconductor Suppliers
- Perception AI Solutions
- Automotive Electromagnetic Standards
- Technology Hardware Partners
- Key Personnel Nishant Loya
- Executive Leadership Venkat Simhadri
- Vehicle Telematics Regulation
- Emergency Braking Compliance
- Fleet AI Safety Competitors
- Edge AI Semiconductor Peers

## God Nodes (most connected - your core abstractions)
1. `DeepGrid Semi` - 26 edges
2. `STRADVISION` - 10 edges
3. `ZF Commercial Vehicle Control Systems India (CVCS)` - 8 edges
4. `Stage 2 Gap Ranking and External Fill` - 8 edges
5. `SoC2 Compute Silicon` - 8 edges
6. `SoC2 Perception Compute` - 7 edges
7. `DeepGrid Attach Strategy` - 6 edges
8. `Aptiv PLC` - 6 edges
9. `SoC2 ASIC Die` - 6 edges
10. `DeepGrid Full System Kit (AD0-AD4)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `STRADVISION` --semantically_similar_to--> `T100 AI Licence`  [INFERRED] [semantically similar]
  sources/competitive-dossier-the-field-supply-dependency.md → products/t100.md
- `DeepGrid Semi` --references--> `AD2 Smart Truck Kit`  [EXTRACTED]
  sources/competitive-dossier-scqa.md → memorandum/2-business.md
- `DeepGrid Semi` --references--> `Seaport AGV`  [EXTRACTED]
  sources/competitive-dossier-scqa.md → products/agv.md
- `drivebuddyAI` --conceptually_related_to--> `Smart Truck (AD2 kit)`  [INFERRED]
  sources/deepgrid-semi-competitor-analysis-part4.md → products/ad2.md
- `Starkenn` --conceptually_related_to--> `Smart Truck (AD2 kit)`  [INFERRED]
  sources/competitive-dossier-the-field-competitive-universe.md → products/ad2.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Act III Silicon and Radar Suppliers** — sources_competitive_dossier_ti, sources_competitive_dossier_nxp, netrasemi [EXTRACTED 0.90]
- **AD2 Perception and Sensing Pipeline** — deck_007_road_autonomy_part2_ad2_kit, deck_024_frame_budget_and_sensors_smart_mirror_tower, deck_024_frame_budget_and_sensors_soc2_die [EXTRACTED 0.90]
- **Pre-Series A Allocation and Unfunded Liabilities** — memorandum_5_choice_part1_fundraising_round, memorandum_5_choice_part1_unfunded_patents, memorandum_5_choice_part1_iso26262_assessor, memorandum_6_numbers_tapeout_gates [EXTRACTED 0.90]
- **Perception Layer Substitution and Qualification** — deepgrid_semi, stradvision, sources_competitive_dossier_competitive_strategy_build_buy_partner_iso_26262 [EXTRACTED 0.90]
- **Unacknowledged Direct Indian ADAS Competitors** — competitor_zf_wabco, starkenn, drivebuddyai, bitsensing [EXTRACTED 0.90]
- **A100 Component Compute Hierarchy** — deck_031_silicon_and_compute_part2_a100_one_channel, deck_049_fleet_and_mobility_part1_a100_two_channel, deck_049_fleet_and_mobility_part1_a100_four_channel [EXTRACTED 0.95]
- **A100 Compute Module Family** — products_a100_1_a100_1ch, products_a100_2_a100_2ch, products_a100_4_a100_4ch [EXTRACTED 0.95]
- **Brake Actuation vs Warning-Only Segmentation** — sources_research_competitive_evidence_metrics_m4_function_scope, sources_research_dossier_gap_register_part1_zf_cvcs_india, sources_research_dossier_gap_register_part1_aptiv_stradvision, starkenn, sources_research_dossier_gap_register_part1_drivebuddyai [EXTRACTED 0.95]
- **Autonomous Robotics & Mobility Deployments** — deck_049_fleet_and_mobility_part2_taas, products_agv_seaport_agv, deck_066_sensors_and_robotics_part1_d_humr_ugv [EXTRACTED 0.95]
- **Regulatory Mandate and Commercialization Strategy** — sources_deepgrid_semi_confidential_information_memorandum_june_2026_part7_tsmc_28nm_tapeout, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part7_ais_certification, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part8_morth_gsr_184e [EXTRACTED 0.95]
- **Competitors with Recurring Revenue Post-Sale** — aptiv, zf, drivebuddyai, starkenn [EXTRACTED 0.95]
- **DeepGrid Business Units Portfolio** — deepgrid_part5_bu01_systems, deepgrid_part5_bu02_semi, deepgrid_part5_bu03_mobility, deepgrid_part5_bu04_robotics [EXTRACTED 0.95]
- **FPGA-to-ASIC Silicon Roadmap and Margin Expansion** — deepgrid_part5_artix_7200t, deepgrid_part5_tsmc_28nm, deepgrid_part6_financial_model [EXTRACTED 0.95]
- **DeepGrid Strategy and Tapeout Decision Framework** — sources_research_reconciliation_deepgrid_playbook, sources_research_tapeout_decision_memo_tapeout_memo, sources_research_tapeout_decision_memo_column_a_tapeout, sources_research_tapeout_decision_memo_column_b_merchant_soc [EXTRACTED 0.95]
- **Sense-Compute-Decide-Act Common Signal Chain** — deck_031_silicon_and_compute_part2_soc2, deck_049_fleet_and_mobility_part1_autonomous_taas, deck_049_fleet_and_mobility_part1_seaport_agv [EXTRACTED 0.95]
- **India Commercial Vehicle ADAS Mandates** — sources_research_gsr_834_862_gazette_gsr_834_e, sources_research_gsr_834_862_gazette_gsr_862_e, sources_research_gsr_834_862_gazette_gsr_184_e [EXTRACTED 0.95]
- **Brake Actuation Mandate Players (P-ACT)** — zf_cvcs_india, aptiv, stradvision, cmvr_rule_96_12 [EXTRACTED 0.95]
- **Automotive Regulatory Framework Mandates** — sources_deepgrid_semi_confidential_information_memorandum_june_2026__part2_gsr_184e, sources_deepgrid_semi_confidential_information_memorandum_june_2026__part2_ais_162_188, sources_deepgrid_semi_confidential_information_memorandum_june_2026__part2_ais_140, sources_deepgrid_semi_confidential_information_memorandum_june_2026__part2_ais_004 [EXTRACTED 0.95]
- **Central Motor Vehicle ADAS Mandate Framework** — sources_research_competitive_evidence_ledger_gsr_834_e, sources_research_competitive_evidence_ledger_gsr_184_e, sources_research_competitive_evidence_ledger_ais_162 [EXTRACTED 0.95]
- **Regulatory Mandate Progression and Supersession** — deepgrid_im_v2, regulation_gsr_184e, regulation_gsr_834e [EXTRACTED 0.95]
- **Commercial Retrofit ADAS Players** — starkenn, bitsensing, drivebuddyai [EXTRACTED 0.95]
- **Roadzen drivebuddyAI India Fleet Deployments** — sources_research_drivebuddyai_expansion_roadzen, drivebuddyai, sources_research_drivebuddyai_expansion_deal_3600_ev, sources_research_drivebuddyai_ir_deal_3000_truck [EXTRACTED 0.95]
- **Sensors & Accessories Product Suite** — deck_049_fleet_and_mobility_part2_thermal_camera, deck_049_fleet_and_mobility_part2_radar_pod, deck_066_sensors_and_robotics_part1_h100_wearable [EXTRACTED 0.95]
- **SoC2 Silicon Execution Consortium** — sources_deepgrid_semi_confidential_information_memorandum_june_2026__part9_smart_soc, sources_deepgrid_semi_confidential_information_memorandum_june_2026__part9_prime_soc, sources_deepgrid_semi_confidential_information_memorandum_june_2026__part9_terminus_circuits, sources_deepgrid_semi_confidential_information_memorandum_june_2026__part9_soc2_programme [EXTRACTED 0.95]
- **Run A for B Strategic Framework** — memorandum_5_choice_part1_strategy, memorandum_5_choice_part1_option_a, memorandum_5_choice_part1_option_b, memorandum_5_choice_part1_run_a_for_b [EXTRACTED 0.95]
- **Tier-1 Actuation Attach Strategy** — deepgrid_semi, zf_cvcs_india, sources_competitive_dossier_p_act_aptiv_plc, sources_competitive_dossier_competitive_strategy_strategic_posture_attach_posture [EXTRACTED 0.95]
- **Tier-1 Perception and Actuation Integration Axis** — stradvision, sources_competitive_dossier_p_act_aptiv_plc, zf_cvcs_india [EXTRACTED 0.95]
- **DeepGrid Commercial Vehicle ADAS Use Cases** — use_cases_uc_01_uc01_aebs, use_cases_uc_02_uc02_nuisance, use_cases_uc_03_uc03_bsis_mois, use_cases_uc_04_uc04_ddaws, use_cases_uc_05_uc05_ldws, use_cases_uc_06_uc06_govt_psu [EXTRACTED 1.00]
- **DeepGrid PhD Supervisors & R&D Advisors** — dr_ramesh_patel, dr_m_v_kartikeyan, prof_c_krishna_mohan, dr_k_t_satyajith [EXTRACTED 1.00]
- **Full-Stack ADAS Platform Architecture** — sources_deepgrid_semi_confidential_information_memorandum_june_2026__part2_dgrid_alpha_chipset, sources_deepgrid_semi_confidential_information_memorandum_june_2026__part2_ddrive_ai_model, sources_deepgrid_semi_confidential_information_memorandum_june_2026__part2_full_system_kit [EXTRACTED 1.00]
- **Indian Automotive Standards for Commercial Vehicle ADAS** — sources_research_zf_india_nomination_gsr_184e, sources_research_zf_india_nomination_ais_162, sources_research_zf_india_nomination_ais_184, sources_research_zf_india_nomination_ais_186, sources_research_zf_india_nomination_ais_187, sources_research_zf_india_nomination_ais_188 [EXTRACTED 1.00]
- **DeepGrid Leadership and Board Governance** — aravind_prasad_g, memorandum_2_business_ayaz_khan, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part8_prashant_sadanand, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part8_jayesh_loya, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part8_krishna_mohan_r [EXTRACTED 1.00]
- **Model Diligence Discrepancies and Findings** — sources_research_model_review_findings_finding_f01, sources_research_model_review_findings_finding_f02, sources_research_model_review_findings_finding_f03, sources_research_model_review_findings_register [EXTRACTED 1.00]
- **Mandated Automotive ADAS Use Cases** — use_cases_uc_01_uc01_aebs, use_cases_uc_02_uc02_nuisance, memorandum_4_usecases_part1_uc03_vru, memorandum_4_usecases_part1_uc04_ddaws, memorandum_4_usecases_part1_uc05_ldws [EXTRACTED 1.00]
- **Road Autonomy SKUs on SoC2** — deck_001_overview_soc2, products_ad0_ad0_mirror, products_ad1_ad1_kit, products_ad2_smart_truck [EXTRACTED 1.00]
- **Single Die Multi-SKU Architecture** — memorandum_1_summary_soc2_die, products_d100_drone_kit, deck_066_sensors_and_robotics_part2_four_d_radar, products_dhumr_defence_dhumr, deck_066_sensors_and_robotics_part1_h100_wearable [EXTRACTED 1.00]
- **Six-Chiplet Combo Die Subsystems** — sources_deepgrid_semi_confidential_information_memorandum_june_2026_part3_combo_die, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part3_a100, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part3_r100, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part3_t100, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part3_d100, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part3_s100, sources_deepgrid_semi_confidential_information_memorandum_june_2026_part3_h100 [EXTRACTED 1.00]
- **SoC2 Compute Product Packaging Family** — deck_024_frame_budget_and_sensors_soc2_die, products_a100_1_a100_1ch, deck_031_silicon_and_compute_part1_a100_2ch, products_a100_4_a100_4ch [EXTRACTED 1.00]
- **India Commercial Vehicle ADAS Competitive Landscape** — sources_research_source_or_cut_netrasemi_sterling_netrasemi, sources_research_source_or_cut_netrasemi_sterling_sterling_tools, sources_research_sterling_minieye_filing_minieye, stradvision [INFERRED 0.85]
- **Perception Sensor Component Suite** — products_h100_driver_monitor, products_radar_radar_pod, products_thermal_thermal_pod [INFERRED 0.85]
- **System Leaders / Routes to Market for DeepGrid** — zf_cvcs_india, aptiv, incumbent_tier1_cohort, deepgrid_semi [INFERRED 0.85]

## Communities (42 total, 24 thin omitted)

### Community 0 - "Automotive Safety Chiplet Partnerships"
Cohesion: 0.09
Nodes (32): Aptiv, CMVR Rule 96(12) AEBS Mandate, DeepGrid Six-Chiplet 28nm Die, DeepGrid Semi, DeepGrid Attach Strategy, Dr. K. T. Satyajith, Dr. M. V. Kartikeyan, Dr. Ramesh Patel (+24 more)

### Community 1 - "Commercial Vehicle ADAS Standards"
Cohesion: 0.11
Nodes (23): AD2 Smart Truck Kit, AIS-162 / CMVR 96(12) (AEBS), AIS-184 / 186 / 187 / 188 Mandates, UC-03 Blind-Spot & Moving-Off Information, UC-04 Driver Drowsiness and Attention, UC-05 Lane Departure Warning, AIS-162 (AEBS Standard), AIS-184 (DDAWS Standard) (+15 more)

### Community 2 - "Market Strategy and Competitor Analysis"
Cohesion: 0.11
Nodes (19): bitsensing, ZF WABCO, AD2 Autonomous Driving Product, ₹1 Cr Defence Revenue Transaction, DeepGrid Semi IM v2 (June 2026), drivebuddyAI, MoRTH Draft G.S.R. 184(E), MoRTH Notified G.S.R. 834(E) / 862(E) (+11 more)

### Community 3 - "SoC2 Compute Hardware Modules"
Cohesion: 0.15
Nodes (17): AD2 Kit (Smart Truck ADAS), D-DRIVE ADAS Sim v2, Smart Mirror Tower, SoC2 ASIC Die, A100 Compute Box 2ch + SDK, SoC2 Per-Core Local DMA Architecture, A100 Compute Box 1ch M.2, A100 Compute Box 2ch (+9 more)

### Community 4 - "Multi-Sensor Edge Perception Hardware"
Cohesion: 0.13
Nodes (17): R100 Radar DSP Block, 4D Imaging Radar Pod, SoC2 Compute Silicon, T100 Perception Software Licence, Transport as a Service (TaaS), LWIR Thermal Camera Pod, Defence D-HUMR UGV, H100 Driver Monitor Wearable (+9 more)

### Community 5 - "Autonomous Vehicle Solutions Ecosystem"
Cohesion: 0.14
Nodes (16): Road Autonomy Segment, SoC2 Silicon, AMR Forklift Dark-Store Simulator, AD0 Smart Mirror, AD1 Indoor L4 Kit, Smart Truck (AD2 kit), 4D Radar Pod, Thermal Camera Pod (+8 more)

### Community 6 - "Corporate Governance and Tapeout"
Cohesion: 0.18
Nodes (12): Aravind Prasad G., Ayaz Khan, AIS-162 / AIS-188 Certification, Deepgrid Semi Pvt Ltd, Pre-Series A Round, TSMC 28nm MPW Tape-out, DGrid Alpha Matrix ALU Architecture, Jayesh Loya (+4 more)

### Community 7 - "Fundraising and Commercialization Strategy"
Cohesion: 0.20
Nodes (12): Pre-Series A Capital Structure (Rs 45 Cr Equity + Rs 10 Cr CGTMSE), ISO 26262 Functional Safety Assessor, Option A: Government and PSU Wedge, Option B: Tier-1 Attach, Option C: Defence-First, Option D: Licence-First, Option E: Silicon Sprint, Strategy: Run A for B (+4 more)

### Community 8 - "Chiplet Architecture and Processors"
Cohesion: 0.20
Nodes (10): Batch-Dispatch Firmware (Patent 1), A100 AI/ADAS Processor Chiplet, ADAS Product Family (AD0–AD4), Six-Chiplet Combo Die, D100 Defence Secure Compute Chiplet, H100 Health AI Processor Chiplet, R100 Radar DSP Chiplet, S100 SDV / Vehicle Gateway Chiplet (+2 more)

### Community 9 - "Autonomous Fleet Compute Infrastructure"
Cohesion: 0.22
Nodes (9): A100 One-Channel M.2 Module, Per-Core Local DMA (LDMA) Architecture, SoC2 Perception Compute, T100 AI Licence (SaaS), A100 Four-Channel PCIe Card, A100 Two-Channel Module, Autonomous TaaS (Fleet & Mobility), DGrid Yard OS (Live Terminal Twin / PS18) (+1 more)

### Community 10 - "Regulatory Compliance and Financials"
Cohesion: 0.22
Nodes (9): MoRTH Vehicle Width & ADAS Regulations, AD2 Truck ADAS Kit, DeepGrid Company P&L Master, ADAS Segment Projections, Defence Segment Projections, Robotics Segment Projections, Finding F-01: FY2028 Net Income Error, Finding F-02: Conflicting FY2032 Outcomes (+1 more)

### Community 11 - "Go-To-Market Tapeout Planning"
Cohesion: 0.33
Nodes (6): Deepgrid Datacentre, DeepGrid GTM Playbook (57-slide), Existing Scored ICP Scorecard, Column A: 28nm Custom ASIC Tapeout, Column B: Source Merchant Automotive SoC, Tapeout Decision Memo

### Community 12 - "Full-Stack Autonomous Business Units"
Cohesion: 0.40
Nodes (5): BU01 Systems (Aftermarket Retrofit), BU02 Semi (SoC Roadmap), BU04 Robotics (D-HUMR / D100), India-Native ADAS Architecture Advantage, Full-Stack Ownership (Silicon, AI Models, Systems)

### Community 13 - "SoC Semiconductor Design Partnerships"
Cohesion: 0.40
Nodes (5): Muse Semi / GSME, Prime SoC, Smart SoC (Jangi Reddy N), SoC2 Programme, Terminus Circuits

### Community 14 - "Automotive Safety Mandate Compliance"
Cohesion: 0.40
Nodes (5): AIS-162 (AEBS), Draft G.S.R. 184(E), G.S.R. 834(E) (Central Motor Vehicles Sixth Amendment Rules 2025), Aptiv & STRADVISION Partnership, ZF CVCS India (formerly WABCO India)

### Community 15 - "FPGA to ASIC Silicon Tapeout"
Cohesion: 0.67
Nodes (4): Artix-7 200T FPGA Validation, R100 Radar RTL (fmcw3-extended), TSMC 28nm Tapeout / MPW, FPGA-to-ASIC Financial Transition

### Community 16 - "Fundraising and Business Model"
Cohesion: 0.50
Nodes (4): DeepGrid Business Plan v2.2, Financial Model Review Findings Register, Model Readiness Review Story Pack, DeepGrid ₹55 Cr Fundraising Plan

### Community 17 - "MoRTH Vehicle Safety Notifications"
Cohesion: 0.67
Nodes (3): G.S.R. 184(E), G.S.R. 834(E), G.S.R. 862(E)

## Ambiguous Edges - Review These
- `Aptiv` → `STRADVISION`  [AMBIGUOUS]
  sources/competitive-dossier-the-field-an-unresolved-question.md · relation: semantically_similar_to

## Knowledge Gaps
- **132 isolated node(s):** `Draft G.S.R. 184(E)`, `MoRTH Notified G.S.R. 834(E) / 862(E)`, `DeepGrid Six-Chiplet 28nm Die`, `Dr. K. T. Satyajith`, `Dr. M. V. Kartikeyan` (+127 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 132 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Aptiv` and `STRADVISION`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `DeepGrid Semi` connect `Automotive Safety Chiplet Partnerships` to `Commercial Vehicle ADAS Standards`, `Multi-Sensor Edge Perception Hardware`, `Autonomous Vehicle Solutions Ecosystem`, `Corporate Governance and Tapeout`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **Why does `AD0 Smart Mirror` connect `Autonomous Vehicle Solutions Ecosystem` to `Automotive Safety Chiplet Partnerships`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `Smart Truck (AD2 kit)` connect `Autonomous Vehicle Solutions Ecosystem` to `Market Strategy and Competitor Analysis`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `Draft G.S.R. 184(E)`, `MoRTH Notified G.S.R. 834(E) / 862(E)`, `DeepGrid Six-Chiplet 28nm Die` to the rest of the system?**
  _132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Automotive Safety Chiplet Partnerships` be split into smaller, more focused modules?**
  _Cohesion score 0.08669354838709678 - nodes in this community are weakly interconnected._
- **Should `Commercial Vehicle ADAS Standards` be split into smaller, more focused modules?**
  _Cohesion score 0.1067193675889328 - nodes in this community are weakly interconnected._