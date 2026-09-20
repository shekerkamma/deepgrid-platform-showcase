'use client';
import { Scene, type Product, type SceneId, domains } from './shared';

// Application context, never a claim about the appearance of a shipped kit.
const applications: Record<string, { scene: SceneId; label: string }> = {
  ad2: { scene: 'truck', label: 'Heavy trucks and buses' },
  ad0: { scene: 'truck', label: 'The driver’s view around the vehicle' },
  ad1: { scene: 'warehouse', label: 'Geofenced warehouse routes' },
  taas: { scene: 'port', label: 'Surveyed industrial transport routes' },
  agv: { scene: 'port', label: 'Container moves inside a terminal' },
  dhumr: { scene: 'defence', label: 'Defence and remote operations' },
  d100: { scene: 'defence', label: 'Perception for defence applications' },
  thermal: { scene: 'defence', label: 'Thermal sensing for low visibility' },
  radar: { scene: 'truck', label: 'Range and motion around a vehicle' },
  h100: { scene: 'truck', label: 'Driver alertness in a fleet' },
};

export function ProductVisual({ product }: { product: Product }) {
  const application = applications[product.id] || {
    scene: 'die' as SceneId,
    label: 'Compute inside the customer’s system',
  };
  const domain = domains.find((d) =>
    (d.carries as readonly string[]).includes(product.id),
  );
  return (
    <figure className="product-context">
      <Scene id={application.scene} sizes="(min-width: 900px) 45vw, 90vw" />
      <figcaption>
        <strong>{application.label}</strong>
        <span>
          Concept render
          {domain ? ` · ${domain.code} domain` : ' · SoC2 platform'}
        </span>
      </figcaption>
    </figure>
  );
}
