// Ask DeepGrid (app/ask.tsx, synced from the DG32 site) imports SectionHead from './detail'. This is the
// showcase's own SectionHead, the same markup the DG32 site uses.
function Eyebrow({children}:{children:React.ReactNode}){return <p className="eyebrow"><span/> {children}</p>}
export function SectionHead({tag,title,copy}:{tag:string;title:string;copy:string}){return <header className="section-head"><div><Eyebrow>{tag}</Eyebrow><h1>{title}</h1></div><p>{copy}</p></header>}
