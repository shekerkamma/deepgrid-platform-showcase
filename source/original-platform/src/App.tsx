import React, { useEffect, useState } from 'react';
import { InteractiveHero } from './components/InteractiveHero';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { A2UIBriefingSection } from './components/A2UIBriefingSection';
import { ProductPortfolio } from './components/ProductPortfolio';
import { SiliconOverview } from './components/SiliconOverview';
import { VideoSection } from './components/VideoSection';
import { SlideGallery } from './components/SlideGallery';
import { InvestmentThesis } from './components/InvestmentThesis';
import { Footer } from './components/Footer';

/* The nav used to be seven scroll anchors on one 46,924px column -- 52
 * viewports, with 70% of it inside the executive summary. Everything was
 * mounted at once whether or not anyone would ever reach it.
 *
 * The same seven entries are now views. No section was removed and no section
 * changed: each renders exactly the component it always pointed at, and the
 * executive summary partitions itself further into Parts I-V. A visitor lands
 * on a page they can finish, and the deepest single view is under a tenth of
 * the old scroll. */

const NAV = [
  { id: 'overview', label: 'Platform Overview' },
  { id: 'a2ui-sec', label: 'A2UI Briefing Agent' },
  { id: 'portfolio-sec', label: '15-SKU Portfolio' },
  { id: 'silicon-sec', label: 'Silicon Architecture' },
  { id: 'video-sec', label: 'Master Video' },
  { id: 'slides-sec', label: '104-Slide Walkthrough' },
  { id: 'investment-sec', label: 'Investment & Diligence' },
] as const;

type ViewId = (typeof NAV)[number]['id'];
const isViewId = (s: string): s is ViewId => NAV.some((n) => n.id === s);

/* There is no PartHead any more.
 *
 * Every view opened with four stacked labels before a sentence of content:
 *
 *   PART 03 · MONOLITHIC SILICON                (eyebrow, 11px, uppercase)
 *   SoC2 Silicon Foundation & Latency Budget    (heading, 32px)
 *   SILICON FOUNDATION                          (eyebrow, 15px)
 *   SoC2 28nm ASIC Specification                (heading, 33.6px)
 *
 * Two eyebrows and two headings, on six of seven views, saying the same thing
 * twice. The top pair was mine: when the sections became views I carried the
 * old scroll dividers over, not noticing every component already ships its own
 * header, and its own is the better one because it is specific. The nav says
 * which section you are in and the pager says what is next, so the "PART 0X"
 * counter was numbering something the reader can already see. */

function App() {
  const [view, setView] = useState<ViewId>(() => {
    const h = window.location.hash.slice(1);
    return isViewId(h) ? h : 'overview';
  });

  // Deep links and the browser back button both keep working, because the view
  // is the hash rather than a scroll position.
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.slice(1);
      if (isViewId(h)) setView(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (id: ViewId) => {
    if (id === view) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setView(id);
    if (window.location.hash.slice(1) !== id) {
      window.history.pushState(null, '', id === 'overview' ? window.location.pathname : `#${id}`);
    }
    // A new view starts at its top. Without this a visitor arriving from the
    // bottom of a long section lands mid-way down the next one.
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const idx = NAV.findIndex((n) => n.id === view);
  const prev = idx > 0 ? NAV[idx - 1] : null;
  const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <nav className="institutional-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--surface)', borderBottom: '1px solid var(--rule)' }}>
        <div className="nav-scroll" style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', width: '100%', padding: '0 16px' }}>
          {NAV.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className={view === link.id ? 'active' : ''}
              aria-current={view === link.id ? 'page' : undefined}
              style={{ background: 'none' }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="page-container">
        {view === 'overview' && (
          <>
            <div id="overview"><InteractiveHero /></div>
            <div id="masthead" style={{ marginTop: '40px' }}><ExecutiveSummary /></div>
          </>
        )}

        {view === 'a2ui-sec' && <A2UIBriefingSection />}
        {view === 'portfolio-sec' && <ProductPortfolio />}
        {view === 'silicon-sec' && <SiliconOverview />}
        {view === 'video-sec' && <VideoSection />}
        {view === 'slides-sec' && <SlideGallery />}
        {view === 'investment-sec' && <InvestmentThesis />}

        {/* Sequential reading still works: the document has an order, and a
            reader who wants to go straight through should not have to return
            to the nav seven times. */}
        <nav className="view-pager" aria-label="Section navigation">
          <div>
            {prev && (
              <button type="button" onClick={() => go(prev.id)}>
                <span className="vp-dir">← Previous</span>
                <span className="vp-label">{prev.label}</span>
              </button>
            )}
          </div>
          <div className="vp-right">
            {next && (
              <button type="button" onClick={() => go(next.id)}>
                <span className="vp-dir">Next →</span>
                <span className="vp-label">{next.label}</span>
              </button>
            )}
          </div>
        </nav>

        <Footer />
      </div>
    </div>
  );
}

export default App;
