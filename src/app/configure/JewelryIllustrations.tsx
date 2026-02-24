"use client";

/**
 * Premium SVG jewelry illustrations.
 * Each accepts imageUrl (photo) + dominantColor (fallback).
 * Stone is composited inside a clipping path that matches the bezel shape.
 */

export type JewelryProps = {
    imageUrl: string | null;
    dominantColor: string;
    stoneName: string;
};

/* ─── shared gradients / utils ──────────────────────────────── */

const GOLD_LIGHT  = "#f0e0b0";
const GOLD_MID    = "#c8a060";
const GOLD_DARK   = "#7a5530";
const GOLD_SHADOW = "rgba(0,0,0,0.55)";

function uid(base: string) { return `cfg-${base}`; }

/* ════════════════════════════════════════════════════════════════
   RING  —  classic cathedral solitaire, oval bezel, 6-prong
════════════════════════════════════════════════════════════════ */
export function RingSVG({ imageUrl, dominantColor, stoneName }: JewelryProps) {
    const cx = 200, cy = 148, rw = 62, rh = 50; // oval bezel centre + radii

    return (
        <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg"
             aria-label={`Ring with ${stoneName}`} style={{ width: "100%", height: "100%" }}>
            <defs>
                {/* metal gradients */}
                <linearGradient id={uid("rg1")} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor={GOLD_LIGHT} />
                    <stop offset="40%"  stopColor={GOLD_MID} />
                    <stop offset="100%" stopColor={GOLD_DARK} />
                </linearGradient>
                <linearGradient id={uid("rg2")} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#e8cc88" />
                    <stop offset="100%" stopColor="#6a4420" />
                </linearGradient>
                <radialGradient id={uid("rinner")} cx="50%" cy="30%" r="60%">
                    <stop offset="0%"   stopColor="rgba(255,240,190,0.6)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                {/* gem shine */}
                <radialGradient id={uid("gshine")} cx="35%" cy="28%" r="55%">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.70)" />
                    <stop offset="50%"  stopColor="rgba(255,255,255,0.18)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <radialGradient id={uid("gdeep")} cx="60%" cy="65%" r="55%">
                    <stop offset="0%"   stopColor="rgba(0,0,0,0.40)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                {/* stone fill */}
                <radialGradient id={uid("stone")} cx="38%" cy="35%" r="60%">
                    <stop offset="0%"   stopColor={lighten(dominantColor, 0.45)} />
                    <stop offset="55%"  stopColor={dominantColor} />
                    <stop offset="100%" stopColor={darken(dominantColor, 0.45)} />
                </radialGradient>
                {/* clip */}
                <clipPath id={uid("rclip")}>
                    <ellipse cx={cx} cy={cy} rx={rw} ry={rh} />
                </clipPath>
                {/* shadow */}
                <filter id={uid("rshadow")} x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor={GOLD_SHADOW} />
                </filter>
                <filter id={uid("glow")} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="6" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* ── shank (band) ── */}
            <g filter={`url(#${uid("rshadow")})`}>
                {/* outer band shape */}
                <path d={`
          M 128 192 
          C 100 240  90 300  98 348
          Q 140 400 200 402
          Q 260 400 302 348
          C 310 300 300 240 272 192
          C 252 168 232 158 210 156
          L 190 156
          C 168 158 148 168 128 192 Z
        `} fill={`url(#${uid("rg1")})`} />

                {/* inner cutout */}
                <path d={`
          M 148 196
          C 124 240  116 298  122 342
          Q 156 388 200 390
          Q 244 388 278 342
          C 284 298 276 240 252 196
          C 236 174 220 166 205 164
          L 195 164
          C 180 166 164 174 148 196 Z
        `} fill="#0a0a0a" />

                {/* band highlight stripe */}
                <path d="M 138 194 C 114 242 108 300 116 346"
                      stroke="rgba(255,240,180,0.40)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M 262 194 C 286 242 292 300 284 346"
                      stroke="rgba(0,0,0,0.25)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </g>

            {/* ── cathedral shoulders ── */}
            <path d={`M 128 192 Q 148 170 168 162`}
                  stroke={`url(#${uid("rg2")})`} strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d={`M 272 192 Q 252 170 232 162`}
                  stroke={`url(#${uid("rg2")})`} strokeWidth="8" fill="none" strokeLinecap="round"/>

            {/* ── bezel collar ── */}
            <ellipse cx={cx} cy={cy} rx={rw + 18} ry={rh + 14}
                     fill={`url(#${uid("rg1")})`} filter={`url(#${uid("rshadow")})`}/>
            {/* inner collar rim */}
            <ellipse cx={cx} cy={cy} rx={rw + 8} ry={rh + 5} fill="#111"/>

            {/* ── stone ── */}
            {imageUrl ? (
                <image href={imageUrl} x={cx - rw} y={cy - rh} width={rw*2} height={rh*2}
                       clipPath={`url(#${uid("rclip")})`} preserveAspectRatio="xMidYMid slice"/>
            ) : (
                <ellipse cx={cx} cy={cy} rx={rw} ry={rh}
                         fill={`url(#${uid("stone")})`} clipPath={`url(#${uid("rclip")})`}/>
            )}

            {/* facet lines on stone */}
            <g clipPath={`url(#${uid("rclip")})`} opacity="0.18">
                <line x1={cx} y1={cy - rh} x2={cx} y2={cy + rh} stroke="white" strokeWidth="0.8"/>
                <line x1={cx - rw} y1={cy} x2={cx + rw} y2={cy} stroke="white" strokeWidth="0.8"/>
                <line x1={cx - rw*0.7} y1={cy - rh*0.7} x2={cx + rw*0.7} y2={cy + rh*0.7} stroke="white" strokeWidth="0.8"/>
                <line x1={cx + rw*0.7} y1={cy - rh*0.7} x2={cx - rw*0.7} y2={cy + rh*0.7} stroke="white" strokeWidth="0.8"/>
            </g>

            {/* shine + depth */}
            <ellipse cx={cx} cy={cy} rx={rw} ry={rh} fill={`url(#${uid("gshine")})`} clipPath={`url(#${uid("rclip")})`}/>
            <ellipse cx={cx} cy={cy} rx={rw} ry={rh} fill={`url(#${uid("gdeep")})`}  clipPath={`url(#${uid("rclip")})`}/>

            {/* ── 6 prongs ── */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
                const r = (deg * Math.PI) / 180;
                const px = cx + Math.cos(r) * (rw + 10);
                const py = cy + Math.sin(r) * (rh + 8);
                return (
                    <ellipse key={deg} cx={px} cy={py} rx={5.5} ry={8}
                             transform={`rotate(${deg}, ${px}, ${py})`}
                             fill={`url(#${uid("rg1")})`} stroke={GOLD_MID} strokeWidth="0.8"/>
                );
            })}

            {/* collar milgrain */}
            {Array.from({length: 32}).map((_, i) => {
                const a = (i / 32) * Math.PI * 2;
                const r2 = rw + 14; const r3 = rh + 10;
                return <circle key={i} cx={cx + Math.cos(a)*r2} cy={cy + Math.sin(a)*r3}
                               r={1.6} fill={GOLD_LIGHT} opacity="0.7"/>;
            })}

            {/* inner ring highlight */}
            <ellipse cx={cx} cy={cy} rx={rw + 8} ry={rh + 5}
                     fill={`url(#${uid("rinner")})`}/>
        </svg>
    );
}

