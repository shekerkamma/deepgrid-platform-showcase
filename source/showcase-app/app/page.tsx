'use client';
import { useEffect, useState, lazy, Suspense } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useNavigation } from './use-navigation';
import { useReveal, useScrollVars } from './motion';
import { Brand, groups, navigation, products, type Product } from './shared';
import Overview from './views/overview';
import Portfolio from './views/portfolio';
import ProductPage from './views/product';
import Technology from './views/technology';
import Films from './views/films';
import Deck from './views/deck';
import Investment from './views/investment';
import siteContent from './site-content.json';

// The site shell: header, section navigation, the current view, pagination, footer, the mobile
// menu and the product dossier. Each view lives in app/views/.
// Ask DeepGrid carries a 1.3 MB index and the in-browser embedding loader, so it loads only when
// its view opens.
const AskDeepGrid = lazy(() => import('./ask'));

const titles: Record<string, string> = {
  overview: 'DeepGrid Semi: one silicon, fifteen products',
  portfolio: 'Products · DeepGrid Semi',
  silicon: 'Technology · DeepGrid Semi',
  briefing: 'Ask DeepGrid · DeepGrid Semi',
  film: 'Videos · DeepGrid Semi',
  slides: 'Slide deck · DeepGrid Semi',
  investment: 'Investment · DeepGrid Semi',
};