/* ════════════════════════════════════════════════════════════════
   EARRING  —  long drop: post → round connector → teardrop bezel
════════════════════════════════════════════════════════════════ */
export function EarringSVG({ imageUrl, dominantColor, stoneName }: JewelryProps) {
    const cx = 200, cy = 258, r = 68;

    return (
        <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg"
             aria-label={`Earring with ${stoneName}`} style={{ width: "100%", height: "100%" }}>
            <defs>
                <linearGradient id={uid("eg1")} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={GOLD_LIGHT}/><stop offset="50%" stopColor={GOLD_MID}/><stop offset="100%" stopColor={GOLD_DARK}/>
                </linearGradient>
                <radialGradient id={uid("egshine")} cx="35%" cy="28%" r="58%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.72)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                </radialGradient>
                <radialGradient id={uid("egdeep")} cx="60%" cy="65%" r="55%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.45)"/><stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                </radialGradient>
                <radialGradient id={uid("estone")} cx="38%" cy="35%" r="60%">
                    <stop offset="0%" stopColor={lighten(dominantColor,0.45)}/>
                    <stop offset="55%" stopColor={dominantColor}/>
                    <stop offset="100%" stopColor={darken(dominantColor,0.45)}/>
                </radialGradient>
                <clipPath id={uid("eclip")}><circle cx={cx} cy={cy} r={r}/></clipPath>
                <filter id={uid("eshadow")} x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor={GOLD_SHADOW}/>
                </filter>
            </defs>

            {/* hook */}
            <path d="M 200 22 Q 240 22 248 50 Q 256 76 238 92 Q 224 104 210 106"
                  stroke={`url(#${uid("eg1")})`} strokeWidth="6" fill="none" strokeLinecap="round"/>
            {/* post */}
            <line x1="200" y1="106" x2="200" y2="152"
                  stroke={`url(#${uid("eg1")})`} strokeWidth="4"/>
            {/* round connector */}
            <circle cx="200" cy="158" r="10" fill={`url(#${uid("eg1")})`}/>
            <circle cx="200" cy="158" r="5"  fill="#111"/>
            {/* bale rect */}
            <rect x="193" y="165" width="14" height="24" rx="4"
                  fill={`url(#${uid("eg1")})`} stroke={GOLD_MID} strokeWidth="0.8"/>

            {/* bezel outer */}
            <circle cx={cx} cy={cy} r={r + 16} fill={`url(#${uid("eg1")})`}
                    filter={`url(#${uid("eshadow")})`}/>
            {/* bezel inner rim */}
            <circle cx={cx} cy={cy} r={r + 6} fill="#111"/>

            {/* stone */}
            {imageUrl ? (
                <image href={imageUrl} x={cx-r} y={cy-r} width={r*2} height={r*2}
                       clipPath={`url(#${uid("eclip")})`} preserveAspectRatio="xMidYMid slice"/>
            ) : (
                <circle cx={cx} cy={cy} r={r} fill={`url(#${uid("estone")})`}/>
            )}

            {/* facets */}
            <g clipPath={`url(#${uid("eclip")})`} opacity="0.16">
                <line x1={cx} y1={cy-r} x2={cx} y2={cy+r} stroke="white" strokeWidth="0.8"/>
                <line x1={cx-r} y1={cy} x2={cx+r} y2={cy} stroke="white" strokeWidth="0.8"/>
                {[45,135,225,315].map(d => {
                    const rd = d*Math.PI/180;
                    return <line key={d} x1={cx+Math.cos(rd)*r} y1={cy+Math.sin(rd)*r}
                                 x2={cx-Math.cos(rd)*r*0.3} y2={cy-Math.sin(rd)*r*0.3} stroke="white" strokeWidth="0.8"/>;
                })}
            </g>

            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid("egshine")})`} clipPath={`url(#${uid("eclip")})`}/>
            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid("egdeep")})`}  clipPath={`url(#${uid("eclip")})`}/>

            {/* milgrain */}
            {Array.from({length: 32}).map((_,i) => {
                const a = (i/32)*Math.PI*2;
                return <circle key={i} cx={cx+Math.cos(a)*(r+10)} cy={cy+Math.sin(a)*(r+10)}
                               r={1.8} fill={GOLD_LIGHT} opacity="0.75"/>;
            })}

            {/* hook end ball */}
            <circle cx="248" cy="50" r="4" fill={`url(#${uid("eg1")})`}/>
        </svg>
    );
}