export default function Home() {
  const {
    route,
    navigate: changeView,
    go,
    update,
    openSlide,
  } = useNavigation();
  const view = route.view,
    params = route.params,
    category = groups.includes(params.get('category') || '')
      ? params.get('category')!
      : 'All products',
    query = params.get('q') || '',
    product = products.find((p) => p.id === params.get('product')) || null,
    slide = Math.max(1, Math.min(104, Number(params.get('slide')) || 1)),
    chapter = params.get('chapter') || '';
  const [menu, setMenu] = useState(false),
    [reduced, setReduced] = useState(false);
  const navigate = (v: string) => {
    setMenu(false);
    changeView(v);
  };
  // a product is its own page (#portfolio?product=ad2), so opening one is a navigation the back button undoes
  const setProduct = (p: Product | null) =>
    p ? go('portfolio?product=' + p.id) : changeView('portfolio');
  const setChapter = (id: string) => {
    update({ chapter: id || undefined }, false);
    requestAnimationFrame(() =>
      document
        .querySelector('.report-toggle')
        ?.scrollIntoView({ block: 'start' }),
    );
  };

  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(q.matches);
    const motion = () => setReduced(q.matches);
    q.addEventListener('change', motion);
    return () => q.removeEventListener('change', motion);
  }, []);
  useEffect(() => {
    document.title = titles[view] || titles.overview;
  }, [view]);
  useScrollVars();
  useReveal(
    view +
      (view === 'portfolio' ? params.get('layout') || '' : '') +
      (view === 'investment' ? chapter : '') +
      (view === 'portfolio' ? params.get('product') || '' : ''),
  );

  const viewIndex = navigation.findIndex((n) => n[0] === view),
    returnTo = params.get('from'),
    returnProduct = returnTo
      ? products.find(
          (p) =>
            p.id === new URLSearchParams(returnTo.split('?')[1]).get('product'),
        )
      : null;
  const navLinks = navigation.map(([id, title]) => (
    <a
      href={'#' + id}
      key={id}
      className={view === id ? 'active' : ''}
      onClick={(e) => {
        e.preventDefault();
        navigate(id);
      }}
      aria-current={view === id ? 'page' : undefined}
    >
      {title}
    </a>
  ));

  return (
    <div className={'site-shell view-' + view}>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
          document.getElementById('main')?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => navigate('overview')}
          aria-label="DeepGrid home"
        >
          <Brand />
        </button>
        <p className="topline">Pre-Series A · Hyderabad, India</p>
        <button
          className="mobile-menu"
          aria-label="Open navigation"
          onClick={() => setMenu(true)}
        >
          <span>{navigation[viewIndex][1]}</span>
          <Menu aria-hidden="true" />
        </button>
      </header>
      <nav className="main-nav" aria-label="Primary navigation">
        {navLinks}
      </nav>
      <main id="main" tabIndex={-1}>
        {view !== 'overview' && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a
              href="#overview"
              onClick={(e) => {
                e.preventDefault();
                navigate('overview');
              }}
            >
              Home
            </a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{navigation[viewIndex][1]}</span>
            {returnTo && (
              <button className="context-back" onClick={() => go(returnTo)}>
                <ArrowLeft size={16} aria-hidden="true" />
                {returnProduct
                  ? 'Back to ' + returnProduct.name
                  : 'Back to ' +
                    (navigation.find(
                      (n) => n[0] === returnTo.split('?')[0],
                    )?.[1] || 'previous section')}
              </button>
            )}
          </nav>
        )}
        {view === 'overview' && (
          <Overview navigate={navigate} go={go} reduced={reduced} />
        )}
        {view === 'portfolio' && product && (
          <ProductPage
            key={product.id}
            product={product}
            go={go}
            back={() => setProduct(null)}
          />
        )}
        {view === 'portfolio' && !product && (
          <Portfolio
            category={category}
            query={query}
            layout={params.get('layout') === 'table' ? 'table' : 'cards'}
            setCategory={(v) =>
              update({ category: v === 'All products' ? undefined : v })
            }
            setQuery={(v) => update({ q: v || undefined })}
            setLayout={(v) =>
              update({ layout: v === 'table' ? 'table' : undefined })
            }
            clear={() => update({ q: undefined, category: undefined })}
            open={setProduct}
          />
        )}
        {view === 'silicon' && (
          <Technology
            reduced={reduced}
            go={go}
            chapter={chapter}
            domain={params.get('domain') || ''}
          />
        )}
        {view === 'briefing' && (
          <div className="dg-ask">
            <Suspense
              fallback={
                <section className="page-wrap">
                  <p className="disclaimer">Loading Ask DeepGrid…</p>
                </section>
              }
            >
              <AskDeepGrid go={go} initialQuery={params.get('q') || ''} />
            </Suspense>
          </div>
        )}
        {view === 'film' && (
          <Films
            reduced={reduced}
            focus={
              params.get('v')
                ? { id: params.get('v')!, t: Number(params.get('t')) || 0 }
                : undefined
            }
          />
        )}
        {view === 'slides' && (
          <Deck slide={slide} setSlide={(n) => update({ slide: String(n) })} />
        )}
        {view === 'investment' && (
          <Investment
            chapter={chapter}
            usecase={params.get('usecase') || ''}
            params={params}
            setChapter={setChapter}
            update={update}
            go={go}
          />
        )}
        {view !== 'overview' && !(view === 'portfolio' && product) && (
          <nav className="section-pagination" aria-label="Section navigation">
            {viewIndex > 0 ? (
              <a
                href={'#' + navigation[viewIndex - 1][0]}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(navigation[viewIndex - 1][0]);
                }}
              >
                <ArrowLeft size={19} aria-hidden="true" />
                <span>
                  <small>Previous</small>
                  {navigation[viewIndex - 1][1]}
                </span>
              </a>
            ) : (
              <span />
            )}
            {viewIndex < navigation.length - 1 && (
              <a
                href={'#' + navigation[viewIndex + 1][0]}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(navigation[viewIndex + 1][0]);
                }}
              >
                <span>
                  <small>Next</small>
                  {navigation[viewIndex + 1][1]}
                </span>
                <ArrowRight size={19} aria-hidden="true" />
              </a>
            )}
          </nav>
        )}
      </main>
      <footer className="footer">
        <div className="footer-top">
          <button
            className="brand"
            onClick={() => navigate('overview')}
            aria-label="DeepGrid home"
          >
            <Brand />
          </button>
          <p className="footer-line">
            Intelligence, <em>made foundational.</em>
          </p>
          <button className="text-link" onClick={() => navigate('briefing')}>
            Ask a question <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DeepGrid Semi Pvt Ltd</span>
          <span>T-Hub, Hyderabad, India</span>
          <span>Management materials. Figures are projections.</span>
          <a href={siteContent.sourceGuide} target="_blank" rel="noreferrer">
            Source data and documents{' '}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </footer>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent className="navigation-sheet">
          <SheetTitle>
            <span className="wordmark">deepgrid</span>
          </SheetTitle>
          <SheetDescription>Explore the DeepGrid platform</SheetDescription>
          <nav>{navLinks}</nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