/* ════════════════════════════════════════════════════════════════
   NECKLACE  —  delicate rope chain + round pendant
════════════════════════════════════════════════════════════════ */
export function NecklaceSVG({ imageUrl, dominantColor, stoneName }: JewelryProps) {
    const cx = 200, cy = 282, r = 74;

    return (
        <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg"
             aria-label={`Necklace with ${stoneName}`} style={{ width: "100%", height: "100%" }}>
            <defs>
                <linearGradient id={uid("ng1")} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={GOLD_LIGHT}/><stop offset="50%" stopColor={GOLD_MID}/><stop offset="100%" stopColor={GOLD_DARK}/>
                </linearGradient>
                <radialGradient id={uid("ngshine")} cx="35%" cy="28%" r="58%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.72)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                </radialGradient>
                <radialGradient id={uid("ngdeep")} cx="60%" cy="65%" r="55%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.45)"/><stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                </radialGradient>
                <radialGradient id={uid("nstone")} cx="38%" cy="35%" r="60%">
                    <stop offset="0%" stopColor={lighten(dominantColor,0.45)}/>
                    <stop offset="55%" stopColor={dominantColor}/>
                    <stop offset="100%" stopColor={darken(dominantColor,0.45)}/>
                </radialGradient>
                <clipPath id={uid("nclip")}><circle cx={cx} cy={cy} r={r}/></clipPath>
                <filter id={uid("nshadow")} x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor={GOLD_SHADOW}/>
                </filter>
            </defs>

            {/* main chain arc */}
            <path d="M 24 36 Q 200 152 376 36"
                  stroke={GOLD_MID} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* rope texture overlay */}
            <path d="M 24 36 Q 200 152 376 36"
                  stroke={GOLD_LIGHT} strokeWidth="1" fill="none" strokeDasharray="6 5" opacity="0.55"/>
            <path d="M 24 36 Q 200 152 376 36"
                  stroke={GOLD_DARK} strokeWidth="1" fill="none" strokeDasharray="5 6" strokeDashoffset="5" opacity="0.40"/>

            {/* left chain clasp dots */}
            <circle cx="24" cy="36" r="5" fill={`url(#${uid("ng1")})`}/>
            <circle cx="376" cy="36" r="5" fill={`url(#${uid("ng1")})`}/>

            {/* drop wire */}
            <line x1="200" y1="150" x2="200" y2="188"
                  stroke={GOLD_MID} strokeWidth="2.5"/>

            {/* bale */}
            <ellipse cx="200" cy="194" rx="12" ry="8" fill={`url(#${uid("ng1")})`}/>
            <rect x="193" y="198" width="14" height="22" rx="4"
                  fill={`url(#${uid("ng1")})`} stroke={GOLD_MID} strokeWidth="0.8"/>

            {/* bezel outer */}
            <circle cx={cx} cy={cy} r={r+16} fill={`url(#${uid("ng1")})`}
                    filter={`url(#${uid("nshadow")})`}/>
            {/* inner rim */}
            <circle cx={cx} cy={cy} r={r+6} fill="#111"/>

            {/* stone */}
            {imageUrl ? (
                <image href={imageUrl} x={cx-r} y={cy-r} width={r*2} height={r*2}
                       clipPath={`url(#${uid("nclip")})`} preserveAspectRatio="xMidYMid slice"/>
            ) : (
                <circle cx={cx} cy={cy} r={r} fill={`url(#${uid("nstone")})`}/>
            )}

            {/* facets */}
            <g clipPath={`url(#${uid("nclip")})`} opacity="0.16">
                <line x1={cx} y1={cy-r} x2={cx} y2={cy+r} stroke="white" strokeWidth="0.8"/>
                <line x1={cx-r} y1={cy} x2={cx+r} y2={cy} stroke="white" strokeWidth="0.8"/>
                {[45,135,225,315].map(d => {
                    const rd = d*Math.PI/180;
                    return <line key={d} x1={cx+Math.cos(rd)*r} y1={cy+Math.sin(rd)*r}
                                 x2={cx-Math.cos(rd)*r*0.3} y2={cy-Math.sin(rd)*r*0.3} stroke="white" strokeWidth="0.8"/>;
                })}
            </g>

            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid("ngshine")})`} clipPath={`url(#${uid("nclip")})`}/>
            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid("ngdeep")})`}  clipPath={`url(#${uid("nclip")})`}/>

            {/* milgrain */}
            {Array.from({length: 36}).map((_,i) => {
                const a = (i/36)*Math.PI*2;
                return <circle key={i} cx={cx+Math.cos(a)*(r+11)} cy={cy+Math.sin(a)*(r+11)}
                               r={1.8} fill={GOLD_LIGHT} opacity="0.75"/>;
            })}

            {/* cross engravings on bezel rim */}
            {[0,90,180,270].map(d => {
                const rd = d*Math.PI/180;
                return (
                    <line key={d}
                          x1={cx+Math.cos(rd)*(r+7)} y1={cy+Math.sin(rd)*(r+7)}
                          x2={cx+Math.cos(rd)*(r+14)} y2={cy+Math.sin(rd)*(r+14)}
                          stroke={GOLD_LIGHT} strokeWidth="2" opacity="0.6"/>
                );
            })}
        </svg>
    );
}

/* ════════════════════════════════════════════════════════════════
   BRACELET  —  hinged bangle with oval center stone, pavé accents
════════════════════════════════════════════════════════════════ */
export function BraceletSVG({ imageUrl, dominantColor, stoneName }: JewelryProps) {
    const cx = 200, cy = 210, rw = 58, rh = 46;

    return (
        <svg viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg"
             aria-label={`Bracelet with ${stoneName}`} style={{ width: "100%", height: "100%" }}>
            <defs>
                <linearGradient id={uid("bg1")} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={GOLD_LIGHT}/><stop offset="50%" stopColor={GOLD_MID}/><stop offset="100%" stopColor={GOLD_DARK}/>
                </linearGradient>
                <linearGradient id={uid("bg2")} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={GOLD_DARK}/><stop offset="50%" stopColor={GOLD_MID}/><stop offset="100%" stopColor={GOLD_DARK}/>
                </linearGradient>
                <radialGradient id={uid("bgshine")} cx="35%" cy="28%" r="58%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.72)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                </radialGradient>
                <radialGradient id={uid("bgdeep")} cx="60%" cy="65%" r="55%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.45)"/><stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                </radialGradient>
                <radialGradient id={uid("bstone")} cx="38%" cy="35%" r="60%">
                    <stop offset="0%" stopColor={lighten(dominantColor,0.45)}/>
                    <stop offset="55%" stopColor={dominantColor}/>
                    <stop offset="100%" stopColor={darken(dominantColor,0.45)}/>
                </radialGradient>
                <clipPath id={uid("bclip")}><ellipse cx={cx} cy={cy} rx={rw} ry={rh}/></clipPath>
                <filter id={uid("bshadow")} x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor={GOLD_SHADOW}/>
                </filter>
            </defs>

            {/* ── bangle body ── two thick arcs forming the hoop */}
            {/* top arc */}
            <path d="M 62 210 C 60 100 340 100 338 210"
                  stroke={`url(#${uid("bg1")})`} strokeWidth="22" fill="none" strokeLinecap="round"
                  filter={`url(#${uid("bshadow")})`}/>
            {/* top arc highlight */}
            <path d="M 66 210 C 64 110 336 110 334 210"
                  stroke="rgba(255,240,180,0.28)" strokeWidth="6" fill="none" strokeLinecap="round"/>

            {/* bottom arc */}
            <path d="M 62 210 C 60 330 340 330 338 210"
                  stroke={`url(#${uid("bg2")})`} strokeWidth="22" fill="none" strokeLinecap="round"
                  filter={`url(#${uid("bshadow")})`}/>
            {/* bottom shadow */}
            <path d="M 66 210 C 64 318 336 318 334 210"
                  stroke="rgba(0,0,0,0.20)" strokeWidth="5" fill="none" strokeLinecap="round"/>

            {/* hinge dots left + right */}
            <circle cx="62"  cy="210" r="11" fill={`url(#${uid("bg1")})`} stroke={GOLD_MID} strokeWidth="1"/>
            <circle cx="338" cy="210" r="11" fill={`url(#${uid("bg1")})`} stroke={GOLD_MID} strokeWidth="1"/>
            <circle cx="62"  cy="210" r="5" fill="#111"/>
            <circle cx="338" cy="210" r="5" fill="#111"/>

            {/* pavé accent stones (small) */}
            {[-88,-66,-44,44,66,88].map((offset) => {
                const x = cx + offset;
                const yOff = Math.abs(offset) * 0.12;
                return (
                    <ellipse key={offset} cx={x} cy={cy - 52 - yOff} rx={5} ry={4}
                             fill={lighten(dominantColor, 0.3)} stroke={GOLD_MID} strokeWidth="0.8" opacity="0.85"/>
                );
            })}

            {/* bezel outer */}
            <ellipse cx={cx} cy={cy} rx={rw+16} ry={rh+12}
                     fill={`url(#${uid("bg1")})`} filter={`url(#${uid("bshadow")})`}/>
            {/* inner rim */}
            <ellipse cx={cx} cy={cy} rx={rw+7} ry={rh+4} fill="#111"/>

            {/* stone */}
            {imageUrl ? (
                <image href={imageUrl} x={cx-rw} y={cy-rh} width={rw*2} height={rh*2}
                       clipPath={`url(#${uid("bclip")})`} preserveAspectRatio="xMidYMid slice"/>
            ) : (
                <ellipse cx={cx} cy={cy} rx={rw} ry={rh} fill={`url(#${uid("bstone")})`}/>
            )}

            {/* facets */}
            <g clipPath={`url(#${uid("bclip")})`} opacity="0.16">
                <line x1={cx} y1={cy-rh} x2={cx} y2={cy+rh} stroke="white" strokeWidth="0.8"/>
                <line x1={cx-rw} y1={cy} x2={cx+rw} y2={cy} stroke="white" strokeWidth="0.8"/>
                <line x1={cx-rw*.7} y1={cy-rh*.7} x2={cx+rw*.7} y2={cy+rh*.7} stroke="white" strokeWidth="0.8"/>
                <line x1={cx+rw*.7} y1={cy-rh*.7} x2={cx-rw*.7} y2={cy+rh*.7} stroke="white" strokeWidth="0.8"/>
            </g>

            <ellipse cx={cx} cy={cy} rx={rw} ry={rh} fill={`url(#${uid("bgshine")})`} clipPath={`url(#${uid("bclip")})`}/>
            <ellipse cx={cx} cy={cy} rx={rw} ry={rh} fill={`url(#${uid("bgdeep")})`}  clipPath={`url(#${uid("bclip")})`}/>

            {/* milgrain */}
            {Array.from({length: 32}).map((_,i) => {
                const a = (i/32)*Math.PI*2;
                return <circle key={i}
                               cx={cx+Math.cos(a)*(rw+11)} cy={cy+Math.sin(a)*(rh+8)}
                               r={1.7} fill={GOLD_LIGHT} opacity="0.70"/>;
            })}

            {/* 4 prongs */}
            {[0,90,180,270].map(deg => {
                const rd = deg*Math.PI/180;
                const px = cx + Math.cos(rd)*(rw+10);
                const py = cy + Math.sin(rd)*(rh+8);
                return <ellipse key={deg} cx={px} cy={py} rx={5} ry={7.5}
                                transform={`rotate(${deg}, ${px}, ${py})`}
                                fill={`url(#${uid("bg1")})`} stroke={GOLD_MID} strokeWidth="0.8"/>;
            })}
        </svg>
    );
}

/* ── color helpers ───────────────────────────────────────────── */
function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const n = parseInt(h.padEnd(6, h).substring(0, 6), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
    return "#" + [r, g, b].map((v) => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, "0")).join("");
}
function lighten(hex: string, amt: number) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
function darken(hex: string, amt: number) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}